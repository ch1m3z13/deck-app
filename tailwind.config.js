/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        lore: {
          base: '#FFFFFF',
          grid: '#F8FAFC',
          dark: '#020617',
          accent: '#6366f1'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out': 'slideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideOut: { '0%': { transform: 'translateX(0)', opacity: '1', maxHeight: '200px' }, '100%': { transform: 'translateX(50px)', opacity: '0', maxHeight: '0px', padding: '0', margin: '0' } },
      }
    },
  },
  plugins: [],
}