import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseService } from '../services/supabase.service';
import { openaiService } from '../services/openai.service';
import { storageService } from '../services/storage.service';
import { geoService } from '../services/geo.service';
import { validateBody, createWorkerProfileSchema, updateWorkerProfileSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';
import { CreateWorkerProfileRequest } from '../types';

export async function workerRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/onboard/worker
   * Create worker profile with AI skill extraction
   */
  fastify.post(
    '/onboard/worker',
    { preHandler: [authMiddleware] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = validateBody(createWorkerProfileSchema, request.body) as CreateWorkerProfileRequest;
        const userId = request.user!.userId;

        // Check if worker profile already exists
        const existing = await supabaseService.getWorkerProfile(userId);
        if (existing) {
          return reply.status(400).send({
            success: false,
            error: 'Worker profile already exists',
          });
        }

        // Extract skills from intro text using AI
        let aiSkills: any = null;
        let transcript = body.intro_text || '';

        if (body.voice_url && !transcript) {
          // If voice provided but no text, we'd transcribe here (requires audio buffer)
          // For now, assume transcript is provided or voice is already transcribed
          transcript = 'Voice intro provided';
        }

        if (transcript) {
          aiSkills = await openaiService.extractSkillsFromText(
            transcript,
            body.location.city,
            'India'
          );
        }

        // Generate bilingual bio using AI
        const bioResult = await openaiService.generateWorkerBio({
          display_name: body.display_name,
          city: body.location.city,
          skills: aiSkills?.tags || [],
          suggested_rate: body.rate_per_hour,
          languages: body.languages || ['English', 'Hindi'],
        });

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

        // Calculate initial TrustRank
        const trustRankResult = await openaiService.calculateTrustRank({
          voice_sentiment_score: 0.7, // Default for new users
          verification_count: 0,
          completed_jobs: 0,
          account_age_days: 0,
        });

        // Create worker profile
        const workerProfile = await supabaseService.createWorkerProfile({
          user_id: userId,
          display_name: body.display_name,
          photo_url: body.photo_url || null,
          voice_intro_url: body.voice_url || null,
          voice_transcript: transcript || null,
          bio_generated: bioResult.english_bio,
          bio_generated_local: bioResult.hindi_bio,
          location_city: body.location.city,
          latitude,
          longitude,
          suggested_rate: body.rate_per_hour || bioResult.daily_rate_range[0],
          availability_status: 'available',
          trustrank: trustRankResult.score / 20, // Convert 0-100 to 0-5 scale
          verified: false,
          languages: body.languages || ['English', 'Hindi'],
          voice_sentiment_score: 0.7,
          ai_metadata: {
            skills_extracted: aiSkills,
            bio_generation: bioResult,
            trustrank_initial: trustRankResult,
          },
        });

        // Link skills to user
        const linkedSkills: any[] = [];
        if (aiSkills && aiSkills.tags) {
          for (const tag of aiSkills.tags) {
            // Get or create skill
            let skill = await supabaseService.getSkillBySlug(tag);
            if (!skill) {
              skill = await supabaseService.createSkill({
                slug: tag,
                name: tag.charAt(0).toUpperCase() + tag.slice(1),
                synonyms: [],
              });
            }

            // Link to user
            await supabaseService.linkUserToSkill(
              userId,
              skill.id,
              'intermediate',
              aiSkills.experience_years || 1
            );

            linkedSkills.push({
              slug: skill.slug,
              name: skill.name,
              proficiency: 'intermediate',
            });
          }
        }

        // Create skill card
        const cardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/worker/${workerProfile.id}`;
        const qrCodeData = await storageService.generateQRCode(cardUrl);

        const skillCard = await supabaseService.createSkillCard({
          worker_id: workerProfile.id,
          card_url: cardUrl,
          qr_code_data: qrCodeData,
          price: 1500,
          verified: false,
          template_variant: 'v1',
          generated_summary: bioResult.english_bio,
        });

        return reply.status(201).send({
          success: true,
          message: API_MESSAGES.WORKER.PROFILE_CREATED,
          worker_profile: workerProfile,
          skills: linkedSkills,
          skill_card: {
            card_url: skillCard.card_url,
            qr_code_data: skillCard.qr_code_data,
          },
        });
      } catch (error: any) {
        console.error('Worker onboarding error:', error);
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
        const userId = request.user!.userId;

        const workerProfile = await supabaseService.getWorkerProfile(userId);

        if (!workerProfile) {
          return reply.status(404).send({
            success: false,
            error: API_MESSAGES.WORKER.NOT_FOUND,
          });
        }

        // Get skills
        const skills = await supabaseService.getUserSkills(userId);

        return reply.status(200).send({
          success: true,
          data: {
            ...workerProfile,
            skills,
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
   * GET /api/worker/:id/skillcard
   * Get public skill card (NO AUTH REQUIRED)
   */
  fastify.get('/worker/:id/skillcard', async (request: FastifyRequest<{
    Params: { id: string };
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      const workerProfile = await supabaseService.getWorkerProfileById(id);

      if (!workerProfile) {
        return reply.status(404).send({
          success: false,
          error: API_MESSAGES.WORKER.NOT_FOUND,
        });
      }

      // Get user info
      const user = await supabaseService.getUserByAuthUid(workerProfile.user_id);

      // Get skills
      const skills = await supabaseService.getUserSkills(workerProfile.user_id);

      // Get skill card
      const skillCard = await supabaseService.getSkillCardByWorkerId(id);

      return reply.status(200).send({
        success: true,
        data: {
          worker: workerProfile,
          skills,
          skill_card: skillCard,
        },
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
      });
    }
  });

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
        const userId = request.user!.userId;
        const updates = validateBody(updateWorkerProfileSchema, request.body);

        // Verify ownership
        const workerProfile = await supabaseService.getWorkerProfileById(id);
        if (!workerProfile || workerProfile.user_id !== userId) {
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
