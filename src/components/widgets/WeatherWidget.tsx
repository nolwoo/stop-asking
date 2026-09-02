import { useState, type ReactNode } from 'react'
import { LoadingDots } from '../ui/LoadingDots'
import { useWeather } from '../../hooks/useWeather'
import { useAir } from '../../hooks/useAir'
import { weatherDescription } from '../../api/weather'
import type { AirGrade } from '../../api/air'

const DAY_KR = ['일', '월', '화', '수', '목', '금', '토']

const Shell = ({ children }: { children: ReactNode }) => (
  <section className="rounded-[18px] bg-[#fafafc] overflow-hidden">{children}</section>
)

/**
 * 체감·습도·바람 밑에 초미세먼지·미세먼지를 같은 줄 스타일로 이어붙인다.
 * 원래는 카드 하단에 따로 2열 그리드로 뺐었는데, 그러면 카드 세로폭이
 * 늘어나 헤더의 날짜·시각을 키울 자리가 줄었다 — 여기 합쳐서 카드를
 * 낮추고 그만큼 헤더를 키웠다(Dashboard.tsx 참고).
 */
const MetaRow = ({ label, value, grade }: { label: string; value: number; grade?: AirGrade }) => {
  const isWarning = (grade?.level ?? 0) >= 3
  return (
    <p className={isWarning ? 'text-[#c23b22] font-semibold' : undefined}>
      {label} {value}
      {grade && (
        <>
          {' '}
          <b className={isWarning ? undefined : 'text-[#0066cc] font-semibold'}>{grade.label}</b>
        </>
      )}
    </p>
  )
}

export const WeatherWidget = () => {
  const { data, loading, error } = useWeather()
  const { data: airData } = useAir()
  const [showWeekly, setShowWeekly] = useState(false)

  if (loading && !data) return <Shell><div className="p-5 flex items-center gap-2 text-sm text-black/50"><span className="eyebrow">Today · Weather</span><LoadingDots size="sm" /></div></Shell>
  if (error && !data) return <Shell><p className="p-5 text-sm font-bold text-black/40">날씨 정보를 불러올 수 없어요</p></Shell>
  if (!data) return null

  const { now, daily } = data
  const { label, emoji } = weatherDescription(now.weatherCode, now.isDay)

  return (
    <Shell>
      <button type="button" onClick={() => setShowWeekly((v) => !v)}
        className="w-full text-left p-5 active:opacity-80 transition-opacity">
        <div className="flex items-start justify-between">
          <div>
            <span className="eyebrow mb-2 block">Today · Weather</span>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-semibold leading-none tracking-tight">{now.temperature}°</span>
              <span className="text-3xl leading-none mb-1">{emoji}</span>
            </div>
            <p className="text-base font-medium mt-1.5 text-black/90">{label}</p>
          </div>
          <div className="text-right text-[13px] font-medium text-black/50 space-y-0.5">
            <p>체감 {now.apparent}°</p>
            <p>습도 {now.humidity}%</p>
            <p>바람 {now.windSpeed.toFixed(1)}m/s</p>
            {airData && (
              <>
                <MetaRow label="초미세먼지" value={airData.pm25} grade={airData.pm25Grade} />
                <MetaRow label="미세먼지" value={airData.pm10} grade={airData.pm10Grade} />
              </>
            )}
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1.5 ${showWeekly ? 'bg-black text-white' : 'bg-white text-black/70'}`}>
              {showWeekly ? '접기 ▲' : '주간 ▼'}
            </span>
          </div>
        </div>
      </button>

      {showWeekly && (
        <div className="mx-5 mb-5 rounded-xl bg-white overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-black/5">
            {daily.map((d, i) => {
              const { emoji: dayEmoji } = weatherDescription(d.weatherCode)
              return (
                <div key={d.date} className={`flex flex-col items-center py-2 px-1 gap-0.5 ${i === 0 ? 'bg-black/[0.03]' : ''}`}>
                  <span className="text-xs font-medium text-black/50">{i === 0 ? '오늘' : DAY_KR[new Date(d.date).getDay()]}</span>
                  <span className="text-base leading-none">{dayEmoji}</span>
                  <span className="text-xs font-semibold text-[#c23b22]">{d.tempMax}°</span>
                  <span className="text-xs font-medium text-[#0066cc]">{d.tempMin}°</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Shell>
  )
}
