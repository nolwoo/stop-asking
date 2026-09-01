import type { ScheduleItem } from '../api/neis'

export const VACATION_KEYWORDS: string[] = ['방학']
export const DDAY_KEYWORDS: string[] = [
  '운동회', '체육대회', '체육한마당', '현장학습',
  '수련활동', '수학여행', '시험', '평가', '진단',
  '재량휴업일', '휴업일',
]

export type DdayResult = {
  eventName: string
  date: string
  daysLeft: number
}

export type CustomDday = {
  id: string
  name: string
  date: string
}

const parseDate = (yyyymmdd: string): Date => {
  const y = parseInt(yyyymmdd.slice(0, 4), 10)
  const m = parseInt(yyyymmdd.slice(4, 6), 10) - 1
  const d = parseInt(yyyymmdd.slice(6, 8), 10)
  return new Date(y, m, d)
}

const daysDiff = (from: Date, to: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24
  const fromDay = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const toDay = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((toDay.getTime() - fromDay.getTime()) / msPerDay)
}

const findByKeywords = (schedules: ScheduleItem[], keywords: string[], today: Date): DdayResult | null => {
  const future = schedules.filter((s) => daysDiff(today, parseDate(s.AA_YMD)) >= 0)
  for (const keyword of keywords) {
    const matched = future
      .filter((s) => s.EVENT_NM.includes(keyword) || (s.EVENT_CNTNT && s.EVENT_CNTNT.includes(keyword)))
      .sort((a, b) => a.AA_YMD.localeCompare(b.AA_YMD))
    if (matched.length > 0) {
      const item = matched[0]
      return { eventName: item.EVENT_NM, date: item.AA_YMD, daysLeft: daysDiff(today, parseDate(item.AA_YMD)) }
    }
  }
  return null
}

export const findNextVacation = (schedules: ScheduleItem[], today = new Date()): DdayResult | null =>
  findByKeywords(schedules, VACATION_KEYWORDS, today)

export const findNextDday = (schedules: ScheduleItem[], today = new Date()): DdayResult | null =>
  findByKeywords(schedules, DDAY_KEYWORDS, today)

export const customToDday = (item: CustomDday, today = new Date()): DdayResult => ({
  eventName: item.name,
  date: item.date,
  daysLeft: daysDiff(today, parseDate(item.date)),
})

export const sortCustomByDate = (items: CustomDday[]): CustomDday[] =>
  [...items].sort((a, b) => a.date.localeCompare(b.date))

export const isPastDate = (yyyymmdd: string, today = new Date()): boolean =>
  daysDiff(today, parseDate(yyyymmdd)) < 0

export const pickCustomVacation = (items: CustomDday[], today = new Date()): CustomDday | null => {
  const upcoming = sortCustomByDate(items)
    .filter((d) => !isPastDate(d.date, today))
    .filter((d) => d.name.includes('방학'))
  return upcoming[0] ?? null
}

export const dateToYmd = (d: Date): string =>
  `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`

export const ymdToInputValue = (yyyymmdd: string): string =>
  `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`

export const inputValueToYmd = (input: string): string => input.replace(/-/g, '')

export const formatDdayLabel = (daysLeft: number): string => {
  if (daysLeft === 0) return 'D-Day!'
  if (daysLeft > 0) return `D-${daysLeft}`
  return `D+${Math.abs(daysLeft)}`
}

export const formatDateKr = (yyyymmdd: string): string => {
  const m = parseInt(yyyymmdd.slice(4, 6), 10)
  const d = parseInt(yyyymmdd.slice(6, 8), 10)
  return `${m}월 ${d}일`
}
