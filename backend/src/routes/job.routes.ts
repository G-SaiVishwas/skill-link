import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseService } from '../services/supabase.service';
import { matchingService } from '../services/matching.service';
import { geoService } from '../services/geo.service';
import { validateBody, createJobRequestSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';
import { CreateJobRequest } from '../types';

export async function jobRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/job/create
   * Create a new job request
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

        // Create job request
        const jobRequest = await supabaseService.createJobRequest({
          employer_id: employerProfile.id,
          raw_text: body.raw_text,
          location_city: body.location.city,
          latitude,
          longitude,
          urgency: 'medium',
          status: 'open',
        });

        return reply.status(201).send({
          success: true,
          message: API_MESSAGES.JOB.CREATED,
          data: {
            job: jobRequest,
          },
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

        const job = await supabaseService.getJobRequest(id);

        if (!job) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.JOB.NOT_FOUND,
          });
        }

        return reply.status(200).send({
          success: true,
          data: job,
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
   * Get matches for a job
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
   * Search for workers (by skills, location, etc.)
   */
  fastify.get(
    '/workers/search',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Querystring: {
        skills?: string;
        city?: string;
        max_distance?: string;
      };
    }>, reply: FastifyReply) => {
      try {
        const { city } = request.query;

        // For MVP, return all worker profiles
        // In production, implement proper search filters
        const { data: workers, error } = await supabaseService['client']
          .from('worker_profiles')
          .select('*')
          .eq('availability_status', 'available')
          .order('trustrank', { ascending: false });

        if (error) throw error;

        return reply.status(200).send({
          success: true,
          data: workers || [],
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
