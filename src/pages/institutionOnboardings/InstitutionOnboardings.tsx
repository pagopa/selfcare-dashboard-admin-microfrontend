import { Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GridSortModel } from '@mui/x-data-grid';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { OnboardingIndexResource } from '../../api/generated/party-registry-proxy/OnboardingIndexResource';
import { searchOnboardingsService } from '../../services/searchOnboardingsService';
import { FiltersBar } from './components/FiltersBar/FiltersBar';
import { parseFilters } from './components/FiltersBar/filtersUtils';
import { OnboardingsTable } from './components/OnboardingsTable/OnboardingsTable';
import { getOnboardingsColumns } from './components/OnboardingsTable/tableColumns';

const PAGE_SIZE = 10;

const InstitutionOnboardings = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [rows, setRows] = useState<Array<OnboardingIndexResource>>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'description', sort: 'asc' },
  ]);
  const [loading, setLoading] = useState(false);
  const products = [];

  const columns = getOnboardingsColumns(t, products);

  useEffect(() => {
    setPage(0);
  }, [location.search]);

  useEffect(() => {
    const filters = parseFilters(location.search);
    const orderBy = sortModel.length > 0 ? `${sortModel[0].field},${sortModel[0].sort}` : '';

    setLoading(true);
    searchOnboardingsService(
      filters.search,
      filters.productIds,
      filters.institutionTypeIds,
      filters.stateIds,
      page,
      PAGE_SIZE,
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
  }, [location.search, page, sortModel]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
    setPage(0);
  };

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%' }}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('institutionOnboardings.title')}
          subTitle={t('institutionOnboardings.subtitle')}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>
      <Grid item xs={12}>
        <FiltersBar />
      </Grid>
      <Grid item xs={12} mt={3} bgcolor={grey[100]}>
        <OnboardingsTable
          rows={rows}
          columns={columns}
          page={page}
          pageSize={PAGE_SIZE}
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

export default InstitutionOnboardings;
