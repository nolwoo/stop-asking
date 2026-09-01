import { useState } from 'react'
import { BrutalButton } from '../ui/BrutalButton'
import { BrutalCard } from '../ui/BrutalCard'
import { useSettingsStore } from '../../store/useSettingsStore'
import { clearAllCache } from '../../lib/cache'
import {
  sortCustomByDate,
  inputValueToYmd,
  ymdToInputValue,
  formatDateKr,
  customToDday,
  formatDdayLabel,
  isPastDate,
  dateToYmd,
} from '../../lib/dday'

type Props = { onClose: () => void }

export const SettingsSheet = ({ onClose }: Props) => {
  const school = useSettingsStore((s) => s.school)
  const customDdays = useSettingsStore((s) => s.customDdays)
  const addCustomDday = useSettingsStore((s) => s.addCustomDday)
  const removeCustomDday = useSettingsStore((s) => s.removeCustomDday)
  const resetSetup = useSettingsStore((s) => s.resetSetup)
  const neisKey = useSettingsStore((s) => s.neisKey)
  const setNeisKey = useSettingsStore((s) => s.setNeisKey)

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [keyInput, setKeyInput] = useState(neisKey)
  const [keySaved, setKeySaved] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)

  const handleClearCache = () => {
    clearAllCache()
    setCacheCleared(true)
    setTimeout(() => setCacheCleared(false), 2000)
  }

  const handleSaveKey = () => {
    setNeisKey(keyInput.trim())
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  const todayInputValue = ymdToInputValue(dateToYmd(new Date()))

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed || !date) return
    addCustomDday({ name: trimmed, date: inputValueToYmd(date) })
    setName('')
    setDate('')
  }

  const isAddValid = name.trim().length > 0 && date.length > 0
  const sorted = sortCustomByDate(customDdays)

  return (
    <div className="min-h-screen bg-bg bg-dots">
      <div className="max-w-md mx-auto px-4 py-5 pb-12">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">설정</h1>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-md shadow-brutal font-black text-lg hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            aria-label="설정 닫기"
          >
            ×
          </button>
        </header>

        {/* 우리 학교 */}
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-black/50 mb-2">
            우리 학교
          </h2>
          <BrutalCard className="p-4" shadow="sm">
            <p className="font-black text-base truncate">
              {school?.SCHUL_NM ?? '학교를 선택해 주세요'}
            </p>
            {school?.address && (
              <p className="text-xs font-bold text-black/40 truncate mt-1">
                {school.address}
              </p>
            )}
            <div className="mt-3">
              <BrutalButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={resetSetup}
              >
                학교 변경
              </BrutalButton>
            </div>
          </BrutalCard>
        </section>

        {/* NEIS API 키 */}
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-black/50 mb-2">
            NEIS API 키
          </h2>
          <BrutalCard className="p-4" shadow="sm">
            <p className="text-xs font-bold text-black/50 mb-3 leading-relaxed">
              방학·급식 데이터 조회에 필요해요.{' '}
              <a
                href="https://open.neis.go.kr"
                target="_blank"
                rel="noreferrer"
                className="underline text-primary"
              >
                open.neis.go.kr
              </a>
              에서 무료 발급 후 붙여넣기.{' '}
              <a
                href="/neis-guide.html"
                target="_blank"
                rel="noreferrer"
                className="underline text-primary"
              >
                발급 방법 →
              </a>
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value)
                  setKeySaved(false)
                }}
                placeholder="인증키를 붙여넣으세요"
                className="flex-1 min-w-0 border-2 border-black rounded-md px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              />
              <BrutalButton
                variant={keySaved ? 'ghost' : 'primary'}
                size="sm"
                onClick={handleSaveKey}
                disabled={keyInput.trim() === neisKey}
              >
                {keySaved ? '✓ 저장됨' : '저장'}
              </BrutalButton>
            </div>
            {neisKey && !keySaved && (
              <p className="text-xs font-bold text-emerald-600 mt-2">
                ✓ 키 등록되어 있음
              </p>
            )}
            {!neisKey && (
              <p className="text-xs font-bold text-amber-600 mt-2">
                ⚠ 키 없으면 방학 일정이 안 뜰 수 있어요
              </p>
            )}
          </BrutalCard>
        </section>

        {/* 내 D-day */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-black/50 mb-2">
            내 D-day
          </h2>

          {/* 추가 폼 */}
          <BrutalCard className="p-4 mb-3" shadow="sm">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black block mb-1" htmlFor="dday-name">
                  이름
                </label>
                <input
                  id="dday-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="우리반 발표회"
                  maxLength={20}
                  className="w-full border-2 border-black rounded-md px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                />
              </div>
              <div>
                <label className="text-xs font-black block mb-1" htmlFor="dday-date">
                  날짜
                </label>
                <input
                  id="dday-date"
                  type="date"
                  value={date}
                  min={todayInputValue}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-2 border-black rounded-md px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                />
              </div>
              <BrutalButton
                variant="primary"
                size="md"
                fullWidth
                onClick={handleAdd}
                disabled={!isAddValid}
              >
                + 추가
              </BrutalButton>
            </div>
          </BrutalCard>

          {/* 데이터 관리 */}
          <section className="mt-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-black/50 mb-2">
              데이터 관리
            </h2>
            <BrutalCard className="p-4" shadow="sm">
              <p className="text-xs font-bold text-black/50 mb-3 leading-relaxed">
                날씨·급식·방학 데이터가 안 뜰 때 캐시를 지우고 새로 불러와요.
              </p>
              <BrutalButton
                variant={cacheCleared ? 'ghost' : 'secondary'}
                size="sm"
                fullWidth
                onClick={handleClearCache}
              >
                {cacheCleared ? '✓ 캐시 삭제 완료 — 새로고침하세요' : '🗑 캐시 전체 삭제'}
              </BrutalButton>
            </BrutalCard>
          </section>

          {/* 목록 */}
          {sorted.length === 0 ? (
            <p className="text-sm font-bold text-black/30 text-center py-6">
              아직 추가한 D-day가 없어요
            </p>
          ) : (
            <div className="space-y-2 mt-3">
              {sorted.map((item) => {
                const past = isPastDate(item.date)
                const dday = customToDday(item)
                return (
                  <BrutalCard
                    key={item.id}
                    className={`p-3 flex items-center gap-3 ${past ? 'opacity-50' : ''}`}
                    shadow="sm"
                  >
                    <div
                      className={`shrink-0 flex items-center justify-center min-w-14 h-10 px-2 rounded-md border-2 border-black font-black text-sm whitespace-nowrap ${
                        past
                          ? 'bg-gray-200 text-black/50'
                          : dday.daysLeft === 0
                          ? 'bg-primary text-white'
                          : dday.daysLeft <= 7
                          ? 'bg-amber-300 text-black'
                          : 'bg-white text-black'
                      }`}
                    >
                      {formatDdayLabel(dday.daysLeft)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-sm truncate">{item.name}</p>
                      <p className="text-xs font-bold text-black/40">
                        {formatDateKr(item.date)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomDday(item.id)}
                      className="w-9 h-9 flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 rounded-md"
                      aria-label={`${item.name} 삭제`}
                    >
                      ×
                    </button>
                  </BrutalCard>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
