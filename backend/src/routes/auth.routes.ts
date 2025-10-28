import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { supabaseService } from '../services/supabase.service';
import { validateBody, loginSchema, verifyOTPSchema } from '../validators/schemas';
import { API_MESSAGES } from '../config/constants';
import { LoginRequest, VerifyOTPRequest } from '../types';

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/auth/login
   * Send OTP to phone number
   */
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = validateBody(loginSchema, request.body) as LoginRequest;

      // Send OTP (in MVP, it's just logged; in prod, send SMS)
      const { otp, expiresAt } = await authService.sendOTP(body.phone);

      // In development, return the OTP in response for testing
      const response: any = {
        success: true,
        message: API_MESSAGES.AUTH.OTP_SENT,
      };

      if (process.env.NODE_ENV === 'development') {
        response.debug = { otp, expiresAt };
      }

      return reply.status(200).send(response);
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
      });
    }
  });

  /**
   * POST /api/auth/verify
   * Verify OTP and return JWT token
   */
  fastify.post('/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = validateBody(verifyOTPSchema, request.body) as VerifyOTPRequest;

      // Verify OTP
      const isValid = authService.verifyOTP(body.phone, body.otp);

      if (!isValid) {
        return reply.status(401).send({
          success: false,
          error: API_MESSAGES.AUTH.INVALID_OTP,
        });
      }

      // Check if user exists
      let user = await supabaseService.getUserByPhone(body.phone);

      if (!user) {
        // Create new user with unknown role (will be set during onboarding)
        const authUid = `auth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        user = await supabaseService.createUser({
          auth_uid: authUid,
          role: 'worker', // Default to worker; can be changed during onboarding
          phone: body.phone,
        });
      }

      // Generate JWT token
      const token = authService.generateToken(user);

      // Clear OTP
      authService.clearOTP(body.phone);

      return reply.status(200).send({
        success: true,
        message: API_MESSAGES.AUTH.OTP_VERIFIED,
        token,
        user: {
          id: user.id,
          auth_uid: user.auth_uid,
          role: user.role,
          phone: user.phone,
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
   * POST /api/auth/refresh
   * Refresh access token
   */
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          success: false,
          error: API_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);

      // Get latest user data
      const user = await supabaseService.getUserByAuthUid(decoded.authUid);

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found',
        });
      }

      // Generate new token
      const newToken = authService.generateToken(user);

      return reply.status(200).send({
        success: true,
        token: newToken,
      });
    } catch (error: any) {
      return reply.status(401).send({
        success: false,
        error: API_MESSAGES.AUTH.TOKEN_INVALID,
      });
    }
  });
}
