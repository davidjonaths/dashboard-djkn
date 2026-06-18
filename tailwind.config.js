/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        djkn: {
          navy: '#0A2540',      // Biru Gelap Kemenkeu
          navyLight: '#1E3A8A', // Biru Aksen
          gold: '#D4AF37',      // Emas Mewah Aset Negara
          goldHover: '#AA8811',
          bg: '#F8FAFC',        // Background kontras putih-abu
        }
      }
    },
  },
  plugins: [],
}