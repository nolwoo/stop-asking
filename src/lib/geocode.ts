export type GeoPoint = { lat: number; lng: number; label: string }

const REGION_GEO: Record<string, GeoPoint> = {
  B10: { lat: 37.5665, lng: 126.978,  label: '서울' },
  C10: { lat: 35.1796, lng: 129.0756, label: '부산' },
  D10: { lat: 35.8714, lng: 128.6014, label: '대구' },
  E10: { lat: 37.4563, lng: 126.7052, label: '인천' },
  F10: { lat: 35.1595, lng: 126.8526, label: '광주' },
  G10: { lat: 36.3504, lng: 127.3845, label: '대전' },
  H10: { lat: 35.5384, lng: 129.3114, label: '울산' },
  I10: { lat: 36.4801, lng: 127.289,  label: '세종' },
  J10: { lat: 37.4138, lng: 127.5183, label: '경기' },
  K10: { lat: 37.8228, lng: 128.1555, label: '강원' },
  M10: { lat: 36.6357, lng: 127.4917, label: '충북' },
  N10: { lat: 36.6588, lng: 126.6728, label: '충남' },
  P10: { lat: 35.7175, lng: 127.153,  label: '전북' },
  Q10: { lat: 34.8679, lng: 126.991,  label: '전남' },
  R10: { lat: 36.4919, lng: 128.8889, label: '경북' },
  S10: { lat: 35.4606, lng: 128.2132, label: '경남' },
  T10: { lat: 33.4996, lng: 126.5312, label: '제주' },
}

export const regionToGeo = (atptCode: string): GeoPoint | null => REGION_GEO[atptCode] ?? null
