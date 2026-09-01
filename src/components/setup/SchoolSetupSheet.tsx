import { SchoolSearchInput } from './SchoolSearchInput'
import { useSettingsStore } from '../../store/useSettingsStore'
import type { School } from '../../api/neis'
import { regionToGeo } from '../../lib/geocode'

type Props = {
  isReset?: boolean
  onDone?: () => void
}

const WindowIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="40" height="40" rx="6" fill="#EEF2FF" stroke="#000" strokeWidth="3" />
    <line x1="24" y1="4" x2="24" y2="44" stroke="#000" strokeWidth="3" />
    <line x1="4" y1="24" x2="44" y2="24" stroke="#000" strokeWidth="3" />
    <circle cx="24" cy="24" r="3" fill="#4F46E5" stroke="#000" strokeWidth="2" />
  </svg>
)

export const SchoolSetupSheet = ({ isReset = false, onDone }: Props) => {
  const { setSchool, setLocation } = useSettingsStore()

  const handleSchoolSelect = (school: School) => {
    setSchool({
      ATPT_OFCDC_SC_CODE: school.ATPT_OFCDC_SC_CODE,
      SD_SCHUL_CODE: school.SD_SCHUL_CODE,
      SCHUL_NM: school.SCHUL_NM,
      SCHUL_KND_SC_NM: school.SCHUL_KND_SC_NM,
      address: school.ORG_RDNMA,
    })
    const geo = regionToGeo(school.ATPT_OFCDC_SC_CODE)
    if (geo) {
      setLocation({ lat: geo.lat, lng: geo.lng, label: geo.label })
    }
    onDone?.()
  }

  return (
    <div className="min-h-screen bg-bg bg-dots flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <WindowIcon />
          </div>
          <h1 className="text-2xl font-black">우리반 창문</h1>
          {!isReset && (
            <p className="text-sm font-bold text-black/50 mt-1">
              우리 학교를 먼저 찾아볼게요
            </p>
          )}
        </div>
        <div className="bg-white border-2 border-black rounded-lg shadow-brutal-md p-5">
          <h2 className="font-black text-base mb-4">학교 찾기</h2>
          <SchoolSearchInput onSelect={handleSchoolSelect} />
        </div>
      </div>
    </div>
  )
}
