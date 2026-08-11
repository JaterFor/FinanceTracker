import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    // 5173 falls inside a Windows/Hyper-V dynamic port-exclusion range on some dev machines (EACCES on bind).
    port: 5273,
    // Default `localhost` resolves to ::1 only on some Windows setups with a broken IPv6 loopback route.
    host: '127.0.0.1',
  },
});
