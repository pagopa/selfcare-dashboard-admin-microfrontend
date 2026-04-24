import { i18n } from 'i18next';
import { Store } from 'redux';

const requiredEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

const optionalStringEnv = (value: string | undefined, defaultValue: string): string =>
  value ?? defaultValue;

const optionalBoolEnv = (value: string | undefined, defaultValue = 'false'): boolean =>
  (value ?? defaultValue) === 'true';

const PUBLIC_URL_INNER = import.meta.env.VITE_PUBLIC_URL || '/dashboard';

export const ENV = {
  STORE: {} as Store,
  i18n: {} as i18n,
  ENV: requiredEnv('VITE_ENV', import.meta.env.VITE_ENV),
  PUBLIC_URL: PUBLIC_URL_INNER,

  ROUTES: {
    ADMIN: `${PUBLIC_URL_INNER}/admin/onboarding`,
    ADMIN_SEARCH: `${PUBLIC_URL_INNER}/admin/search`,
    ADMIN_PARTY_DETAIL: `${PUBLIC_URL_INNER}/admin/onboarding/:tokenId`,
    ADMIN_CONTRACT: `${PUBLIC_URL_INNER}/admin/contract`,
    ADMIN_CONTRACT_EDITOR: `${PUBLIC_URL_INNER}/admin/contract/editor`,
  },

  DASHBOARD_ROUTES: {
    OVERVIEW: `${PUBLIC_URL_INNER}/:partyId`,
  },

  URL_FE: {
    LOGIN: requiredEnv('VITE_URL_FE_LOGIN', import.meta.env.VITE_URL_FE_LOGIN),
    LOGOUT: requiredEnv('VITE_URL_FE_LOGOUT', import.meta.env.VITE_URL_FE_LOGOUT),
    ONBOARDING: requiredEnv('VITE_URL_FE_ONBOARDING', import.meta.env.VITE_URL_FE_ONBOARDING),
    LANDING: requiredEnv('VITE_URL_FE_LANDING', import.meta.env.VITE_URL_FE_LANDING),
    ASSISTANCE: requiredEnv('VITE_URL_FE_ASSISTANCE', import.meta.env.VITE_URL_FE_ASSISTANCE),
  },

  URL_DOCUMENTATION: 'https://docs.pagopa.it/area-riservata/',

  URL_API: {
    API_DASHBOARD: requiredEnv('VITE_URL_API_DASHBOARD', import.meta.env.VITE_URL_API_DASHBOARD),
    API_ONBOARDING_V2: requiredEnv(
      'VITE_URL_API_ONBOARDING_V2',
      import.meta.env.VITE_URL_API_ONBOARDING_V2
    ),
    PARTY_REGISTRY_PROXY: requiredEnv(
      'VITE_URL_API_PARTY_REGISTRY_PROXY',
      import.meta.env.VITE_URL_API_PARTY_REGISTRY_PROXY
    ),
  },

  API_TIMEOUT_MS: {
    DASHBOARD: Number.parseInt(
      requiredEnv('VITE_API_DASHBOARD_TIMEOUT_MS', import.meta.env.VITE_API_DASHBOARD_TIMEOUT_MS),
      10
    ),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: requiredEnv(
      'VITE_URL_INSTITUTION_LOGO_PREFIX',
      import.meta.env.VITE_URL_INSTITUTION_LOGO_PREFIX
    ),
    SUFFIX: requiredEnv(
      'VITE_URL_INSTITUTION_LOGO_SUFFIX',
      import.meta.env.VITE_URL_INSTITUTION_LOGO_SUFFIX
    ),
  },
};
