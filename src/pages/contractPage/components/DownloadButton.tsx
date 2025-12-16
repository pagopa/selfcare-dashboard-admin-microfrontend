import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { downloadContractTemplate } from '../../../services/contractService';
import { downloadBase64File } from '../utils/downloadFile';

type Props = {
  contractId: string;
  productId: string;
  fileName: string;
};

export const DownloadButton = ({ contractId, productId, fileName }: Props) => {
  const addError = useErrorDispatcher();

  const handleDownload = async () => {
    try {
      const file = await downloadContractTemplate(contractId, productId);

      if (file.data) {
        downloadBase64File(
          file.data,
          file.type === 'PDF' ? 'application/pdf' : 'text/html',
          fileName
        );
      }
    } catch (error) {
      addError({
        id: `download-contract-${contractId}-error`,
        blocking: false,
        techDescription: `Failed to download contract ${contractId}`,
        toNotify: false,
        error: error as Error,
      });
    }
  };

  return (
    <Button size="small" startIcon={<FileDownloadIcon />} onClick={handleDownload}>
      Download
    </Button>
  );
};
