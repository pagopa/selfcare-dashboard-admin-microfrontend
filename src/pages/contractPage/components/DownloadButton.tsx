// components/DownloadButton.tsx
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';
import { downloadContract } from '../utils/downloadContract';

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
    await downloadContract(contractId, productId, fileName, addError);
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
