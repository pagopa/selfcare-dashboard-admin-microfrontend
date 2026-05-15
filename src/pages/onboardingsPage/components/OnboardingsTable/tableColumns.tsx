import { ArrowForward } from '@mui/icons-material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { GridColDef, GridOverlay, GridRenderCellParams } from '@mui/x-data-grid';
import { ButtonNaked } from '@pagopa/mui-italia';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions, isProductAllowed } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { TFunction } from 'i18next';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { OnboardingIndexResource } from '../../../../api/generated/party-registry-proxy/OnboardingIndexResource';
import BackofficeNotIntegratedModal from '../../../../components/BackofficeNotIntegratedModal';
import { useTokenExchange } from '../../../../hooks/useTokenExchange';
import { Product } from '../../../../model/Product';
import { ENV } from '../../../../utils/env';

const STATUS_CHIP_CONFIG: Record<
  string,
  {
    label: string;
    tooltipText: string;
    color: 'success' | 'warning' | 'error' | 'info' | 'default';
  }
> = {
  TOBEVALIDATED: {
    label: 'Da validare',
    tooltipText: 'Richiesta di adesione in attesa di approvazione da parte di un utente PagoPA.',
    color: 'default',
  },
  PENDING: {
    label: 'In attesa',
    tooltipText:
      "L'ente deve caricare il contratto firmato per completare la richiesta di adesione.",
    color: 'warning',
  },
  COMPLETED: {
    label: 'Attivo',
    tooltipText: "L'ente è aderente al prodotto. La richiesta è stata completata con successo.",
    color: 'success',
  },
  REJECTED: {
    label: 'Rifiutato',
    tooltipText: 'Richiesta di adesione rifiutata da un utente PagoPA dopo le verifiche.',
    color: 'error',
  },
  DELETED: {
    label: 'Disattivo',
    tooltipText: "L'ente non risulta più aderente al prodotto.",
    color: 'error',
  },
  FAILED: {
    label: 'In errore',
    tooltipText: 'La richiesta di adesione non è andata a buon fine a causa di un errore tecnico.',
    color: 'error',
  },
};

const truncatedCellSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  pl: 2,
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
  const config = STATUS_CHIP_CONFIG[value] ?? {
    label: value,
    tooltipText: '',
    color: 'default' as const,
  };
  return (
    <Tooltip title={config.tooltipText} arrow enterDelay={300}>
      <Chip label={config.label} color={config.color} size="small" />
    </Tooltip>
  );
};

const DescriptionCell = ({ params }: { params: GridRenderCellParams<OnboardingIndexResource> }) => {
  const history = useHistory();
  const text = params.row?.description ?? '';
  const isClickable = params.row?.status === 'COMPLETED' || params.row?.status === 'DELETED';

  if (!isClickable) {
    return (
      <Tooltip title={text} arrow enterDelay={300}>
        <Box sx={truncatedCellSx}>{text}</Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={text} arrow enterDelay={300}>
      <Box sx={truncatedCellSx}>
        <ButtonNaked
          color="primary"
          component="button"
          sx={{
            fontWeight: 700,
            fontSize: '16px',
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            display: 'block',
          }}
          onClick={() => {
            history.push(
              resolvePathVariables(ENV.ROUTES.ADMIN_ONBOARDINGS_DETAIL, {
                tokenId: params.row.institutionId,
              })
            );
          }}
        >
          {text}
        </ButtonNaked>
      </Box>
    </Tooltip>
  );
};

const ActionCell = ({
  params,
  products,
}: {
  params: GridRenderCellParams<OnboardingIndexResource>;
  products: Array<Product>;
}) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { invokeProductBo } = useTokenExchange();
  const [openModal, setOpenModal] = useState(false);

  const productId = params.row?.productId || '';
  const status = params.row?.status;

  if (
    status !== 'COMPLETED' ||
    !(
      hasPermission(productId, Actions.AccessProductBackofficeAdmin) ||
      hasPermission('ALL', Actions.AccessProductBackofficeAdmin)
    )
  ) {
    return null;
  }

  const productName = products.find((p) => p.id === productId)?.title || productId;

  return (
    <>
      <ButtonNaked
        component="button"
        endIcon={<ArrowForward />}
        onClick={() => {
          trackEvent('BACKSTAGE_BACK_OFFICE_CLICK', {
            product_id: productId,
          });
          if (isProductAllowed(productId)) {
            const selectedParty = params.row;
            const productFromConfiguration = products.find((p) => p.id === productId);
            if (productFromConfiguration) {
              void invokeProductBo(productFromConfiguration, selectedParty);
            }
          } else {
            setOpenModal(true);
          }
        }}
        sx={{ color: 'primary.main', fontWeight: 'bold' }}
      >
        {t('adminPage.selectedPartyDetails.backOffice')}
      </ButtonNaked>
      <BackofficeNotIntegratedModal
        open={openModal}
        productName={productName}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export const RenderNoRowsOverlay = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const handleReset = () => {
    history.push({
      pathname: location.pathname,
      search: '',
    });
  };

  return (
    <GridOverlay sx={{ pointerEvents: 'auto' }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        sx={{ height: '100%', width: '100%', pointerEvents: 'auto' }}
      >
        <SentimentDissatisfiedIcon />
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Trans i18nKey="onboardingsPage.table.noResults">
            I filtri che hai applicato non hanno dato nessun risultato.
          </Trans>
        </Typography>
        <ButtonNaked
          size="small"
          onClick={handleReset}
          sx={{ ml: 1, color: '#0B3EE3', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          {t('onboardingsPage.filters.resetButton')}
        </ButtonNaked>
      </Stack>
    </GridOverlay>
  );
};

export const getOnboardingsColumns = (
  t: TFunction,
  products: Array<Product>
): Array<GridColDef<OnboardingIndexResource>> => [
  {
    field: 'description',
    headerName: t('onboardingsPage.table.institutionName'),
    flex: 2,
    sortable: false,
    valueGetter: (params) => {
      const description = params.row?.description;
      const parentDescription = params.row?.parentDescription;
      return description && parentDescription
        ? `${description} - ${parentDescription}`
        : description || '';
    },
    renderCell: (params) => <DescriptionCell params={params} />,
  },
  {
    field: 'productId',
    headerName: t('onboardingsPage.table.product'),
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const productId = params.row?.productId;

      const subProduct = products
        .flatMap((p) => p.subProducts ?? [])
        .find((sp) => sp.id === productId);

      const product = products.find((p) => p.id === productId);

      return subProduct?.title ?? product?.title ?? productId ?? '';
    },
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'institutionType',
    headerName: t('onboardingsPage.table.institutionType'),
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const raw = params.row?.institutionType as string | undefined;
      if (!raw) {
        return '';
      }
      const key = `common.institutionType.descriptions.${raw.toLowerCase()}`;
      const translated = t(key);
      return translated === key ? raw : translated;
    },
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'status',
    headerName: t('onboardingsPage.table.status'),
    flex: 1,
    sortable: false,
    renderCell: renderStatusCell,
  },
  {
    field: 'actions',
    headerName: '',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => <ActionCell params={params} products={products} />,
  },
];
