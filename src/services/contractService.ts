import { ContractsApi } from '../api/ContractsApiClient';
import type { ContractTemplateResponse } from '../api/generated/b4f-dashboard/ContractTemplateResponse';


export type ContractsNestedResponse = Record<
  string, // productId
  Record<
    string, // contract name (es. "accordo di adesione")
    Array<ContractTemplateResponse>
  >
>;

export const fetchContractTemplatesNested = async (
  name?: string,
  version?: string
): Promise<ContractsNestedResponse> => {
  const response = await ContractsApi.listContractTemplates(name, version);

  const contracts = (response as any).contracts ?? response.contractsList;

  if (!contracts || typeof contracts !== 'object') {
    return {};
  }

  return contracts as ContractsNestedResponse;
};

export const uploadContractTemplate = async (
  productId: string,
  name: string,
  version: string,
  htmlContent: string,
  description?: string
): Promise<void> => {
  const file = new File([htmlContent], `${name}_${version}.html`, {
    type: 'text/html',
  });

  return ContractsApi.postUploadContract(
    productId,
    name,
    version,
    file,
    description
  );
};
