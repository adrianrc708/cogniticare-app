/** @type {import('tailwindcss').Config} */
module.exports = {
    // Habilitar modo oscuro manual mediante clase 'dark'
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}