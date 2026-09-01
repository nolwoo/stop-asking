import { useState } from 'react'
import { BrutalButton } from '../ui/BrutalButton'
import { BrutalCard } from '../ui/BrutalCard'
import { useSettingsStore } from '../../store/useSettingsStore'

type Props = {
  onComplete: () => void
}

export const NeisKeySetupSheet = ({ onComplete }: Props) => {
  const setNeisKey = useSettingsStore((s) => s.setNeisKey)
  const neisKey = useSettingsStore((s) => s.neisKey)
  const [keyInput, setKeyInput] = useState(neisKey)

  const handleSave = () => {
    if (keyInput.trim()) setNeisKey(keyInput.trim())
    onComplete()
  }

  return (
    <div className="min-h-screen bg-bg bg-dots flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-black">NEIS API 키</h1>
          <p className="text-sm font-bold text-black/50 mt-1">
            방학·급식 데이터를 불러오는 데 필요해요
          </p>
        </div>

        {/* 카드 */}
        <BrutalCard className="p-5" shadow="md">
          <p className="text-xs font-bold text-black/50 mb-4 leading-relaxed">
            <a
              href="https://open.neis.go.kr"
              target="_blank"
              rel="noreferrer"
              className="underline text-primary"
            >
              open.neis.go.kr
            </a>
            에서 무료 발급 후 붙여넣기 하세요.
          </p>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="인증키를 붙여넣으세요"
            autoFocus
            className="w-full border-2 border-black rounded-md px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 mb-4"
          />
          <BrutalButton
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSave}
            disabled={!keyInput.trim()}
          >
            저장하고 시작 →
          </BrutalButton>
          <button
            type="button"
            onClick={onComplete}
            className="w-full mt-3 text-sm font-bold text-black/35 hover:text-black/60 py-2 transition-colors"
          >
            나중에 입력할게요
          </button>
        </BrutalCard>

        <p className="text-center text-xs font-bold text-black/30 mt-4">
          키 없이도 날씨는 볼 수 있어요
        </p>
      </div>
    </div>
  )
}
