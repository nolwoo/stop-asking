import { useState, useEffect, useCallback } from 'react'
import { getSchedule, type ScheduleItem } from '../api/neis'
import { useSettingsStore } from '../store/useSettingsStore'
import { getCached, setCached, midnightTtl, yyyymmdd } from '../lib/cache'
import { findNextDday, findNextVacation, type DdayResult } from '../lib/dday'

type State = { vacation: DdayResult|null; nextEvent: DdayResult|null; loading: boolean; error: boolean }

export const useSchedule = () => {
  const school = useSettingsStore((s) => s.school)
  const [state, setState] = useState<State>({ vacation: null, nextEvent: null, loading: false, error: false })

  const fetchSchedule = useCallback(async () => {
    if (!school) return
    const today = new Date()
    // 캐시 키 v3: NEIS 키 추가 후 구버전 캐시 무효화용
    const key = `schedule_raw_v3_${school.SD_SCHUL_CODE}_${yyyymmdd()}`
    const cached = getCached<ScheduleItem[]>(key, midnightTtl())
    if (cached) {
      setState({ vacation: findNextVacation(cached, today), nextEvent: findNextDday(cached, today), loading: false, error: false })
      return
    }
    setState((s) => ({ ...s, loading: true, error: false }))
    const to = new Date(today)
    to.setMonth(to.getMonth() + 12)
    const schedules = await getSchedule(school.ATPT_OFCDC_SC_CODE, school.SD_SCHUL_CODE, today, to)
    setCached(key, schedules, midnightTtl())
    setState({ vacation: findNextVacation(schedules, today), nextEvent: findNextDday(schedules, today), loading: false, error: false })
  }, [school])

  useEffect(() => { fetchSchedule() }, [fetchSchedule])

  // 자정을 넘기면 캐시 키(yyyymmdd)와 D-day 계산 기준일이 바뀐다.
  // 교실에 하루 종일 켜둬도 날짜가 넘어가면 다시 불러오도록 1분마다 날짜 변화를 감시.
  useEffect(() => {
    let lastDay = yyyymmdd()
    const id = setInterval(() => {
      const today = yyyymmdd()
      if (today !== lastDay) {
        lastDay = today
        fetchSchedule()
      }
    }, 60 * 1000)
    return () => clearInterval(id)
  }, [fetchSchedule])

  return state
}
