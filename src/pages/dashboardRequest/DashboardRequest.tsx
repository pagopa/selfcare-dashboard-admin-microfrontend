import { Chip, Grid, Typography, Alert, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formData, OnboardingDataDto } from '../../services/dashboardRequestService';
import ConfirmPage from '../confirmPage/ConfirmPage';
import RejectPage from '../rejectedPage/RejectPage';
import DashboardRequestActions from './components/DashboardRequestActions';
import DashboardRequestFields from './components/DashboardRequestFields';

const CustomAlert = styled(Alert)({
  '& .MuiAlert-icon': {
    color: '#FFCB46',
  },
});

export default function DashboardRequestToBeAnswered() {
  const { t } = useTranslation();
  const [showRejectPage, setShowRejectPage] = useState<boolean>();
  const [showConfirmPage, setShowConfirmPage] = useState<boolean>();
  const [data, setData] = useState<OnboardingDataDto>();

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    const getTaxCode = window.location.search.split('/').pop();
    const pspBillingData = formData.find((data) => data.billingData.taxCode === getTaxCode);

    setData(pspBillingData);
  }, []);
  // TODO: to remove when api will be ready
  const toValidateState = data?.status === 'PENDING';

  const stateCondtition = (state: any, isChipLabelState: boolean, isBgColorChipState: boolean) => {
    if (isChipLabelState) {
      switch (state) {
        case 'APPROVED':
          return t('requestToBeAnsweredPage.approvedDataChip');
        case 'REJECT':
          return t('requestToBeAnsweredPage.rejectedDataChip');
        default:
          return t('requestToBeAnsweredPage.validationDataChip');
      }
    }
    if (isBgColorChipState) {
      switch (state) {
        case 'APPROVED':
          return 'success.light';
        case 'REJECTED':
          return 'error.light';
        default:
          return 'warning.main';
      }
    }
    return undefined;
  };

  return showRejectPage ? (
    <RejectPage data={data} />
  ) : showConfirmPage ? (
    <ConfirmPage data={data} />
  ) : (
    <Grid container ml={32} sx={{ width: '920px' }}>
      <Grid item xs={12}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={6}>
          <Grid item>
            <Typography variant="h4"> {t('requestToBeAnsweredPage.title')} </Typography>
          </Grid>
          <Grid item>
            <Chip
              sx={{
                backgroundColor: stateCondtition(data?.status, false, true),
                height: '30px',
              }}
              label={stateCondtition(data?.status, true, false)}
            />
          </Grid>
        </Grid>
        {toValidateState && (
          <Grid item xs={12} width="100%" mt={5}>
            <CustomAlert
              severity="warning"
              sx={{
                fontSize: 'fontSize',
                backgroundColor: 'background.paper',
                height: '80px',
                alignItems: 'center',
                color: 'colorTextPrimary',
                borderLeft: 'solid',
                borderLeftColor: 'warning.main',
                borderLeftWidth: '4px',
                width: '100%',
              }}
            >
              {t('requestToBeAnsweredPage.checkPartyInfoAlert')}
            </CustomAlert>
          </Grid>
        )}
        <DashboardRequestFields />
        <DashboardRequestActions
          setShowRejectPage={setShowRejectPage}
          setShowConfirmPage={setShowConfirmPage}
          toValidateState={toValidateState}
        />
      </Grid>
    </Grid>
  );
}
