import { CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';
import type { History } from 'history';

import { ContractDetail } from './components/ContractDetail';
import { useContracts } from './hooks/useContracts';

type Props = {
  history: History;
};

export default function ContractPage({ history }: Props) {
  const { t } = useTranslation();

  const { loading, products, contractsByProduct } = useContracts();

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%', backgroundColor: 'transparent !important' }}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('contractPage.title')}
          subTitle={t('contractPage.subtitle')}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={2}>
          {products.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              {t('contractPage.noProducts')}
            </Typography>
          ) : (
            products.map((product) => {
              const contracts = contractsByProduct[product.id] ?? [];

              return (
                <ContractDetail
                  key={product.id}
                  product={product}
                  contracts={contracts}
                  onCreate={() => history.push(`/contracts/${product.id}/editor`)}
                  onEdit={(contractTemplateId) =>
                    history.push(`/contracts/${product.id}/${contractTemplateId}/editor`)
                  }
                  expanded={false}
                />
              );
            })
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
