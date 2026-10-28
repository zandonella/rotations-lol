import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        allowedHosts: ['aurora', 'aurora.tail7d4c86.ts.net'],
        proxy: {
            '/__mythic-status': {
                target: 'http://127.0.0.1:4311',
                rewrite: () => '/v1/status/mythic',
            },
        },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
