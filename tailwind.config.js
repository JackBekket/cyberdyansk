/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Токены Cyberdyansk — тёмная табличная эстетика оригинала.
        cyber: {
          bg: '#0b0d12', // фон приложения
          panel: '#12151d', // панели/карточки
          line: '#232837', // нейтральные рамки и разделители
          text: '#c9cfdd',
          dim: '#6b7385', // второстепенный текст, недоступные действия
          orange: '#e08a2e', // тир рамки 1 (GDD §7)
          blue: '#4d7fd6', // тир рамки 2
          green: '#4fae6a', // тир рамки 3; дельты (+N)
          purple: '#9b6bd6', // тир рамки 4
          red: '#c8503f', // дельты (−N), предупреждения
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
