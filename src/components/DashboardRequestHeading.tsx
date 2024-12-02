import { Grid, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getChipContent } from '../utils/getChipContent';

type Props = {
  isExpiredRequest: boolean;
  requestStatus: string;
};
export function DashboardRequestHeading({ isExpiredRequest, requestStatus }: Props) {
  const { t } = useTranslation();
  console.log(getChipContent(t, requestStatus).bgColor);
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={6}>
      <Grid item>
        <Typography variant="h4"> {t('onboardingRequestPage.title')} </Typography>
      </Grid>
      <Grid item>
        <Chip
          sx={{
            backgroundColor: isExpiredRequest
              ? 'error.main'
              : getChipContent(t, requestStatus).bgColor,
            height: '30px',
          }}
          label={
            isExpiredRequest
              ? t('onboardingRequestPage.expired.chip')
              : getChipContent(t, requestStatus).label
          }
        />
      </Grid>
    </Grid>
  );
}
