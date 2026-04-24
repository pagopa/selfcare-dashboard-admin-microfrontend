import { Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridSortModel } from '@mui/x-data-grid';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { OnboardingIndexResource } from '../../api/generated/party-registry-proxy/OnboardingIndexResource';
import { Product } from '../../model/Product';
import { searchOnboardingsService } from '../../services/partyRegistryProxyService';
import { fetchProducts } from '../../services/productService';
import { useGlobalPermissions } from '../../hooks/useGlobalPermissions';
import { FiltersBar } from './components/FiltersBar/FiltersBar';
import { parseFilters, serializeFilters } from './components/FiltersBar/filtersUtils';
import { OnboardingsTable } from './components/OnboardingsTable/OnboardingsTable';
import { getOnboardingsColumns } from './components/OnboardingsTable/tableColumns';

const OnboardingsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const addError = useErrorDispatcher();
  const history = useHistory();
  const filters = parseFilters(location.search);

  useGlobalPermissions();

  const [rows, setRows] = useState<Array<OnboardingIndexResource>>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Array<Product>>([]);

  useEffect(() => {
    if (products.length > 0) {
      return;
    }
    fetchProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        addError({
          id: 'fetchProducts-api-error',
          blocking: false,
          techDescription: 'Fetch products failed',
          toNotify: false,
          error: error as Error,
        });
      });
  }, []);

  const columns = getOnboardingsColumns(t, products);

  useEffect(() => {
    setLoading(true);
    searchOnboardingsService(
      filters.search,
      filters.productIds,
      filters.institutionTypeIds,
      filters.stateIds,
      filters.page,
      filters.size
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
    const newFilters = { ...filters, page: 0 };
    history.push({
      pathname: location.pathname,
      search: serializeFilters(newFilters),
    });
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
