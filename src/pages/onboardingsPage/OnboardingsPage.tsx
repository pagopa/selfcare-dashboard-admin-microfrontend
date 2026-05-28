import { Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridSortModel } from '@mui/x-data-grid';
import { TitleBox, usePermissions } from '@pagopa/selfcare-common-frontend';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { OnboardingIndexResource } from '../../api/generated/party-registry-proxy/OnboardingIndexResource';
import { useFetchProducts } from '../../hooks/useFetchProducts';
import { useGlobalPermissions } from '../../hooks/useGlobalPermissions';
import { searchOnboardingsService } from '../../services/partyRegistryProxyService';
import { FiltersBar } from './components/FiltersBar/FiltersBar';
import { parseFilters, serializeFilters } from './components/FiltersBar/filtersUtils';
import { OnboardingsTable } from './components/OnboardingsTable/OnboardingsTable';
import { getOnboardingsColumns } from './components/OnboardingsTable/tableColumns';

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

  const columns = getOnboardingsColumns(t, products, hasBackofficeAdmin);

  useEffect(() => {
    const sortItem = sortModel[0];
    const orderBy = sortItem
      ? `${SORT_FIELD_MAP[sortItem.field] ?? sortItem.field} ${sortItem.sort}`
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
    history.push({
      pathname: location.pathname,
      search: serializeFilters(newFilters),
    });
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    history.push({
      pathname: location.pathname,
      search: serializeFilters(newFilters),
    });
  };

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
    </Grid>
  );
};

export default OnboardingsPage;
