import { Toaster as Sonner } from 'sonner'

/** Notifikasi toast global. Panggil `toast.success(...)` / `toast.error(...)` dari mana saja. */
export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'rounded-xl! border-border! shadow-elevated! font-sans!',
          title: 'font-semibold!',
        },
      }}
    />
  )
}
