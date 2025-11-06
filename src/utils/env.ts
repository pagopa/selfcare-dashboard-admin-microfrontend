import * as env from 'env-var';
import { i18n } from 'i18next';
import { Store } from 'redux';

const PUBLIC_URL_INNER: string | undefined = env.get('PUBLIC_URL').asString() || '/dashboard';
export const ENV = {
  STORE: {} as Store,
  i18n: {} as i18n,
  ENV: env.get('REACT_APP_ENV').required().asString(),
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
    LOGIN: env.get('REACT_APP_URL_FE_LOGIN').required().asString(),
    LOGOUT: env.get('REACT_APP_URL_FE_LOGOUT').required().asString(),
    ONBOARDING: env.get('REACT_APP_URL_FE_ONBOARDING').required().asString(),
    LANDING: env.get('REACT_APP_URL_FE_LANDING').required().asString(),
    ASSISTANCE: env.get('REACT_APP_URL_FE_ASSISTANCE').required().asString(),
  },

  URL_DOCUMENTATION: 'https://docs.pagopa.it/area-riservata/',

  URL_API: {
    API_DASHBOARD: env.get('REACT_APP_URL_API_DASHBOARD').required().asString(),
    API_ONBOARDING_V2: env.get('REACT_APP_URL_API_ONBOARDING_V2').required().asString(),
    PARTY_REGISTRY_PROXY: env.get('REACT_APP_URL_API_PARTY_REGISTRY_PROXY').required().asString(),
  },

  API_TIMEOUT_MS: {
    DASHBOARD: env.get('REACT_APP_API_DASHBOARD_TIMEOUT_MS').required().asInt(),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_PREFIX').required().asString(),
    SUFFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_SUFFIX').required().asString(),
  },
};
