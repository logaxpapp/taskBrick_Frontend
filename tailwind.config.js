/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1) Add custom font size 'xxs'
      fontSize: {
        'xxs': '0.625rem', // ~10px
      },
      // 2) Extend color palette
      colors: {
        primary: "#192bc2", 
        secondary: "#1b1c2e",
        tertiary: "#1d1e2c",
        accent: "#ff6363",
        light: "#f5f5f5",
        dark: "#1a1a1a",
        success: "#28a745",
        warning: "#ffc107",
        error: "#dc3545",
        info: "#17a2b8",
        muted: "#6c757d",
        custom: '#f8f9fa',

        // Your new custom color
        customBlue: '#192bc2',
      },
    },
  },
  plugins: [],
};
