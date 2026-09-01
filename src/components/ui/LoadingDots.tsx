type Props = { size?: 'sm'|'md'; className?: string }

export const LoadingDots = ({ size = 'md', className = '' }: Props) => (
  <span className={`inline-flex items-center gap-1 ${className}`} aria-label="불러오는 중" role="status">
    {[0,1,2].map((i) => (
      <span key={i}
        className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-black/40 animate-dots`}
        style={{ animationDelay: `${i * 0.16}s` }}
      />
    ))}
  </span>
)
