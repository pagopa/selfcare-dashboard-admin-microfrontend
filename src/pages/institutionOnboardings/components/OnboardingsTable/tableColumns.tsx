import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Chip, Tooltip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { TFunction } from 'i18next';
import { Product } from '../../../../model/Product';

const STATUS_CHIP_CONFIG: Record<
  string,
  { label: string; color: 'success' | 'warning' | 'error' | 'info' | 'default' }
> = {
  ACTIVE: { label: 'Attivo', color: 'success' },
  PENDING: { label: 'In attesa', color: 'warning' },
  TOBEVALIDATED: { label: 'Da validare', color: 'info' },
  REJECTED: { label: 'Rifiutato', color: 'error' },
  SUSPENDED: { label: 'Sospeso', color: 'default' },
};

const truncatedCellSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
} as const;

const renderCellWithTooltip = (params: GridRenderCellParams) => {
  const text = params.formattedValue ?? params.value ?? '';
  return (
    <Tooltip title={text} arrow enterDelay={300}>
      <Box sx={truncatedCellSx}>{text}</Box>
    </Tooltip>
  );
};

const renderStatusCell = (params: GridRenderCellParams<string>) => {
  const value = params.value ?? '';
  const config = STATUS_CHIP_CONFIG[value] ?? { label: value, color: 'default' as const };
  return (
    <Tooltip title={config.label} arrow enterDelay={300}>
      <Chip label={config.label} color={config.color} size="small" />
    </Tooltip>
  );
};

const renderActionCell = () => (
  <ArrowForwardIosIcon fontSize="small" color="primary" sx={{ cursor: 'pointer' }} />
);

export const getOnboardingsColumns = (
  t: TFunction,
  products: Array<Product>
): Array<GridColDef> => [
  {
    field: 'description',
    headerName: t('institutionOnboardings.table.institutionName'),
    flex: 2,
    sortable: true,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'productId',
    headerName: t('institutionOnboardings.table.product'),
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const productId = params.row?.productId;
      const product = products.find((p) => p.id === productId);
      return product?.title ?? productId ?? '';
    },
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'institutionType',
    headerName: t('institutionOnboardings.table.institutionType'),
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const raw = params.row?.institutionType as string | undefined;
      if (!raw) {
        return '';
      }
      const key = `common.institutionType.descriptions.${raw.toLowerCase()}`;
      const translated = t(key);
      return translated !== key ? translated : raw;
    },
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'status',
    headerName: t('institutionOnboardings.table.status'),
    flex: 1,
    sortable: false,
    renderCell: renderStatusCell,
  },
  {
    field: 'actions',
    headerName: '',
    width: 60,
    sortable: false,
    disableColumnMenu: true,
    renderCell: renderActionCell,
  },
];
