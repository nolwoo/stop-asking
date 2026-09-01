export type WeatherNow = {
  temperature: number; apparent: number; humidity: number
  weatherCode: number; windSpeed: number; isDay: boolean
}

export type WeatherDaily = {
  date: string; weatherCode: number; tempMax: number
  tempMin: number; precipitationSum: number
}

export type WeatherData = { now: WeatherNow; daily: WeatherDaily[] }

export const getWeather = async (lat: number, lng: number): Promise<WeatherData | null> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&timezone=Asia%2FSeoul&forecast_days=7&models=best_match`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const c = data.current
    if (!c) return null
    const now: WeatherNow = {
      temperature: Math.round(c.temperature_2m),
      apparent: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      weatherCode: c.weather_code,
      windSpeed: c.wind_speed_10m,
      isDay: c.is_day === 1,
    }
    const d = data.daily
    const daily: WeatherDaily[] = d
      ? (d.time as string[]).map((date: string, i: number) => ({
          date, weatherCode: d.weather_code[i],
          tempMax: Math.round(d.temperature_2m_max[i]),
          tempMin: Math.round(d.temperature_2m_min[i]),
          precipitationSum: d.precipitation_sum[i],
        }))
      : []
    return { now, daily }
  } catch { return null }
}

export const weatherDescription = (code: number, isDay = true): { label: string; emoji: string } => {
  if (code === 0) return { label: '맑음', emoji: isDay ? '☀️' : '🌙' }
  if (code === 1) return { label: '대체로 맑음', emoji: isDay ? '🌤️' : '🌙' }
  if (code === 2) return { label: '구름 조금', emoji: '⛅' }
  if (code === 3) return { label: '흐림', emoji: '☁️' }
  if ([45, 48].includes(code)) return { label: '안개', emoji: '🌫️' }
  if ([51, 53, 55].includes(code)) return { label: '이슬비', emoji: '🌦️' }
  if ([61, 63, 65].includes(code)) return { label: '비', emoji: '🌧️' }
  if ([71, 73, 75, 77].includes(code)) return { label: '눈', emoji: '🌨️' }
  if ([80, 81, 82].includes(code)) return { label: '소나기', emoji: '🌦️' }
  if ([85, 86].includes(code)) return { label: '눈 소나기', emoji: '🌨️' }
  if ([95, 96, 99].includes(code)) return { label: '뇌우', emoji: '⛈️' }
  return { label: '날씨', emoji: '🌡️' }
}

export const weatherBgClass = (code: number): string => {
  if (code <= 1) return 'bg-amber-50 border-amber-400'
  if (code <= 3) return 'bg-slate-50 border-slate-300'
  if ([45, 48].includes(code)) return 'bg-gray-100 border-gray-400'
  if (code >= 51 && code <= 67) return 'bg-blue-50 border-blue-400'
  if (code >= 71 && code <= 77) return 'bg-sky-50 border-sky-400'
  if (code >= 80 && code <= 82) return 'bg-indigo-50 border-indigo-400'
  if (code >= 95) return 'bg-purple-50 border-purple-400'
  return 'bg-white border-gray-300'
}
