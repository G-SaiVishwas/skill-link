// Type definitions for SkillLink API

export interface User {
  id: string;
  auth_uid: string;
  role: 'worker' | 'employer' | 'admin';
  phone: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  display_name: string;
  photo_url: string | null;
  voice_intro_url: string | null;
  voice_transcript: string | null;
  bio_generated: string | null;
  bio_generated_local: string | null;
  location_city: string | null;
  latitude: number | null;
  longitude: number | null;
  suggested_rate: number | null;
  availability_status: 'available' | 'busy' | 'inactive';
  trustrank: number;
  verified: boolean;
  languages: string[];
  voice_sentiment_score: number | null;
  ai_metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  user_id: string;
  org_name: string | null;
  contact_name: string | null;
  photo_url: string | null;
  location_city: string | null;
  latitude: number | null;
  longitude: number | null;
  preferred_languages: string[];
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  slug: string;
  name: string;
  synonyms: string[];
  category: string | null;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: 'beginner' | 'intermediate' | 'expert';
  experience_years: number;
  created_at: string;
}

export interface JobRequest {
  id: string;
  employer_id: string;
  raw_text: string;
  ai_transcript: string | null;
  ai_skills: string[];
  structured_job: Record<string, any> | null;
  role_text: string | null;
  urgency: 'flexible' | 'medium' | 'high' | 'urgent';
  preferred_experience: string | null;
  location_city: string | null;
  latitude: number | null;
  longitude: number | null;
  availability_window: string | null;
  status: 'open' | 'in_progress' | 'filled' | 'cancelled';
  ai_summary: string | null;
  ai_meta: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  request_id: string;
  worker_id: string;
  score: number;
  status: 'suggested' | 'shortlisted' | 'contacted' | 'hired' | 'rejected';
  matched_at: string;
  contacted_at: string | null;
  hired_at: string | null;
}

export interface Message {
  id: string;
  match_id: string;
  sender_user_id: string;
  message_text: string;
  message_translated_text: string | null;
  message_language: string | null;
  direction: 'worker_to_employer' | 'employer_to_worker';
  created_at: string;
}

export interface SkillCard {
  id: string;
  worker_id: string;
  card_url: string;
  qr_code_data: string;
  price: number | null;
  verified: boolean;
  template_variant: string | null;
  generated_summary: string | null;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types

export interface LoginRequest {
  phone: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message: string;
}

export interface CreateWorkerProfileRequest {
  display_name: string;
  intro_text?: string;
  photo_url?: string;
  voice_url?: string;
  location: {
    city: string;
    lat?: number;
    lng?: number;
  };
  rate_per_hour?: number;
  languages?: string[];
}

export interface CreateWorkerProfileResponse {
  success: boolean;
  worker_profile: WorkerProfile;
  skills: Array<{
    slug: string;
    name: string;
    proficiency: string;
  }>;
  skill_card: {
    card_url: string;
    qr_code_data: string;
  };
}

export interface CreateEmployerProfileRequest {
  org_name?: string;
  contact_name: string;
  photo_url?: string;
  location: {
    city: string;
    lat?: number;
    lng?: number;
  };
  preferred_languages?: string[];
}

export interface CreateJobRequest {
  raw_text: string;
  location: {
    city: string;
    lat?: number;
    lng?: number;
  };
  voice_url?: string;
}

export interface CreateJobResponse {
  success: boolean;
  job: JobRequest;
  suggested_workers: SuggestedWorker[];
}

export interface SuggestedWorker {
  worker_id: string;
  match_id: string;
  score: number;
  name: string;
  photo_url: string | null;
  bio: string | null;
  skills: string[];
  rate_per_hour: number | null;
  distance_km: number | null;
  trustrank: number;
}

export interface SearchWorkersQuery {
  skills?: string;
  city?: string;
  rate_min?: number;
  rate_max?: number;
  radius_km?: number;
  lat?: number;
  lng?: number;
}

export interface SendMessageRequest {
  match_id: string;
  message_text: string;
}

// AI Service Types

export interface VoiceToSkillsResult {
  tags: string[];
  experience_years: number;
  languages_spoken: string[];
  preferred_roles: string[];
  confidence: number;
  notes: string;
}

export interface JobDecoderResult {
  role: string;
  required_skills: string[];
  urgency: string;
  availability_timeframe: string;
  preferred_experience: string | null;
  ai_skills: string[];
  confidence: number;
  confidence_notes: string;
}

export interface ProfileGenerationResult {
  english_bio: string;
  hindi_bio: string;
  daily_rate_range: [number, number];
  rate_rationale: string;
  tone: string;
}

export interface TrustRankResult {
  score: number;
  score_breakdown: string[];
  recommendations: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  details?: any;
}
