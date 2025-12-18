import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { WithDefaultsT, createClient } from './generated/b4f-dashboard/client';
import { ContractTemplateResponseList } from './generated/b4f-dashboard/ContractTemplateResponseList';
import { ContractTemplateFile } from './generated/b4f-dashboard/ContractTemplateFile';
import { ContractTemplateUploadRequest } from './generated/b4f-dashboard/ContractTemplateUploadRequest';

const MOCK_BEARER_TOKEN_IAM = "REPLACE_WITH_YOUR_CONTRACT_TOKEN";

const withBearerAuthContracts: WithDefaultsT<'bearerAuth'> = (wrappedOperation) => (params: any) => wrappedOperation({
  ...params,
  bearerAuth: `Bearer ${MOCK_BEARER_TOKEN_IAM}`,
});

const apiClientContracts = createClient({
  baseUrl: ENV.URL_API.API_DASHBOARD,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.DASHBOARD),
  withDefaults: withBearerAuthContracts,
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

export const ContractsApi = {
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
    name : string,
    version : string,
    file : File,
    description?: string
  ): Promise<void> => {
    const result = await apiClientContracts.postUploadContract({
      productId,
      name,
      version,
      file,
      description,
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },
};
