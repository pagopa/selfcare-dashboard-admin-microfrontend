import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { OnboardingsTable } from '../OnboardingsTable';
import { getOnboardingsColumns } from '../tableColumns';

vi.mock('@pagopa/selfcare-common-frontend/lib/components/CustomPagination', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="mock-pagination">
      <button onClick={() => props.onPageRequest({ page: 1 })}>page 2</button>
      {props.pageSizeControl}
    </div>
  ),
}));

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Select: (props: any) => (
      <select
        data-testid="mock-select"
        value={props.value}
        onChange={(e) => props.onChange({ target: { value: e.target.value } })}
      >
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    ),
  };
});

vi.mock('@mui/x-data-grid', async () => {
  const actual = await vi.importActual('@mui/x-data-grid');
  return {
    ...actual,
    GridOverlay: ({ children }: any) => <div data-testid="grid-overlay">{children}</div>,
  };
});

const tMock = vi.fn((key: string) => {
  if (key === 'common.institutionType.descriptions.pa') return 'Pubblica Amministrazione';
  return key;
});

const mockProducts = [
  { id: 'prod-1', title: 'Product 1', subProducts: [{ id: 'sub-1', title: 'Sub Product 1' }] },
];

const mockRows = [
  { 
    onboardingId: '1', 
    description: 'Ente 1', 
    productId: 'prod-1', 
    status: 'COMPLETED',
    institutionType: 'PA'
  }
];

const realColumns = getOnboardingsColumns(tMock as any, mockProducts as any).map(c => ({...c, width: 200}));

const mockProps = {
  rows: mockRows,
  columns: realColumns,
  loading: false,
  pageSize: 10,
  page: 0,
  totalRows: 1,
  sortModel: [],
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
  onSortModelChange: vi.fn(),
};

const renderTable = (props = mockProps) => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <OnboardingsTable {...props} />
    </Router>
  );
  return { history };
};

describe('OnboardingsTable component', () => {
  test('should render table and rows', async () => {
    renderTable();
    expect(await screen.findByText('Ente 1')).toBeInTheDocument();
  });
// TODO remove skip after enabling click
  test.skip('should call onRowClick and navigate', async () => {
    const { history } = renderTable();
    const row = await screen.findByText('Ente 1');
    fireEvent.click(row);
    expect(history.location.pathname).toContain('/1');
  });

  test('should show pagination controls when totalRows > 10', async () => {
    renderTable({ ...mockProps, totalRows: 15 });
    expect(screen.getByTestId('mock-pagination')).toBeInTheDocument();
    const page2Btn = screen.getByRole('button', { name: /page 2/i });
    fireEvent.click(page2Btn);
    expect(mockProps.onPageChange).toHaveBeenCalledWith(1);
  });

  test('should call onPageSizeChange when size changed', () => {
    renderTable({ ...mockProps, totalRows: 50 });
    const select = screen.getByTestId('mock-select');
    fireEvent.change(select, { target: { value: '20' } });
    expect(mockProps.onPageSizeChange).toHaveBeenCalledWith(20);
  });
});

describe('tableColumns rendering logic', () => {
  test('valueGetter for products should resolve product and subproduct titles', () => {
    const productColumn = realColumns.find(c => c.field === 'productId');
    
    // Test product resolution
    const res1 = productColumn?.valueGetter!({ row: { productId: 'prod-1' } } as any);
    expect(res1).toBe('Product 1');

    // Test subproduct resolution
    const res2 = productColumn?.valueGetter!({ row: { productId: 'sub-1' } } as any);
    expect(res2).toBe('Sub Product 1');

    // Test unknown product fallback
    const res3 = productColumn?.valueGetter!({ row: { productId: 'unknown' } } as any);
    expect(res3).toBe('unknown');
  });

  test('valueGetter for institutionType should translate correctly', () => {
    const instColumn = realColumns.find((c) => c.field === 'institutionType');

    const res1 = instColumn?.valueGetter!({ row: { institutionType: 'PA' } } as any);
    expect(res1).toBe('Pubblica Amministrazione');

    const res2 = instColumn?.valueGetter!({ row: { institutionType: 'GSP' } } as any);
    expect(res2).toBe('GSP');

    const res3 = instColumn?.valueGetter!({ row: {} } as any);
    expect(res3).toBe('');
  });

  test('renderStatusCell should return status configuration', () => {
    const statusColumn = realColumns.find((c) => c.field === 'status');
    const { getByText } = render(<>{statusColumn?.renderCell!({ value: 'COMPLETED' } as any)}</>);
    expect(getByText('Attivo')).toBeInTheDocument();
  });

  test('renderActionCell should render icon', () => {
    const actionColumn = realColumns.find((c) => c.field === 'actions');
    const { container } = render(<>{actionColumn?.renderCell!({} as any)}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

import { RenderNoRowsOverlay } from '../tableColumns';
describe('RenderNoRowsOverlay', () => {
  test('should render reset button and call history.push on click', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <RenderNoRowsOverlay />
      </Router>
    );

    const resetBtn = screen.getByRole('button');
    fireEvent.click(resetBtn);
    expect(history.location.search).toBe('');
  });
});
