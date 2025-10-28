import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
});

export const verifyOTPSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Worker profile schemas
export const createWorkerProfileSchema = z.object({
  display_name: z.string().min(2).max(100),
  intro_text: z.string().optional(),
  photo_url: z.string().url().optional(),
  voice_url: z.string().url().optional(),
  location: z.object({
    city: z.string().min(2),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
  rate_per_hour: z.number().positive().optional(),
  languages: z.array(z.string()).optional(),
});

export const updateWorkerProfileSchema = z.object({
  display_name: z.string().min(2).max(100).optional(),
  bio_generated: z.string().optional(),
  location_city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  suggested_rate: z.number().positive().optional(),
  availability_status: z.enum(['available', 'busy', 'inactive']).optional(),
  languages: z.array(z.string()).optional(),
});

// Employer profile schemas
export const createEmployerProfileSchema = z.object({
  org_name: z.string().min(2).max(200).optional(),
  contact_name: z.string().min(2).max(100),
  photo_url: z.string().url().optional(),
  location: z.object({
    city: z.string().min(2),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
  preferred_languages: z.array(z.string()).optional(),
});

export const updateEmployerProfileSchema = z.object({
  org_name: z.string().min(2).max(200).optional(),
  contact_name: z.string().min(2).max(100).optional(),
  photo_url: z.string().url().optional(),
  location_city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  preferred_languages: z.array(z.string()).optional(),
});

// Job request schemas
export const createJobRequestSchema = z.object({
  raw_text: z.string().min(10).max(2000),
  location: z.object({
    city: z.string().min(2),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
  voice_url: z.string().url().optional(),
});

export const searchWorkersSchema = z.object({
  skills: z.string().optional(),
  city: z.string().optional(),
  rate_min: z.coerce.number().positive().optional(),
  rate_max: z.coerce.number().positive().optional(),
  radius_km: z.coerce.number().positive().max(500).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

// Match schemas
export const updateMatchStatusSchema = z.object({
  status: z.enum(['suggested', 'shortlisted', 'contacted', 'hired', 'rejected']),
});

// Message schemas
export const sendMessageSchema = z.object({
  match_id: z.string().uuid(),
  message_text: z.string().min(1).max(5000),
});

// Helper to validate request body
export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
