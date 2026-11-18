import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { tokenStorage } from '@/lib/token-storage'
import { authService } from '@/services/auth.service'
import { setUnauthorizedHandler } from '@/services/api-client'
import type { AuthSession } from '@/types/auth'
import { authKeys } from '../lib/query-keys'
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())

  // Pulihkan sesi saat halaman di-refresh: token ada → ambil profil user.
  const meQuery = useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await authService.me()
      } catch (error) {
        // Token tidak valid/kedaluwarsa → buang supaya tidak dipakai lagi.
        tokenStorage.clear()
        throw error
      }
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  })

  const clearSession = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    return () => setUnauthorizedHandler(null)
  }, [clearSession])

  const signIn = useCallback(
    (session: AuthSession, remember: boolean) => {
      tokenStorage.set(session.token, remember)
      queryClient.setQueryData(authKeys.me, session.user)
      setToken(session.token)
    },
    [queryClient],
  )

  const signOut = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Sesi lokal tetap dihapus meski request logout gagal.
    }
    clearSession()
  }, [clearSession])

  const status: AuthStatus = !token
    ? 'unauthenticated'
    : meQuery.isSuccess
      ? 'authenticated'
      : meQuery.isError
        ? 'unauthenticated'
        : 'loading'

  const value = useMemo<AuthContextValue>(
    () => ({ status, user: status === 'authenticated' ? (meQuery.data ?? null) : null, signIn, signOut }),
    [status, meQuery.data, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
