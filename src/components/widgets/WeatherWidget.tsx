import { useState } from 'react'
import { BrutalCard } from '../ui/BrutalCard'
import { LoadingDots } from '../ui/LoadingDots'
import { useWeather } from '../../hooks/useWeather'
import { useAir } from '../../hooks/useAir'
import { weatherDescription, weatherBgClass } from '../../api/weather'
import type { AirGrade } from '../../api/air'

const DAY_KR = ['일', '월', '화', '수', '목', '금', '토']

const AirRow = ({ label, value, grade }: { label: string; value: number; unit?: string; grade: AirGrade }) => {
  const isWarning = grade.level >= 3
  const isCritical = grade.level >= 4
  return (
    <div className={`flex items-center justify-between rounded px-2 py-1 border-2 ${
      isCritical ? 'border-red-500 bg-red-100' : isWarning ? 'border-amber-500 ' + grade.bgClass : grade.borderClass + ' ' + grade.bgClass}`}>
      <div className="flex items-center gap-1 min-w-0">
        {isWarning && <span aria-hidden="true" className="shrink-0">⚠️</span>}
        <span className={`w-2 h-2 rounded-full border border-black shrink-0 ${grade.dotClass}`} />
        <span className="text-xs font-black whitespace-nowrap">{label}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-1">
        <span className="text-xs font-bold text-black/60 whitespace-nowrap">{value}</span>
        <span className={`text-xs font-black px-1 py-0.5 rounded border border-current whitespace-nowrap ${grade.textClass}`}>{grade.label}</span>
      </div>
    </div>
  )
}

export const WeatherWidget = () => {
  const { data, loading, error } = useWeather()
  const { data: airData } = useAir()
  const [showWeekly, setShowWeekly] = useState(false)

  if (loading && !data) return <BrutalCard className="p-4"><div className="flex items-center gap-2 text-sm text-black/50"><span>날씨</span><LoadingDots size="sm" /></div></BrutalCard>
  if (error && !data) return <BrutalCard className="p-4"><p className="text-sm font-bold text-black/40">날씨 정보를 불러올 수 없어요</p></BrutalCard>
  if (!data) return null

  const { now, daily } = data
  const { label, emoji } = weatherDescription(now.weatherCode, now.isDay)
  const bgClass = weatherBgClass(now.weatherCode)

  return (
    <BrutalCard className="overflow-hidden" shadow="md">
      <button type="button" onClick={() => setShowWeekly((v) => !v)}
        className={`w-full text-left p-4 ${bgClass} active:opacity-80 transition-opacity`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-black/50 uppercase tracking-widest mb-1">날씨</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black leading-none">{now.temperature}°</span>
              <span className="text-2xl leading-none mb-1">{emoji}</span>
            </div>
            <p className="text-sm font-bold mt-1">{label}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-right text-xs font-bold text-black/60 space-y-0.5">
              <p>체감 {now.apparent}°</p>
              <p>습도 {now.humidity}%</p>
              <p>바람 {now.windSpeed.toFixed(1)}m/s</p>
            </div>
            <span className={`text-xs font-black px-2 py-1 rounded border-2 border-black mt-1 ${showWeekly ? 'bg-black text-white' : 'bg-white text-black'}`}>
              {showWeekly ? '접기 ▲' : '주간 ▼'}
            </span>
          </div>
        </div>
      </button>

      {showWeekly && (
        <div className="grid grid-cols-7 divide-x-2 divide-black border-t-2 border-black">
          {daily.map((d, i) => {
            const { emoji: dayEmoji } = weatherDescription(d.weatherCode)
            return (
              <div key={d.date} className={`flex flex-col items-center py-2 px-1 gap-0.5 ${i === 0 ? 'bg-primary/10' : ''}`}>
                <span className="text-xs font-bold text-black/60">{i === 0 ? '오늘' : DAY_KR[new Date(d.date).getDay()]}</span>
                <span className="text-base leading-none">{dayEmoji}</span>
                <span className="text-xs font-black text-rose-600">{d.tempMax}°</span>
                <span className="text-xs font-bold text-sky-600">{d.tempMin}°</span>
              </div>
            )
          })}
        </div>
      )}

      {airData && (
        <div className="border-t-2 border-black p-3 grid grid-cols-2 gap-2">
          <AirRow label="초미세먼지" value={airData.pm25} unit="μg/m³" grade={airData.pm25Grade} />
          <AirRow label="미세먼지" value={airData.pm10} unit="μg/m³" grade={airData.pm10Grade} />
        </div>
      )}
    </BrutalCard>
  )
}
