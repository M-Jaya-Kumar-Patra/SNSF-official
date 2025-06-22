/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'iphone12': '390px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to left, #2563eb, #3730a3)', // blue-600 → indigo-800
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
  
};
