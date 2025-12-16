import { useState } from 'react';

import { CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';
import { useContracts } from './hooks/useContracts';
import { ProductAccordion } from './components/ProductAccordion';

export default function ContractPage() {
  const { t } = useTranslation();
  const { loading, products, contractsByProduct } = useContracts();
  const [expandedProduct, setExpandedProduct] = useState<string | false>(false);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%' }}>
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
            <Typography variant="body2">Nessun prodotto disponibile</Typography>
          ) : (
            products.map((product) => (
              <ProductAccordion
                key={product.id}
                product={product}
                contracts={contractsByProduct[product.id] ?? []}
                expanded={expandedProduct === product.id}
                onToggle={() =>
                  setExpandedProduct(expandedProduct === product.id ? false : product.id)
                }
              />
            ))
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
