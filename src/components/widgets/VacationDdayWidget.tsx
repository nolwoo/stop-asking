import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { LoadingDots } from '../ui/LoadingDots'
import { useSchedule } from '../../hooks/useSchedule'
import { useSettingsStore } from '../../store/useSettingsStore'
import { customToDday, formatDateKr, pickCustomVacation } from '../../lib/dday'

const encouragement = (daysLeft: number): string => {
  if (daysLeft === 0) return '오늘부터 방학!'
  if (daysLeft <= 7) return '조금만 버티면 돼!'
  if (daysLeft <= 30) return '거의 다 왔어!'
  if (daysLeft <= 60) return '힘내자!'
  return '아직 멀었지만 그래도!'
}

export const VacationDdayWidget = ({ minimized = false }: { minimized?: boolean }) => {
  const { vacation: neisVacation, loading } = useSchedule()
  const customDdays = useSettingsStore((s) => s.customDdays)
  const customPick = pickCustomVacation(customDdays)
  const vacation = neisVacation ?? (customPick ? customToDday(customPick) : null)

  useEffect(() => {
    if (vacation?.daysLeft !== 0) return
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    const t1 = setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, angle: 60 }), 300)
    const t2 = setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, angle: 120 }), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [vacation?.daysLeft])

  if (minimized) {
    if (!vacation) return null
    return (
      <div className="mt-3 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-block-navy text-white px-5 py-3 rounded-full font-black text-sm">
          <span>방학까지</span>
          <span className="text-lg">{vacation.daysLeft === 0 ? 'D-Day' : `D-${vacation.daysLeft}`}</span>
        </div>
      </div>
    )
  }

  if (loading && !vacation) {
    return (
      <section className="bg-block-navy text-white rounded-[24px] p-4">
        <span className="eyebrow text-white/50">Next break</span>
        <div className="flex items-center h-10"><LoadingDots size="md" /></div>
      </section>
    )
  }

  if (!vacation) {
    return (
      <section className="bg-white border-2 border-dashed border-black/40 rounded-2xl p-3.5">
        <span className="eyebrow mb-1.5 block">Next break</span>
        <p className="text-xl mb-1">🏫</p>
        <p className="font-black text-sm">방학 일정이 없어요</p>
        <p className="text-xs font-bold text-black/40 mt-1 leading-relaxed">
          학교 NEIS에 방학이 등록 안 됐어요.<br />
          ⚙ 설정 → 내 D-day에서 이름에 <b className="text-black">방학</b>을 넣어 추가하면 여기에 표시돼요.
        </p>
      </section>
    )
  }

  return (
    <section className="bg-block-navy text-white rounded-2xl p-3.5">
      <span className="eyebrow text-white/50">Next break</span>
      <div className="flex items-baseline justify-between gap-3 mt-1.5">
        <p className="text-sm font-black leading-tight truncate min-w-0">{vacation.eventName}</p>
        <p className="text-2xl font-black leading-none tabular-nums tracking-tight shrink-0">
          {vacation.daysLeft === 0 ? 'D-Day' : `D-${vacation.daysLeft}`}
        </p>
      </div>
      <p className="text-xs font-bold text-white/70 mt-1.5">
        {encouragement(vacation.daysLeft)} · {formatDateKr(vacation.date)}
      </p>
      {vacation.daysLeft === 0 && (
        <p className="text-base font-black text-white/90 mt-1 animate-bounce">🎉 오늘부터 방학!</p>
      )}
    </section>
  )
}
