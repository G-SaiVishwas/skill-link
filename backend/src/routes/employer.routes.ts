import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseService } from '../services/supabase.service';
import { geoService } from '../services/geo.service';
import { validateBody, createEmployerProfileSchema, updateEmployerProfileSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';
import { CreateEmployerProfileRequest } from '../types';

export async function employerRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/onboard/employer
   * Create employer profile
   */
  fastify.post(
    '/onboard/employer',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = validateBody(createEmployerProfileSchema, request.body) as CreateEmployerProfileRequest;
        const userId = request.user!.userId;

        // Check if employer profile already exists
        const existing = await supabaseService.getEmployerProfile(userId);
        if (existing) {
          return reply.status(400).send({
            success: false,
            error: 'Employer profile already exists',
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

        // Create employer profile
        const employerProfile = await supabaseService.createEmployerProfile({
          user_id: userId,
          org_name: body.org_name || null,
          contact_name: body.contact_name,
          photo_url: body.photo_url || null,
          location_city: body.location.city,
          latitude,
          longitude,
          preferred_languages: body.preferred_languages || ['English', 'Hindi'],
        });

        return reply.status(201).send({
          success: true,
          message: API_MESSAGES.EMPLOYER.PROFILE_CREATED,
          data: employerProfile,
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
   * GET /api/employer/me
   * Get logged-in employer's profile
   */
  fastify.get(
    '/employer/me',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user!.userId;

        const employerProfile = await supabaseService.getEmployerProfile(userId);

        if (!employerProfile) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.EMPLOYER.NOT_FOUND,
          });
        }

        return reply.status(200).send({
          success: true,
          data: employerProfile,
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
   * GET /api/employer/jobs
   * Get employer's posted jobs
   */
  fastify.get(
    '/employer/jobs',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user!.userId;

        // Get employer profile
        const employerProfile = await supabaseService.getEmployerProfile(userId);

        if (!employerProfile) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.EMPLOYER.NOT_FOUND,
          });
        }

        // Get jobs
        const jobs = await supabaseService.getEmployerJobs(employerProfile.id);

        return reply.status(200).send({
          success: true,
          data: jobs,
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
   * PATCH /api/employer/:id
   * Update employer profile
   */
  fastify.patch(
    '/employer/:id',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Params: { id: string };
    }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const userId = request.user!.userId;
        const updates = validateBody(updateEmployerProfileSchema, request.body);

        // Get employer profile to verify ownership
        const employerProfile = await supabaseService.getEmployerProfile(userId);

        if (!employerProfile || employerProfile.id !== id) {
          return reply.status(403).send({
            success: false,
            error: 'Not authorized to update this profile',
          });
        }

        const updated = await supabaseService.updateEmployerProfile(id, updates);

        return reply.status(200).send({
          success: true,
          message: API_MESSAGES.EMPLOYER.PROFILE_UPDATED,
          data: updated,
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
