import { ArrowForward } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
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
import { grey } from '@mui/material/colors';
import {
  ButtonNaked,
  PartyAccountItem,
  PartyAccountItemButton,
  ProductAvatar,
} from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';
import { useTokenExchange } from '../../hooks/useTokenExchange';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { fetchPartyDetailsService } from '../../services/dashboardService';
import { searchInstitutionsService } from '../../services/partyRegistryProxyService';
import { fetchProducts } from '../../services/productService';
import { buildUrlLog } from '../../utils/helper';
import GenericEnvProductModal from './components/GenericEnvProductModal';
import SessionModalInteropProduct from './components/SessionModalInteropProduct';
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
  const [openCustomEnvInteropModal, setOpenCustomEnvInteropModal] = useState<boolean>(false);
  const [openGenericEnvProductModal, setOpenGenericEnvProductModal] = useState<boolean>(false);

  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const { invokeProductBo } = useTokenExchange();
  const lang = i18n.language;

  const interopProductsList = (partyDetail?.products ?? []).filter((p) =>
    p.productId?.startsWith('prod-interop')
  );
  const hasMoreThanOneInteropEnv = interopProductsList.length > 1;

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Debounced search function
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

  useEffect(() => {
    if (selectedInstitution?.id) {
      fetchPartyDetailsService(selectedInstitution.id)
        .then((party) => {
          if (party) {
            setPartyDetail(party);
          }
        })
        .catch((error) => {
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

  const onboardedProducts = partyDetail?.products.filter(
    (p) => p.productOnBoardingStatus === 'ACTIVE'
  );

  const main = onboardedProducts?.find((p) => p.productId === 'prod-interop');
  const variants = onboardedProducts?.filter((p) => p.productId?.startsWith('prod-interop'));

  const productsToShow = (() => {
    if (main) {
      return [main];
    }
    if (variants && variants.length === 1) {
      return variants;
    }
    if (variants && variants.length > 1) {
      return [{ ...variants[0], productId: 'prod-interop' }];
    }
    return onboardedProducts;
  })();

  const getProductToShow = (productId: string) => products.find((p) => p.id === productId);

  const handleOnboardedProductClick = (productFromConfiguration?: Product) => {
    if (!productFromConfiguration) {
      console.log('No onboarded product provided');
      return;
    }

    console.log('Clicked product:', productFromConfiguration);

    if (hasMoreThanOneInteropEnv && productFromConfiguration?.id?.startsWith('prod-interop')) {
      setOpenCustomEnvInteropModal(true);
      return;
    }

    if (
      productFromConfiguration.backOfficeEnvironmentConfigurations &&
      productFromConfiguration.backOfficeEnvironmentConfigurations.length > 0 &&
      productFromConfiguration?.id !== 'prod-interop'
    ) {
      setOpenGenericEnvProductModal(true);
      return;
    }

    // Fallback: open product backoffice directly
    void invokeProductBo(
      productFromConfiguration,
      selectedInstitution as SearchServiceInstitution,
      undefined,
      lang
    );
  };

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
            setOpen(false);
          }}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === 'input') {
              debouncedSearch(newInputValue);
            }
          }}
          options={options}
          getOptionLabel={(option) => option.description || ''}
          noOptionsText={
            open && !loading ? (
              <Typography fontWeight="bold">
                {t('adminPage.searchInstitutions.noResults')}
              </Typography>
            ) : null
          }
          filterOptions={(x) => x} // Disable client-side filtering since we search server-side
          disablePortal
          PopperComponent={(props) => (
            <div {...props} style={{ ...props.style, position: 'relative' }}>
              {typeof props.children === 'function' ? null : props.children}
            </div>
          )}
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
          <PartyAccountItem
            image={selectedInstitution.id ? buildUrlLog(selectedInstitution.id) : undefined}
            partyName={selectedInstitution.description || '-'}
            parentPartyName={selectedInstitution.parentDescription || undefined}
          />

          <Grid
            container
            bgcolor={grey[100]}
            mt={2}
            p={2}
            alignItems="center"
            flexDirection={'row'}
          >
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">
                {t('adminPage.selectedPartyDetails.fiscalCode')}
              </Typography>
              <Typography fontWeight="fontWeightMedium">{partyDetail.fiscalCode}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">
                {t('adminPage.selectedPartyDetails.digitalAddress')}
              </Typography>
              <Typography
                fontWeight="fontWeightMedium"
                noWrap
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
              >
                {partyDetail.digitalAddress || '-'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">
                {t('adminPage.selectedPartyDetails.registeredOffice')}
              </Typography>
              <Typography fontWeight="fontWeightMedium">
                {partyDetail.registeredOffice || '-'}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />

          {/* Products Table */}
          {productsToShow && productsToShow.length > 0 && (
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
                    const productFromConfiguration = getProductToShow(
                      onboardedProduct?.productId || ''
                    );
                    const interopProduction = products.find((p) => p.id === 'prod-interop');
                    return (
                      <>
                        <TableRow key={onboardedProduct?.productId} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <ProductAvatar
                                id={onboardedProduct?.productId}
                                size="small"
                                logoUrl={productFromConfiguration?.logo || ''}
                                logoBgColor={productFromConfiguration?.logoBgColor || 'transparent'}
                                logoAltText={`${onboardedProduct?.productId} logo`}
                              />
                              <Typography>{productFromConfiguration?.title || '-'}</Typography>
                            </Box>
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
                          <TableCell align="right">
                            <ButtonNaked
                              component="button"
                              endIcon={<ArrowForward />}
                              onClick={() => handleOnboardedProductClick(productFromConfiguration)}
                              sx={{ color: 'primary.main', fontWeight: 'bold' }}
                            >
                              {t('adminPage.selectedPartyDetails.backOffice')}
                            </ButtonNaked>
                          </TableCell>
                        </TableRow>
                        <SessionModalInteropProduct
                          open={openCustomEnvInteropModal}
                          title={t('overview.activeProducts.activeProductsEnvModal.title')}
                          message={
                            <Trans
                              i18nKey="overview.activeProducts.activeProductsEnvModal.message"
                              values={{
                                productTitle: productFromConfiguration?.id.startsWith(
                                  'prod-interop'
                                )
                                  ? products?.find((pp) => pp.id === 'prod-interop')?.title
                                  : productFromConfiguration?.title,
                              }}
                              components={{ 1: <strong /> }}
                            >
                              {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
                            </Trans>
                          }
                          onConfirmLabel={t(
                            'overview.activeProducts.activeProductsEnvModal.enterButton'
                          )}
                          onCloseLabel={t(
                            'overview.activeProducts.activeProductsEnvModal.backButton'
                          )}
                          onConfirm={() =>
                            invokeProductBo(
                              interopProduction as Product,
                              selectedInstitution,
                              undefined,
                              lang
                            )
                          }
                          handleClose={() => {
                            setOpenCustomEnvInteropModal(false);
                          }}
                          authorizedInteropProducts={interopProductsList?.map(
                            (p) => p.productId || ''
                          )}
                          products={products}
                          party={selectedInstitution}
                        />
                        <GenericEnvProductModal
                          open={openGenericEnvProductModal}
                          title={t('overview.activeProducts.activeProductsEnvModal.title')}
                          message={
                            <Trans
                              i18nKey="overview.activeProducts.activeProductsEnvModal.message"
                              values={{ productTitle: productFromConfiguration?.title }}
                              components={{ 1: <strong /> }}
                            >
                              {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
                            </Trans>
                          }
                          onConfirmLabel={t(
                            'overview.activeProducts.activeProductsEnvModal.enterButton'
                          )}
                          onCloseLabel={t(
                            'overview.activeProducts.activeProductsEnvModal.backButton'
                          )}
                          onConfirm={(e) =>
                            invokeProductBo(
                              productFromConfiguration as Product,
                              selectedInstitution,
                              (e.target as HTMLInputElement).value,
                              lang
                            )
                          }
                          handleClose={() => {
                            setOpenGenericEnvProductModal(false);
                          }}
                          productEnvironments={
                            productFromConfiguration?.backOfficeEnvironmentConfigurations as any
                          }
                        />
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default AdminPage;
