import type { FormEvent, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** `destructive` untuk aksi berisiko seperti hapus / tolak. */
  variant?: 'default' | 'destructive'
  loading?: boolean
  onConfirm: () => void
}

/** Konfirmasi sebelum aksi penting (hapus, tolak, publikasi, dsb.). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Ya, lanjutkan',
  cancelLabel = 'Batal',
  variant = 'default',
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  const destructive = variant === 'destructive'
  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className="max-w-md" hideClose>
        <div className="flex gap-4">
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl',
              destructive ? 'bg-destructive-soft text-destructive' : 'bg-primary-soft text-primary',
            )}
          >
            <AlertTriangle className="size-5" aria-hidden />
          </div>
          <DialogHeader className="pr-0">
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button variant={destructive ? 'destructive' : 'default'} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  submitLabel?: string
  loading?: boolean
  /** Biasanya `form.handleSubmit(...)` dari React Hook Form. */
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  className?: string
}

/** Dialog berisi form (tambah/ubah data). Validasi tetap di React Hook Form + Zod. */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = 'Simpan',
  loading,
  onSubmit,
  children,
  className,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">{children}</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" loading={loading}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
