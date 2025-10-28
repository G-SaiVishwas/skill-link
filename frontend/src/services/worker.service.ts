// Worker operations
// POST /api/onboard/worker, GET /api/worker/me, etc.

export const workerService = {
  createWorkerProfile: async (_data: any) => {
    // TODO: Call POST /api/onboard/worker
  },
  
  getWorkerProfile: async () => {
    // TODO: Call GET /api/worker/me
  },
  
  getPublicSkillCard: async (_id: string) => {
    // TODO: Call GET /api/worker/:id/skillcard
  },
  
  updateWorkerProfile: async (_id: string, _data: any) => {
    // TODO: Call PATCH /api/worker/:id
  },
}
