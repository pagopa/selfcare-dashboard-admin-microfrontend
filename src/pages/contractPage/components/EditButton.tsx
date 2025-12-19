// components/EditButton.tsx
import { Button } from '@mui/material';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { downloadContractToEdit } from '../utils/downloadContract';
import { ENV } from '../../../utils/env';

type Props = {
  contractId: string;
  productId: string;
  fileName: string;
  disabled?: boolean;
  name?: string;
  version?: string;
  products: Array<any>;
};

export const EditButton = ({ contractId, productId, fileName, disabled, name, version, products }: Props) => {
  const addError = useErrorDispatcher();
  const { t } = useTranslation();
  const history = useHistory();

  const handleEdit = async () => {
    const contractHtml = await downloadContractToEdit(contractId, productId, fileName, addError);
    if (contractHtml) {
      console.log(contractHtml);
      history.push(ENV.ROUTES.ADMIN_CONTRACT_EDITOR, {
        products,
        productId,
        name,
        version,
        contractHtml
      });
    }
  };

  return (
    <Button
      size="small"
      startIcon={<EditIcon />}
      onClick={handleEdit}
      disabled={disabled}
    >
      {t('contractPage.edit')}
    </Button>
  );
};
