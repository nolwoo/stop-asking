# 우리반 창문 (stop-asking / 그물)

교실 홈화면에 띄워두는 정보 위젯. 방학 D-day · 날씨 · 미세먼지 · 급식 · 우리반 D-day를 한 화면에.

- **대상**: 초등교사 / 초등학생
- **배포**: `dist/index.html` 단일 파일 (서버 불필요) — Vercel 호스팅 + 파일 다운로드 둘 다 가능
- **데이터**: 날씨·미세먼지는 [Open-Meteo](https://open-meteo.com) (무료·무키), 방학·급식은 [NEIS Open API](https://open.neis.go.kr) (앱 설정 화면에서 키 입력)

## 개발

```bash
npm install
npm run dev      # http://localhost:5320
npm run build    # → dist/index.html 단일 파일
npm run preview
```

## 스택

React 19 · TypeScript · Vite · Tailwind CSS v3 · Zustand (+persist) · vite-plugin-singlefile

## 첫 실행

1. 학교 검색 → 선택
2. NEIS API 키 입력 (open.neis.go.kr 무료 발급) — "나중에" 스킵 가능
3. 대시보드. 설정은 각 브라우저의 localStorage에 저장됨 (파일에 안 박힘)
