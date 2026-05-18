import { ArrowForward } from '@mui/icons-material';
import {
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher, usePermissions } from '@pagopa/selfcare-common-frontend';
import NavigationBar, {
  NavigationPath,
} from '@pagopa/selfcare-common-frontend/lib/components/NavigationBar';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { ProductOnBoardingStatusEnum } from '../../api/generated/b4f-dashboard/OnboardedProductResource';
import BackofficeNotIntegratedModal from '../../components/BackofficeNotIntegratedModal';
import GenericEnvProductModal from '../../components/GenericEnvProductModal';
import ProductAvatarCell from '../../components/ProductAvatarCell';
import SessionModalInteropProduct from '../../components/SessionModalInteropProduct';
import { useFetchProducts } from '../../hooks/useFetchProducts';
import { Party } from '../../model/Party';
import { useAppDispatch } from '../../redux/hooks';
import { fetchPartyDetailsService } from '../../services/dashboardService';
import { ENV } from '../../utils/env';
import { useProductFiltering } from '../adminPage/hooks/useProductFiltering';
import { useProductNavigation } from '../adminPage/hooks/useProductNavigation';
import { commonStyles } from '../adminPage/utils/styles';
import { isProductAllowed } from '../adminPage/utils/utils';
import AdminPartyInfo from './components/AdminPartyInfo';

const PartyDetailPage = () => {
  const [openBackofficeNotIntegratedModal, setOpenBackofficeNotIntegratedModal] = useState(false);
  const [partyDetail, setPartyDetail] = useState<Party | null>(null);

  const history = useHistory();
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();

  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const { products } = useFetchProducts();
  const { partyId } = useParams<{ partyId: string }>();

  const {
    productsToShow,
    interopProductsList,
    hasMoreThanOneInteropEnv,
    getProductTitle,
    getActiveSubProduct,
  } = useProductFiltering({ partyDetail, products });

  const {
    activeProduct,
    interopProduction,
    openInteropModal,
    openGenericEnvModal,
    handleOnboardedProductClick,
    handleInteropConfirm,
    handleGenericEnvConfirm,
    closeInteropModal,
    closeGenericEnvModal,
  } = useProductNavigation({ products, partyDetail, hasMoreThanOneInteropEnv });

  useEffect(() => {
    if (partyId) {
      fetchPartyDetailsService(partyId)
        .then((party) => {
          if (party) {
            setPartyDetail(party);
            const productPermissions = [...party.products]
              .filter((product) => product.productOnBoardingStatus === 'ACTIVE')
              .map((product) => ({
                productId: product.productId ?? '',
                actions: product.userProductActions ? [...product.userProductActions] : [],
              }));
            dispatch(setProductPermissions(productPermissions));
          }
        })
        .catch((error) => {
          addError({
            id: `fetchPartyDetails-${partyDetail?.partyId}-api-error`,
            blocking: false,
            techDescription: `Fetch party details for institution id: ${partyDetail?.partyId} failed`,
            toNotify: false,
            error: error as Error,
          });
        });
    }
  }, [partyId]);

  const goBack = () => {
    history.goBack();
  };

  const innerPaths: Array<NavigationPath> = [];

  return (
    <Grid px={3} mt={3} sx={{ width: '100%' }}>
      <NavigationBar
        paths={innerPaths}
        showBackComponent={true}
        goBack={goBack}
        backLabel={'Indietro'}
        color="black"
      />

      {partyDetail && (
        <Grid item xs={12} sx={commonStyles} mt={5}>
          <AdminPartyInfo partyDetail={partyDetail} />
          <Divider sx={{ my: 3 }} />

          {productsToShow && productsToShow.length > 0 && (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {t('adminPage.selectedPartyDetails.product')}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {t('adminPage.selectedPartyDetails.subscriptionDate')}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {t('adminPage.selectedPartyDetails.agreementStatus')}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {t('adminPage.selectedPartyDetails.institutionType')}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsToShow?.map((onboardedProduct) => {
                      const productFromConfiguration = products.find(
                        (p) => p.id === onboardedProduct?.productId
                      );

                      if (!productFromConfiguration) {
                        return null;
                      }
                      const canAccessBackofficeAdmin = hasPermission(
                        onboardedProduct.productId || '',
                        Actions.AccessProductBackofficeAdmin
                      );

                      const canAccessAccountPage = hasPermission(
                        onboardedProduct.productId || '',
                        Actions.ViewAccountPage
                      );

                      return (
                        <Fragment key={onboardedProduct?.productId}>
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
                            {onboardedProduct.productOnBoardingStatus ===
                              ProductOnBoardingStatusEnum.ACTIVE &&
                              canAccessBackofficeAdmin && (
                                <TableCell align="right">
                                  <ButtonNaked
                                    component="button"
                                    endIcon={<ArrowForward />}
                                    onClick={() => {
                                      trackEvent('BACKSTAGE_BACK_OFFICE_CLICK', {
                                        product_id: onboardedProduct.productId || '',
                                      });
                                      if (isProductAllowed(onboardedProduct.productId || '')) {
                                        handleOnboardedProductClick(productFromConfiguration);
                                      } else {
                                        setOpenBackofficeNotIntegratedModal(true);
                                      }
                                    }}
                                    sx={{ color: 'primary.main', fontWeight: 'bold' }}
                                  >
                                    {t('adminPage.selectedPartyDetails.backOffice')}
                                  </ButtonNaked>
                                </TableCell>
                              )}
                            {canAccessAccountPage && (
                              <TableCell align="right">
                                <ButtonNaked
                                  component="button"
                                  endIcon={<ArrowForward />}
                                  onClick={() => {
                                    history.push(
                                      resolvePathVariables(ENV.ROUTES.ADMIN_ONBOARDINGS_DETAIL, {
                                        tokenId: onboardedProduct.tokenId || '',
                                      })
                                    );
                                  }}
                                  sx={{ color: 'primary.main', fontWeight: 'bold' }}
                                >
                                  {t('adminPage.selectedPartyDetails.accountPage')}
                                </ButtonNaked>
                              </TableCell>
                            )}
                          </TableRow>
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <BackofficeNotIntegratedModal
                open={openBackofficeNotIntegratedModal}
                productName={activeProduct?.title ?? ''}
                onClose={() => setOpenBackofficeNotIntegratedModal(false)}
              />
              <SessionModalInteropProduct
                open={openInteropModal}
                title={t('overview.activeProducts.activeProductsEnvModal.title')}
                message={
                  <Trans
                    i18nKey="overview.activeProducts.activeProductsEnvModal.message"
                    values={{
                      productTitle: activeProduct?.id?.startsWith('prod-interop')
                        ? interopProduction?.title
                        : activeProduct?.title,
                    }}
                    components={{ 1: <strong /> }}
                  >
                    {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
                  </Trans>
                }
                onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
                onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
                onConfirm={handleInteropConfirm}
                handleClose={closeInteropModal}
                authorizedInteropProducts={interopProductsList?.map((p) => p.productId || '')}
                products={products}
                party={partyDetail}
              />
              <GenericEnvProductModal
                open={openGenericEnvModal}
                title={t('overview.activeProducts.activeProductsEnvModal.title')}
                message={
                  <Trans
                    i18nKey="overview.activeProducts.activeProductsEnvModal.message"
                    values={{ productTitle: activeProduct?.title }}
                    components={{ 1: <strong /> }}
                  >
                    {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
                  </Trans>
                }
                onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
                onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
                onConfirm={(e) => handleGenericEnvConfirm((e.target as HTMLInputElement).value)}
                handleClose={closeGenericEnvModal}
                productEnvironments={activeProduct?.backOfficeEnvironmentConfigurations as any}
              />
            </>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default PartyDetailPage;
