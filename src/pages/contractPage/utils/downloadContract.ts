import { AppError } from '@pagopa/selfcare-common-frontend/lib/model/AppError';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ENV } from '../../../utils/env';

const buildContractUrl = (contractId: string, productId: string, fileName: string): string => {
  const params = new URLSearchParams({
    productId,
    contractName: fileName,
  });

  return `${ENV.URL_API.API_DASHBOARD}/v1/contracts/${contractId}?${params.toString()}`;
};

const buildAuthHeaders = () => ({
  Authorization: `Bearer ${storageTokenOps.read()}`,
  'Content-Type': 'text/html',
});

export async function downloadContract(
  contractId: string,
  productId: string,
  fileName: string,
  onError: (error: AppError) => void
) {
  try {
    const url = buildContractUrl(contractId, productId, fileName);

    const response = await fetch(url, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      onError({
        id: `contract-${productId}`,
        blocking: false,
        error: new Error(`Errore nel recupero del contratto: ${response.statusText}`),
        techDescription: `Errore nel recupero del contratto HTML con productId ${productId}`,
        toNotify: true,
      });
      return;
    }

    const htmlContent = await response.text();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);

    // Forza il download con il nome file scelto
    const link = document.createElement('a');
    // eslint-disable-next-line functional/immutable-data
    link.href = blobUrl;
    // eslint-disable-next-line functional/immutable-data
    link.download = fileName.endsWith('.html') ? fileName : `${fileName}.html`;
    link.click();

    // Rilascio memoria
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    onError({
      id: `contract-${productId}`,
      blocking: false,
      error: error as Error,
      techDescription: `Errore imprevisto durante il download del contratto HTML con productId ${productId}`,
      toNotify: true,
    });
  }
}

export async function downloadContractToEdit(
  contractId: string,
  productId: string,
  fileName: string,
  onError: (error: AppError) => void
) {
  try {
    const url = buildContractUrl(contractId, productId, fileName);

    const response = await fetch(url, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      onError({
        id: `contract-${productId}`,
        blocking: false,
        error: new Error(`Errore nel recupero del contratto: ${response.statusText}`),
        techDescription: `Errore nel recupero del contratto HTML con productId ${productId}`,
        toNotify: true,
      });
      return;
    }

    const html = await response.text();
    const htmlMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return htmlMatch ? htmlMatch[1] : '';
  } catch (error) {
    onError({
      id: `contract-${productId}`,
      blocking: false,
      error: error as Error,
      techDescription: `Errore imprevisto durante il download del contratto HTML (per la modifica) con productId ${productId}`,
      toNotify: true,
    });
    return '';
  }
}
