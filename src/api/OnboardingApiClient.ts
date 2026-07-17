import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { OnboardingRequestResource } from '../model/OnboardingRequestResource';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/onboarding/client';
import { AvailableDocumentsResource } from './generated/onboarding/AvailableDocumentsResource';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: ENV.URL_API.API_ONBOARDING_V2,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
  withDefaults: withBearerAndInstitutionId,
});

const buildOnSuccess = () => `${window.location.pathname}${window.location.search}`;

const buildRedirectUrl = (baseUrl: string) => {
  const [urlWithoutHash, hashFragment] = baseUrl.split('#');
  const separator = urlWithoutHash.includes('?') ? '&' : '?';
  const onSuccess = encodeURIComponent(buildOnSuccess());
  const hash = hashFragment ? `#${hashFragment}` : '';
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  return `${urlWithoutHash}${separator}onSuccess=${onSuccess}${hash}`;
};

const onRedirectToBackstage = () => {
  const redirectBaseUrl = ENV.URL_FE.LOGIN_GOOGLE || ENV.URL_FE.LOGIN;
  const redirectUrl = buildRedirectUrl(redirectBaseUrl);

  window.location.assign(redirectUrl);

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
};

export const OnboardingApi = {
  fetchOnboardingRequest: async (onboardingId: string): Promise<OnboardingRequestResource> => {
    const result = await apiClient.retrieveOnboardingRequestUsingGET({
      onboardingId,
    });
    return extractResponse(result, 200, onRedirectToBackstage);
  },

  rejectOnboardingRequest: async (onboardingId: string): Promise<OnboardingRequestResource> => {
    const result = await apiClient.rejectOnboardingUsingPOST({
      onboardingId,
      body: {
        reason: '',
      },
    });
    return extractResponse(result, 200, onRedirectToBackstage);
  },

  approveOnboardingRequest: async (onboardingId: string): Promise<OnboardingRequestResource> => {
    const result = await apiClient.approveOnboardingUsingPOST({
      onboardingId,
    });
    return extractResponse(result, 200, onRedirectToBackstage);
  },

  downloadOnboardingAttachments: (
    onboardingId: string,
    type: string,
    name?: string
  ): Promise<Response> => {
    const token = storageTokenOps.read();
    const params = new URLSearchParams({ type });
    if (name) {
      params.append('name', name);
    }
    return fetch(
      `${ENV.URL_API.API_ONBOARDING_V2}/v2/tokens/${onboardingId}/download?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          accept: '*/*',
          'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
          authorization: `Bearer ${token}`,
          'content-type': 'application/octet-stream',
        },
      }
    );
  },

  getAvailableDocuments: async (onboardingId: string): Promise<AvailableDocumentsResource> => {
    const result = await apiClient.getAvailableDocumentsUsingGET({
      onboardingId,
    });
    return extractResponse(result, 200, onRedirectToBackstage);
  },
};
