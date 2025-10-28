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
