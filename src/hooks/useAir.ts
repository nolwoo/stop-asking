import { useState, useEffect, useCallback, useRef } from 'react'
import { getAirQuality, type AirData } from '../api/air'
import { useSettingsStore } from '../store/useSettingsStore'
import { getCached, setCached, yyyymmddhh } from '../lib/cache'

const TTL = 60 * 60 * 1000

export const useAir = () => {
  const location = useSettingsStore((s) => s.location)
  const [state, setState] = useState<{ data: AirData|null; loading: boolean; error: boolean }>
    ({ data: null, loading: false, error: false })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAir = useCallback(async () => {
    if (!location) return
    const key = `air_${location.lat.toFixed(3)}_${location.lng.toFixed(3)}_${yyyymmddhh()}`
    const cached = getCached<AirData>(key, TTL)
    if (cached) { setState({ data: cached, loading: false, error: false }); return }
    setState((s) => ({ ...s, loading: true }))
    const data = await getAirQuality(location.lat, location.lng)
    if (data) { setCached(key, data, TTL); setState({ data, loading: false, error: false }) }
    else setState((s) => ({ ...s, loading: false, error: true }))
  }, [location])

  useEffect(() => {
    fetchAir()
    timerRef.current = setInterval(fetchAir, TTL)
    const onVisible = () => { if (document.visibilityState === 'visible') fetchAir() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [fetchAir])
  return state
}
