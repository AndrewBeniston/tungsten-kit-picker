"use client"

import { createContext, useContext, useState, useCallback } from 'react'
import { spreadsheetService } from '@/services/spreadsheet'

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  signIn: (token: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const signIn = useCallback((newToken: string) => {
    setToken(newToken)
    setIsAuthenticated(true)
    spreadsheetService.setAuthToken(newToken)
  }, [])

  const signOut = useCallback(() => {
    setToken(null)
    setIsAuthenticated(false)
    spreadsheetService.setAuthToken('')
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 