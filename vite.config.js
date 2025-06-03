import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    host: true,
    open: '/welcome.html'
  }
});
