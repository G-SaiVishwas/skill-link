// Global toast notifications

'use client'

import { createContext } from 'react'

export const ToastContext = createContext({})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastContext.Provider value={{}}>{children}</ToastContext.Provider>
}
