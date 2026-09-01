/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF8',
        primary: {
          DEFAULT: '#4F46E5',
          foreground: '#FFFFFF',
        },
        block: {
          lime: '#DCEEB1',
          lilac: '#C5B0F4',
          cream: '#F4ECD6',
          mint: '#C8E6CD',
          navy: '#1F1D3D',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        brutal: '2px 2px 0 #000',
        'brutal-md': '4px 4px 0 #000',
        'brutal-lg': '6px 6px 0 #000',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
      },
      keyframes: {
        dots: {
          '0%, 80%, 100%': { opacity: '0.1', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        dots: 'dots 1.4s infinite ease-in-out both',
      },
    },
  },
  plugins: [],
}
