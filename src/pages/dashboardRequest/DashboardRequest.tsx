import { Grid } from '@mui/material';
import { useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { productId2ProductTitle } from '@pagopa/selfcare-common-frontend/lib/utils/productId2ProductTitle';
import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';
import { fetchOnboardingRequest } from '../../services/onboardingRequestService';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../utils/constants';
import ConfirmPage from '../confirmPage/ConfirmPage';
import RejectPage from '../rejectedPage/RejectPage';
import { getOutcomeAlert } from '../../components/getOutcomeAlert';
import { DashboardRequestHeading } from '../../components/DashboardRequestHeading';
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

  const isExpiredRequest =
    onboardingRequestData?.status !== 'COMPLETED' &&
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
          <DashboardRequestHeading
            isExpiredRequest={isExpiredRequest}
            requestStatus={onboardingRequestData?.status}
          />
          {isExpiredRequest
            ? getOutcomeAlert({
                severity: 'error',
                borderColor: 'error.main',
                message: t('onboardingRequestPage.expired.reason'),
              })
            : onboardingRequestData?.status === 'TOBEVALIDATED'
            ? getOutcomeAlert({
                severity: 'info',
                borderColor: 'info.main',
                message: t('onboardingRequestPage.checkPartyInfoAlert'),
              })
            : onboardingRequestData?.status === 'REJECTED' &&
              getOutcomeAlert({
                severity: 'warning',
                borderColor: 'warning.main',
                hasReason: true,
                updatedAt: onboardingRequestData?.updatedAt,
                reasonForReject: onboardingRequestData?.reasonForReject,
              })}
          <DashboardRequestFields onboardingRequestData={onboardingRequestData} isPSP={isPSP} />
          <DashboardRequestActions
            retrieveTokenIdFromUrl={retrieveTokenIdFromUrl}
            partyName={onboardingRequestData?.institutionInfo.name}
            productTitle={productId2ProductTitle(onboardingRequestData?.productId ?? '')}
            setShowRejectPage={setShowRejectPage}
            setShowConfirmPage={setShowConfirmPage}
            isToBeValidatedRequest={onboardingRequestData?.status === 'TOBEVALIDATED'}
          />
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}
