import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseService } from '../services/supabase.service';
import { validateBody, updateMatchStatusSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';

export async function matchRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/match/:id/contact
   * Shortlist worker and initiate chat
   */
  fastify.post(
    '/match/:id/contact',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Params: { id: string };
    }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        // Get match
        const match = await supabaseService.getMatch(id);

        if (!match) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.MATCH.NOT_FOUND,
          });
        }

        // Update match status to 'contacted'
        const updated = await supabaseService.updateMatchStatus(id, 'contacted', {
          contacted_at: new Date().toISOString(),
        });

        return reply.status(200).send({
          success: true,
          message: API_MESSAGES.MATCH.CREATED,
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

  /**
   * PATCH /api/match/:id/status
   * Update match status
   */
  fastify.patch(
    '/match/:id/status',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Params: { id: string };
    }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const body = validateBody(updateMatchStatusSchema, request.body) as { status: string };

        // Additional fields based on status
        const additionalFields: any = {};
        if (body.status === 'hired') {
          additionalFields.hired_at = new Date().toISOString();
        }

        const updated = await supabaseService.updateMatchStatus(id, body.status, additionalFields);

        return reply.status(200).send({
          success: true,
          message: API_MESSAGES.MATCH.UPDATED,
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

  /**
   * GET /api/matches
   * Get matches (filter by worker_id or employer_id via query)
   */
  fastify.get(
    '/matches',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Querystring: { worker_id?: string; employer_id?: string };
    }>, reply: FastifyReply) => {
      try {
        const { worker_id } = request.query;

        if (worker_id) {
          const matches = await supabaseService.getWorkerMatches(worker_id);
          return reply.status(200).send({
            success: true,
            data: matches,
          });
        }

        // Default: return empty (could implement employer-side match retrieval)
        return reply.status(200).send({
          success: true,
          data: [],
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
