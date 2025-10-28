import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { supabaseService } from '../services/supabase.service';
import { API_MESSAGES } from '../config/constants';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      authUid: string;
      role: string;
      phone: string;
    };
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
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

    // Attach user info to request
    request.user = {
      userId: decoded.userId,
      authUid: decoded.authUid,
      role: decoded.role,
      phone: decoded.phone,
    };
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: API_MESSAGES.AUTH.TOKEN_INVALID,
    });
  }
}

/**
 * Middleware to check if user has specific role
 */
export function requireRole(...allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: API_MESSAGES.AUTH.UNAUTHORIZED,
      });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({
        success: false,
        error: 'Insufficient permissions',
      });
    }
  };
}

/**
 * Error handler middleware
 */
export async function errorHandler(
  error: Error & { statusCode?: number; validation?: any },
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const statusCode = error.statusCode || 500;

  console.error('Error:', {
    url: request.url,
    method: request.method,
    error: error.message,
    stack: error.stack,
  });

  // Validation errors (from Zod)
  if (error.name === 'ZodError') {
    return reply.status(400).send({
      success: false,
      error: API_MESSAGES.GENERAL.VALIDATION_ERROR,
      details: error.message,
    });
  }

  // Generic error response
  reply.status(statusCode).send({
    success: false,
    error: error.message || API_MESSAGES.GENERAL.SERVER_ERROR,
  });
}
