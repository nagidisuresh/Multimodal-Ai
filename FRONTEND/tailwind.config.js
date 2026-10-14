/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0B1120',
          light: '#F8FAFC',
        },
        card: {
          dark: '#111827',
          light: '#FFFFFF',
        },
        navy: {
          950: '#070C18',
          900: '#0B1120',
          850: '#0E172A',
          800: '#111827',
          750: '#162238',
          700: '#1F2937',
          600: '#374151',
          500: '#4B5563',
        },
        teal: {
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        verdict: {
          scam: '#EF4444',
          suspicious: '#F59E0B',
          safe: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Telugu', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.25s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(20, 184, 166, 0.15)' },
          '50%': { boxShadow: '0 0 35px rgba(20, 184, 166, 0.4)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      boxShadow: {
        'glow-teal': '0 0 30px rgba(20, 184, 166, 0.25), 0 0 60px rgba(20, 184, 166, 0.1)',
        'glow-red': '0 0 30px rgba(239, 68, 68, 0.25), 0 0 60px rgba(239, 68, 68, 0.1)',
        'glow-amber': '0 0 30px rgba(245, 158, 11, 0.25), 0 0 60px rgba(245, 158, 11, 0.1)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.25), 0 0 60px rgba(59, 130, 246, 0.1)',
        'card-hover': '0 16px 40px -10px rgba(20, 184, 166, 0.15), 0 0 0 1px rgba(20, 184, 166, 0.1)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0B1120 0%, #111827 50%, #0E172A 100%)',
        'teal-gradient': 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 50%, #3B82F6 100%)',
      },
    },
  },
  plugins: [],
}
