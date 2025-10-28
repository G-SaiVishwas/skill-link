// Route constants for navigation

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  
  WORKER_DASHBOARD: '/worker/dashboard',
  WORKER_ONBOARD: '/worker/onboard',
  WORKER_PROFILE: (id: string) => `/worker/profile/${id}`,
  WORKER_SETTINGS: '/worker/settings',
  
  EMPLOYER_DASHBOARD: '/employer/dashboard',
  EMPLOYER_POST_JOB: '/employer/post-job',
  EMPLOYER_MATCHES: '/employer/matches',
  EMPLOYER_SEARCH: '/employer/search',
  EMPLOYER_JOB: (id: string) => `/employer/jobs/${id}`,
  EMPLOYER_SETTINGS: '/employer/settings',
  
  CHAT: (matchId: string) => `/chat/${matchId}`,
}
