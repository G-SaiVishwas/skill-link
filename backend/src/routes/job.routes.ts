import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseService } from '../services/supabase.service';
import { openaiService } from '../services/openai.service';
import { matchingService } from '../services/matching.service';
import { geoService } from '../services/geo.service';
import { validateBody, createJobRequestSchema, searchWorkersSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';
import { CreateJobRequest, SearchWorkersQuery } from '../types';

export async function jobRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/workers/jobs
   * Get job opportunities for logged-in worker
   */
  fastify.get(
    '/workers/jobs',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Querystring: { limit?: number; offset?: number };
    }>, reply: FastifyReply) => {
      try {
        const userId = request.user!.id;
        const { limit = 20, offset = 0 } = request.query;

        // Get worker profile
        const workerProfile = await supabaseService.getWorkerProfile(userId);

        if (!workerProfile) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.WORKER.NOT_FOUND,
          });
        }

        // Get worker's skills
        const workerSkills = await supabaseService.getUserSkills(userId);
        const skillSlugs = workerSkills.map(s => s.slug);

        // Get open jobs
        const { data: jobs, error } = await supabaseService
          .getClient()
          .from('job_requests')
          .select(`
            *,
            employer:employer_profiles!employer_id (
              id,
              user_id,
              contact_name,
              org_name,
              photo_url,
              verified
            )
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        // Filter and score jobs by skill match and distance
        const jobsWithScores = (jobs || []).map(job => {
          // Calculate skill match
          const jobSkills = (job.ai_skills || []).map((s: any) => 
            typeof s === 'string' ? s.toLowerCase() : s.slug?.toLowerCase()
          );
          const matchedSkills = jobSkills.filter((s: string) => 
            skillSlugs.some(ws => ws.toLowerCase() === s)
          );
          const skillMatch = jobSkills.length > 0 
            ? (matchedSkills.length / jobSkills.length) * 100 
            : 0;

          // Calculate distance
          let distance = null;
          if (job.latitude && job.longitude && workerProfile.latitude && workerProfile.longitude) {
            distance = geoService.calculateDistance(
              workerProfile.latitude,
              workerProfile.longitude,
              job.latitude,
              job.longitude
            );
          }

          // Calculate overall match score
          const distanceScore = distance ? Math.max(0, 100 - (distance * 2)) : 50;
          const urgencyBoost = job.urgency === 'urgent' ? 20 : job.urgency === 'high' ? 10 : 0;
          const matchScore = (skillMatch * 0.6) + (distanceScore * 0.3) + urgencyBoost;

          return {
            id: job.id,
            employer: {
              id: job.employer.id,
              name: job.employer.contact_name || job.employer.org_name,
              org_name: job.employer.org_name,
              verified: job.employer.verified || false,
              photo_url: job.employer.photo_url,
            },
            title: job.role_text || 'Job Opportunity',
            description: job.ai_summary || job.raw_text?.substring(0, 200) || '',
            skills_required: jobSkills,
            matched_skills: matchedSkills,
            location: {
              city: job.location_city,
              distance_km: distance,
            },
            urgency: job.urgency,
            preferred_experience: job.preferred_experience,
            availability_window: job.availability_window,
            created_at: job.created_at,
            match_score: Math.round(matchScore),
            skill_match_percent: Math.round(skillMatch),
          };
        });

        // Sort by match score
        jobsWithScores.sort((a, b) => b.match_score - a.match_score);

        return reply.status(200).send({
          success: true,
          data: jobsWithScores,
          count: jobsWithScores.length,
          worker_location: workerProfile.location_city,
        });
      } catch (error: any) {
        console.error('Get worker jobs error:', error);
        return reply.status(500).send({
          success: false,
          error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
        });
      }
    }
  );

  /**
   * POST /api/job/create
   * Create job request with AI parsing and auto-matching
   */
  fastify.post(
    '/job/create',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = validateBody(createJobRequestSchema, request.body) as CreateJobRequest;
        const userId = request.user!.id;

        // Get employer profile
        const employerProfile = await supabaseService.getEmployerProfile(userId);

        if (!employerProfile) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.EMPLOYER.NOT_FOUND,
          });
        }

        // Parse job description with AI
        const jobParsed = await openaiService.parseJobDescription(
          body.raw_text,
          employerProfile.org_name || employerProfile.contact_name || 'Employer',
          body.location.city
        );

        // Get or estimate coordinates
        let latitude = body.location.lat;
        let longitude = body.location.lng;

        if (!latitude || !longitude) {
          const coords = geoService.getCityCoordinates(body.location.city);
          if (coords) {
            latitude = coords.lat;
            longitude = coords.lng;
          }
        }

        // Map urgency
        const urgencyMap: Record<string, string> = {
          immediate: 'urgent',
          urgent: 'urgent',
          soon: 'high',
          flexible: 'medium',
        };

        // Create job request
        const jobRequest = await supabaseService.createJobRequest({
          employer_id: employerProfile.id,
          raw_text: body.raw_text,
          ai_transcript: body.voice_url ? 'Voice input' : null,
          ai_skills: jobParsed.ai_skills,
          structured_job: {
            parsed: jobParsed,
          },
          role_text: jobParsed.role,
          urgency: urgencyMap[jobParsed.urgency] || 'medium',
          preferred_experience: jobParsed.preferred_experience,
          location_city: body.location.city,
          latitude,
          longitude,
          availability_window: jobParsed.availability_timeframe,
          status: 'open',
          ai_summary: jobParsed.role,
          ai_meta: {
            confidence: jobParsed.confidence,
            notes: jobParsed.confidence_notes,
          },
        });

        // Find matching workers
        const suggestedWorkers = await matchingService.findMatchingWorkers(
          jobRequest.id,
          {
            requiredSkills: jobParsed.required_skills,
            latitude,
            longitude,
            maxRadiusKm: 50,
          },
          employerProfile
        );

        return reply.status(201).send({
          success: true,
          message: API_MESSAGES.JOB.CREATED,
          job: jobRequest,
          suggested_workers: suggestedWorkers,
        });
      } catch (error: any) {
        console.error('Job creation error:', error);
        return reply.status(500).send({
          success: false,
          error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
        });
      }
    }
  );

  /**
   * GET /api/job/:id
   * Get job details
   */
  fastify.get(
    '/job/:id',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Params: { id: string };
    }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const jobRequest = await supabaseService.getJobRequest(id);

        if (!jobRequest) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.JOB.NOT_FOUND,
          });
        }

        return reply.status(200).send({
          success: true,
          data: jobRequest,
        });
      } catch (error: any) {
        return reply.status(500).send({
          success: false,
          error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
        });
      }
    }
  );

  /**
   * GET /api/job/:id/matches
   * Get all matches for a job
   */
  fastify.get(
    '/job/:id/matches',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Params: { id: string };
    }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const matches = await supabaseService.getJobMatches(id);

        return reply.status(200).send({
          success: true,
          data: matches,
        });
      } catch (error: any) {
        return reply.status(500).send({
          success: false,
          error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
        });
      }
    }
  );

  /**
   * GET /api/workers/search
   * Search workers by filters
   */
  fastify.get(
    '/workers/search',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Querystring: SearchWorkersQuery;
    }>, reply: FastifyReply) => {
      try {
        const query = validateBody(searchWorkersSchema, request.query);

        // Build search query
        let dbQuery = supabaseService
          .getClient()
          .from('worker_profiles_view')
          .select('*')
          .eq('availability_status', 'available');

        // Filter by city
        if (query.city) {
          dbQuery = dbQuery.ilike('location_city', `%${query.city}%`);
        }

        // Filter by rate
        if (query.rate_min) {
          dbQuery = dbQuery.gte('suggested_rate', query.rate_min);
        }
        if (query.rate_max) {
          dbQuery = dbQuery.lte('suggested_rate', query.rate_max);
        }

        const { data: workers, error } = await dbQuery;

        if (error) throw error;

        // Filter by skills (post-query)
        let filteredWorkers = workers || [];

        if (query.skills) {
          const skillsArray = query.skills.split(',').map(s => s.trim().toLowerCase());
          filteredWorkers = filteredWorkers.filter(worker => {
            const workerSkills = (worker.skill_tags || []).map((s: string) => s.toLowerCase());
            return skillsArray.some(skill => workerSkills.includes(skill));
          });
        }

        // Filter by distance
        if (query.lat && query.lng && query.radius_km) {
          filteredWorkers = filteredWorkers.filter(worker => {
            if (!worker.latitude || !worker.longitude) return false;
            return geoService.isWithinRadius(
              query.lat!,
              query.lng!,
              worker.latitude,
              worker.longitude,
              query.radius_km!
            );
          });
        }

        // Add distance to each worker
        if (query.lat && query.lng) {
          filteredWorkers = filteredWorkers.map(worker => ({
            ...worker,
            distance_km: worker.latitude && worker.longitude
              ? geoService.calculateDistance(
                  query.lat!,
                  query.lng!,
                  worker.latitude,
                  worker.longitude
                )
              : null,
          }));
        }

        return reply.status(200).send({
          success: true,
          data: filteredWorkers,
          count: filteredWorkers.length,
        });
      } catch (error: any) {
        return reply.status(500).send({
          success: false,
          error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
        });
      }
    }
  );
}
