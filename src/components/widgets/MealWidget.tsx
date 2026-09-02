import { LoadingDots } from '../ui/LoadingDots'
import { useMeal } from '../../hooks/useMeal'

export const MealWidget = () => {
  const { dishes, meal, loading, empty } = useMeal()
  return (
    <section className="rounded-[18px] bg-[#fafafc] p-5">
      <div className="flex items-center justify-between mb-3.5">
        <span className="eyebrow">School lunch</span>
        {meal && <span className="text-xs font-semibold text-[#0066cc] bg-[#eaf2fd] rounded-full px-2.5 py-1">{meal.MMEAL_SC_NM}</span>}
      </div>
      {loading && dishes.length === 0
        ? <div className="flex items-center gap-2 h-10"><LoadingDots size="sm" /></div>
        : empty
        ? <p className="text-base font-medium text-black/30 py-2">오늘 급식 정보가 없어요</p>
        : <>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {dishes.slice(0, 10).map((dish, i) => (
                <li key={i} className="text-[14px] font-normal text-black/90">{dish}</li>
              ))}
              {dishes.length > 10 && <li className="col-span-2 text-sm font-medium text-black/40">외 {dishes.length - 10}가지</li>}
            </ul>
            {meal?.CAL_INFO && <p className="text-xs font-medium text-black/40 mt-2.5 text-right">{meal.CAL_INFO}</p>}
          </>
      }
    </section>
  )
}
