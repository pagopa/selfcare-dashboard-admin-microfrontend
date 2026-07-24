import { ArrowForward } from '@mui/icons-material';
import { Chip, TableCell, TableRow } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ProductOnBoardingStatusEnum } from '../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { SubProductResource } from '../../../api/generated/b4f-dashboard/SubProductResource';
import ProductAvatarCell from '../../../components/ProductAvatarCell';
import { OnboardedProduct } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { STATUSES_ALLOWED_TO_SEE_REQUESTS } from '../../../utils/constants';
import { ENV } from '../../../utils/env';
import { isProductAllowed } from '../../adminPage/utils/utils';

interface PartyProductRowProps {
  onboardedProduct: OnboardedProduct;
  productFromConfiguration: Product;
  hasPermission: (productId: string, action: string) => boolean;
  getActiveSubProduct: (productId: string) => SubProductResource | undefined;
  getProductTitle: (product: OnboardedProduct, productFromConfig: Product) => string;
  uniqueRoles: Array<string>;
  onProductClick: (productFromConfiguration: Product) => void;
  onBackofficeNotIntegrated: () => void;
}

const PartyProductRow: React.FC<PartyProductRowProps> = ({
  onboardedProduct,
  productFromConfiguration,
  hasPermission,
  getActiveSubProduct,
  getProductTitle,
  uniqueRoles,
  onProductClick,
  onBackofficeNotIntegrated,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const canAccessBackofficeAdmin = hasPermission(
    onboardedProduct.productId || '',
    Actions.AccessProductBackofficeAdmin
  );

  const canAccessAccountPage =
    hasPermission(onboardedProduct.productId || '', Actions.ViewAccountPage) &&
    STATUSES_ALLOWED_TO_SEE_REQUESTS.includes(onboardedProduct?.productOnBoardingStatus || '');

  const showBackofficeButton =
    onboardedProduct.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE &&
    canAccessBackofficeAdmin;

  const showAccountPageButton = !canAccessBackofficeAdmin && canAccessAccountPage;

  const handleBackofficeClick = () => {
    trackEvent('BACKSTAGE_BACK_OFFICE_CLICK', {
      product_id: onboardedProduct.productId || '',
      product_role: uniqueRoles.length ? uniqueRoles.join(',') : '',
    });
    if (isProductAllowed(onboardedProduct.productId || '')) {
      onProductClick(productFromConfiguration);
    } else {
      onBackofficeNotIntegrated();
    }
  };

  const handleAccountPageClick = () => {
    history.push(
      resolvePathVariables(ENV.ROUTES.ADMIN_REQUEST_DETAIL, {
        tokenId: onboardedProduct.tokenId || '',
      }),
      { fromDashboard: true }
    );
  };

  return (
    <TableRow hover>
      <TableCell>
        <ProductAvatarCell
          onboardedProduct={onboardedProduct}
          productFromConfiguration={productFromConfiguration}
          getActiveSubProduct={getActiveSubProduct}
          getProductTitle={getProductTitle}
        />
      </TableCell>
      <TableCell>
        {onboardedProduct?.createdAt
          ? new Date(onboardedProduct.createdAt).toLocaleDateString()
          : '-'}
      </TableCell>
      <TableCell>
        <Chip
          label={t('adminPage.selectedPartyDetails.activeStatus')}
          size="small"
          color="success"
          sx={{ backgroundColor: 'success.light', color: 'success.main' }}
        />
      </TableCell>
      <TableCell>
        {t(
          `common.institutionType.descriptions.${onboardedProduct?.institutionType?.toLowerCase()}`
        ) || '-'}
      </TableCell>
      {showBackofficeButton && (
        <TableCell align="right">
          <ButtonNaked
            component="button"
            endIcon={<ArrowForward />}
            onClick={handleBackofficeClick}
            sx={{ color: 'primary.main', fontWeight: 'bold' }}
          >
            {t('adminPage.selectedPartyDetails.backOffice')}
          </ButtonNaked>
        </TableCell>
      )}
      {showAccountPageButton && (
        <TableCell align="right">
          <ButtonNaked
            component="button"
            endIcon={<ArrowForward />}
            onClick={handleAccountPageClick}
            sx={{ color: 'primary.main', fontWeight: 'bold' }}
          >
            {t('adminPage.selectedPartyDetails.accountPage')}
          </ButtonNaked>
        </TableCell>
      )}
    </TableRow>
  );
};

export default PartyProductRow;
