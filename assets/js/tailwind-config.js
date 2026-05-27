// Shared Tailwind theme values for CDN-based pages.
// Keeping this in a separate file avoids repeating the same color and font
// tokens across each HTML page.
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        navy: {
          900: '#162033',
          800: '#1e2a43',
          700: '#334155',
          600: '#475569'
        },
        indigo: {
          50: '#fff5ee',
          100: '#ffe7d6',
          200: '#ffd0b2',
          300: '#ffb182',
          400: '#ff9158',
          500: '#ff7a3d',
          600: '#ea6931',
          700: '#cb5624',
          800: '#a14520'
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      }
    }
  }
};
