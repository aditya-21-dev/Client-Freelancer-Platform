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
          primary: '#1D4ED8',
          secondary: '#2563EB',
          background: '#F8FAFC',
          sidebar: '#FFFFFF',
          active: '#DBEAFE',
          border: '#E2E8F0',

          // text
          text: '#0F172A',
          subtext: '#475569',

          // messages
          messageSent: '#1E3A8A',
          messageReceived: '#F1F5F9',
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
