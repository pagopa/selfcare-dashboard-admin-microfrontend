import { Alert, Chip, Grid, Typography } from '@mui/material';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { productId2ProductTitle } from '@pagopa/selfcare-common-frontend/utils/productId2ProductTitle';
import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';
import { fetchOnboardingRequest } from '../../services/onboardingRequestService';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../utils/constants';
import ConfirmPage from '../confirmPage/ConfirmPage';
import RejectPage from '../rejectedPage/RejectPage';
import RetrieveTokenErrorPage from './JwtInvalidPage';
import DashboardRequestActions from './components/DashboardRequestActions';
import DashboardRequestFields from './components/DashboardRequestFields';

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function DashboardRequest() {
  const { t } = useTranslation();
  const setLoadingRetrieveOnboardingRequest = useLoading(LOADING_RETRIEVE_ONBOARDING_REQUEST);

  const [onboardingRequestData, setOnboardingRequestData] = useState<OnboardingRequestResource>();
  const [showRejectPage, setShowRejectPage] = useState<boolean>();
  const [showConfirmPage, setShowConfirmPage] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  // eslint-disable-next-line functional/immutable-data
  const retrieveTokenIdFromUrl = window.location.pathname.split('/').pop();

  const isPSP = onboardingRequestData?.institutionInfo.institutionType === 'PSP';

  const productTitle = productId2ProductTitle(onboardingRequestData?.productId ?? '');

  useEffect(() => {
    if (retrieveTokenIdFromUrl) {
      retrieveOnboardingRequest(retrieveTokenIdFromUrl);
    }
  }, [retrieveTokenIdFromUrl]);

  const retrieveOnboardingRequest = (retrieveTokenIdFromUrl: string) => {
    setLoadingRetrieveOnboardingRequest(true);
    fetchOnboardingRequest(retrieveTokenIdFromUrl)
      .then((r) => {
        setOnboardingRequestData(r);
      })
      .catch(() => {
        setError(true);
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
        case 'PENDING':
          return t('onboardingRequestPage.validationDataChip');
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
        case 'PENDING':
          return 'info.main';
        case 'REJECTED':
          return 'warning.main';
        default:
          return 'info.main';
      }
    }
    return undefined;
  };

  const fromISO2ITA = (date?: string) => {
    const dateFormat = new Date(date as string);
    const day = dateFormat.getDate();
    const month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();

    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  };

  const isExpiredRequest =
    onboardingRequestData?.status !== 'ACTIVE' &&
    onboardingRequestData?.status !== 'REJECTED' &&
    onboardingRequestData?.expiringDate
      ? new Date(onboardingRequestData?.expiringDate) <= new Date()
      : false;

  return showRejectPage ? (
    <RejectPage onboardingRequestData={onboardingRequestData} />
  ) : showConfirmPage ? (
    <ConfirmPage onboardingRequestData={onboardingRequestData} />
  ) : error ? (
    <RetrieveTokenErrorPage />
  ) : onboardingRequestData ? (
    <Grid container justifyContent="center">
      <Grid container sx={{ width: '920px' }}>
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" mt={6}>
            <Grid item>
              <Typography variant="h4"> {t('onboardingRequestPage.title')} </Typography>
            </Grid>
            <Grid item>
              <Chip
                sx={{
                  backgroundColor: isExpiredRequest
                    ? 'error.main'
                    : requestState(onboardingRequestData?.status, false, true),
                  height: '30px',
                }}
                label={
                  isExpiredRequest
                    ? t('onboardingRequestPage.expired.chip')
                    : requestState(onboardingRequestData?.status, true, false)
                }
              />
            </Grid>
          </Grid>
          {isExpiredRequest ? (
            <Grid item xs={12} width="100%" mt={5}>
              <Alert
                severity="error"
                sx={{
                  fontSize: 'fontSize',
                  height: '53px',
                  alignItems: 'center',
                  color: 'colorTextPrimary',
                  borderLeft: 'solid',
                  borderLeftColor: 'error.main',
                  borderLeftWidth: '4px',
                  width: '100%',
                }}
              >
                {t('onboardingRequestPage.expired.reason')}
              </Alert>
            </Grid>
          ) : onboardingRequestData?.status === 'TOBEVALIDATED' ? (
            <Grid item xs={12} width="100%" mt={5}>
              <Alert
                severity="info"
                sx={{
                  fontSize: 'fontSize',
                  height: '53px',
                  alignItems: 'center',
                  color: 'colorTextPrimary',
                  borderLeft: 'solid',
                  borderLeftColor: 'info.main',
                  borderLeftWidth: '4px',
                  width: '100%',
                }}
              >
                {t('onboardingRequestPage.checkPartyInfoAlert')}
              </Alert>
            </Grid>
          ) : (
            onboardingRequestData?.status === 'REJECTED' && (
              <Grid item xs={12} width="100%" mt={5}>
                <Alert
                  severity="warning"
                  sx={{
                    fontSize: 'fontSize',
                    height: '74px',
                    alignItems: 'center',
                    color: 'colorTextPrimary',
                    borderLeft: 'solid',
                    borderLeftColor: 'warning.main',
                    borderLeftWidth: '4px',
                    width: '100%',
                  }}
                >
                  <Trans
                    i18nKey={
                      'onboardingRequestPage.checkPartyInfoAlert.checkPartyRejectReasonAlert'
                    }
                    components={{
                      1: <strong style={{ fontWeight: '600' }} />,
                      3: <br />,
                    }}
                  >
                    {`<1>Hai rifiutato questa richiesta di adesione il ${fromISO2ITA(
                      onboardingRequestData?.updatedAt
                    )}. </1> <3/>Motivo del rifiuto: “${onboardingRequestData?.reasonForReject}“`}
                  </Trans>
                </Alert>
              </Grid>
            )
          )}
          <DashboardRequestFields onboardingRequestData={onboardingRequestData} isPSP={isPSP} />
          <DashboardRequestActions
            retrieveTokenIdFromUrl={retrieveTokenIdFromUrl}
            partyName={onboardingRequestData?.institutionInfo.name}
            productTitle={productTitle}
            setShowRejectPage={setShowRejectPage}
            setShowConfirmPage={setShowConfirmPage}
            isPendingRequest={onboardingRequestData?.status === 'TOBEVALIDATED'}
          />
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}
