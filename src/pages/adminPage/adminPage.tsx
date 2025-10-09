import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Grid, styled, TextField, Typography } from '@mui/material';
import { PartyAccountItemButton } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';
import { searchInstitutionsService } from '../../services/partyRegistryProxyService';

const AdminPage = () => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_RETRIEVE_INSTITUTIONS);

  const [options, setOptions] = useState<Array<SearchServiceInstitution>>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<SearchServiceInstitution | null>(
    null
  );

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchText: string) => {
        if (searchText.length < 3) {
          setOptions([]);
          return;
        }
        setLoading(true);
        try {
          const results = await searchInstitutionsService(searchText);
          setOptions(results);
        } catch (error) {
          setOptions([]);

          addError({
            id: `searchInstitutions-${searchText}-api-error`,
            blocking: false,
            techDescription: `Search institutions with text: ${searchText} not found`,
            toNotify: false,
            error: error as Error,
          });
        } finally {
          setLoading(false);
        }
      }, 800),
    []
  );

  // Trigger search when input changes
  useEffect(() => {
    debouncedSearch(inputValue)?.finally(() => {});
  }, [inputValue, debouncedSearch]);

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
          freeSolo
          id="search-institutions-autocomplete"
          value={selectedInstitution}
          onChange={(_, newValue) => {
            setSelectedInstitution(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={options}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            return option.description || '';
          }}
          noOptionsText={
            <Typography fontWeight="bold">{t('adminPage.searchInstitutions.noResults')}</Typography>
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
          renderOption={(_props, option) => (
            <PartyAccountItemButton
              partyName={option?.description || ''}
              image={undefined}
              parentPartyName={option?.parentDescription}
              maxCharactersNumberMultiLine={20}
            />
          )}
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
