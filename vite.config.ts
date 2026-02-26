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
          '@pagopa/selfcare-common-frontend',
          '@pagopa/mui-italia',
          '@pagopa/ts-commons',
          'react',
          'react-dom',
          'react-redux',
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
    build: {
      target: 'esnext', // OBBLIGATORIO per @originjs/vite-plugin-federation
      minify: false, // OBBLIGATORIO per MF remotes
      outDir: 'build',
      sourcemap: true,
    },
    define: {
      'process.env': Object.fromEntries(
        Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
      ),
    },
  };
});
