import * as env from 'env-var';
import { Store } from 'redux';
import { i18n } from 'i18next';

const PUBLIC_URL_INNER: string | undefined = env.get('PUBLIC_URL').asString() || '/dashboard';
export const ENV = {
  STORE: {} as Store,
  i18n: {} as i18n,
  ENV: env.get('REACT_APP_ENV').required().asString(),
  PUBLIC_URL: PUBLIC_URL_INNER,

  // TODO ROUTES
  ROUTES: {
    ADMIN: `${PUBLIC_URL_INNER}/admin`, // TODO ADD THE CORRECT ONE
  },

  URL_FE: {
    LOGIN: env.get('REACT_APP_URL_FE_LOGIN').required().asString(),
    LOGOUT: env.get('REACT_APP_URL_FE_LOGOUT').required().asString(),
    ONBOARDING: env.get('REACT_APP_URL_FE_ONBOARDING').required().asString(),
    LANDING: env.get('REACT_APP_URL_FE_LANDING').required().asString(),
    ASSISTANCE: env.get('REACT_APP_URL_FE_ASSISTANCE').required().asString(),
  },

  URL_API: {
    API_DASHBOARD: env.get('REACT_APP_URL_API_DASHBOARD').required().asString(),
  },

  API_TIMEOUT_MS: {
    DASHBOARD: env.get('REACT_APP_API_DASHBOARD_TIMEOUT_MS').required().asInt(),
  },

  PARTY_GROUPS_PAGE_SIZE: env.get('REACT_APP_PARTY_GROUPS_PAGE_SIZE').required().asInt(),
  PARTY_PRODUCT_GROUPS_PAGE_SIZE: env
    .get('REACT_APP_PARTY_PRODUCT_GROUPS_PAGE_SIZE')
    .required()
    .asInt(),
};
