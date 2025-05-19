// ./postcss.config.js (o .mjs) - CONFIGURACIÓN RECOMENDADA PARA TW v3
/** @type {import('postcss-load-config').Config} */
const config = { // Usa module.exports si el archivo es .js
  plugins: {
    // 'postcss-nesting': {}, // Añade si lo necesitas e instalaste postcss-nesting
    tailwindcss: {}, // <--- CONFIGURACIÓN ESTÁNDAR PARA v3
    autoprefixer: {},
  },
};
export default config; // Usa export default si el archivo es .mjs