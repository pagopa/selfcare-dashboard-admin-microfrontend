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

// utils/downloadContract.ts
export async function downloadContractToEdit(
  contractId: string,
  productId: string,
  fileName: string,
  onError: (error: AppError) => void
) {
  try {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiJlOGVjYTIyZS03MzJmLTRiZTMtYTQ3Zi1mM2E0MTg1MDkwODUiLCJlbWFpbCI6InRlc3RAcGFnb3BhLml0IiwiaXNzIjoiUEFHT1BBIiwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpYXQiOjE3NTkzMDQ5NzAsImV4cCI6MTk1OTMzNzM3MCwianRpIjoiNTJlYzc4ZTgtOGZhZi00MzMyLWJkNGQtZGUxMDhlOGU0MmRkIn0.AHNUP0GwU69eZxnAZPk717qMgjLoRXWrDkPIRhV4jPdnLZ_ctIW8w--VhAagBiPXW98F-u24W0xxlN0mlz8WFfOPEHA2olvyT75CylCYMZ716EZmVrO6vn_E0eNhs6Hn-OsS32pYZzn21H3vpSU4kzfEM2QsVs6NmRAsqVSt52LVnU2CCyn_TsKFmj5rR6l-TXAfF13Ir8sIGKZLbBXkz7UaQDNDaVT17caOI6CN3ggWMG_YKUxOwLa2wdEC2eY8Ifu-FSxK4oDlOvTNxi_ulycXQFFUKE37o4ACkrMxTHHtIveSBM8tcDad2xHn4-fG5euXGZPSF_3TLZut5bxqVw";
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

    const html = await response.text();
    const htmlMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return htmlMatch ? htmlMatch[1] : "";
  } catch (error) {
    onError({
      id: `contract-${productId}`,
      blocking: false,
      error: error as Error,
      techDescription: `Errore imprevisto durante il download del contratto HTML (per la modifica) con productId ${productId}`,
      toNotify: true,
    });
    return "";
  }
}
