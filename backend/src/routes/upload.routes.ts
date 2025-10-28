import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { storageService } from '../services/storage.service';
import { openaiService } from '../services/openai.service';
import { API_MESSAGES, UPLOAD_LIMITS } from '../config/constants';

export async function uploadRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/upload/photo
   * Upload and resize worker photo
   */
  fastify.post(
    '/upload/photo',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = await request.file();

        if (!data) {
          return reply.status(400).send({
            success: false,
            error: 'No file uploaded',
          });
        }

        // Validate file type
        if (!storageService.validateFileType(data.mimetype, UPLOAD_LIMITS.PHOTO.ALLOWED_TYPES)) {
          return reply.status(400).send({
            success: false,
            error: API_MESSAGES.UPLOAD.INVALID_TYPE,
          });
        }

        // Get file buffer
        const buffer = await data.toBuffer();

        // Validate file size
        if (!storageService.validateFileSize(buffer.length, UPLOAD_LIMITS.PHOTO.MAX_SIZE)) {
          return reply.status(400).send({
            success: false,
            error: API_MESSAGES.UPLOAD.TOO_LARGE,
          });
        }

        // Upload and optimize
        const userId = request.user!.id;
        const publicUrl = await storageService.uploadPhoto(buffer, userId, data.filename);

        return reply.status(200).send({
          success: true,
          message: API_MESSAGES.UPLOAD.SUCCESS,
          url: publicUrl,
        });
      } catch (error: any) {
        console.error('Photo upload error:', error);
        return reply.status(500).send({
          success: false,
          error: error.message || API_MESSAGES.UPLOAD.FAILED,
        });
      }
    }
  );

  /**
   * POST /api/upload/voice
   * Upload voice file and optionally transcribe
   */
  fastify.post(
    '/upload/voice',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest<{
      Querystring: { transcribe?: string };
    }>, reply: FastifyReply) => {
      try {
        const data = await request.file();

        if (!data) {
          return reply.status(400).send({
            success: false,
            error: 'No file uploaded',
          });
        }

        // Validate file type
        if (!storageService.validateFileType(data.mimetype, UPLOAD_LIMITS.VOICE.ALLOWED_TYPES)) {
          return reply.status(400).send({
            success: false,
            error: API_MESSAGES.UPLOAD.INVALID_TYPE,
          });
        }

        // Get file buffer
        const buffer = await data.toBuffer();

        // Validate file size
        if (!storageService.validateFileSize(buffer.length, UPLOAD_LIMITS.VOICE.MAX_SIZE)) {
          return reply.status(400).send({
            success: false,
            error: API_MESSAGES.UPLOAD.TOO_LARGE,
          });
        }

        // Upload voice file
        const userId = request.user!.id;
        const publicUrl = await storageService.uploadVoice(
          buffer,
          userId,
          data.filename,
          data.mimetype
        );

        // Optionally transcribe
        let transcript = null;
        if (request.query.transcribe === 'true') {
          try {
            transcript = await openaiService.transcribeVoice(buffer, data.filename);
          } catch (err) {
            console.error('Transcription failed:', err);
            // Continue without transcript
          }
        }

        return reply.status(200).send({
          success: true,
          message: API_MESSAGES.UPLOAD.SUCCESS,
          url: publicUrl,
          transcript,
        });
      } catch (error: any) {
        console.error('Voice upload error:', error);
        return reply.status(500).send({
          success: false,
          error: error.message || API_MESSAGES.UPLOAD.FAILED,
        });
      }
    }
  );
}
