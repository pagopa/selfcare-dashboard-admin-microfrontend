import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../../model/Product';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { ContractTable } from './ContractTable';

type Props = {
  product: Product;
  contracts: Array<ContractTemplateResponse>;
  expanded: boolean;
  onToggle: () => void;
  onCreate: () => void;
  onEdit: (contractTemplateId: string) => void;
};

export const ProductDetail = ({
  product,
  contracts,
  expanded,
  onToggle,
  onCreate,
  onEdit,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Accordion expanded={expanded} onChange={onToggle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {product.title}
          </Typography>

          <Typography variant="body2" color="textSecondary">
            {contracts.length} {t('contractPage.contracts', { count: contracts.length })}
          </Typography>

          <Stack sx={{ flex: 1 }} />

          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onCreate();
            }}
          >
            {t('contractPage.new')}
          </Button>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        {contracts.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            {t('contractPage.noContracts')}
          </Typography>
        ) : (
          <ContractTable contracts={contracts} productId={product.id} onEdit={onEdit} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};
