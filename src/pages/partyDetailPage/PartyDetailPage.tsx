import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useErrorDispatcher, usePermissions } from '@pagopa/selfcare-common-frontend';
import NavigationBar, {
  NavigationPath,
} from '@pagopa/selfcare-common-frontend/lib/components/NavigationBar';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import BackofficeNotIntegratedModal from '../../components/BackofficeNotIntegratedModal';
import GenericEnvProductModal from '../../components/GenericEnvProductModal';
import SessionModalInteropProduct from '../../components/SessionModalInteropProduct';
import { useFetchProducts } from '../../hooks/useFetchProducts';
import { Party } from '../../model/Party';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPartyDetailsService } from '../../services/dashboardService';
import { useProductFiltering } from '../adminPage/hooks/useProductFiltering';
import { useProductNavigation } from '../adminPage/hooks/useProductNavigation';
import { commonStyles } from '../adminPage/utils/styles';
import AdminPartyInfo from './components/AdminPartyInfo';
import PartyProductRow from './components/PartyProductRow';

const PartyDetailPage = () => {
  const [openBackofficeNotIntegratedModal, setOpenBackofficeNotIntegratedModal] = useState(false);
  const [partyDetail, setPartyDetail] = useState<Party | null>(null);

  const history = useHistory();
  const dispatch = useAppDispatch();
  const uniqueRoles = useAppSelector((s: any) => s.adminRoles?.uniqueRoles ?? []);
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

                      return (
                        <PartyProductRow
                          key={onboardedProduct?.productId}
                          onboardedProduct={onboardedProduct}
                          productFromConfiguration={productFromConfiguration}
                          hasPermission={hasPermission}
                          getActiveSubProduct={getActiveSubProduct}
                          getProductTitle={getProductTitle}
                          uniqueRoles={uniqueRoles}
                          onProductClick={handleOnboardedProductClick}
                          onBackofficeNotIntegrated={() =>
                            setOpenBackofficeNotIntegratedModal(true)
                          }
                        />
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
