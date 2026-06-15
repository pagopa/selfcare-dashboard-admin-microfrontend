/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALLOWED_PRODUCTS_BACKSTAGE: string;
  readonly VITE_URL_FE_BACKSTAGE: string;
  readonly VITE_URL_CDN: string;
  readonly VITE_GOOGLE_LOGIN_URL?: string;
  readonly NODE_ENV: 'development' | 'uat' | 'production';
  readonly VITE_ENV: string;
  readonly VITE_PUBLIC_URL?: string;
  readonly VITE_URL_FE_LOGIN: string;
  readonly VITE_URL_FE_LOGOUT: string;
  readonly VITE_URL_FE_ONBOARDING: string;
  readonly VITE_URL_FE_LANDING: string;
  readonly VITE_URL_FE_ASSISTANCE: string;
  readonly VITE_URL_API_DASHBOARD: string;
  readonly VITE_URL_API_ONBOARDING_V2: string;
  readonly VITE_URL_API_PARTY_REGISTRY_PROXY: string;
  readonly VITE_API_DASHBOARD_TIMEOUT_MS: string;
  readonly VITE_URL_INSTITUTION_LOGO_PREFIX: string;
  readonly VITE_URL_INSTITUTION_LOGO_SUFFIX: string;
  readonly VITE_API_MOCK_PRODUCTS: string;
  readonly VITE_API_MOCK_REQUEST_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
