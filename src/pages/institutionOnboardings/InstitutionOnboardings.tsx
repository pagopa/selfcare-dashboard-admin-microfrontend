import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { FiltersBar } from './components/FiltersBar/FiltersBar';

const InstitutionOnboardings = () => {
  const { t } = useTranslation();
  return (
    <Grid container px={3} mt={3} sx={{ width: '100%' }}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('institutionOnboardings.title')}
          subTitle={t('institutionOnboardings.subtitle')}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>
      <Grid item xs={12}>
        <FiltersBar />
      </Grid>
    </Grid>
  );
};

export default InstitutionOnboardings;
