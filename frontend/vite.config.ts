import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        // Cambiado de '0.0.0.0' a '127.0.0.1' y cambiado el puerto a 5174.
        host: '127.0.0.1',
        port: 5174,
    }
});