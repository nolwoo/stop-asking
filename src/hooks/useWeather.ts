import { useState, useEffect, useCallback, useRef } from 'react'
import { getWeather, type WeatherData } from '../api/weather'
import { useSettingsStore } from '../store/useSettingsStore'
import { getCached, setCached, yyyymmdd } from '../lib/cache'

const TTL = 30 * 60 * 1000

export const useWeather = () => {
  const location = useSettingsStore((s) => s.location)
  const [state, setState] = useState<{ data: WeatherData|null; loading: boolean; error: boolean }>
    ({ data: null, loading: false, error: false })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetch = useCallback(async () => {
    if (!location) return
    const key = `weather_${location.lat.toFixed(3)}_${location.lng.toFixed(3)}_${yyyymmdd()}`
    const cached = getCached<WeatherData>(key, TTL)
    if (cached) { setState((s) => ({ ...s, data: cached, loading: false, error: false })); return }
    setState((s) => ({ ...s, loading: true, error: false }))
    const data = await getWeather(location.lat, location.lng)
    if (data) { setCached(key, data, TTL); setState({ data, loading: false, error: false }) }
    else setState((s) => ({ ...s, loading: false, error: true }))
  }, [location])

  useEffect(() => {
    fetch()
    timerRef.current = setInterval(fetch, TTL)
    const onVisible = () => { if (document.visibilityState === 'visible') fetch() }
    const onOnline = () => fetch() // 네트워크 복구 시 최신 날씨로 갱신
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('online', onOnline)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('online', onOnline)
    }
  }, [fetch])
  return state
}
