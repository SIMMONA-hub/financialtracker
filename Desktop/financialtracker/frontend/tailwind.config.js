/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5',
                accent:  '#f472b6',
                bg:      '#f3f4f6',
            }
        }
    },
    plugins: [],
};
