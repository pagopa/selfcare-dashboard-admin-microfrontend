import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import {
    buildFetchApi,
    extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/party-registry-proxy/client';
import { SearchServiceInstitution } from './generated/party-registry-proxy/SearchServiceInstitution';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiJ0ZXN0QHBhZ29wYS5pdCIsImlzcyI6IlBBR09QQSIsImF1ZCI6ImFwaS5kZXYuc2VsZmNhcmUucGFnb3BhLml0IiwiaWF0IjoxNzU5MzA0OTcwLCJleHAiOjE5NTkzMzczNzAsImp0aSI6IjUyZWM3OGU4LThmYWYtNDMzMi1iZDRkLWRlMTA4ZThlNDJkZCJ9.aYv-asLRR4yOg2tMLm0likKLj3ppfLHXrX3GXz138CjuAx-il7_FO_T8fK7YdrqouOYnENds6WQyxI9phFjyx9NLQpKP-xQJ7Z-P-XqRihQVkxFJUdHckeYZly9wj5Q11UPnHcvPIAQ-1KIpRBZG75b-Ww9qe1LE_D7MWJOY11nXJpt_xCnfff6QWuDbBljLO_rAMj08GPbng6q0hNrulr3uXnfYuSxGFjiZct3_w2D_sasolOiCDHUbveMO9suoxm4WyknqYHz_4lzVHC3BZNUNPfvNWAYXMaIAv_BGhTY6RfUXdCLVhxMANezeVhB6e1pwMFF06ZSQKj2cAhGiVQ';
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: ENV.URL_API.PARTY_REGISTRY_PROXY,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
  withDefaults: withBearerAndInstitutionId,
});

const onRedirectToLogin = () =>
  ENV.STORE.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: ENV.i18n.t('session.expired.title'),
      displayableDescription: ENV.i18n.t('session.expired.message'),
    })
  );

export const OnboardingApi = {
  searchInstitutions: async (searchText: string): Promise<Array<SearchServiceInstitution>> => {
    const result = await apiClient.searchInstitutions({
      searchText,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
