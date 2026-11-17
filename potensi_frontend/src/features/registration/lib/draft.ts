import { EMPTY_REGISTRATION, type RegistrationFormValues } from '../schemas/registration.schema'

/**
 * Draf form registrasi disimpan di localStorage browser ini saja
 * supaya isian tidak hilang saat halaman ter-refresh.
 */
const DRAFT_KEY = 'potensi.registration-draft'

type Draft = Omit<RegistrationFormValues, 'agreement'>

export function loadDraft(): { values: RegistrationFormValues; hasDraft: boolean } {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return { values: EMPTY_REGISTRATION, hasDraft: false }
    const draft = JSON.parse(raw) as Partial<Draft>
    return {
      values: {
        institution: { ...EMPTY_REGISTRATION.institution, ...draft.institution },
        admin: { ...EMPTY_REGISTRATION.admin, ...draft.admin },
        agreement: false,
      },
      hasDraft: true,
    }
  } catch {
    return { values: EMPTY_REGISTRATION, hasDraft: false }
  }
}

export function saveDraft(values: Partial<RegistrationFormValues>) {
  try {
    const draft: Partial<Draft> = { institution: values.institution, admin: values.admin }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // abaikan
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // abaikan
  }
}
