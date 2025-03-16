import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
  extract: {
    include: ['index.html', 'src/**/*.{vue,html,jsx,tsx}'],
  },
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        dark: '#121212',
      },
    },
  },
  plugins: [],
});
