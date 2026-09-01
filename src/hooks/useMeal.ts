import { useState, useEffect, useCallback } from 'react'
import { getMeal, cleanDishName, type Meal } from '../api/neis'
import { useSettingsStore } from '../store/useSettingsStore'
import { getCached, setCached, midnightTtl, yyyymmdd } from '../lib/cache'

export const useMeal = () => {
  const school = useSettingsStore((s) => s.school)
  const [state, setState] = useState<{ dishes: string[]; meal: Meal|null; loading: boolean; error: boolean; empty: boolean }>
    ({ dishes: [], meal: null, loading: false, error: false, empty: false })

  const fetchMeal = useCallback(async () => {
    if (!school) return
    const key = `meal_${school.SD_SCHUL_CODE}_${yyyymmdd()}`
    const cached = getCached<Meal>(key, midnightTtl())
    if (cached) { setState({ dishes: cleanDishName(cached.DDISH_NM), meal: cached, loading: false, error: false, empty: false }); return }
    setState((s) => ({ ...s, loading: true }))
    const meals = await getMeal(school.ATPT_OFCDC_SC_CODE, school.SD_SCHUL_CODE)
    const lunch = meals.find((m) => m.MMEAL_SC_NM === '중식') ?? meals[0] ?? null
    if (lunch) {
      setCached(key, lunch, midnightTtl())
      setState({ dishes: cleanDishName(lunch.DDISH_NM), meal: lunch, loading: false, error: false, empty: false })
    } else {
      setState({ dishes: [], meal: null, loading: false, error: false, empty: true })
    }
  }, [school])

  useEffect(() => { fetchMeal() }, [fetchMeal])

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
