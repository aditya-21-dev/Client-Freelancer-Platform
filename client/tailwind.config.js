/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E40AF',
          secondary: '#0F766E',
          background: '#FFFFFF',
          sidebar: '#FFFFFF',
          active: '#E0E7FF',
          border: '#D6DCE8',

          // text
          text: '#0B1220',
          subtext: '#475569',

          // messages
          messageSent: '#EEF2FF',
          messageReceived: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
