import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { OnboardingRequestResource } from '../model/OnboardingRequestResource';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/onboarding/client';

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
  return `${urlWithoutHash}${separator}onSuccess=${onSuccess}${hashFragment ? `#${hashFragment}` : ''}`;
};

const onRedirectToLogin = () => {
  const redirectUrl = buildRedirectUrl(ENV.URL_FE.LOGIN);

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

const onRedirectToBackstage = () => {
  const fallbackLoginUrl = ENV.URL_FE.LOGIN;
  const redirectBaseUrl = ENV.URL_FE.BACKSTAGE || fallbackLoginUrl;
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
    return extractResponse(result, 200, onRedirectToLogin);
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

  downloadOnboardingAttachments: async (onboardingId: string, name: string): Promise<any> => {
    const result = await apiClient.getAttachmentUsingGET({
      onboardingId,
      name,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
