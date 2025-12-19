import { Button, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router-dom';
import { ENV } from '../../utils/env';
import { ContractDetail } from './components/ContractDetail';
import { useContracts } from './hooks/useContracts';

export default function ContractPage() {
  const { t } = useTranslation();

  const { loading, products, contractsByProduct } = useContracts();
  const history = useHistory();

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%', backgroundColor: 'transparent !important' }}>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('contractPage.title')}
          subTitle={t('contractPage.subtitle')}
          mbTitle={2}
          mbSubTitle={2}
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              history.push(ENV.ROUTES.ADMIN_CONTRACT_EDITOR, {
                products,
              });
            }}
          >
            {t('contractPage.new')}
          </Button>
        </Stack>
        <Divider sx={{ mt: 2 }} />
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
                  onEdit={(contractTemplateId) =>
                    history.push(
                      `${ENV.ROUTES.ADMIN_CONTRACT_EDITOR}/${product.id}/${contractTemplateId}/editor`,
                      { products }
                    )
                  }
                  expanded={false}
                  products={products}
                />
              );
            })
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
