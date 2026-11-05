import { useState, useEffect, useCallback } from 'react'
import { getSchedule, type ScheduleItem } from '../api/neis'
import { useSettingsStore } from '../store/useSettingsStore'
import { getCached, setCached, midnightTtl, yyyymmdd } from '../lib/cache'
import { findNextDday, findNextVacation, type DdayResult } from '../lib/dday'

type State = { vacation: DdayResult|null; nextEvent: DdayResult|null; loading: boolean; error: boolean }

export const useSchedule = () => {
  const school = useSettingsStore((s) => s.school)
  const neisKey = useSettingsStore((s) => s.neisKey)
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
    let schedules: ScheduleItem[]
    try {
      schedules = await getSchedule(school.ATPT_OFCDC_SC_CODE, school.SD_SCHUL_CODE, today, to)
    } catch {
      // 실패는 캐시하지 않는다 — 예전엔 빈 배열이 자정까지 캐시돼 '방학 일정이 없어요'가 계속 떴다
      setState({ vacation: null, nextEvent: null, loading: false, error: true })
      return
    }
    // 결과가 비어 있으면(학교가 아직 등록 전일 수 있음) 1시간만 캐시
    setCached(key, schedules, schedules.length ? midnightTtl() : Math.min(midnightTtl(), 60 * 60 * 1000))
    setState({ vacation: findNextVacation(schedules, today), nextEvent: findNextDday(schedules, today), loading: false, error: false })
  }, [school, neisKey])

  useEffect(() => { fetchSchedule() }, [fetchSchedule])

  // 실패했으면 5분마다, 그리고 네트워크가 돌아오거나 화면이 다시 보일 때 재시도
  useEffect(() => {
    if (!state.error) return
    const retry = () => { fetchSchedule() }
    const onVisible = () => { if (document.visibilityState === 'visible') retry() }
    const id = setInterval(retry, 5 * 60 * 1000)
    window.addEventListener('online', retry)
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(id); window.removeEventListener('online', retry); document.removeEventListener('visibilitychange', onVisible) }
  }, [state.error, fetchSchedule])

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
