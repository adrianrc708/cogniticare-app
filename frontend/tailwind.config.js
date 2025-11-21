/** @type {import('tailwindcss').Config} */
module.exports = {
    // Importante: Especificar todos los archivos que usan clases de Tailwind
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}" // Asegura que las páginas están incluidas
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}