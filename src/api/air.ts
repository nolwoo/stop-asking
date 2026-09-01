export type AirGrade = {
  label: string; level: 1 | 2 | 3 | 4
  bgClass: string; textClass: string; borderClass: string; dotClass: string
}

export type AirData = { pm25: number; pm10: number; pm25Grade: AirGrade; pm10Grade: AirGrade }

// ⚠️ Tailwind JIT는 소스에 클래스 문자열이 그대로 있어야 생성한다.
// `bg-${color}-100` 같은 동적 조합은 purge되어 빌드 결과에서 색상이 통째로 빠지므로
// 등급별 클래스를 정적 리터럴로 매핑한다. (동적 조합 금지)
type GradeStyle = Pick<AirGrade, 'bgClass' | 'textClass' | 'borderClass' | 'dotClass'>

const GRADE_STYLES: Record<1 | 2 | 3 | 4, GradeStyle> = {
  1: { bgClass: 'bg-sky-100',     textClass: 'text-sky-700',     borderClass: 'border-sky-400',     dotClass: 'bg-sky-500' },
  2: { bgClass: 'bg-emerald-100', textClass: 'text-emerald-700', borderClass: 'border-emerald-400', dotClass: 'bg-emerald-500' },
  3: { bgClass: 'bg-amber-100',   textClass: 'text-amber-700',   borderClass: 'border-amber-400',   dotClass: 'bg-amber-500' },
  4: { bgClass: 'bg-rose-100',    textClass: 'text-rose-700',    borderClass: 'border-rose-400',    dotClass: 'bg-rose-500' },
}

const makeGrade = (label: string, level: 1 | 2 | 3 | 4): AirGrade => ({
  label, level, ...GRADE_STYLES[level],
})

export const pm25ToGrade = (v: number): AirGrade => {
  if (v <= 15) return makeGrade('좋음', 1)
  if (v <= 35) return makeGrade('보통', 2)
  if (v <= 75) return makeGrade('나쁨', 3)
  return makeGrade('매우나쁨', 4)
}

export const pm10ToGrade = (v: number): AirGrade => {
  if (v <= 30) return makeGrade('좋음', 1)
  if (v <= 80) return makeGrade('보통', 2)
  if (v <= 150) return makeGrade('나쁨', 3)
  return makeGrade('매우나쁨', 4)
}

export const getAirQuality = async (lat: number, lng: number): Promise<AirData | null> => {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5&timezone=Asia%2FSeoul`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const c = data.current
    if (!c) return null
    const pm25 = Math.round(c.pm2_5 ?? 0)
    const pm10 = Math.round(c.pm10 ?? 0)
    return { pm25, pm10, pm25Grade: pm25ToGrade(pm25), pm10Grade: pm10ToGrade(pm10) }
  } catch { return null }
}
