import { useState, useEffect, useCallback } from 'react'
import { getMeal, cleanDishName, type Meal } from '../api/neis'
import { useSettingsStore } from '../store/useSettingsStore'
import { getCached, setCached, midnightTtl, yyyymmdd } from '../lib/cache'

export const useMeal = () => {
  const school = useSettingsStore((s) => s.school)
  const neisKey = useSettingsStore((s) => s.neisKey)
  const [state, setState] = useState<{ dishes: string[]; meal: Meal|null; loading: boolean; error: boolean; empty: boolean }>
    ({ dishes: [], meal: null, loading: false, error: false, empty: false })

  const fetchMeal = useCallback(async () => {
    if (!school) return
    const key = `meal_${school.SD_SCHUL_CODE}_${yyyymmdd()}`
    const cached = getCached<Meal>(key, midnightTtl())
    if (cached) { setState({ dishes: cleanDishName(cached.DDISH_NM), meal: cached, loading: false, error: false, empty: false }); return }
    setState((s) => ({ ...s, loading: true }))
    let meals
    try {
      meals = await getMeal(school.ATPT_OFCDC_SC_CODE, school.SD_SCHUL_CODE)
    } catch {
      // 실패는 캐시하지 않고 '오류'로 표시 — 아래 재시도 로직이 다시 불러온다
      setState({ dishes: [], meal: null, loading: false, error: true, empty: false })
      return
    }
    const lunch = meals.find((m) => m.MMEAL_SC_NM === '중식') ?? meals[0] ?? null
    if (lunch) {
      setCached(key, lunch, midnightTtl())
      setState({ dishes: cleanDishName(lunch.DDISH_NM), meal: lunch, loading: false, error: false, empty: false })
    } else {
      setState({ dishes: [], meal: null, loading: false, error: false, empty: true })
    }
    // neisKey: 키를 바꾸면 다시 불러온다
  }, [school, neisKey])

  useEffect(() => { fetchMeal() }, [fetchMeal])

  // 실패했으면 5분마다, 그리고 네트워크가 돌아오거나 화면이 다시 보일 때 재시도
  useEffect(() => {
    if (!state.error) return
    const retry = () => { fetchMeal() }
    const onVisible = () => { if (document.visibilityState === 'visible') retry() }
    const id = setInterval(retry, 5 * 60 * 1000)
    window.addEventListener('online', retry)
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(id); window.removeEventListener('online', retry); document.removeEventListener('visibilitychange', onVisible) }
  }, [state.error, fetchMeal])

  // 자정 롤오버: 날짜가 바뀌면 "오늘 급식" 캐시 키도 바뀌므로 다시 불러온다.
  useEffect(() => {
    let lastDay = yyyymmdd()
    const id = setInterval(() => {
      const today = yyyymmdd()
      if (today !== lastDay) {
        lastDay = today
        fetchMeal()
      }
    }, 60 * 1000)
    return () => clearInterval(id)
  }, [fetchMeal])

  return state
}
