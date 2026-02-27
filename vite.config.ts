import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      federation({
        name: 'selfcareAdmin',
        filename: 'remoteEntry.js',
        exposes: {
          './RoutingAdmin': './src/remotes/RoutingAdmin',
        },
        shared: [
          'react',
          'react-dom',
          'react-router-dom',
          '@emotion/react',
          '@emotion/styled',
          '@mui/icons-material',
          '@mui/material',
          '@mui/lab',
          '@mui/x-data-grid',
          '@mui/x-data-grid-generator',
          'i18next',
          'react-i18next',
          'core-js',
          'mixpanel-browser',
        ],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_URL_CDN: env.VITE_URL_CDN || '',
          },
        },
      }),
    ],
    server: {
      port: 3003,
    },
    resolve: {
      dedupe: ['react', 'react-dom', 'react-redux'],
    },
    build: {
      target: 'esnext',
      minify: false,
      outDir: 'dist',
      sourcemap: true,
      assetsDir: '',
    },
    define: {
      'process.env': Object.fromEntries(
        Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
      ),
    },
  };
});
