import { Grid, Paper, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';
import type { RouteComponentProps } from 'react-router-dom';

type RouteParams = {
  productId: string;
  contractTemplateId?: string;
};

type Props = RouteComponentProps<RouteParams>;

export default function ContractBuildPage({ match }: Props) {
  const { t } = useTranslation();
  const { productId } = match.params;

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%' }}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('contractEditor.title')}
          subTitle={t(
            'contractEditor.subtitle',
          )}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>

      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: '1px dashed',
            borderColor: 'divider',
            minHeight: 520,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Placeholder editor <b>{productId}</b>
          </Typography>

          {/*
            QUI IN FUTURO:
            <ExternalContractEditor
              productId={productId}
              initialData={...}
              onSave={(payload) => callService(payload)}
            />
          */}
        </Paper>
      </Grid>
    </Grid>
  );
}
