import { Button, Stack } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../../utils/constants';
import {
  approveOnboardingPspRequest,
  rejectOnboardingPspRequest,
} from '../../../services/dashboardRequestService';

type Props = {
  setShowRejectPage: Dispatch<SetStateAction<boolean | undefined>>;
  setShowConfirmPage: Dispatch<SetStateAction<boolean | undefined>>;
  isPendingRequest: boolean;
  retrieveTokenIdFromUrl?: string;
};

export default function DashboardRequestActions({
  setShowRejectPage,
  setShowConfirmPage,
  isPendingRequest,
  retrieveTokenIdFromUrl,
}: Props) {
  const addError = useErrorDispatcher();
  const setLoadingRetrieveOnboardingRequest = useLoading(LOADING_RETRIEVE_ONBOARDING_REQUEST);

  const { t } = useTranslation();
  const rejectOnboarding = () => {
    setLoadingRetrieveOnboardingRequest(true);
    if (retrieveTokenIdFromUrl) {
      rejectOnboardingPspRequest(retrieveTokenIdFromUrl)
        .then(() => setShowRejectPage(true))
        .catch((reason: any) => {
          addError({
            id: `Onboarding request with tokenId: ${retrieveTokenIdFromUrl} not rejected`,
            blocking: false,
            techDescription: reason,
            toNotify: false,
            error: new Error('INVALID_TOKEN_ID'),
          });
        })
        .finally(() => setLoadingRetrieveOnboardingRequest(false));
    }
  };

  const approveOnboarding = () => {
    setLoadingRetrieveOnboardingRequest(true);
    if (retrieveTokenIdFromUrl) {
      approveOnboardingPspRequest(retrieveTokenIdFromUrl)
        .then(() => setShowConfirmPage(true))
        .catch((reason: any) => {
          addError({
            id: `Onboarding request with tokenId: ${retrieveTokenIdFromUrl} not approved`,
            blocking: false,
            techDescription: reason,
            toNotify: false,
            error: new Error('INVALID_TOKEN_ID'),
          });
        })
        .finally(() => setLoadingRetrieveOnboardingRequest(false));
    }
  };
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={6} mb={6}>
      {isPendingRequest ? (
        <>
          <Stack>
            <Button
              variant="outlined"
              color="error"
              style={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
              onClick={rejectOnboarding}
            >
              {t('onboardingRequestPage.actions.declineButton')}
            </Button>
          </Stack>

          <Stack>
            <Button variant="contained" sx={{ marginLeft: 3 }} onClick={approveOnboarding}>
              {t('onboardingRequestPage.actions.approveButton')}
            </Button>
          </Stack>
        </>
      ) : (
        <Stack>
          <Button
            variant="outlined"
            sx={{ marginLeft: 3 }}
            onClick={() => window.location.assign('https://www.pagopa.it/it/')}
          >
            {t('onboardingRequestPage.actions.closeButton')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
