import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../utils/test-utils';

const invokeProductBoMock = vi.fn();

vi.mock('../../../hooks/useTokenExchange', () => ({
  useTokenExchange: () => ({ invokeProductBo: invokeProductBoMock }),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/locale/locale-utils', () => ({
  default: { language: 'it' },
}));

import { useProductNavigation } from '../useProductNavigation';

const TestComponent = ({ products, partyDetail, hasMore }: any) => {
  const {
    openInteropModal,
    openGenericEnvModal,
    handleOnboardedProductClick,
    activeProduct,
    interopProduction,
    handleInteropConfirm,
    handleGenericEnvConfirm,
  } = useProductNavigation({ products, partyDetail, hasMoreThanOneInteropEnv: hasMore });

  return (
    <div>
      <div data-testid="interop">{String(openInteropModal)}</div>
      <div data-testid="generic">{String(openGenericEnvModal)}</div>
      <div data-testid="active">{activeProduct?.id || ''}</div>
      <div data-testid="interopProd">{interopProduction?.id || ''}</div>
      <button
        onClick={() =>
          handleOnboardedProductClick(products[0])
        }
      >
        click
      </button>
      <button onClick={() => handleInteropConfirm()}>confirm-interop</button>
      <button onClick={() => handleGenericEnvConfirm('env1')}>confirm-generic</button>
    </div>
  );
};

describe('useProductNavigation', () => {
  beforeEach(() => {
    invokeProductBoMock.mockClear();
  });

  it('opens interop modal when product is interop and multiple envs', async () => {
    const products = [{ id: 'prod-interop' }];
    await renderWithProviders(<TestComponent products={products} partyDetail={{}} hasMore={true} />);
    fireEvent.click(screen.getByText('click'));
    expect(screen.getByTestId('interop').textContent).toBe('true');
    expect(invokeProductBoMock).not.toHaveBeenCalled();
  });

  it('opens generic env modal when product has backOfficeEnvironmentConfigurations', async () => {
    const products = [{ id: 'prod-x', backOfficeEnvironmentConfigurations: [{ environment: 'env1' }] }];
    await renderWithProviders(<TestComponent products={products} partyDetail={{}} hasMore={false} />);
    fireEvent.click(screen.getByText('click'));
    expect(screen.getByTestId('generic').textContent).toBe('true');
    expect(invokeProductBoMock).not.toHaveBeenCalled();
  });
});
