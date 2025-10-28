import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { supabaseService } from '../services/supabase.service';
import { API_MESSAGES } from '../config/constants';

/**
 * Auth routes for Supabase Google OAuth
 * 
 * Flow:
 * 1. Frontend uses Supabase Auth UI for Google OAuth
 * 2. Frontend gets Supabase session token
 * 3. Frontend sends token to /api/auth/session
 * 4. Backend verifies token and creates/retrieves user
 * 5. Backend returns user data
 */
export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/auth/session
   * Verify Supabase token and get/create user
   */
  fastify.post('/session', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          success: false,
          error: 'Authorization header required',
        });
      }

      const token = authHeader.substring(7);

      // Verify and extract user info from Supabase token
      const tokenData = authService.extractUserFromToken(token);

      // Check if user exists
      let user = await supabaseService.getUserByAuthUid(tokenData.authUid);

      if (!user) {
        // Create new user from Google OAuth data
        user = await supabaseService.createUser({
          auth_uid: tokenData.authUid,
          email: tokenData.email,
          phone: tokenData.phone || '',
          role: '', // Will be set during onboarding
        });
      }

      return reply.status(200).send({
        success: true,
        user: {
          id: user.id,
          auth_uid: user.auth_uid,
          email: user.email,
          phone: user.phone,
          role: user.role,
          created_at: user.created_at,
        },
        message: user.role ? 'User authenticated' : 'Please complete onboarding',
        needsOnboarding: !user.role,
      });
    } catch (error: any) {
      console.error('Auth session error:', error);
      return reply.status(401).send({
        success: false,
        error: API_MESSAGES.AUTH.TOKEN_INVALID,
      });
    }
  });

  /**
   * GET /api/auth/me
   * Get current user (requires auth)
   */
  fastify.get('/me', {
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          reply.status(401).send({
            success: false,
            error: API_MESSAGES.AUTH.UNAUTHORIZED,
          });
          return;
        }

        const token = authHeader.substring(7);
        const tokenData = authService.extractUserFromToken(token);
        const user = await supabaseService.getUserByAuthUid(tokenData.authUid);

        if (!user) {
          reply.status(401).send({
            success: false,
            error: 'User not found',
          });
          return;
        }

        request.user = user;
      } catch (error) {
        reply.status(401).send({
          success: false,
          error: API_MESSAGES.AUTH.TOKEN_INVALID,
        });
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      user: request.user,
    });
  });

  /**
   * POST /api/auth/logout
   * Logout (client-side handles Supabase signOut)
   */
  fastify.post('/logout', async (_request: FastifyRequest, reply: FastifyReply) => {
    // With Supabase, logout is handled on client side
    // This endpoint is just for consistency
    return reply.status(200).send({
      success: true,
      message: 'Logged out successfully',
    });
  });
}

