// Dark/light mode (optional)

'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>
}
