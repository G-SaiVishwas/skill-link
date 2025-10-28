// Fetch wrapper with auth token handling

export async function apiCall(endpoint: string, options?: RequestInit) {
  // TODO: Add auth token from storage
  const response = await fetch(endpoint, options)
  return response.json()
}
