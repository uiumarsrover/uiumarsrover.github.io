/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mars: {
          50: '#fff4f0',
          100: '#ffe6dc',
          200: '#ffcfbd',
          300: '#ffad93',
          400: '#ff7b5d',
          500: '#ff5722',
          600: '#ea3e0c',
          700: '#c42e06',
          800: '#9e260a',
          900: '#80230e',
          accent: '#FF6B4A',
          gold: '#F5A623',
          cyber: '#00F0FF',
        },
        space: {
          950: '#04070D',
          900: '#080E18',
          850: '#0E1726',
          800: '#142033',
          700: '#1F304B',
          card: 'rgba(15, 23, 42, 0.75)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mars-glow': 'radial-gradient(circle at center, rgba(255, 87, 34, 0.15) 0%, transparent 70%)',
        'cyber-glow': 'radial-gradient(circle at center, rgba(0, 240, 255, 0.12) 0%, transparent 70%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 10px rgba(255,87,34,0.4))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(255,87,34,0.8))' },
        }
      }
    },
  },
  plugins: [],
};
