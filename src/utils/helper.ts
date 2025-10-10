import { ENV } from './env';

export const buildUrlLog = (partyId: string) =>
  `${ENV.URL_INSTITUTION_LOGO.PREFIX}${partyId}${ENV.URL_INSTITUTION_LOGO.SUFFIX}`;
