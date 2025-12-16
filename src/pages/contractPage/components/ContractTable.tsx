import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { DownloadButton } from './DownloadButton';

type Props = {
  contracts: Array<ContractTemplateResponse>;
  productId: string;
};

export const ContractsTable = ({ contracts, productId }: Props) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Versione</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Data creazione</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Creato da</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>
            Azioni
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {contracts.map((contract, index) => (
          <TableRow key={contract.contractTemplateId || index}>
            <TableCell>{contract.name}</TableCell>
            <TableCell>
              <Typography sx={{ fontFamily: 'monospace' }}>
                {contract.contractTemplateVersion}
              </Typography>
            </TableCell>
            <TableCell>
              {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : '-'}
            </TableCell>
            <TableCell>{contract.createdBy || '-'}</TableCell>
            <TableCell align="right">
              {contract.contractTemplateId && (
                <DownloadButton
                  contractId={contract.contractTemplateId}
                  productId={productId}
                  fileName={`${contract.name}_v${contract.contractTemplateVersion}`}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
