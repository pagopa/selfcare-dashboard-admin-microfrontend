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
import { ContractTemplateResponseList } from './generated/b4f-dashboard/ContractTemplateResponseList';
import { ContractTemplateFile } from './generated/b4f-dashboard/ContractTemplateFile';
import { ContractTemplateUploadRequest } from './generated/b4f-dashboard/ContractTemplateUploadRequest';

const MOCK_BEARER_TOKEN = storageTokenOps.read();

const MOCK_BEARER_TOKEN_CONTRACTS = storageTokenOps.read();

const withBearerAndPartyId: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => wrappedOperation({
  ...params,
  bearerAuth: `Bearer ${MOCK_BEARER_TOKEN}`,
});

const withBearerAndPartyIdContracts: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => wrappedOperation({
  ...params,
  bearerAuth: `Bearer ${MOCK_BEARER_TOKEN_CONTRACTS}`,
});

const apiClient = createClient({
  baseUrl: ENV.URL_API.API_DASHBOARD,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
  withDefaults: withBearerAndPartyId,
});

const apiClientContracts = createClient({
  baseUrl: ENV.URL_API.API_DASHBOARD,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
  withDefaults: withBearerAndPartyIdContracts,
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

  listContractTemplates: async (
    name?: string,
    version?: string
  ): Promise<ContractTemplateResponseList> => {
    const result = await apiClientContracts.listContractTemplates({
      name,
      version,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  downloadContractTemplate: async (
    contractId: string,
    productId: string
  ): Promise<ContractTemplateFile> => {
    const result = await apiClientContracts.downloadContractTemplate({
      contractId,
      productId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  postUploadContract: async (
    productId: string,
    contractTemplateUploadRequest: ContractTemplateUploadRequest
  ): Promise<void> => {
    const result = await apiClientContracts.postUploadContract({
      productId,
      body: contractTemplateUploadRequest,
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },
};
