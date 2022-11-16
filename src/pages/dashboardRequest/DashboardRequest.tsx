import { Chip, Grid, Typography, Alert, styled } from '@mui/material';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';
import { fetchOnboardingPspRequest } from '../../services/dashboardRequestService';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../utils/constants';
import ConfirmPage from '../confirmPage/ConfirmPage';
import RejectPage from '../rejectedPage/RejectPage';
import DashboardRequestActions from './components/DashboardRequestActions';
import DashboardRequestFields from './components/DashboardRequestFields';

const CustomAlert = styled(Alert)({
  '& .MuiAlert-icon': {
    color: '#FFCB46',
  },
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function DashboardRequest() {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoadingRetrieveOnboardingRequest = useLoading(LOADING_RETRIEVE_ONBOARDING_REQUEST);

  const [onboardingRequestData, setOnboardingRequestData] = useState<OnboardingRequestResource>();
  const [showRejectPage, setShowRejectPage] = useState<boolean>();
  const [showConfirmPage, setShowConfirmPage] = useState<boolean>();

  // eslint-disable-next-line functional/immutable-data
  const retrieveTokenIdFromUrl = window.location.pathname.split('/').pop();

  useEffect(() => {
    if (retrieveTokenIdFromUrl) {
      onboardingPspRequestData(retrieveTokenIdFromUrl);
    }
  }, [retrieveTokenIdFromUrl]);

  const onboardingPspRequestData = (retrieveTokenIdFromUrl: string) => {
    setLoadingRetrieveOnboardingRequest(true);
    fetchOnboardingPspRequest(retrieveTokenIdFromUrl)
      .then((r) => setOnboardingRequestData(r))
      .catch((reason) => {
        addError({
          id: `Onboarding request with tokenId: ${retrieveTokenIdFromUrl} not found`,
          blocking: false,
          techDescription: reason,
          toNotify: false,
          error: new Error('INVALID_TOKEN_ID'),
        });
      })
      .finally(() => setLoadingRetrieveOnboardingRequest(false));
  };

  const requestState = (
    requestStatus: string | undefined,
    isChipLabelState: boolean,
    isBgColorChipState: boolean
  ) => {
    if (isChipLabelState) {
      switch (requestStatus) {
        case 'ACTIVE':
          return t('onboardingRequestPage.approvedDataChip');
        case 'REJECTED':
          return t('onboardingRequestPage.rejectedDataChip');
        default:
          return t('onboardingRequestPage.validationDataChip');
      }
    }
    if (isBgColorChipState) {
      switch (requestStatus) {
        case 'ACTIVE':
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
    <RejectPage />
  ) : showConfirmPage ? (
    <ConfirmPage />
  ) : (
    <Grid container ml={32} sx={{ width: '920px' }}>
      <Grid item xs={12}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={6}>
          <Grid item>
            <Typography variant="h4"> {t('onboardingRequestPage.title')} </Typography>
          </Grid>
          <Grid item>
            <Chip
              sx={{
                backgroundColor: requestState(onboardingRequestData?.status, false, true),
                height: '30px',
              }}
              label={requestState(onboardingRequestData?.status, true, false)}
            />
          </Grid>
        </Grid>
        {onboardingRequestData?.status === 'PENDING' && (
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
              {t('onboardingRequestPage.checkPartyInfoAlert')}
            </CustomAlert>
          </Grid>
        )}
        <DashboardRequestFields onboardingRequestData={onboardingRequestData} />
        <DashboardRequestActions
          setShowRejectPage={setShowRejectPage}
          setShowConfirmPage={setShowConfirmPage}
          isPendingRequest={onboardingRequestData?.status === 'TOBEVALIDATED'}
        />
      </Grid>
    </Grid>
  );
}
