import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const { t } = useTranslation();

  const commonStyles = {
    backgroundColor: 'background.paper',
    p: 3,
    borderRadius: '4px',
    marginBottom: 5,
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
        />
      </Grid>

      <Grid item xs={12} sx={commonStyles}>
        <Typography fontWeight={'bold'} fontSize={'14px'} pb={3}>
          {t('adminPage.searchInstitutions.title')}
        </Typography>

        <Autocomplete
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
          options={[]}
          freeSolo
        />
      </Grid>
    </Grid>
  );
};

export default AdminPage;
