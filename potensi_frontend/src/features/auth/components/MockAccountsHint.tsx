import { FlaskConical } from 'lucide-react'
import { MOCK_PASSWORD, MOCK_USERS } from '@/mocks/fixtures/users'
import { ROLE_LABEL } from '../lib/role-home'

/** Hanya tampil saat `npm run dev` + VITE_USE_MOCK=true. Tidak ikut ke build produksi. */
export function MockAccountsHint() {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-brand-gold/60 bg-warning/50 p-3.5 text-xs text-warning-foreground">
      <p className="mb-2 flex items-center gap-1.5 font-semibold">
        <FlaskConical className="size-3.5" aria-hidden /> Mode mock — akun demo (sandi: {MOCK_PASSWORD})
      </p>
      <ul className="space-y-1">
        {MOCK_USERS.map((u) => (
          <li key={u.id} className="flex justify-between gap-2">
            <span className="font-mono">{u.email}</span>
            <span className="text-warning-foreground/70">{ROLE_LABEL[u.role]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
