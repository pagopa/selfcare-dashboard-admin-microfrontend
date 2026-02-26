/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';

    VITE_API_MOCK_REQUEST_DATA: string;
  }
}
interface Window {
  Stripe: any;
}
