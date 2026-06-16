import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/constants', () => ({
    PRODUCT_IDS: { IO: 'prod-io', IO_PREMIUM: 'prod-io-premium' },
}));

import { useProductFiltering } from '../useProductFiltering';

const TestComponent = ({ partyDetail, products }: any) => {
    const { productsToShow, interopProductsList, hasMoreThanOneInteropEnv, getProductTitle } =
        useProductFiltering({ partyDetail, products });

    return (
        <div data-testid="out">
            <div data-testid="productsToShow">{JSON.stringify(productsToShow?.map((p) => p.productId))}</div>
            <div data-testid="interop">{JSON.stringify(interopProductsList.map((p) => p.productId))}</div>
            <div data-testid="hasMore">{JSON.stringify(hasMoreThanOneInteropEnv)}</div>
            <div data-testid="title">{productsToShow ? getProductTitle(productsToShow[0], products[0]) : ''}</div>
        </div>
    );
};

describe('useProductFiltering', () => {
    it('filters and titles products correctly', () => {
        const products = [
            { id: 'prod-io', title: 'IO' },
            { id: 'prod-io-premium', title: 'IO Premium' },
            { id: 'prod-other', title: 'Other' },
        ];

        const partyDetail = {
            products: [
                { productId: 'prod-io', productOnBoardingStatus: 'ACTIVE' },
                { productId: 'prod-io-premium', productOnBoardingStatus: 'ACTIVE' },
                { productId: 'prod-other', productOnBoardingStatus: 'ACTIVE' },
            ],
        };

        render(<TestComponent partyDetail={partyDetail} products={products} />);

        expect(screen.getByTestId('productsToShow').textContent).toContain('prod-io');
        expect(screen.getByTestId('productsToShow').textContent).toContain('prod-other');
        expect(screen.getByTestId('interop').textContent).toBe('[]');
        expect(screen.getByTestId('hasMore').textContent).toBe('false');
        expect(screen.getByTestId('title').textContent).toBe('IO Premium');
    });
});
