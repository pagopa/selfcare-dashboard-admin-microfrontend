import { DashboardApi } from '../api/DashboardApiClient';
import { ContractTemplateResponse } from '../api/generated/b4f-dashboard/ContractTemplateResponse';
import { ContractTemplateFile } from '../api/generated/b4f-dashboard/ContractTemplateFile';
import { ContractTemplateUploadRequest } from '../api/generated/b4f-dashboard/ContractTemplateUploadRequest';

export const fetchContractTemplates = async (
  name: string,
  version: string
): Promise<Array<ContractTemplateResponse>> => {
  const response = await DashboardApi.listContractTemplates(name, version);
  return response.contractsList ? [...response.contractsList] : [];
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
