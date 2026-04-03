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

function getSavedUser(): AuthUser | null {
  try {
    const saved = sessionStorage.getItem('currentUser')
    return saved ? (JSON.parse(saved) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getSavedUser)

  const login = (email: string, password: string): boolean => {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (!user) return false

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    setCurrentUser(authUser)
    sessionStorage.setItem('currentUser', JSON.stringify(authUser))
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
