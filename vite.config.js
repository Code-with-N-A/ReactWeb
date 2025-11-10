import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/ReactWeb/", // 👈 ye zaroor likh, yahi tera repo name hai
  plugins: [react(), tailwindcss()],
})
