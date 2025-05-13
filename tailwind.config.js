/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        green: {
          light: '#6EAB50',
          dark: '#54873B',
          lighter: 'rgb(137, 178, 107)',
          lightest: '#A5F77D',
        },
        yellow: {
          light: '#FEE94E',
          dark: '#C7B73C',
        },
        gray: {
          dark: '#0a0a0a',
        }
      },
      fontFamily: {
        nanum: ['var(--font-nanum)', 'cursive'],
        poppins: ['var(--font-poppins)']
      },
      boxShadow: {
        'inner-green': 'inset 0 0 0 2px rgb(137, 178, 107)',
        'inner-black': 'inset 0 0 0 4px black'
      },
    },
  },
  plugins: [],
}