import { ArrowForward } from '@mui/icons-material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { GridOverlay, GridRenderCellParams } from '@mui/x-data-grid';
import { ButtonNaked } from '@pagopa/mui-italia';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions, isProductAllowed } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { OnboardingIndexResource } from '../../../../../api/generated/party-registry-proxy/OnboardingIndexResource';
import BackofficeNotIntegratedModal from '../../../../../components/BackofficeNotIntegratedModal';
import GenericEnvProductModal from '../../../../../components/GenericEnvProductModal';
import SessionModalInteropProduct from '../../../../../components/SessionModalInteropProduct';
import { Product } from '../../../../../model/Product';
import { STATUSES_ALLOWED_TO_SEE_REQUESTS } from '../../../../../utils/constants';
import { ENV } from '../../../../../utils/env';
import { useProductNavigation } from '../../../../adminPage/hooks/useProductNavigation';
import { STATUS_CHIP_CONFIG } from './statusConfig';
import { ModalState } from '.';

const truncatedCellSx = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    pl: 1,
} as const;

export const renderCellWithTooltip = (params: GridRenderCellParams) => {
    const text = params.formattedValue ?? params.value ?? '';
    return (
        <Tooltip title={text} arrow enterDelay={300}>
            <Box sx={truncatedCellSx}>{text}</Box>
        </Tooltip>
    );
};

export const renderUpdatedAtCell = (params: GridRenderCellParams<Date>) => {
    const date = params.value;
    const text = date ? date.toLocaleDateString() : '-';
    return (
        <Tooltip title={text} arrow enterDelay={300}>
            <Box sx={truncatedCellSx}>{text}</Box>
        </Tooltip>
    );
};

export const renderStatusCell = (params: GridRenderCellParams<string>) => {
    const value = params.value ?? '';
    const config = STATUS_CHIP_CONFIG[value] ?? {
        label: value,
        tooltipText: '',
        color: 'default' as const,
    };
    return (
        <Tooltip title={config.tooltipText} arrow enterDelay={300}>
            <Chip label={config.label} color={config.color} size="small" sx={{ ml: 1 }} />
        </Tooltip>
    );
};

export const renderHeaderWithTooltip = (params: any) => (
    <Tooltip title={params.colDef.description || params.colDef.headerName} arrow enterDelay={300}>
        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
            {params.colDef.headerName}
        </Box>
    </Tooltip>
);

export const DescriptionCell = ({ params }: { params: GridRenderCellParams<OnboardingIndexResource> }) => {
    const history = useHistory();
    const text = params.row?.description ?? '';
    const isClickable = params.row?.status === 'COMPLETED';

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
                                partyId: params.row.institutionId,
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

export const ActionCell = ({
  params,
  products,
  onOpenModal,
}: {
  params: GridRenderCellParams<OnboardingIndexResource>;
  products: Array<Product>;
  onOpenModal: (state: ModalState) => void;
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { hasPermission } = usePermissions();
  const partyDetail = params.row;

  const productId = params.row?.productId || '';
  const status = params.row?.status;

  const canAccessBackofficeAdmin =
    hasPermission(productId, Actions.AccessProductBackofficeAdmin) ||
    hasPermission('ALL', Actions.AccessProductBackofficeAdmin);

  const canAccessAccountPage =
    hasPermission(productId, Actions.ViewAccountPage) ||
    (hasPermission('ALL', Actions.ViewAccountPage) &&
      STATUSES_ALLOWED_TO_SEE_REQUESTS.includes(status));

  return (
    <>
      {status === 'COMPLETED' && canAccessBackofficeAdmin && (
        <ButtonNaked
          component="button"
          endIcon={<ArrowForward />}
          onClick={() => {
            trackEvent('BACKSTAGE_BACK_OFFICE_CLICK', { product_id: productId });
            if (isProductAllowed(productId)) {
              const productFromConfiguration = products.find((p) => p.id === productId);
              if (productFromConfiguration) {
                onOpenModal({ type: 'product', row: partyDetail });
              }
            } else {
              onOpenModal({ type: 'backoffice', row: partyDetail });
            }
          }}
          sx={{ color: 'primary.main', fontWeight: 'bold', mr: 2 }}
        >
          {t('adminPage.selectedPartyDetails.backOffice')}
        </ButtonNaked>
      )}
      {!canAccessBackofficeAdmin && canAccessAccountPage && (
        <ButtonNaked
          component="button"
          endIcon={<ArrowForward />}
          onClick={() => {
            history.push(
              resolvePathVariables(ENV.ROUTES.ADMIN_REQUEST_DETAIL, {
                tokenId: params.row.onboardingId,
              }),
              { fromDashboard: true }
            );
          }}
          sx={{ color: 'primary.main', fontWeight: 'bold', mr: 2 }}
        />
      )}
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