import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { PartyAccountItemButton } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { debounce, DebouncedFunc } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';
import { searchInstitutionsService } from '../../services/partyRegistryProxyService';
import { ENV } from '../../utils/env';
import { buildUrlLog } from '../../utils/helper';
import { commonStyles, CustomListbox } from './utils/styles';

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Array<SearchServiceInstitution>>([]);
  const requestIdRef = useRef(0);
  const debouncedSearchRef = useRef<DebouncedFunc<(searchText: string) => void> | null>(null);

  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const addErrorRef = useRef(addError);
  const history = useHistory();

  addErrorRef.current = addError;

  useEffect(() => {
    trackEvent('BACKSTAGE_DASHBOARD');
  }, []);

  useEffect(() => {
    const searchInstitutions = (searchText: string) => {
      const requestId = ++requestIdRef.current;

      if (searchText.length < 3) {
        setOptions([]);
        setLoading(false);
        setOpen(false);
        return;
      }

      setLoading(true);

      searchInstitutionsService(searchText)
        .then((results) => {
          if (requestId !== requestIdRef.current) {
            return;
          }
          setOptions(results);
        })
        .catch((error) => {
          if (requestId !== requestIdRef.current) {
            return;
          }
          setOptions([]);

          addErrorRef.current({
            id: `searchInstitutions-${searchText}-api-error`,
            blocking: false,
            techDescription: `Search institutions with text: ${searchText} not found`,
            toNotify: false,
            error: error as Error,
          });
        })
        .finally(() => {
          if (requestId !== requestIdRef.current) {
            return;
          }
          setLoading(false);
          setOpen(false);      // force close
          setTimeout(() => setOpen(true), 0);
        });
    };

    debouncedSearchRef.current = debounce(searchInstitutions, 400);

    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, []);

  return (
    <Grid px={3} mt={3} sx={{ width: '100%' }}>
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
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          inputValue={inputValue}
          onChange={(_, newValue) => {
            trackEvent('BACKSTAGE_PARTY_SELECTION', {
              party_id: newValue?.id || 'id_undefined',
            });
            setOpen(false);
            if (newValue) {
              history.push(
                resolvePathVariables(ENV.ROUTES.ADMIN_SEARCH_DETAIL, {
                  partyId: newValue?.id || '',
                })
              );
            }
          }}
          onInputChange={(_, newInputValue, reason) => {
            setInputValue(newInputValue);
            if (reason === 'input') {
              debouncedSearchRef.current?.(newInputValue);
            }
          }}
          options={options}
          isOptionEqualToValue={(option, value) => option.id === value.id}
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
    </Grid>
  );
};

export default AdminPage;
