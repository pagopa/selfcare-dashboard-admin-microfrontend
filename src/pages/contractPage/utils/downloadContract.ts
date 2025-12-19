import { storageTokenOps } from "@pagopa/selfcare-common-frontend/lib/utils/storage";
import { AppError } from "@pagopa/selfcare-common-frontend/lib/model/AppError";
import { ENV } from "../../../utils/env";

// utils/downloadContract.ts
export async function downloadContract(
  contractId: string,
  productId: string,
  fileName: string,
  onError: (error: AppError) => void
) {
  try {
    const token = storageTokenOps.read();
    const url = `${ENV.URL_API.API_DASHBOARD}/v1/contracts/${contractId}?productId=${productId}&contractName=${fileName}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/html',
      },
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
