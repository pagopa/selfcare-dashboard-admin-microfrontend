import { theme } from '@pagopa/mui-italia/dist/theme/theme';
import { TFunction } from 'i18next';

export const getChipContent = (
  t: TFunction<'translation', undefined>,
  requestStatus: string | undefined
) => {
  switch (requestStatus) {
    case 'COMPLETED':
    case 'PENDING':
      return {
        bgColor: theme.palette.success.light,
        label: t('onboardingRequestPage.approvedDataChip'),
      };
    case 'REJECTED':
      return {
        bgColor: theme.palette.warning.main,
        label: t('onboardingRequestPage.rejectedDataChip'),
      };
    default:
      return {
        bgColor: theme.palette.info.main,
        label: t('onboardingRequestPage.validationDataChip'),
      };
  }
};
