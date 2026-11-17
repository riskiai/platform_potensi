import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth.service'
import type { ApiError } from '@/types/api'
import type { AuthSession, LoginPayload } from '@/types/auth'
import { ROLE_HOME } from '../lib/role-home'
import { useAuth } from './useAuth'

interface LocationState {
  from?: string
}

export function useLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation<AuthSession, ApiError, LoginPayload>({
    mutationFn: authService.login,
    onSuccess(session, payload) {
      signIn(session, payload.remember)
      const from = (location.state as LocationState | null)?.from
      navigate(from ?? ROLE_HOME[session.user.role], { replace: true })
    },
  })
}
