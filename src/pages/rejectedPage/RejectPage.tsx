import { Button, Grid, Typography } from '@mui/material';
import { IllusCompleted } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';
import { ENV } from '../../utils/env';

type Props = {
  onboardingRequestData?: OnboardingRequestResource;
};
export default function RejectPage({ onboardingRequestData }: Props) {
  const { t } = useTranslation();
  return (
    <Grid
      item
      container
      xs={12}
      mt={13}
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <IllusCompleted size={60} />
      <Grid item mt={3}>
        <Typography variant="h4">{t('rejectPage.title')}</Typography>
      </Grid>
      <Grid item xs={4} display="flex" alignItems={'center'}>
        <Typography variant="body1" textAlign="center">
          <Trans i18nKey="rejectPage.description">
            L’adesione di {{ ente: onboardingRequestData?.institutionInfo.name }} non è andata a
            buon fine. Invieremo un’email all’indirizzo PEC indicato. Al suo interno, ci sono le
            istruzioni per completare l’adesione.
          </Trans>
        </Typography>
      </Grid>
      <Button
        variant="contained"
        sx={{ alignSelf: 'center' }}
        onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
      >
        {t('rejectPage.backLabel')}
      </Button>
    </Grid>
  );
}
