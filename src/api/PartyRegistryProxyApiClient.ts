import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/party-registry-proxy/client';
import { OnboardingIndexSearchResource } from './generated/party-registry-proxy/OnboardingIndexSearchResource';
import { SearchServiceInstitution } from './generated/party-registry-proxy/SearchServiceInstitution';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiI5OTIwODc4Yy05MTUzLTQxNmQtOTcwOS0yMGI1NGE1MGI5MzgiLCJlbWFpbCI6Im9yYWxkby5kb2NpQG50dGRhdGEuY29tIiwiaXNzIjoiUEFHT1BBIiwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpYXQiOjE3NjE1NTUzMjUsImV4cCI6MTk2MTU4NzcyNSwianRpIjoiZTBjZWViNjMtNzQ4OC00YjUzLWIwMjgtMTZkMjE1NTUwMjA2In0.aoIurFBwduL4bI_wkY45BEXGHmzHjo_-Nxe0zLUFBs1Zid2EKrS5zAXJ6DXW2JS_QkIvmd8A1TkzKb88LGX2Sf2R9yZA3fwoQj3-DtDVRlfGOr5oNyKMSNecQR9etsbqClLGzioFl0vuvMi7U2lTMPGPF7FNuuto5SdCcXITaysYjqBm2sPrclMu8mUs5qLyoWTF02Nv_KAqhvPs8Sic03c7SQjaXRXb9S2ZLAOox418VxTLvxzxeq8HWZvkvOqXH9iBVn74HNfCXiyGisznixBvupLLuoMhRYdcwMj5ZF9A9KXXoljdRmCLYFJdz4biOrf_4K1uqTLwvPz3yFEbZQ';
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

export const PartyRegisrtyApi = {
  searchInstitutions: async (searchText: string): Promise<Array<SearchServiceInstitution>> => {
    const result = await apiClient.searchInstitutionsUsingGET({
      search: searchText,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  searchOnboardings: async (
    searchText: string,
    products: Array<string>,
    institutionTypes: Array<string>,
    statuses: Array<string>,
    page: number,
    pageSize: number
    // orderBy: string
  ): Promise<OnboardingIndexSearchResource> => {
    const result = await apiClient.retrieveOnboardingOnSearchEngine({
      searchText,
      products,
      institutionTypes,
      statuses,
      page,
      pageSize,
      // orderBy,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
