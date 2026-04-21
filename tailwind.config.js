/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        ink: '#000000',           // Black
        violet: {
          DEFAULT: '#7D39EB',
          50:  '#F4ECFE',
          100: '#E4D1FC',
          200: '#CAA8F8',
          300: '#AF7FF4',
          400: '#9459EF',
          500: '#7D39EB',
          600: '#6320C7',
          700: '#4B1899',
          800: '#34116C',
          900: '#1E0A40',
        },
        lime: {
          DEFAULT: '#C6FF33',
          50:  '#F6FFE0',
          100: '#ECFFBF',
          200: '#DFFF8F',
          300: '#D2FF60',
          400: '#C6FF33',
          500: '#A9E813',
          600: '#84B70A',
          700: '#5F8506',
          800: '#3B5404',
          900: '#1A2500',
        },
        paper: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.75rem, 7vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      backgroundImage: {
        'glow-violet': 'radial-gradient(60% 60% at 50% 50%, rgba(125,57,235,0.35) 0%, transparent 70%)',
        'glow-lime': 'radial-gradient(60% 60% at 50% 50%, rgba(198,255,51,0.35) 0%, transparent 70%)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'fade-up': 'fadeUp 0.8s ease-out both',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
