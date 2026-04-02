import { i18n } from 'i18next';
import { Store } from 'redux';

const PUBLIC_URL_INNER: string | undefined = import.meta.env.VITE_PUBLIC_URL || '/dashboard';
export const ENV = {
  STORE: {} as Store,
  i18n: {} as i18n,
  ENV: import.meta.env.VITE_ENV,
  PUBLIC_URL: PUBLIC_URL_INNER,

  ROUTES: {
    ADMIN: `${PUBLIC_URL_INNER}/admin/onboarding`,
    ADMIN_SEARCH: `${PUBLIC_URL_INNER}/admin/search`,
    ADMIN_PARTY_DETAIL: `${PUBLIC_URL_INNER}/admin/onboarding/:tokenId`,
  },

  DASHBOARD_ROUTES: {
    OVERVIEW: `${PUBLIC_URL_INNER}/:partyId`,
  },

  URL_FE: {
    LOGIN: import.meta.env.VITE_URL_FE_LOGIN,
    LOGOUT: import.meta.env.VITE_URL_FE_LOGOUT,
    ONBOARDING: import.meta.env.VITE_URL_FE_ONBOARDING,
    LANDING: import.meta.env.VITE_URL_FE_LANDING,
    ASSISTANCE: import.meta.env.VITE_URL_FE_ASSISTANCE,
  },

  URL_DOCUMENTATION: 'https://docs.pagopa.it/area-riservata/',

  URL_API: {
    API_DASHBOARD: import.meta.env.VITE_URL_API_DASHBOARD,
    API_ONBOARDING_V2: import.meta.env.VITE_URL_API_ONBOARDING_V2,
    PARTY_REGISTRY_PROXY: import.meta.env.VITE_URL_API_PARTY_REGISTRY_PROXY,
  },

  API_TIMEOUT_MS: {
    DASHBOARD: import.meta.env.VITE_API_DASHBOARD_TIMEOUT_MS,
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: import.meta.env.VITE_URL_INSTITUTION_LOGO_PREFIX,
    SUFFIX: import.meta.env.VITE_URL_INSTITUTION_LOGO_SUFFIX,
  },

  ALLOWED_PREFIXES: import.meta.env.VITE_ALLOWED_PRODUCTS_BACKSTAGE || '',
};
