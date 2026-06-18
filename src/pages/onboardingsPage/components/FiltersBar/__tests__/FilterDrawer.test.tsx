import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import { FilterDrawer } from '../FilterDrawer';

// Increased timeout for stability
vi.setConfig({ testTimeout: 20000 });

const mockProducts = [
  { id: 'prod-1', title: 'App IO', status: 'ACTIVE' },
  { id: 'prod-2', title: 'PagoPA', status: 'ACTIVE' },
];

describe('FilterDrawer component', () => {
  test('should open drawer, select items, show chip and +N overflow indicator, and support deleting chip', async () => {
    // Render the FilterDrawer component
    const { history } = await renderWithProviders(<FilterDrawer products={mockProducts as any} />);

    // Drawer should start closed. Let's click on the filters button to open it.
    const filterBtn = screen.getByRole('button', { name: /Filtra/i });
    fireEvent.click(filterBtn);

    // Verify Drawer content is rendered
    const productsLabel = screen.getByLabelText(/Prodotto/i);
    expect(productsLabel).toBeInTheDocument();

    // Open Products dropdown
    const selectTrigger = productsLabel.parentElement?.querySelector('[role="button"]') || productsLabel;
    fireEvent.mouseDown(selectTrigger);

    // Find and click mock items in the dropdown
    const firstOption = await screen.findByText('App IO');
    fireEvent.click(firstOption);

    const secondOption = await screen.findByText('PagoPA');
    fireEvent.click(secondOption);

    // The first selected option should be rendered as a Chip
    const firstChip = await screen.findByRole('button', { name: /App IO/i });
    expect(firstChip).toBeInTheDocument();

    // The overflow count (+1) should be visible near it
    const badge = screen.getByText('+1');
    expect(badge).toBeInTheDocument();

    // Now test chip deletion: click the delete icon on the chip
    // In MUI, the Chip component renders a delete icon button/SVG. Since onDelete is provided, it's clickable
    // We can select the delete icon by class, or simulate a click on the delete button of the Chip
    const deleteIcon = firstChip.querySelector('.MuiChip-deleteIcon');
    expect(deleteIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon!);

    // After deleting the first option chip, "App IO" should be removed.
    // The second option "PagoPA" should now be the new first option chip.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /App IO/i })).not.toBeInTheDocument();
      const secondChip = screen.queryByRole('button', { name: /PagoPA/i });
      expect(secondChip).toBeInTheDocument();
    });
  });
});
