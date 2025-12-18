import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../../model/Product';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { ContractTable } from './ContractTable';

type Props = {
  product: Product;
  contracts: Array<ContractTemplateResponse>;
  expanded: boolean;
  onEdit: (contractTemplateId: string) => void;
};

export const ContractDetail = ({ product, contracts }: Props) => {
  const { t } = useTranslation();

  return (
    <Accordion
      elevation={0}
      disableGutters
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: 1,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="column" sx={{ width: '100%' }}>
          <Typography variant="caption" color="textSecondary">
            {t('contractPage.product')}
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>{product.title}</Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        {contracts.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            {t('contractPage.noContracts')}
          </Typography>
        ) : (
          <ContractTable contracts={contracts} productId={product.id} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};
