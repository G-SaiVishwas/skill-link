// Application constants

export const USER_ROLES = {
  WORKER: 'worker',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
} as const;

export const SKILL_PROFICIENCY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  EXPERT: 'expert',
} as const;

export const JOB_REQUEST_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  FILLED: 'filled',
  CANCELLED: 'cancelled',
} as const;

export const JOB_URGENCY_LEVEL = {
  FLEXIBLE: 'flexible',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const MATCH_STATUS = {
  SUGGESTED: 'suggested',
  SHORTLISTED: 'shortlisted',
  CONTACTED: 'contacted',
  HIRED: 'hired',
  REJECTED: 'rejected',
} as const;

export const MESSAGE_DIRECTION = {
  WORKER_TO_EMPLOYER: 'worker_to_employer',
  EMPLOYER_TO_WORKER: 'employer_to_worker',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const VERIFICATION_METHOD = {
  EMPLOYER: 'employer',
  DOCUMENT: 'document',
  PHONE: 'phone',
  AI_REVIEW: 'ai_review',
} as const;

export const WORKER_AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  INACTIVE: 'inactive',
} as const;

// API Response Messages
export const API_MESSAGES = {
  AUTH: {
    OTP_SENT: 'OTP sent successfully',
    OTP_VERIFIED: 'Login successful',
    INVALID_OTP: 'Invalid OTP',
    OTP_EXPIRED: 'OTP expired',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_INVALID: 'Invalid or expired token',
  },
  WORKER: {
    PROFILE_CREATED: 'Worker profile created successfully',
    PROFILE_UPDATED: 'Worker profile updated successfully',
    NOT_FOUND: 'Worker profile not found',
  },
  EMPLOYER: {
    PROFILE_CREATED: 'Employer profile created successfully',
    PROFILE_UPDATED: 'Employer profile updated successfully',
    NOT_FOUND: 'Employer profile not found',
  },
  JOB: {
    CREATED: 'Job request created successfully',
    NOT_FOUND: 'Job request not found',
    UPDATED: 'Job request updated successfully',
  },
  MATCH: {
    CREATED: 'Match created successfully',
    UPDATED: 'Match status updated',
    NOT_FOUND: 'Match not found',
  },
  MESSAGE: {
    SENT: 'Message sent successfully',
    NOT_FOUND: 'Chat not found',
  },
  UPLOAD: {
    SUCCESS: 'File uploaded successfully',
    FAILED: 'File upload failed',
    INVALID_TYPE: 'Invalid file type',
    TOO_LARGE: 'File size exceeds limit',
  },
  GENERAL: {
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    NOT_FOUND: 'Resource not found',
  },
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  PHOTO: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    RESIZE_WIDTH: 800,
    RESIZE_HEIGHT: 800,
  },
  VOICE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/wav', 'audio/webm'],
    MAX_DURATION: 180, // 3 minutes in seconds
  },
};

// Geo distance constants (in kilometers)
export const GEO_CONSTANTS = {
  EARTH_RADIUS_KM: 6371,
  DEFAULT_SEARCH_RADIUS: 50, // 50km default search radius
  MAX_SEARCH_RADIUS: 500, // 500km max radius
};

// Skill card constants
export const SKILL_CARD = {
  BASE_URL: '/worker',
  QR_SIZE: 300,
  TEMPLATES: ['v1', 'v2', 'premium'],
};

// Matching algorithm weights
export const MATCH_WEIGHTS = {
  SKILL_MATCH: 0.4,
  DISTANCE: 0.25,
  TRUSTRANK: 0.2,
  RATE: 0.1,
  AVAILABILITY: 0.05,
};
