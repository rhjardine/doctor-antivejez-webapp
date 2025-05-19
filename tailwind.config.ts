// ./tailwind.config.ts
import type { Config } from 'tailwindcss';

// Función helper para convertir RGB a formato CSS
function rgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        // --- Colores Corporativos ---
        primary: {
          light: rgb(142, 202, 230), // #8ECAE6 (Para hover/light themes)
          DEFAULT: rgb(35, 188, 239), // Azul claro principal
          dark: rgb(28, 151, 191),   // Un tono más oscuro para hover/active
        },
        secondary: {
          light: rgb(61, 88, 149),    // Un tono más claro
          DEFAULT: rgb(41, 59, 100),   // Azul oscuro principal (para sidebar bg)
          dark: rgb(27, 39, 67),     // Un tono más oscuro
        },
        // --- Colores Base (Light Mode) ---
        'light-text': {
          DEFAULT: '#2C3E50', // Texto oscuro principal
          medium: '#546E7A',
          light: '#78909C',
        },
        'light-bg': {
          DEFAULT: '#F8F9FA', // Fondo principal claro
          card: '#FFFFFF',   // Fondo de tarjetas/elementos
        },
        'light-border': '#D9E2EC',
        // --- Colores Base (Dark Mode) ---
        'dark-text': {
          DEFAULT: '#E0E6ED', // Texto claro principal
          medium: '#B8C4CF',
          light: '#8D99A4',
        },
        'dark-bg': {
          DEFAULT: '#1A2634', // Fondo principal oscuro
          card: '#242F3F',   // Fondo de tarjetas/elementos oscuros
        },
        'dark-border': '#3A4858',
        // --- Colores de Estado ---
        danger: '#E63946',
        warning: '#F9A826',
        success: '#2DC653',
        info: '#5BC0EB',
      },
      borderRadius: { /* ...tus valores... */ },
      boxShadow: { /* ...tus valores... */ },
      keyframes: { /* ...tus valores... */ },
      animation: { /* ...tus valores... */ },
    },
  },
  plugins: [],
};
export default config;