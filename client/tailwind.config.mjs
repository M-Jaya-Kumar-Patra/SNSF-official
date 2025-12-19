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
        'mdlg': '1552px', 
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to left, #1e293b, #0f172a)', // blue-600 → indigo-800
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
  
};
