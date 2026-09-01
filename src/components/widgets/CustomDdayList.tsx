import { BrutalCard } from '../ui/BrutalCard'
import { useSettingsStore } from '../../store/useSettingsStore'
import { useSchedule } from '../../hooks/useSchedule'
import { customToDday, formatDateKr, sortCustomByDate, isPastDate, formatDdayLabel, pickCustomVacation } from '../../lib/dday'

export const CustomDdayList = () => {
  const customDdays = useSettingsStore((s) => s.customDdays)
  const { vacation: neisVacation } = useSchedule()
  const promotedId = !neisVacation ? pickCustomVacation(customDdays)?.id : null
  const upcoming = sortCustomByDate(customDdays).filter((d) => !isPastDate(d.date)).filter((d) => d.id !== promotedId)

  if (upcoming.length === 0) return (
    <BrutalCard className="p-4 text-center" shadow="sm">
      <p className="text-2xl mb-2">📅</p>
      <p className="font-black text-sm">우리반 D-DAY가 없어요</p>
      <p className="text-xs font-bold text-black/40 mt-1">⚙ 설정에서 추가해보세요</p>
    </BrutalCard>
  )

  return (
    <BrutalCard className="p-4" shadow="md">
      <p className="text-xs font-bold text-black/50 uppercase tracking-widest mb-3">우리반 D-DAY</p>
      <div className="space-y-2">
        {upcoming.map((item) => {
          const dday = customToDday(item)
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 py-1">
              <div className="min-w-0 flex-1">
                <p className="font-black text-sm truncate">{item.name}</p>
                <p className="text-xs font-bold text-black/40">{formatDateKr(item.date)}</p>
              </div>
              <div className={`shrink-0 flex items-center justify-center min-w-14 h-10 px-3 rounded-md border-2 border-black font-black text-sm whitespace-nowrap ${
                dday.daysLeft === 0 ? 'bg-primary text-white' : dday.daysLeft <= 7 ? 'bg-amber-300 text-black' : 'bg-white text-black'}`}>
                {formatDdayLabel(dday.daysLeft)}
              </div>
            </div>
          )
        })}
      </div>
    </BrutalCard>
  )
}
