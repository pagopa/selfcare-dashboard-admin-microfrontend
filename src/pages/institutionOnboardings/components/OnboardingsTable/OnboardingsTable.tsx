import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef, GridRow, GridRowProps, GridSortModel } from '@mui/x-data-grid';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { OnboardingIndexResource } from '../../../../api/generated/party-registry-proxy/OnboardingIndexResource';
import { ENV } from '../../../../utils/env';

type Props = {
  readonly rows: ReadonlyArray<OnboardingIndexResource>;
  readonly columns: Array<GridColDef>;
  readonly page: number;
  readonly pageSize: number;
  readonly totalRows: number;
  readonly sortModel: GridSortModel;
  readonly loading: boolean;
  readonly onPageChange: (newPage: number) => void;
  readonly onSortModelChange: (model: GridSortModel) => void;
};

const CustomRow = (props: GridRowProps) => <GridRow {...props} style={{ cursor: 'pointer' }} />;

const CustomDataGrid = styled(DataGrid)({
  border: 'none !important',
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
    { outline: 'none' },
  '&.MuiDataGrid-root .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
    lineHeight: '25px !important',
  },
  '&.MuiDataGrid-columnHeaders': { borderBottom: 'none !important' },
  '.justifyContentBold': {
    fontSize: '16px',
    fontWeight: '600',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.MuiDataGrid-virtualScroller': {
    backgroundColor: '#F2F2F2',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '.MuiDataGrid-columnSeparator': { display: 'none' },
  '.MuiDataGrid-cell ': { padding: '0px', borderBottom: 'none' },
  '.MuiDataGrid-columnHeaders': { borderBottom: 'none' },
  '.MuiDataGrid-row': {
    backgroundColor: 'white',
    '&.Mui-selected': {
      backgroundColor: '#ebf4fd',
      '&:hover': { backgroundColor: 'transparent' },
    },
    '&:hover': {
      backgroundColor: '#f6f7f8',
    },
  },
  '.MuiDataGrid-row:first-of-type': { borderRadius: '4px 4px 0 0' },
  '.MuiDataGrid-row:last-child': { borderRadius: '0 0 4px 4px' },
  '.MuiDataGrid-row:first-of-type:last-child': {
    borderRadius: '4px',
  },
  '.justifyContentNormal': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.justifyContentNormalRight': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
      justifyContent: 'right',
    },
  },
  '& .MuiDataGrid-virtualScrollerRenderZone': {
    width: '100% !important',
  },
});

export const OnboardingsTable = ({
  rows,
  columns,
  page,
  pageSize,
  totalRows,
  sortModel,
  loading,
  onPageChange,
  onSortModelChange,
}: Props) => {
  const history = useHistory();

  const handleRowClick = (params: { row: OnboardingIndexResource }) => {
    const { onboardingId } = params.row;
    if (onboardingId) {
      history.push(
        resolvePathVariables(ENV.ROUTES.ADMIN_PARTY_DETAIL, {
          tokenId: onboardingId,
        })
      );
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <CustomDataGrid
        autoHeight
        rows={rows as Array<OnboardingIndexResource>}
        columns={columns}
        getRowId={(row) => row.onboardingId}
        paginationMode="server"
        sortingMode="server"
        page={page}
        pageSize={pageSize}
        rowCount={totalRows}
        sortModel={sortModel}
        loading={loading}
        onPageChange={onPageChange}
        onSortModelChange={onSortModelChange}
        rowsPerPageOptions={[pageSize]}
        disableSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        onRowClick={handleRowClick}
        components={{
          Row: CustomRow,
        }}
      />
    </Box>
  );
};
