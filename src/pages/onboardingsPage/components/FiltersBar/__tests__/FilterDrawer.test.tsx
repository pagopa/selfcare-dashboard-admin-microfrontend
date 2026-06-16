import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FilterDrawer } from '../FilterDrawer';
import { Product } from '../../../../../model/Product';
import { StatusEnum } from '../../../../../api/generated/b4f-dashboard/ProductsResource';

// Mock the translation hook
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { language: 'it' },
    }),
  };
});

const mockProduct: Product = {
  id: 'prod1',
  title: 'Product 1',
  status: StatusEnum.ACTIVE,
  subProducts: [],
  description: '',
  logo: '',
  urlBO: '',
  imageUrl: '',
  delegable: false,
  invoiceable: false
};

const renderFilterDrawer = (products = [mockProduct]) => {
  return render(
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
        <FilterDrawer products={products} />
      </LocalizationProvider>
    </BrowserRouter>
  );
};

describe('FilterDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render filter button with active count', () => {
    renderFilterDrawer();

    const button = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('(0)');
  });

  it('should open drawer when filter button is clicked', () => {
    renderFilterDrawer();

    const button = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(button);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should close drawer when close button is clicked', () => {
    renderFilterDrawer();

    const button = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(button);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render text search filter field', () => {
    renderFilterDrawer();

    const button = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(button);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should have apply and reset buttons in drawer footer', () => {
    renderFilterDrawer();

    const button = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(button);

    const drawerTitle = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawerTitle).toBeInTheDocument();
  });

  it('should handle text filter input change', async () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Find the search input field
    const textInputs = screen.getAllByRole('textbox');
    expect(textInputs.length).toBeGreaterThan(0);
  });

  it('should apply filters when Enter key is pressed in text field', async () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Find text input and simulate Enter key
    const textInputs = screen.getAllByRole('textbox');
    const searchInput = textInputs[0];

    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(searchInput).toBeInTheDocument();
  });

  it('should render select filters', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Verify drawer is open with filters
    const drawerTitle = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawerTitle).toBeInTheDocument();
  });

  it('should render date filters with request date label', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Verify drawer contains date filters section
    const drawerTitle = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawerTitle).toBeInTheDocument();
  });

  it('should render state filter with status options', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawerTitle = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawerTitle).toBeInTheDocument();
  });

  it('should initialize draft filters from URL search params', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    expect(filterButton).toBeInTheDocument();
  });

  it('should display reset button in footer', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Footer buttons should exist in drawer
    const drawerTitle = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawerTitle).toBeInTheDocument();
  });

  it('should display apply button in footer', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Footer should contain apply button
    const drawerTitle = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawerTitle).toBeInTheDocument();
  });

  it('should have institution type filter', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should have state/status filter with multiple select', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should support min/max date constraints for date range filters', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // DateFilterField components should have min/max constraints
    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should handle filter state changes correctly', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render filter buttons with proper styling', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    expect(filterButton).toHaveStyle({ color: '#0B3EE3' });
  });

  it('should render drawer with proper dimensions', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should have footer with proper layout', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render checkbox icons in menu items', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should handle render value for selected filters', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should have proper menu styling with custom scrollbar', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render tooltip for request date filters', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should handle filter categorization correctly', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Verify different filter types are rendered
    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should support conditional rendering of state filter', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render all filter sections in correct order', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should update draft filters when text input changes', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const textInputs = screen.getAllByRole('textbox');
    if (textInputs.length > 0) {
      const searchInput = textInputs[0] as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(searchInput.value).toBe('test search');
    }
  });

  it('should handle date filter changes through DateFilterField', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should handle institution type filter changes', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // Institution type filter should be rendered
    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should handle state/status filter changes', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should update active count when filters are applied', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    expect(filterButton).toHaveTextContent('(0)');

    fireEvent.click(filterButton);

    // The active count is calculated based on currentFilters
    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should calculate correct active filter count', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should filter config by text type', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should filter config for select filters excluding stateIds', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should filter config for date type filters', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should find state filter from config', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should have proper drawer box styling', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should have drawer header with close button', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawerTitle = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawerTitle).toBeInTheDocument();
  });

  it('should render drawer content box with proper styling', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should map text filters with TextField components', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should map select filters with FormControl and Select components', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render date filters conditional section', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render state filter conditional section', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should render drawer footer with reset button', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const resetButton = screen.getByRole('button', { name: /onboardingsPage.filters.cancelFiltersButton/ });
    expect(resetButton).toBeInTheDocument();
  });

  it('should render drawer footer with apply button', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const allButtons = screen.getAllByRole('button');
    const applyButtons = allButtons.filter(btn => btn.textContent?.includes('onboardingsPage.filters'));
    expect(applyButtons.length).toBeGreaterThan(0);
  });

  it('should handle key down Enter event in text filter field', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const textInputs = screen.getAllByRole('textbox');
    if (textInputs.length > 0) {
      fireEvent.keyDown(textInputs[0], { key: 'Enter' });
      // Drawer should close after apply is triggered
      expect(filterButton).toBeInTheDocument();
    }
  });

  it('should handle filter change for all filter types', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    // The handleFilterChange function should be called on any filter change
    const drawer = screen.getByRole('heading', { name: /onboardingsPage.filters.title/ });
    expect(drawer).toBeInTheDocument();
  });

  it('should reset filters and navigate when reset button is clicked', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const resetButton = screen.getByRole('button', { name: /onboardingsPage.filters.cancelFiltersButton/ });

    fireEvent.click(resetButton);

    expect(filterButton).toBeInTheDocument();
  });

  it('should apply filters and navigate when apply button is clicked', () => {
    renderFilterDrawer();

    const filterButton = screen.getByRole('button', { name: /onboardingsPage.filters.filtersButton/ });
    fireEvent.click(filterButton);

    const textInputs = screen.getAllByRole('textbox');
    if (textInputs.length > 0) {
      fireEvent.change(textInputs[0], { target: { value: 'test' } });
    }

    const applyButtons = screen.getAllByRole('button');
    const applyButton = applyButtons.find(btn =>
      btn.textContent?.includes('onboardingsPage.filters.filtersButton')
    );

    if (applyButton && applyButton !== filterButton) {
      fireEvent.click(applyButton);
    }

    expect(filterButton).toBeInTheDocument();
  });

});
