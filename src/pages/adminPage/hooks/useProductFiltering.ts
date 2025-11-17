import { PRODUCT_IDS } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useMemo } from 'react';
import { Party, OnboardedProduct } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { SubProductResource } from '../../../api/generated/b4f-dashboard/SubProductResource';

interface UseProductFilteringParams {
  partyDetail: Party | null;
  products: Array<Product>;
}

interface UseProductFilteringReturn {
  productsToShow: Array<OnboardedProduct> | undefined;
  interopProductsList: Array<OnboardedProduct>;
  hasMoreThanOneInteropEnv: boolean;
  getProductTitle: (product: OnboardedProduct, productFromConfig: Product) => string;
  getActiveSubProduct: (productId: string) => SubProductResource | undefined;
}

export const useProductFiltering = ({
  partyDetail,
  products,
}: UseProductFilteringParams): UseProductFilteringReturn => {
  const interopProductsList = useMemo(
    () => (partyDetail?.products ?? []).filter((p) => p.productId?.startsWith('prod-interop')),
    [partyDetail?.products]
  );

  const hasMoreThanOneInteropEnv = interopProductsList.length > 1;

  const onboardedProducts = useMemo(
    () => partyDetail?.products.filter((p) => p.productOnBoardingStatus === 'ACTIVE'),
    [partyDetail?.products]
  );

  const productsToShow = useMemo(() => {
    if (!onboardedProducts) {
      return undefined;
    }

    const interopProducts = onboardedProducts.filter((p) =>
      p.productId?.startsWith('prod-interop')
    );
    const otherProducts = onboardedProducts.filter((p) => !p.productId?.startsWith('prod-interop'));

    // Determine initial product list based on interop logic
    const getInitialList = () => {
      const hasMultipleInterop = interopProducts.length > 1;

      if (!hasMultipleInterop) {
        return onboardedProducts;
      }

      const mainInterop =
        interopProducts.find((p) => p.productId === 'prod-interop') || interopProducts[0];

      return [{ ...mainInterop, productId: 'prod-interop' }, ...otherProducts];
    };

    // Filter to only show ACTIVE products from configuration
    const isProductActive = (productId: string) =>
      products.some((p) => p.status === 'ACTIVE' && p.id === productId);

    return getInitialList().filter((product) => isProductActive(product.productId || ''));
  }, [onboardedProducts, products]);

  const getProductTitle = (product: OnboardedProduct, productFromConfig: Product): string => {
    const hasBasicIOAndPremium = onboardedProducts?.some(
      (p) => p.productId === PRODUCT_IDS.IO || p.productId === PRODUCT_IDS.IO_PREMIUM
    );

    if (product.productId === PRODUCT_IDS.IO && hasBasicIOAndPremium) {
      return `${productFromConfig.title} Premium`;
    }

    return productFromConfig.title || product?.productId || '';
  };

  const getActiveSubProduct = (productId: string) => {
    const configProduct = products.find((p) => p.id === productId);

    return configProduct?.subProducts?.find((subProduct) =>
      onboardedProducts?.some(
        (onboarded) =>
          onboarded.productId === subProduct.id && onboarded.productOnBoardingStatus === 'ACTIVE'
      )
    );
  };

  return {
    productsToShow,
    interopProductsList,
    hasMoreThanOneInteropEnv,
    getProductTitle,
    getActiveSubProduct,
  };
};
