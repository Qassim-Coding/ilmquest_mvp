import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png'],
        // Polices et icônes mises en cache avec l'app : l'arabe s'affiche aussi hors ligne
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          // Audios des Noms (public/audio/noms) : pas téléchargés d'avance avec l'app (environ 2 Mo),
          // mais gardés sur le téléphone dès qu'un Nom a été écouté une fois : ils marchent ensuite hors ligne.
          // L'adresse contient ?v=<empreinte> : un fichier refait a une nouvelle adresse, c'est donc lui qui est chargé.
          runtimeCaching: [
            {
              urlPattern: /\/audio\/noms\/\d+\.mp3/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'ilmquest-audio',
                expiration: { maxEntries: 300 },
                cacheableResponse: { statuses: [200] },
              },
            },
          ],
        },
        manifest: {
          name: 'IlmQuest',
          short_name: 'IlmQuest',
          description: "Apprenez et mémorisez les 99 Noms d'Allah",
          theme_color: '#F3F8F5',
          background_color: '#F3F8F5',
          display: 'standalone',
          // Icône « Livre ouvert » : PNG pour Android et l'installation, SVG pour les navigateurs récents
          icons: [
            { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          ],
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify-file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
