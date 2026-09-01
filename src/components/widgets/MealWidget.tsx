import { BrutalCard } from '../ui/BrutalCard'
import { LoadingDots } from '../ui/LoadingDots'
import { useMeal } from '../../hooks/useMeal'

export const MealWidget = () => {
  const { dishes, meal, loading, empty } = useMeal()
  return (
    <BrutalCard className="p-4" shadow="md">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-black/50 uppercase tracking-widest">오늘 급식</p>
        {meal && <span className="text-xs font-bold bg-amber-100 border border-black/20 rounded px-1.5 py-0.5">{meal.MMEAL_SC_NM}</span>}
      </div>
      {loading && dishes.length === 0
        ? <div className="flex items-center gap-2 h-10"><LoadingDots size="sm" /></div>
        : empty
        ? <p className="text-sm font-bold text-black/30 py-2">오늘 급식 정보가 없어요</p>
        : <>
            <ul className="space-y-1">
              {dishes.slice(0, 8).map((dish, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/25 shrink-0" />
                  <span>{dish}</span>
                </li>
              ))}
              {dishes.length > 8 && <li className="text-xs font-bold text-black/30 ml-3.5">외 {dishes.length - 8}가지</li>}
            </ul>
            {meal?.CAL_INFO && <p className="text-xs font-bold text-black/40 mt-2 text-right">{meal.CAL_INFO}</p>}
          </>
      }
    </BrutalCard>
  )
}
