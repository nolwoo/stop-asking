import { BrutalCard } from '../ui/BrutalCard'
import { LoadingDots } from '../ui/LoadingDots'
import { useMeal } from '../../hooks/useMeal'

export const MealWidget = () => {
  const { dishes, meal, loading, empty } = useMeal()
  return (
    <BrutalCard className="p-5" shadow="md">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-black/50 uppercase tracking-widest">오늘 급식</p>
        {meal && <span className="text-sm font-bold bg-amber-100 border border-black/20 rounded px-2 py-0.5">{meal.MMEAL_SC_NM}</span>}
      </div>
      {loading && dishes.length === 0
        ? <div className="flex items-center gap-2 h-10"><LoadingDots size="sm" /></div>
        : empty
        ? <p className="text-base font-bold text-black/30 py-2">오늘 급식 정보가 없어요</p>
        : <>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {dishes.slice(0, 10).map((dish, i) => (
                <li key={i} className="flex items-center gap-2 text-base font-bold">
                  <span className="w-2 h-2 rounded-full bg-black/30 shrink-0" />
                  <span>{dish}</span>
                </li>
              ))}
              {dishes.length > 10 && <li className="col-span-2 text-sm font-bold text-black/30">외 {dishes.length - 10}가지</li>}
            </ul>
            {meal?.CAL_INFO && <p className="text-sm font-bold text-black/40 mt-3 text-right">{meal.CAL_INFO}</p>}
          </>
      }
    </BrutalCard>
  )
}
