import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../types';

// In-memory OTP store (for MVP - use Redis in production)
interface OTPRecord {
  otp: string;
  expiresAt: Date;
  verified: boolean;
}

const otpStore = new Map<string, OTPRecord>();

class AuthService {
  /**
   * Generate a random 6-digit OTP
   */
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to phone (MVP: just store it, in prod use Twilio/AWS SNS)
   */
  async sendOTP(phone: string): Promise<{ otp: string; expiresAt: Date }> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

    otpStore.set(phone, {
      otp,
      expiresAt,
      verified: false,
    });

    // TODO: In production, send SMS via Twilio/AWS SNS
    console.log(`📱 OTP for ${phone}: ${otp} (expires at ${expiresAt.toISOString()})`);

    return { otp, expiresAt };
  }

  /**
   * Verify OTP for a phone number
   */
  verifyOTP(phone: string, otp: string): boolean {
    const record = otpStore.get(phone);

    if (!record) {
      return false;
    }

    if (record.verified) {
      return false; // OTP already used
    }

    if (new Date() > record.expiresAt) {
      otpStore.delete(phone);
      return false; // OTP expired
    }

    if (record.otp !== otp) {
      return false; // Wrong OTP
    }

    // Mark as verified
    record.verified = true;
    return true;
  }

  /**
   * Generate JWT token for a user
   */
  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      authUid: user.auth_uid,
      role: user.role,
      phone: user.phone,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Clear OTP record (cleanup)
   */
  clearOTP(phone: string): void {
    otpStore.delete(phone);
  }

  /**
   * Get OTP for testing purposes (dev only!)
   */
  getOTPForTesting(phone: string): string | null {
    if (config.nodeEnv !== 'development') {
      return null;
    }
    const record = otpStore.get(phone);
    return record?.otp || null;
  }
}

export const authService = new AuthService();
