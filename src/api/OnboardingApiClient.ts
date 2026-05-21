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

const buildOnSuccess = () => encodeURIComponent(window.location.pathname + window.location.search);

const onRedirectToLogin = () => {
  const onSuccessEncoded = buildOnSuccess();
  const redirectUrl = `${ENV.URL_FE.LOGIN}?onSuccess=${onSuccessEncoded}`;

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
  const onSuccessEncoded = encodeURIComponent(window.location.pathname + window.location.search);
  const redirectUrl = `${redirectBaseUrl}?onSuccess=${onSuccessEncoded}`;

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

  downloadOnboardingAttachments: async (onboardingId: string, name: string): Promise<any> => {
    const result = await apiClient.getAttachmentUsingGET({
      onboardingId,
      name,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
