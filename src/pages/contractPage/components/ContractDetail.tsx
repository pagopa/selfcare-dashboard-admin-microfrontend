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

export const ContractDetail = ({ product, contracts, onToggle, onCreate}: Props) => {
  const { t } = useTranslation();

  return (
    <Accordion
      onChange={onToggle}
      elevation={0}
      disableGutters
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: 1,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <Typography sx={{ flex: 3, fontWeight: 600 }}>{product.title}</Typography>

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
          <ContractTable contracts={contracts} productId={product.id}/>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
