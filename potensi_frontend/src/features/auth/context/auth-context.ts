import { createContext } from 'react'
import type { AuthSession, AuthUser } from '@/types/auth'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  status: AuthStatus
  user: AuthUser | null
  signIn(session: AuthSession, remember: boolean): void
  signOut(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
