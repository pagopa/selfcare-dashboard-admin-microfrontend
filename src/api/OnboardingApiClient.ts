// import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { ENV } from '../utils/env';
import { OnboardingRequestResource } from '../model/OnboardingRequestResource';
import { createClient, WithDefaultsT } from './generated/onboarding/client';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9hMjo3YTo0NjozYjoyYTo2MDo1Njo0MDo4ODphMDo1ZDphNDpmODowMToxZTozZSJ9.eyJmYW1pbHlfbmFtZSI6InNpc3RpIiwiZmlzY2FsX251bWJlciI6IlNTVE1UVDgwQTAxRjIwNUMiLCJuYW1lIjoibWF0dGlhIiwic3BpZF9sZXZlbCI6Imh0dHBzOi8vd3d3LnNwaWQuZ292Lml0L1NwaWRMMiIsImZyb21fYWEiOmZhbHNlLCJ1aWQiOiJkZWE1ZDJjNC05YzNiLTQ3YzEtYmQ5YS0zZTM4YTIwMzcwMDkiLCJsZXZlbCI6IkwyIiwiaWF0IjoxNzMzNzM2NzU1LCJleHAiOjE3MzM3NjkxNTUsImF1ZCI6ImFwaS5kZXYuc2VsZmNhcmUucGFnb3BhLml0IiwiaXNzIjoiU1BJRCIsImp0aSI6Il8wY2M1ODE5YjY2YWNlMjA3MzdiNCJ9.blijFdaw5nrB93U1rYAm6hHNp9cqQe2ABSHwzMeIM3gBuLbpkU_B4s-QJUyIAq29EeHA26V6_uN6SFOmKYSLk2KW9ozNHEO4B_hiDwxjIRz5hVFGaVapEbjppjzOy1BAexyGDhF2WLtxbj5i5k8Dj9djIFgNkZ1cTnMy-IzLVnY5efkBCoCyUziCCRxkTwSrKpoTQdqrG2fJbciPL2O8CL52TxQWN4a-GVFNwjnpQPBj_qvsdyKP_ypP02OeaP7W-0JvJ2UCCdxVUYmhpzOtjmw1PLgs0Ig9yh1_1eKzCBf-rPlsuXIsZT5Zk6fz6NW2r2aL_RSRslF1FOUE9SxMKA';
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
    return extractResponse(result, 200, onRedirectToLogin);
  },

  approveOnboardingRequest: async (onboardingId: string): Promise<OnboardingRequestResource> => {
    const result = await apiClient.approveOnboardingUsingPOST({
      onboardingId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  downloadOnboardingAttachments: async (onboardingId: string, name: string): Promise<any> => {
    const result = await apiClient.getAttachmentUsingGET({
      onboardingId,
      name,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
