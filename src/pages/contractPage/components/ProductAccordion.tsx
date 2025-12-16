import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import type { Product } from '../../../model/Product';
import { ContractsTable } from './ContractTable';

type Props = {
  product: Product;
  contracts: Array<ContractTemplateResponse>;
  expanded: boolean;
  onToggle: () => void;
};

export const ProductAccordion = ({ product, contracts, expanded, onToggle }: Props) => (
  <Accordion expanded={expanded} onChange={onToggle}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {product.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {contracts.length} contratti
        </Typography>
      </Stack>
    </AccordionSummary>

    <AccordionDetails>
      {contracts.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          Nessun contratto disponibile
        </Typography>
      ) : (
        <ContractsTable contracts={contracts} productId={product.id} />
      )}
    </AccordionDetails>
  </Accordion>
);
