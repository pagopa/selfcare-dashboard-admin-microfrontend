import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';
import { downloadContractTemplate } from '../../../services/contractService';
import { downloadBase64File } from '../utils/downloadFile';

type Props = {
  contractId: string;
  productId: string;
  fileName: string;
  disabled?: boolean;
};

export const DownloadButton = ({ contractId, productId, fileName, disabled }: Props) => {
  const addError = useErrorDispatcher();
  const { t } = useTranslation();

  const handleDownload = async () => {
    try {
      const file = await downloadContractTemplate(contractId, productId);
      if (!file.data) {
        return;
      } 

      const mime = file.type === 'PDF' ? 'application/pdf' : 'text/html';
      const ext = file.type === 'PDF' ? 'pdf' : 'html';
      downloadBase64File(file.data, mime, `${fileName}.${ext}`);
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
    <Button
      size="small"
      startIcon={<FileDownloadIcon />}
      onClick={handleDownload}
      disabled={disabled}
    >
      {t('contractPage.download', 'Download')}
    </Button>
  );
};
