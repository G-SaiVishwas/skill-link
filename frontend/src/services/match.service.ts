// Match operations
// POST /api/match/:id/contact, PATCH /api/match/:id/status, etc.

export const matchService = {
  contactWorker: async (_matchId: string) => {
    // TODO: Call POST /api/match/:id/contact
  },
  
  updateMatchStatus: async (_matchId: string, _status: string) => {
    // TODO: Call PATCH /api/match/:id/status
  },
  
  getWorkerMatches: async (_workerId: string) => {
    // TODO: Call GET /api/matches?worker_id={id}
  },
}
