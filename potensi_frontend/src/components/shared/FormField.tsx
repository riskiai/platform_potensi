import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  /** Harus sama dengan `id` input di dalamnya. */
  id: string
  label: string
  error?: string
  description?: ReactNode
  required?: boolean
  className?: string
  /** Satu elemen input (Input, Textarea, SelectTrigger, …). */
  children: ReactElement<Record<string, unknown>>
}

/**
 * Pembungkus field form: label, input, deskripsi, dan pesan error.
 * Otomatis memasang `aria-invalid` & `aria-describedby` ke input.
 *
 * Contoh dengan React Hook Form:
 *   <FormField id="name" label="Nama" error={errors.name?.message}>
 *     <Input id="name" {...register('name')} />
 *   </FormField>
 *
 * Untuk `<Select>`, pasang `aria-invalid` langsung di `<SelectTrigger>`
 * karena atribut dari FormField jatuh ke root Select yang tidak dirender.
 */
export function FormField({ id, label, error, description, required, className, children }: FormFieldProps) {
  const descId = description ? `${id}-desc` : undefined
  const errId = error ? `${id}-error` : undefined
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined

  const control = isValidElement(children)
    ? cloneElement(children, { 'aria-invalid': !!error || undefined, 'aria-describedby': describedBy })
    : children

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-destructive" aria-hidden>*</span> : null}
      </Label>
      {control}
      {description && !error ? (
        <p id={descId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
