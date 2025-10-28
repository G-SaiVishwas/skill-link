// Authentication service
// POST /api/auth/login, POST /api/auth/verify

export const authService = {
  sendOTP: async (_phone: string) => {
    // TODO: Call POST /api/auth/login
  },
  
  verifyOTP: async (_phone: string, _otp: string) => {
    // TODO: Call POST /api/auth/verify
  },
}
