import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseService } from '../services/supabase.service';
// import { openaiService } from '../services/openai.service'; // For future translation feature
import { validateBody, sendMessageSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';
import { SendMessageRequest } from '../types';

export async function chatRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/messages/:match_id
   * Get all messages for a match
   */
  fastify.get(
    '/messages/:match_id',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Params: { match_id: string };
    }>, reply: FastifyReply) => {
      try {
        const { match_id } = request.params;

        const messages = await supabaseService.getMessages(match_id);

        return reply.status(200).send({
          success: true,
          data: messages,
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
   * POST /api/message
   * Send a new message
   */
  fastify.post(
    '/message',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = validateBody(sendMessageSchema, request.body) as SendMessageRequest;
        const userId = request.user!.id;

        // Get match to determine direction
        const match = await supabaseService.getMatch(body.match_id);

        if (!match) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.MESSAGE.NOT_FOUND,
          });
        }

        // Determine message direction
        const workerProfile = match.worker_profiles;
        const jobRequest = match.job_requests;

        let direction = 'worker_to_employer';
        if (workerProfile && workerProfile.user_id === userId) {
          direction = 'worker_to_employer';
        } else {
          direction = 'employer_to_worker';
        }

        // Optionally translate message (for multi-language support)
        // For MVP, we'll just store the original text
        const message = await supabaseService.createMessage({
          match_id: body.match_id,
          sender_user_id: userId,
          message_text: body.message_text,
          message_translated_text: null,
          message_language: 'en', // Default language
          direction,
        });

        return reply.status(201).send({
          success: true,
          message: API_MESSAGES.MESSAGE.SENT,
          data: message,
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
