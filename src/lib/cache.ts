const PREFIX = 'mumubangak_cache_'

type CacheEntry<T> = { value: T; expireAt: number }

export const getCached = <T>(key: string, _ttlMs: number): T | null => {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() > entry.expireAt) {
      localStorage.removeItem(PREFIX + key)
      return null
    }
    return entry.value
  } catch { return null }
}

export const setCached = <T>(key: string, value: T, ttlMs: number): void => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ value, expireAt: Date.now() + ttlMs }))
  } catch {}
}

export const clearAllCache = (): void => {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(PREFIX)) keys.push(key)
  }
  keys.forEach((key) => localStorage.removeItem(key))
}

export const midnightTtl = (): number => {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

export const yyyymmdd = (d: Date = new Date()): string =>
  `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`

export const yyyymmddhh = (d: Date = new Date()): string =>
  yyyymmdd(d) + d.getHours().toString().padStart(2, '0')
