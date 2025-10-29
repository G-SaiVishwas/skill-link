import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseService } from '../services/supabase.service';
import { geoService } from '../services/geo.service';
import { validateBody, createWorkerProfileSchema, updateWorkerProfileSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';
import { CreateWorkerProfileRequest } from '../types';

export async function workerRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/onboard/worker
   * Create worker profile
   */
  fastify.post(
    '/onboard/worker',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = validateBody(createWorkerProfileSchema, request.body) as CreateWorkerProfileRequest;
        const userId = request.user!.id;

        // Check if worker profile already exists
        const existing = await supabaseService.getWorkerProfile(userId);
        if (existing) {
          return reply.status(400).send({
            success: false,
            error: 'Worker profile already exists',
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

        // Create worker profile
        const workerProfile = await supabaseService.createWorkerProfile({
          user_id: userId,
          full_name: body.full_name,
          photo_url: body.photo_url || null,
          location_city: body.location.city,
          latitude,
          longitude,
          bio: body.bio || null,
          skills: body.skills || [],
          experience_years: body.experience_years || 0,
          hourly_rate: body.hourly_rate || null,
          availability: body.availability || 'full-time',
          languages: body.languages || ['English', 'Hindi'],
          voice_intro_url: body.voice_intro_url || null,
        });

        return reply.status(201).send({
          success: true,
          message: API_MESSAGES.WORKER.PROFILE_CREATED,
          data: workerProfile,
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
   * GET /api/worker/me
   * Get logged-in worker's profile
   */
  fastify.get(
    '/worker/me',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user!.id;

        const workerProfile = await supabaseService.getWorkerProfile(userId);

        if (!workerProfile) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.WORKER.NOT_FOUND,
          });
        }

        return reply.status(200).send({
          success: true,
          data: workerProfile,
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
   * GET /api/worker/:id/skillcard
   * Get worker's skill card
   */
  fastify.get(
    '/worker/:id/skillcard',
    async (request: FastifyRequest<{
      Params: { id: string };
    }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const skillCard = await supabaseService.getSkillCard(id);

        if (!skillCard) {
          return reply.status(404).send({
            success: false,
            error: 'Skill card not found',
          });
        }

        return reply.status(200).send({
          success: true,
          data: skillCard,
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
   * PATCH /api/worker/:id
   * Update worker profile
   */
  fastify.patch(
    '/worker/:id',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Params: { id: string };
    }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const userId = request.user!.id;
        const updates = validateBody(updateWorkerProfileSchema, request.body);

        // Get worker profile to verify ownership
        const workerProfile = await supabaseService.getWorkerProfile(userId);

        if (!workerProfile || workerProfile.id !== id) {
          return reply.status(403).send({
            success: false,
            error: 'Not authorized to update this profile',
          });
        }

        const updated = await supabaseService.updateWorkerProfile(id, updates);

        return reply.status(200).send({
          success: true,
          message: API_MESSAGES.WORKER.PROFILE_UPDATED,
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
