import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        welcome: resolve(__dirname, 'src/welcome.html'),
        requiredReview: resolve(__dirname, 'src/required-review.html'),
        namePronunciation: resolve(__dirname, 'src/name-pronunciation.html'),
        requiredConfirmation: resolve(__dirname, 'src/required-confirmation.html'),
        interviewDayChecklist: resolve(__dirname, 'src/interview-day-checklist.html'),
        interview: resolve(__dirname, 'src/interview.html'),
        interviewDate: resolve(__dirname, 'src/interview-date.html'),
        congratulations: resolve(__dirname, 'src/congratulations.html'),
        aboutStanford: resolve(__dirname, 'src/about-stanford.html'),
        aboutMMI: resolve(__dirname, 'src/about-mmi.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/style.css';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true,
    open: '/welcome.html'
  }
});
