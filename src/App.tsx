import { useState } from 'react'
import { useSettingsStore } from './store/useSettingsStore'
import { Dashboard } from './pages/Dashboard'
import { SchoolSetupSheet } from './components/setup/SchoolSetupSheet'
import { NeisKeySetupSheet } from './components/setup/NeisKeySetupSheet'

function App() {
  const setupDone = useSettingsStore((s) => s.setupDone)
  const school = useSettingsStore((s) => s.school)
  const completeSetup = useSettingsStore((s) => s.completeSetup)
  const [step, setStep] = useState<'school' | 'neisKey'>('school')

  if (setupDone) return <Dashboard />

  // 학교 선택 완료 → NEIS 키 입력 단계
  if (school !== null && step === 'neisKey') {
    return <NeisKeySetupSheet onComplete={completeSetup} />
  }

  return (
    <SchoolSetupSheet
      onDone={() => setStep('neisKey')}
    />
  )
}

export default App
