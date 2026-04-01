import { ArrowForward } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked, PartyAccountItemButton } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { isProductAllowed } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { storageOpsBuilder } from '@pagopa/selfcare-common-frontend/lib/utils/storage-utils';
import { debounce } from 'lodash';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { useAppDispatch } from '../../redux/hooks';
import { fetchPartyDetailsService } from '../../services/dashboardService';
import { searchInstitutionsService } from '../../services/partyRegistryProxyService';
import { fetchProducts } from '../../services/productService';
import { buildUrlLog } from '../../utils/helper';
import AdminPartyInfo from './components/AdminPartyInfo';
import GenericEnvProductModal from './components/GenericEnvProductModal';
import ProductAvatarCell from './components/ProductAvatarCell';
import SessionModalInteropProduct from './components/SessionModalInteropProduct';
import { useProductFiltering } from './hooks/useProductFiltering';
import { useProductNavigation } from './hooks/useProductNavigation';
import { commonStyles, CustomListbox } from './utils/styles';

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Array<SearchServiceInstitution>>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<SearchServiceInstitution | null>(
    null
  );
  const [partyDetail, setPartyDetail] = useState<Party | null>(null);
  const [products, setProducts] = useState<Array<Product>>([]);

  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const dispatch = useAppDispatch();

  // Extract product filtering logic to custom hook
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
  } = useProductNavigation({ products, selectedInstitution, hasMoreThanOneInteropEnv });

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        addError({
          id: 'fetchProducts-api-error',
          blocking: false,
          techDescription: 'Fetch products failed',
          toNotify: false,
          error: error as Error,
        });
      });
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchText: string) => {
        if (searchText.length < 3) {
          setOptions([]);
          return;
        }
        setLoading(true);

        searchInstitutionsService(searchText)
          .then((results) => {
            setOptions(results);
          })
          .catch((error) => {
            setOptions([]);

            addError({
              id: `searchInstitutions-${searchText}-api-error`,
              blocking: false,
              techDescription: `Search institutions with text: ${searchText} not found`,
              toNotify: false,
              error: error as Error,
            });
          })
          .finally(() => {
            setLoading(false);
            setOpen(true);
          });
      }, 400),

    []
  );

  useEffect(
    () => () => {
      debouncedSearch.cancel();
    },
    [debouncedSearch]
  );

  useEffect(() => {
    const storedInstitution = storageOpsBuilder(
      'selectedInstitution',
      'object',
      false
    ).read() as SearchServiceInstitution | null;
    if (storedInstitution) {
      setSelectedInstitution(storedInstitution);
    }
  }, []);

  useEffect(() => {
    if (selectedInstitution?.id) {
      fetchPartyDetailsService(selectedInstitution.id)
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
          storageOpsBuilder('selectedInstitution', 'object', false).delete();
          setSelectedInstitution(null);

          addError({
            id: `fetchPartyDetails-${selectedInstitution.id}-api-error`,
            blocking: false,
            techDescription: `Fetch party details for institution id: ${selectedInstitution.id} failed`,
            toNotify: false,
            error: error as Error,
          });
        });
    }
  }, [selectedInstitution]);

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%', backgroundColor: 'transparent !important' }}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('adminPage.title')}
          subTitle={t('adminPage.subtitle')}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>

      <Grid item xs={12} sx={commonStyles}>
        <Typography fontWeight={'bold'} fontSize={'14px'} pb={3}>
          {t('adminPage.searchInstitutions.title')}
        </Typography>

        <Autocomplete
          id="search-institutions-autocomplete"
          forcePopupIcon={false}
          open={open}
          value={selectedInstitution}
          onChange={(_, newValue) => {
            setSelectedInstitution(newValue);
            if (newValue) {
              storageOpsBuilder('selectedInstitution', 'object', false).write(newValue);
            } else {
              storageOpsBuilder('selectedInstitution', 'object', false).delete();
            }
            setOpen(false);
          }}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === 'input') {
              debouncedSearch(newInputValue);
            }
          }}
          onBlur={() => setOpen(false)}
          options={options}
          getOptionLabel={(option) => option.description || ''}
          noOptionsText={
            open && !loading ? (
              <Typography fontWeight="bold">
                {t('adminPage.searchInstitutions.noResults')}
              </Typography>
            ) : null
          }
          filterOptions={(x) => x}
          disablePortal
          ListboxComponent={CustomListbox}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                backgroundColor: 'background.paper',
                marginTop: 0,
                border: 'none',
                boxShadow: 'none',
              },
            },
            popper: {
              sx: {
                position: 'relative !important',
                transform: 'none !important',
                marginTop: '0 !important',
              },
            },
          }}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <li key={key} {...rest} style={{ all: 'unset' }}>
                <PartyAccountItemButton
                  partyName={option?.description || ''}
                  image={option?.id ? buildUrlLog(option.id) : undefined}
                  parentPartyName={option?.parentDescription}
                  maxCharactersNumberMultiLine={20}
                />
              </li>
            );
          }}
          renderInput={(params) => {
            const hasValue = Boolean(params.inputProps.value);
            return (
              <TextField
                {...params}
                label={hasValue ? t('adminPage.searchInstitutions.shortLabel') : ''}
                placeholder={t('adminPage.searchInstitutions.longLabel')}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <SearchIcon fontSize="small" />,
                  endAdornment: loading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : (
                    params.InputProps.endAdornment
                  ),
                }}
                fullWidth
              />
            );
          }}
        />
      </Grid>

      {partyDetail && selectedInstitution && (
        <Grid item xs={12} sx={commonStyles}>
          <AdminPartyInfo partyDetail={partyDetail} selectedInstitution={selectedInstitution} />
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
                                `onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.institutionType.descriptions.${onboardedProduct?.institutionType?.toLowerCase()}`
                              ) || '-'}
                            </TableCell>
                            {isProductAllowed(onboardedProduct.productId || '') && (
                              <TableCell align="right">
                                <ButtonNaked
                                  component="button"
                                  endIcon={<ArrowForward />}
                                  onClick={() =>
                                    handleOnboardedProductClick(productFromConfiguration)
                                  }
                                  sx={{ color: 'primary.main', fontWeight: 'bold' }}
                                >
                                  {t('adminPage.selectedPartyDetails.backOffice')}
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
                party={selectedInstitution}
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

export default AdminPage;
