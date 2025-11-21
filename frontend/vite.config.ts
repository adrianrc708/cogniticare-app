import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        // Asegura que Vite se pueda acceder desde otras IPs si es necesario
        host: '0.0.0.0',
        port: 5173,
    }
});