import { createContext, useState, type ReactNode } from 'react'
import type { AuthUser } from '../types'
import { MOCK_USERS } from '../data/users'

type AuthContextType = {
  currentUser: AuthUser | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  const login = (email: string, password: string): boolean => {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) return false

    const { password: _, ...authUser } = user
    setCurrentUser(authUser)
    return true
  }

  const logout = () => {
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
