import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../types';

interface SupabaseJWTPayload {
  aud: string;
  exp: number;
  sub: string; // This is the auth_uid from Supabase Auth
  email?: string;
  phone?: string;
  role?: string;
  user_metadata?: any;
  app_metadata?: any;
}

class AuthService {
  /**
   * Verify Supabase JWT token
   */
  verifySupabaseToken(token: string): SupabaseJWTPayload {
    try {
      const decoded = jwt.verify(token, config.supabase.jwtSecret, {
        algorithms: ['HS256'],
      }) as SupabaseJWTPayload;
      
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired Supabase token');
    }
  }

  /**
   * Extract user info from Supabase JWT
   */
  extractUserFromToken(token: string): { authUid: string; email?: string; phone?: string } {
    const decoded = this.verifySupabaseToken(token);
    return {
      authUid: decoded.sub,
      email: decoded.email || decoded.user_metadata?.email,
      phone: decoded.phone || decoded.user_metadata?.phone,
    };
  }

  /**
   * Validate if token is from Supabase Auth
   */
  isValidSupabaseToken(token: string): boolean {
    try {
      this.verifySupabaseToken(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate JWT token for a user (custom token if needed)
   */
  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      authUid: user.auth_uid,
      role: user.role,
      email: user.email,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as any);
  }

  /**
   * Verify custom JWT token (fallback if not using Supabase token)
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();
