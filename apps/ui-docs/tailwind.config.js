const base = require('@calcom/config/tailwind-preset')
/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  darkMode: ['class', '[data-mode="dark"]'],
  content: [
    ...base.content,
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './mdx/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
