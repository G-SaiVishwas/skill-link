// Job operations
// POST /api/job/create, GET /api/job/:id, etc.

export const jobService = {
  createJobRequest: async (_data: any) => {
    // TODO: Call POST /api/job/create
  },
  
  getJobMatches: async (_jobId: string) => {
    // TODO: Call GET /api/job/:id/matches
  },
  
  getJobDetails: async (_jobId: string) => {
    // TODO: Call GET /api/job/:id
  },
  
  searchWorkers: async (_filters: any) => {
    // TODO: Call GET /api/workers/search
  },
}
