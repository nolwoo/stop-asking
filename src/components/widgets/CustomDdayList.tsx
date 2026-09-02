import { useSettingsStore } from '../../store/useSettingsStore'
import { useSchedule } from '../../hooks/useSchedule'
import { customToDday, formatDateKr, sortCustomByDate, isPastDate, formatDdayLabel, pickCustomVacation } from '../../lib/dday'

export const CustomDdayList = () => {
  const customDdays = useSettingsStore((s) => s.customDdays)
  const { vacation: neisVacation } = useSchedule()
  const promotedId = !neisVacation ? pickCustomVacation(customDdays)?.id : null
  const upcoming = sortCustomByDate(customDdays).filter((d) => !isPastDate(d.date)).filter((d) => d.id !== promotedId)

  if (upcoming.length === 0) return (
    <section className="rounded-[18px] border border-dashed border-black/15 p-3.5 text-center">
      <p className="text-xl mb-1">📅</p>
      <p className="font-semibold text-xs">우리반 D-DAY가 없어요</p>
      <p className="text-xs font-medium text-black/40 mt-1">⚙ 설정에서 추가해보세요</p>
    </section>
  )

  return (
    <section className="rounded-[18px] bg-[#fafafc] p-3.5">
      <span className="eyebrow mb-2 block">Class D-days</span>
      <div className="space-y-1.5">
        {upcoming.map((item) => {
          const dday = customToDday(item)
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 py-0.5">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs truncate">{item.name}</p>
                <p className="text-xs font-medium text-black/40">{formatDateKr(item.date)}</p>
              </div>
              <div className={`shrink-0 flex items-center justify-center min-w-12 h-8 px-2.5 rounded-full font-semibold text-xs whitespace-nowrap ${
                dday.daysLeft === 0 ? 'bg-black text-white' : dday.daysLeft <= 7 ? 'bg-[#fff3d6] text-[#8a6100]' : 'bg-[#f5f5f7] text-[#0066cc]'}`}>
                {formatDdayLabel(dday.daysLeft)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
