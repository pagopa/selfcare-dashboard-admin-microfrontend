import { DashboardApi } from '../api/DashboardApiClient';
import { ContractTemplateResponse } from '../api/generated/b4f-dashboard/ContractTemplateResponse';
import { ContractTemplateFile } from '../api/generated/b4f-dashboard/ContractTemplateFile';
import { ContractTemplateUploadRequest } from '../api/generated/b4f-dashboard/ContractTemplateUploadRequest';

export const fetchContractTemplates = async (
  name?: string,
  version?: string
): Promise<Array<ContractTemplateResponse>> => {
  const response = await DashboardApi.listContractTemplates(name, version);
  
  const contractsList = (response as any).contracts ?? response.contractsList;
  
  if (!contractsList) {
    return [];
  }
  
  if (Array.isArray(contractsList)) {
    return contractsList;
  }
  
  return Object.entries(contractsList).reduce<Array<ContractTemplateResponse>>(
    (acc, [productId, productContracts]) => {
      if (typeof productContracts === 'object' && productContracts !== null) {
        const newContracts = Object.entries(productContracts).reduce<Array<ContractTemplateResponse>>(
          (agreementAcc, [, agreementContracts]) => {
            if (Array.isArray(agreementContracts)) {
              return [
                ...agreementAcc,
                ...agreementContracts.map((contract) => ({
                  ...contract,
                  productId,
                })),
              ];
            }
            return agreementAcc;
          },
          []
        );
        return [...acc, ...newContracts];
      }
      return acc;
    },
    []
  );
};

export const downloadContractTemplate = async (
  contractId: string,
  productId: string
): Promise<ContractTemplateFile> =>
  DashboardApi.downloadContractTemplate(contractId, productId);

export const uploadContractTemplate = async (
  productId: string,
  uploadRequest: ContractTemplateUploadRequest
): Promise<void> =>
  DashboardApi.postUploadContract(productId, uploadRequest);
