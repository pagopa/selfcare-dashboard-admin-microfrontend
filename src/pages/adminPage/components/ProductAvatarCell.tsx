// ProductAvatarCell.tsx
import { Box, Typography } from '@mui/material';
import { ProductAvatar } from '@pagopa/mui-italia';
import { SubProductResource } from '../../../api/generated/b4f-dashboard/SubProductResource';
import { OnboardedProduct } from '../../../model/Party';
import { Product } from '../../../model/Product';

interface ProductAvatarCellProps {
  onboardedProduct: OnboardedProduct;
  productFromConfiguration: Product;
  getActiveSubProduct: (productId: string) => SubProductResource | undefined;
  getProductTitle: (product: OnboardedProduct, productFromConfig: Product) => string;
}

const ProductAvatarCell: React.FC<ProductAvatarCellProps> = ({
  onboardedProduct,
  productFromConfiguration,
  getActiveSubProduct,
  getProductTitle,
}) => {
  const activeSubProduct = getActiveSubProduct(onboardedProduct.productId || '');

  const hasActiveSubProduct = !!activeSubProduct;

  const logoUrl = hasActiveSubProduct
    ? activeSubProduct?.logo || productFromConfiguration.logo || ''
    : productFromConfiguration.logo || '';

  const logoBgColor = hasActiveSubProduct
    ? activeSubProduct?.logoBgColor || productFromConfiguration.logoBgColor || 'transparent'
    : productFromConfiguration.logoBgColor || 'transparent';

  console.log(
    'Rendering ProductAvatarCell for product:',
    onboardedProduct.productId,
    'hasActiveSubProduct:',
    hasActiveSubProduct,
    ' activeSubProduct:',
    activeSubProduct
  );

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <ProductAvatar
        id={onboardedProduct.productId}
        size="small"
        logoUrl={logoUrl}
        logoBgColor={logoBgColor}
        logoAltText={`${onboardedProduct.productId} logo`}
      />
      <Typography>{getProductTitle(onboardedProduct, productFromConfiguration)}</Typography>
    </Box>
  );
};

export default ProductAvatarCell;
