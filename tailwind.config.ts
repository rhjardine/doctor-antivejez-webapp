// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores corporativos principales
        primary: {
          DEFAULT: 'rgb(35, 188, 239)', // #23BCEF
          50: 'rgb(240, 251, 255)',
          100: 'rgb(224, 247, 255)',
          200: 'rgb(186, 237, 255)',
          300: 'rgb(125, 223, 255)',
          400: 'rgb(56, 200, 255)',
          500: 'rgb(35, 188, 239)', // Color principal
          600: 'rgb(2, 132, 199)',
          700: 'rgb(3, 105, 161)',
          800: 'rgb(7, 89, 133)',
          900: 'rgb(12, 74, 110)',
          dark: 'rgb(2, 132, 199)',
          light: 'rgb(56, 200, 255)',
        },
        // Colores secundarios y de apoyo
        secondary: {
          DEFAULT: 'rgb(51, 65, 85)', // Gris azulado para sidebar
          50: 'rgb(248, 250, 252)',
          100: 'rgb(241, 245, 249)',
          200: 'rgb(226, 232, 240)',
          300: 'rgb(203, 213, 225)',
          400: 'rgb(148, 163, 184)',
          500: 'rgb(100, 116, 139)',
          600: 'rgb(71, 85, 105)',
          700: 'rgb(51, 65, 85)',
          800: 'rgb(30, 41, 59)',
          900: 'rgb(15, 23, 42)',
          light: 'rgb(71, 85, 105)',
        },
        // Colores de fondo
        bg: {
          light: 'rgb(249, 250, 251)',
          dark: 'rgb(17, 24, 39)',
          card: {
            light: 'rgb(255, 255, 255)',
            dark: 'rgb(31, 41, 55)',
          }
        },
        // Colores de texto
        text: {
          light: {
            base: 'rgb(17, 24, 39)',
            medium: 'rgb(75, 85, 99)',
            muted: 'rgb(107, 114, 128)',
          },
          dark: {
            base: 'rgb(243, 244, 246)',
            medium: 'rgb(209, 213, 219)',
            muted: 'rgb(156, 163, 175)',
          }
        },
        // Colores de borde
        border: {
          light: 'rgb(229, 231, 235)',
          dark: 'rgb(55, 65, 81)',
        }
      },
    },
  },
  plugins: [],
}