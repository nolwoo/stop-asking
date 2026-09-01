import { useSettingsStore } from '../store/useSettingsStore'

const BASE = 'https://open.neis.go.kr/hub'

const getKeyParam = (): string => {
  const key = useSettingsStore.getState().neisKey
  return key ? `&KEY=${encodeURIComponent(key)}` : ''
}

export type School = {
  ATPT_OFCDC_SC_CODE: string
  ATPT_OFCDC_SC_NM: string
  SD_SCHUL_CODE: string
  SCHUL_NM: string
  SCHUL_KND_SC_NM: string
  LCTN_SC_NM: string
  ORG_RDNMA: string
}

export type Meal = {
  MLSV_YMD: string
  MMEAL_SC_NM: string
  DDISH_NM: string
  CAL_INFO: string
}

export type ScheduleItem = {
  AA_YMD: string
  EVENT_NM: string
  EVENT_CNTNT: string
}

const yyyymmdd = (d: Date): string =>
  `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`

const fetchJson = async (url: string): Promise<unknown> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`NEIS ${res.status}`)
  return res.json()
}

const extractRows = (raw: unknown, rootKey: string): Record<string, string>[] => {
  const node = (raw as Record<string, unknown>)?.[rootKey]
  if (!Array.isArray(node)) return []
  for (const block of node) {
    const b = block as Record<string, unknown>
    if (Array.isArray(b.row)) return b.row as Record<string, string>[]
  }
  return []
}

const extractTotalCount = (raw: unknown, rootKey: string): number => {
  const node = (raw as Record<string, unknown>)?.[rootKey]
  if (!Array.isArray(node)) return 0
  const headBlock = node[0] as Record<string, unknown> | undefined
  const headArr = headBlock?.head as Record<string, unknown>[] | undefined
  return (headArr?.[0]?.list_total_count as number) ?? 0
}

export const searchSchools = async (name: string, regionCode?: string): Promise<School[]> => {
  if (!name.trim()) return []
  const region = regionCode ? `&ATPT_OFCDC_SC_CODE=${regionCode}` : ''
  const url = `${BASE}/schoolInfo?Type=json&pIndex=1&pSize=30${getKeyParam()}${region}&SCHUL_NM=${encodeURIComponent(name)}`
  const raw = await fetchJson(url)
  return extractRows(raw, 'schoolInfo') as unknown as School[]
}

export const getMeal = async (
  ATPT_OFCDC_SC_CODE: string,
  SD_SCHUL_CODE: string,
  date: Date = new Date()
): Promise<Meal[]> => {
  const url = `${BASE}/mealServiceDietInfo?Type=json&pIndex=1&pSize=10${getKeyParam()}&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${yyyymmdd(date)}`
  try {
    const raw = await fetchJson(url)
    return extractRows(raw, 'mealServiceDietInfo') as unknown as Meal[]
  } catch { return [] }
}

export const getSchedule = async (
  ATPT_OFCDC_SC_CODE: string,
  SD_SCHUL_CODE: string,
  from: Date,
  to: Date
): Promise<ScheduleItem[]> => {
  const PAGE_SIZE = 100
  const base = `${BASE}/SchoolSchedule?Type=json&pSize=${PAGE_SIZE}${getKeyParam()}&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&AA_FROM_YMD=${yyyymmdd(from)}&AA_TO_YMD=${yyyymmdd(to)}`
  const allItems: ScheduleItem[] = []
  try {
    let page = 1
    let totalCount = Infinity
    while (allItems.length < totalCount && page <= 20) {
      const raw = await fetchJson(`${base}&pIndex=${page}`)
      if (page === 1) totalCount = extractTotalCount(raw, 'SchoolSchedule')
      const rows = extractRows(raw, 'SchoolSchedule') as unknown as ScheduleItem[]
      if (rows.length === 0) break
      allItems.push(...rows)
      page++
    }
  } catch {}
  return allItems
}

export const cleanDishName = (raw: string): string[] =>
  raw.split(/<br\s*\/?>/i)
    .map((s) => s.replace(/\s*\([^)]*\)\s*/g, '').trim())
    .filter(Boolean)
