import { Box, MenuItem, Select, styled } from '@mui/material';
import { DataGrid, GridColDef, GridRow, GridRowProps, GridSortModel } from '@mui/x-data-grid';
import CustomPagination from '@pagopa/selfcare-common-frontend/lib/components/CustomPagination';
import { Page } from '@pagopa/selfcare-common-frontend/lib/model/Page';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import { OnboardingIndexResource } from '../../../../api/generated/party-registry-proxy/OnboardingIndexResource';
import { ENV } from '../../../../utils/env';
import { RenderNoRowsOverlay } from './tableColumns';

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

type Props = {
  readonly rows: ReadonlyArray<OnboardingIndexResource>;
  readonly columns: Array<GridColDef>;
  readonly page: number;
  readonly pageSize: number;
  readonly totalRows: number;
  readonly sortModel: GridSortModel;
  readonly loading: boolean;
  readonly onPageChange: (newPage: number) => void;
  readonly onPageSizeChange: (newSize: number) => void;
  readonly onSortModelChange: (model: GridSortModel) => void;
};

export const OnboardingsTable = ({
  rows,
  columns,
  page,
  pageSize,
  totalRows,
  sortModel,
  loading,
  onPageChange,
  onPageSizeChange,
  onSortModelChange,
}: Props) => {
  const history = useHistory();

  const pageModel: Page = {
    number: page,
    size: pageSize,
    totalElements: totalRows,
    totalPages: Math.ceil(totalRows / pageSize),
  };

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
    <Box
      id="OnboardingsSearchTableBox"
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
        backgroundColor: '#E9EBF1',
      }}
      justifyContent="start"
      p={1}
    >
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
        disableColumnMenu
        onRowClick={handleRowClick}
        components={{
          Row: CustomRow,
          NoRowsOverlay: RenderNoRowsOverlay,
          Pagination: () => (
            <CustomPagination
              page={pageModel}
              onPageRequest={(req) => onPageChange(req.page)}
              variant="text"
              pageSizeControl={
                pageModel.totalElements > 10 && (
                  <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  >
                    {[10, 20, 50, 70].map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                )
              }
            />
          ),
        }}
      />
    </Box>
  );
};
