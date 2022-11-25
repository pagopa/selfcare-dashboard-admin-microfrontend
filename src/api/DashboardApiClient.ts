import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { OnboardingRequestResource } from '../model/OnboardingRequestResource';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/b4f-dashboard/client';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: ENV.URL_API.API_DASHBOARD,
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

export const DashboardApi = {
  fetchOnboardingPspRequest: async (tokenId: string): Promise<OnboardingRequestResource> => {
    const result = await apiClient.retrieveOnboardingRequestUsingGET({
      tokenId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  rejectOnboardingPspRequest: async (tokenId: string): Promise<OnboardingRequestResource> => {
    const result = await apiClient.rejectOnboardingRequestUsingDELETE({
      tokenId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
