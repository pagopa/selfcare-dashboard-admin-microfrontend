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
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.name')}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.version')}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.createdAt')}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{t('contractPage.createdBy')}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              {t('contractPage.actions.default')}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {contracts.map((contract, index) => (
            <TableRow key={contract.contractTemplateId || index}>
              <TableCell>{contract.name}</TableCell>

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
                  contractId={contract.contractTemplateId || ''}
                  productId={productId}
                  fileName={`${contract.name}_v${contract.contractTemplateVersion}`}
                  disabled={!contract.contractTemplateId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
