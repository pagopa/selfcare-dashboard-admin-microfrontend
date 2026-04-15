import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';

const InstitutionOnboardings = () => {
  const { t } = useTranslation();
  return (
    <>
      <Grid container px={3} mt={3} sx={{ width: '100%' }}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('institutionOnboardings.title')}
          subTitle={t('institutionOnboardings.subtitle')}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>
    </>
  );
};

export default InstitutionOnboardings;
