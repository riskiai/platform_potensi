import markUrl from '@/assets/brand/potensi-mark.png'
import logoUrl from '@/assets/brand/potensi-logo.png'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/constants/app'

interface LogoProps {
  /** `mark` = ikon saja, `full` = ikon + tulisan POTENSI */
  variant?: 'mark' | 'full'
  className?: string
}

export function Logo({ variant = 'full', className }: LogoProps) {
  return (
    <img
      src={variant === 'mark' ? markUrl : logoUrl}
      alt={APP_NAME}
      className={cn('h-10 w-auto select-none', className)}
      draggable={false}
    />
  )
}
