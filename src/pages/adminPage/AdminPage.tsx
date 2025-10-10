import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, CircularProgress, Grid, styled, TextField, Typography } from '@mui/material';
import { PartyAccountItemButton } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';
import { searchInstitutionsService } from '../../services/partyRegistryProxyService';
import { ENV } from '../../utils/env';

const AdminPage = () => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Array<SearchServiceInstitution>>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<SearchServiceInstitution | null>(
    null
  );

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

  const buildUrlLog = (partyId: string) =>
    `${ENV.URL_INSTITUTION_LOGO.PREFIX}${partyId}${ENV.URL_INSTITUTION_LOGO.SUFFIX}`;

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
    </Grid>
  );
};

export default AdminPage;
