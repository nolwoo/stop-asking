import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CustomDday } from '../lib/dday'

export type SchoolInfo = {
  ATPT_OFCDC_SC_CODE: string
  SD_SCHUL_CODE: string
  SCHUL_NM: string
  SCHUL_KND_SC_NM: string
  address: string
}

export type LocationInfo = {
  lat: number
  lng: number
  label: string
}

type SettingsState = {
  school: SchoolInfo | null
  location: LocationInfo | null
  setupDone: boolean
  customDdays: CustomDday[]
  neisKey: string
}

type SettingsActions = {
  setSchool: (school: SchoolInfo) => void
  setLocation: (location: LocationInfo) => void
  completeSetup: () => void
  resetSetup: () => void
  addCustomDday: (item: Omit<CustomDday, 'id'>) => void
  removeCustomDday: (id: string) => void
  setNeisKey: (key: string) => void
}

const initialState: SettingsState = {
  school: null,
  location: null,
  setupDone: false,
  customDdays: [],
  neisKey: '',
}

const genId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSchool: (school) => set({ school }),
      setLocation: (location) => set({ location }),
      completeSetup: () => set({ setupDone: true }),
      resetSetup: () =>
        set((s) => ({ school: null, location: null, setupDone: false, customDdays: s.customDdays })),
      addCustomDday: (item) =>
        set((s) => ({ customDdays: [...s.customDdays, { ...item, id: genId() }] })),
      removeCustomDday: (id) =>
        set((s) => ({ customDdays: s.customDdays.filter((d) => d.id !== id) })),
      setNeisKey: (key) => set({ neisKey: key }),
    }),
    { name: 'mumubangak-settings' }
  )
)
