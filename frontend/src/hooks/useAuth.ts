// Auth state (current user, login, logout)
import { useAuth as useAuthContext } from '../context/AuthContext'

export function useAuth() {
  return useAuthContext()
}
