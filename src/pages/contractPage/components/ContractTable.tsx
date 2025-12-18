import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { DownloadButton } from './DownloadButton';

type Props = {
  contracts: Array<ContractTemplateResponse>;
  productId: string;
};

export const ContractTable = ({ contracts, productId }: Props) => {
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.table.name')}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.table.version')}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.table.createdAt')}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.table.createdBy')}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              {t('contractPage.table.actions')}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Nessun contratto disponibile
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => (
              <TableRow key={contract.contractTemplateId}>
                <TableCell>{contract.description}</TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {contract.contractTemplateVersion}
                  </Typography>
                </TableCell>

                <TableCell>
                  {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : '-'}
                </TableCell>

                <TableCell>{contract.createdBy || '-'}</TableCell>

                <TableCell align="center">
                  <DownloadButton
                    contractId={contract.contractTemplateId ?? ''}
                    productId={productId}
                    fileName={`${contract.name}_v${contract.contractTemplateVersion}`}
                    disabled={!contract.contractTemplateId}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
