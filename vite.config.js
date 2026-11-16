import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact()],
  build: {
    // Verhindert das Leeren des dist-Ordners, falls du mehrere Build-Steps hast (optional)
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      // Hier kannst du alle Einstiegspunkte deiner Extension definieren (Popup, Background, Content-Scripts)
      input: {
        popup: resolve(__dirname, 'popup.html'),
        // background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        // Erzwingt feste Dateinamen ohne kryptische Hashes für die Manifest.json
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
