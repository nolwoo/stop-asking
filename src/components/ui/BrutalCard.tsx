import { type ReactNode } from 'react'

type Props = {
  children: ReactNode; className?: string
  shadow?: 'sm'|'md'|'lg'|'none'; onClick?: () => void
  as?: 'div'|'article'|'section'
}

const shadowMap = { sm: 'shadow-brutal', md: 'shadow-brutal-md', lg: 'shadow-brutal-lg', none: '' }

export const BrutalCard = ({ children, className = '', shadow = 'md', onClick, as: Tag = 'div' }: Props) => (
  <Tag
    className={`bg-white border-2 border-black rounded-md ${shadowMap[shadow]}${onClick ? ' press-effect cursor-pointer' : ''} ${className}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
  >
    {children}
  </Tag>
)
