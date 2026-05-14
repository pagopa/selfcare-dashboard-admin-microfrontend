import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { PartyAccountItem } from '@pagopa/mui-italia';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Party } from '../../../model/Party';
import { ENV } from '../../../utils/env';
import { buildUrlLog } from '../../../utils/helper';
import { TruncatedTextWithTooltip } from '../../adminPage/utils/utils';

type AdminPartyInfoProps = {
  partyDetail: Party;
};

const AdminPartyInfo = ({ partyDetail }: AdminPartyInfoProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
      >
        <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <PartyAccountItem
            image={partyDetail.partyId ? buildUrlLog(partyDetail.partyId) : undefined}
            partyName={partyDetail.description || '-'}
            parentPartyName={partyDetail.parentDescription || undefined}
          />
        </Box>
        <Button
          variant="outlined"
          onClick={() =>
            history.push(
              resolvePathVariables(ENV.DASHBOARD_ROUTES.OVERVIEW, {
                partyId: partyDetail.partyId ?? '',
              })
            )
          }
          endIcon={<VisibilityIcon />}
          sx={{ flexShrink: 0 }}
        >
          {t('adminPage.selectedPartyDetails.redirectToOverview')}
        </Button>
      </Stack>

      <Grid container bgcolor={grey[100]} mt={2} alignItems="center" flexDirection="row">
        <Grid item xs={3} p={2}>
          <Typography variant="caption" color="textSecondary">
            {t('adminPage.selectedPartyDetails.fiscalCode')}
          </Typography>
          <Typography fontWeight="fontWeightMedium">{partyDetail.fiscalCode}</Typography>
        </Grid>
        <Grid item xs={4} p={2}>
          <Typography variant="caption" color="textSecondary">
            {t('adminPage.selectedPartyDetails.digitalAddress')}
          </Typography>

          <TruncatedTextWithTooltip text={partyDetail.digitalAddress || '-'} />
        </Grid>
        <Grid item p={2}>
          <Typography variant="caption" color="textSecondary">
            {t('adminPage.selectedPartyDetails.registeredOffice')}
          </Typography>
          <Typography fontWeight="fontWeightMedium">
            {`${partyDetail.registeredOffice} ${partyDetail.city}`}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminPartyInfo;
