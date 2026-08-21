/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0065ff',
          dark: '#0663f6',
          deep: '#0563f6',
          legacy: '#0064ff',
        },
        navy: {
          DEFAULT: '#253858',
          text: '#172b4d',
          alt: '#283756',
        },
        green: {
          tag: '#49cc76',
          cta: '#19ad86',
          ctaDark: '#17a47d',
          success: '#09c098',
          highlight: '#b6f4b4',
        },
        orange: {
          error: '#fa6541',
          tag: '#ff991f',
          status: '#ff900b',
          tagBg: '#fef8d8',
        },
        cyan: '#00b8d9',
        yellow: '#ffc400',
        blueBG: '#f2f7ff',
        blueBGMuted: '#f5f6fc',
        slate2: {
          secondary: '#5e6c84',
          muted: '#7a869a',
          border: '#dfe1e6',
        },
        purple2: '#6554c0',
        peach: '#ffe0cc',
      },
      fontFamily: {
        sans: [
          'Roboto',
          '-apple-system',
          'system-ui',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 6px 16px rgba(52,105,203,0.16)',
        nav: '0 4px 12px 0 rgb(0 0 0 / 5%)',
        soft: '0 3px 16px rgba(0,0,0,0.16)',
      },
      borderRadius: {
        card: '8px',
        cardlg: '16px',
        pill: '50px',
      },
      maxWidth: {
        container: '1140px',
      },
    },
  },
  plugins: [],
}
