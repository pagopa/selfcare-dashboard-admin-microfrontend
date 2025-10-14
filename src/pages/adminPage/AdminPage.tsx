import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  styled,
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
import { PartyAccountItem, PartyAccountItemButton } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';
import { Party } from '../../model/Party';
import { fetchPartyDetailsService } from '../../services/dashboardService';
import { searchInstitutionsService } from '../../services/partyRegistryProxyService';
import { buildUrlLog } from '../../utils/helper';

const AdminPage = () => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Array<SearchServiceInstitution>>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<SearchServiceInstitution | null>(
    null
  );
  const [partyDetail, setPartyDetail] = useState<Party | null>(null);

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

  const commonStyles = {
    backgroundColor: 'background.paper',
    p: 3,
    borderRadius: '4px',
    marginBottom: 5,
  };

  const CustomListbox = styled('ul')({
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: `inset 10px 10px  #E6E9F2`,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#0073E6',
      borderRadius: '16px',
    },
    overflowY: 'auto',
    overflowX: 'hidden',
  });

  const getProductLabel = (productId?: string) => {
    switch (productId) {
      case 'prod-interop':
        return 'Interoperabilità';
      case 'prod-pagopa':
        return 'PagoPA';
      default:
        return productId;
    }
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
              <Typography>{partyDetail.fiscalCode}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">
                {t('adminPage.selectedPartyDetails.digitalAddress')}
              </Typography>
              <Typography>{partyDetail.digitalAddress || '-'}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="textSecondary">
                {t('adminPage.selectedPartyDetails.registeredOffice')}
              </Typography>
              <Typography>{partyDetail.registeredOffice}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          {/* Products Table */}
          {partyDetail.products && partyDetail.products.length > 0 && (
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
                  {partyDetail.products.map((product) => (
                    <TableRow key={product.productId} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            width={32}
                            height={32}
                            bgcolor="#E5F0FF"
                            borderRadius="6px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {/* ProductAvatar component would go here */}
                          </Box>
                          <Typography>{getProductLabel(product?.productId)}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {product?.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t('adminPage.selectedPartyDetails.activeStatus')}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {t(
                          `onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.institutionType.descriptions.${product?.institutionType?.toLowerCase()}`
                        ) || '-'}
                      </TableCell>
                      <TableCell align="right">
                        {/*
                        <Typography
                          sx={{
                            color: 'primary.main',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Vedi Back-office →
                        </Typography>
                      */}
                      </TableCell>
                    </TableRow>
                  ))}
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
