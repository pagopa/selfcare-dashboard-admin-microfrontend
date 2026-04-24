/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALLOWED_PRODUCTS_BACKSTAGE: string;
  readonly NODE_ENV: 'development' | 'uat' | 'production';
  readonly VITE_API_MOCK_REQUEST_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
