import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { IllusCompleted } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';
import { ENV } from '../../utils/env';

type Props = {
  onboardingRequestData?: OnboardingRequestResource;
};

export default function ConfirmPage({ onboardingRequestData }: Props) {
  const { t } = useTranslation();
  return (
    <Grid item container xs={12} justifyContent="center" flexDirection="column" alignItems="center">
      <Stack mt={13} alignItems="center">
        <IllusCompleted size={60} />
        <Box mt={3}>
          <Typography variant="h4">{t('confirmPage.title')}</Typography>
        </Box>
        <Grid item xs={5} display="flex" alignItems={'center'} mt={2}>
          <Typography variant="body1" textAlign="center">
            <Trans i18nKey="confirmPage.description">
              L’adesione di
              <strong> {{ ente: onboardingRequestData?.institutionInfo.name }} </strong>è stata
              approvata. Invieremo all’indirizzo PEC indicato un’email con le istruzioni per
              completare l’adesione.
            </Trans>
          </Typography>
        </Grid>
        <Button
          variant="contained"
          sx={{ alignSelf: 'center', mt: 4 }}
          onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
        >
          {t('confirmPage.backLabel')}
        </Button>
      </Stack>
    </Grid>
  );
}
