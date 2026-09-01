import { useState, useEffect, useRef } from 'react'
import { searchSchools, type School } from '../../api/neis'
import { LoadingDots } from '../ui/LoadingDots'
import { REGIONS } from './regions'

const useDebounce = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t) }, [value, delay])
  return debounced
}

export const SchoolSearchInput = ({ onSelect }: { onSelect: (school: School) => void }) => {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [results, setResults] = useState<School[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setSearched(false); return }
    let cancelled = false
    setLoading(true)
    searchSchools(debouncedQuery, region || undefined)
      .then((data) => { if (!cancelled) { setResults(data); setSearched(true); setLoading(false) } })
      .catch(() => { if (!cancelled) { setResults([]); setSearched(true); setLoading(false) } })
    return () => { cancelled = true }
  }, [debouncedQuery, region])

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100) }, [])

  return (
    <div className="space-y-3">
      <select value={region} onChange={(e) => setRegion(e.target.value)}
        className="w-full border-2 border-black rounded-md px-3 py-2.5 text-sm font-bold bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
        <option value="">전국</option>
        {REGIONS.map((r) => <option key={r.code} value={r.code}>{r.short}</option>)}
      </select>
      <div className="relative">
        <input ref={inputRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="학교 이름을 입력하세요" autoComplete="off" autoCorrect="off" autoCapitalize="off"
          className="w-full border-2 border-black rounded-md px-3 py-2.5 pr-10 text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" />
        {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2"><LoadingDots size="sm" /></div>}
      </div>
      {searched && results.length === 0 && !loading && (
        <div className="text-center py-6">
          <p className="text-sm font-bold text-black/40">검색 결과가 없어요</p>
          <p className="text-xs text-black/30 mt-1">학교 이름 일부만 입력해도 돼요</p>
        </div>
      )}
      {results.length > 0 && (
        <ul className="border-2 border-black rounded-md overflow-hidden divide-y-2 divide-black max-h-64 overflow-y-auto">
          {results.map((school) => (
            <li key={`${school.ATPT_OFCDC_SC_CODE}-${school.SD_SCHUL_CODE}`}>
              <button type="button" onClick={() => onSelect(school)}
                className="w-full text-left px-3 py-3 hover:bg-primary/10 active:bg-primary/20 transition-colors min-h-[56px] flex flex-col justify-center">
                <span className="font-black text-sm">{school.SCHUL_NM}</span>
                <span className="text-xs font-bold text-black/50 mt-0.5">
                  {school.LCTN_SC_NM} · {school.SCHUL_KND_SC_NM} · {school.ORG_RDNMA}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
