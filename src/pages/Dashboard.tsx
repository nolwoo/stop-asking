import { useEffect, useState } from 'react'
import { WeatherWidget } from '../components/widgets/WeatherWidget'
import { VacationDdayWidget } from '../components/widgets/VacationDdayWidget'
import { CustomDdayList } from '../components/widgets/CustomDdayList'
import { MealWidget } from '../components/widgets/MealWidget'
import { SettingsSheet } from '../components/setup/SettingsSheet'
import { useSettingsStore } from '../store/useSettingsStore'

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const WindowIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="40" height="40" rx="6" fill="#EEF2FF" stroke="#000" strokeWidth="3" />
    <line x1="24" y1="4" x2="24" y2="44" stroke="#000" strokeWidth="3" />
    <line x1="4" y1="24" x2="44" y2="24" stroke="#000" strokeWidth="3" />
    <circle cx="24" cy="24" r="3" fill="#4F46E5" stroke="#000" strokeWidth="2" />
  </svg>
)

const MinimizeIcon = ({ minimized }: { minimized: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {minimized
      ? <><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></>
      : <><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" /></>
    }
  </svg>
)

const useTime = () => {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  return time
}

const formatTime = (d: Date): string =>
  `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`

const formatToday = (): string => {
  const now = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}요일`
}

export const Dashboard = () => {
  const school = useSettingsStore((s) => s.school)
  const [showSettings, setShowSettings] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const now = useTime()

  if (showSettings) return <SettingsSheet onClose={() => setShowSettings(false)} />

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-4 pb-8">
        <header className="mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WindowIcon />
              <h1 className="text-[13px] font-semibold text-black/50">{school?.SCHUL_NM ?? '그물'}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setMinimized((v) => !v)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  minimized ? 'bg-black text-white' : 'bg-[#f5f5f7] text-black/70 hover:bg-[#e8e8ed]'}`}
                aria-label={minimized ? '전체 보기' : '최소화'}>
                <MinimizeIcon minimized={minimized} />
              </button>
              <button type="button" onClick={() => setShowSettings(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f7] text-black/70 hover:bg-[#e8e8ed] transition-colors"
                aria-label="설정">
                <SettingsIcon />
              </button>
            </div>
          </div>
          {/* 날짜·시각이 이 화면에서 제일 자주 보는 정보라 헤더의 주인공으로 크게 둔다 */}
          <div className="mt-1.5">
            <p className="text-[22px] font-semibold text-black tracking-tight">{formatToday()}</p>
            <p className="text-[64px] font-semibold leading-none tracking-tight tabular-nums text-black mt-0.5 select-none" aria-label="현재 시각">
              {formatTime(now)}
            </p>
          </div>
        </header>

        <div className="space-y-3">
          {minimized ? (
            <VacationDdayWidget minimized />
          ) : (
            <>
              <WeatherWidget />
              <MealWidget />
              <VacationDdayWidget />
              <CustomDdayList />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
