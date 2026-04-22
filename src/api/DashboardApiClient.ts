import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { WithDefaultsT, createClient } from './generated/b4f-dashboard/client';
import { InstitutionResource } from './generated/b4f-dashboard/InstitutionResource';
import { ProductsResource } from './generated/b4f-dashboard/ProductsResource';

const withBearerAndPartyId: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiI5OTIwODc4Yy05MTUzLTQxNmQtOTcwOS0yMGI1NGE1MGI5MzgiLCJlbWFpbCI6Im9yYWxkby5kb2NpQG50dGRhdGEuY29tIiwiaXNzIjoiUEFHT1BBIiwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpYXQiOjE3NjE1NTUzMjUsImV4cCI6MTk2MTU4NzcyNSwianRpIjoiZTBjZWViNjMtNzQ4OC00YjUzLWIwMjgtMTZkMjE1NTUwMjA2In0.aoIurFBwduL4bI_wkY45BEXGHmzHjo_-Nxe0zLUFBs1Zid2EKrS5zAXJ6DXW2JS_QkIvmd8A1TkzKb88LGX2Sf2R9yZA3fwoQj3-DtDVRlfGOr5oNyKMSNecQR9etsbqClLGzioFl0vuvMi7U2lTMPGPF7FNuuto5SdCcXITaysYjqBm2sPrclMu8mUs5qLyoWTF02Nv_KAqhvPs8Sic03c7SQjaXRXb9S2ZLAOox418VxTLvxzxeq8HWZvkvOqXH9iBVn74HNfCXiyGisznixBvupLLuoMhRYdcwMj5ZF9A9KXXoljdRmCLYFJdz4biOrf_4K1uqTLwvPz3yFEbZQ';
  return wrappedOperation({
    ...params,
    bearerAuth: `Bearer ${token}`,
  });
};

const apiClient = createClient({
  baseUrl: ENV.URL_API.API_DASHBOARD,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
  withDefaults: withBearerAndPartyId,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message'),
    })
  );

export const DashboardApi = {
  getInstitution: async (institutionId: string): Promise<InstitutionResource> => {
    const result = await apiClient.v2GetInstitution({
      institutionId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getAllInstituionById: async (institutionId: string): Promise<InstitutionResource> => {
    const result = await apiClient.v2GetAllInstitution({
      institutionId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },


  getProducts: async (): Promise<Array<ProductsResource>> => {
    const result = await apiClient.getProductsTreeUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  tokenExchangeAdmin: async (
    institutionId: string,
    productId: string,
    environment?: string,
    lang?: string
  ): Promise<string> => {
    const result = await apiClient.v2ExchangeBackofficeAdmin({
      institutionId,
      productId,
      environment,
      lang,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
