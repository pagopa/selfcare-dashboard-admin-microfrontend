import path from 'path';
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const base =
    command === 'build' && env.VITE_URL_CDN
      ? `${env.VITE_URL_CDN}/microcomponents/dashboard/admin/onboarding/`
      : '/';

  return {
    base,
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
          '@emotion/react',
          '@emotion/styled',
          '@mui/icons-material',
          '@mui/material',
          '@mui/lab',
          '@mui/x-data-grid',
          '@mui/x-data-grid-generator',
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
      alias: [
        {
          find: /^@pagopa\/selfcare-common-frontend$/,
          replacement: path.resolve('./node_modules/@pagopa/selfcare-common-frontend/lib/index.js'),
        },
      ],
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
