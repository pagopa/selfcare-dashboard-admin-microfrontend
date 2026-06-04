import { Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridSortModel } from '@mui/x-data-grid';
import { TitleBox, usePermissions } from '@pagopa/selfcare-common-frontend';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { OnboardingIndexResource } from '../../api/generated/party-registry-proxy/OnboardingIndexResource';
import BackofficeNotIntegratedModal from '../../components/BackofficeNotIntegratedModal';
import GenericEnvProductModal from '../../components/GenericEnvProductModal';
import SessionModalInteropProduct from '../../components/SessionModalInteropProduct';
import { useFetchProducts } from '../../hooks/useFetchProducts';
import { useGlobalPermissions } from '../../hooks/useGlobalPermissions';
import { searchOnboardingsService } from '../../services/partyRegistryProxyService';
import { useProductNavigation } from '../adminPage/hooks/useProductNavigation';
import { FiltersBar } from './components/FiltersBar/FiltersBar';
import { parseFilters, serializeFilters } from './components/FiltersBar/filtersUtils';
import { OnboardingsTable } from './components/OnboardingsTable/OnboardingsTable';
import { getOnboardingsColumns, ModalState } from './components/OnboardingsTable/columns';

const SORT_FIELD_MAP: Record<string, string> = {
  requestDate: 'createdAt',
};

const OnboardingsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const filters = parseFilters(location.search);

  useGlobalPermissions();
  const { products } = useFetchProducts();

  const [rows, setRows] = useState<Array<OnboardingIndexResource>>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({ type: null, row: null });

  useEffect(() => {
    trackEvent('BACKSTAGE_ONBOARDINGS');
  }, []);

  const { hasPermission } = usePermissions();

  const hasBackofficeAdmin = rows.some(
    (row) =>
      row.status === 'COMPLETED' &&
      (hasPermission(row.productId ?? '', Actions.AccessProductBackofficeAdmin) ||
        hasPermission('ALL', Actions.AccessProductBackofficeAdmin))
  );

  const partyDetail = modalState.row ?? ({} as OnboardingIndexResource);
  const hasMoreThanOneInteropEnv = true;

  const {
    activeProduct,
    interopProduction,
    openInteropModal,
    openGenericEnvModal,
    handleInteropConfirm,
    handleGenericEnvConfirm,
    closeInteropModal,
    closeGenericEnvModal,
  } = useProductNavigation({ products, partyDetail, hasMoreThanOneInteropEnv });

  const columns = getOnboardingsColumns(t, products, hasBackofficeAdmin, setModalState);

  useEffect(() => {
    const orderBy =
      sortModel.length > 0
        ? sortModel.map(
          (item) =>
            `${SORT_FIELD_MAP[item.field] ?? item.field}_${item.sort?.toUpperCase()}`
        )
        : undefined;

    setLoading(true);
    searchOnboardingsService(
      filters.search,
      filters.productIds,
      filters.institutionTypeIds,
      filters.stateIds,
      filters.page,
      filters.size,
      orderBy
    )
      .then((response) => {
        setRows([...(response.onboardings ?? [])]);
        setTotalRows(response.totalElements ?? 0);
      })
      .catch(() => {
        setRows([]);
        setTotalRows(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.search, sortModel]);

  const handlePageSizeChange = (newSize: number) => {
    const newFilters = { ...filters, size: newSize, page: 0 };
    history.push({ pathname: location.pathname, search: serializeFilters(newFilters) });
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    history.push({ pathname: location.pathname, search: serializeFilters(newFilters) });
  };

  const productName =
    products.find((p) => p.id === modalState.row?.productId)?.title ??
    modalState.row?.productId ??
    '';

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%' }} bgcolor={'#F4F5F8'}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('onboardingsPage.title')}
          subTitle={t('onboardingsPage.subtitle')}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>
      <Grid item xs={12}>
        <FiltersBar products={products} />
      </Grid>
      <Grid item xs={12} mt={3} bgcolor={grey[100]}>
        <OnboardingsTable
          rows={rows}
          columns={columns}
          page={filters.page}
          pageSize={filters.size}
          onPageSizeChange={handlePageSizeChange}
          totalRows={totalRows}
          sortModel={sortModel}
          loading={loading}
          onPageChange={handlePageChange}
          onSortModelChange={handleSortModelChange}
        />
      </Grid>

      <BackofficeNotIntegratedModal
        open={modalState.type === 'backoffice'}
        productName={productName}
        onClose={() => setModalState({ type: null, row: null })}
      />
      <SessionModalInteropProduct
        open={openInteropModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.message"
            values={{
              productTitle: activeProduct?.id?.startsWith('prod-interop')
                ? interopProduction?.title
                : activeProduct?.title,
            }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={handleInteropConfirm}
        handleClose={closeInteropModal}
        authorizedInteropProducts={['prod-interop', 'prod-interop-coll', 'prod-interop-atst']}
        products={products}
        party={modalState.row}
      />
      <GenericEnvProductModal
        open={openGenericEnvModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.message"
            values={{ productTitle: activeProduct?.title }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={(e) => handleGenericEnvConfirm((e.target as HTMLInputElement).value)}
        handleClose={closeGenericEnvModal}
        productEnvironments={activeProduct?.backOfficeEnvironmentConfigurations as any}
      />
    </Grid>
  );
};

export default OnboardingsPage;