import { type ReactNode, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary'|'secondary'|'ghost'
type Size = 'sm'|'md'|'lg'

type Props = {
  children: ReactNode; variant?: Variant; size?: Size
  fullWidth?: boolean; loading?: boolean; icon?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-white border-2 border-black shadow-brutal-md hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  secondary: 'bg-white text-black border-2 border-black shadow-brutal hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
  ghost: 'bg-transparent text-black border-2 border-black hover:bg-black/5 active:translate-x-[1px] active:translate-y-[1px]',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-base min-h-[44px]',
  lg: 'px-6 py-3 text-lg min-h-[52px]',
}

export const BrutalButton = ({ children, variant='primary', size='md', fullWidth=false, loading=false, icon, className='', disabled, ...rest }: Props) => {
  const isDisabled = disabled || loading
  return (
    <button
      {...rest} disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-75 select-none',
        variantStyles[variant], sizeStyles[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading
        ? <span className="inline-flex gap-1">{[0,1,2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-current animate-dots" style={{ animationDelay: `${i * 0.16}s` }} />)}</span>
        : <>{icon && <span className="shrink-0">{icon}</span>}{children}</>
      }
    </button>
  )
}
