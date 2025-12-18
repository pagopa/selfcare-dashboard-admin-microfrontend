import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteComponentProps } from 'react-router-dom';

type Product = {
  id: string;
  name: string;
};

type LocationState = {
  products?: Array<Product>;
};

type RouteParams = {
  productId?: string;
};

type Props = RouteComponentProps<RouteParams>;

const SIDEBAR_WIDTH = 420;

export default function ContractBuildPage({ match, location }: Props) {
  const { t } = useTranslation();

  const isDesktop = useMediaQuery('(min-width:900px)');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const drawerVariant = useMemo(() => (isDesktop ? 'persistent' : 'temporary'), [isDesktop]);

  const state = location.state as LocationState | undefined;
  const products: Array<Product> = state?.products ?? [];

  const [selectedProductId, setSelectedProductId] = useState<string>(match.params.productId ?? '');

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container px={3} mt={3} spacing={3}>
        <Grid item xs={12}>
          <TitleBox
            variantTitle="h4"
            variantSubTitle="body1"
            title={t('contractEditor.title')}
            subTitle={t('contractEditor.subtitle')}
            mbTitle={2}
            mbSubTitle={3}
          />
        </Grid>

        {/* EDITOR */}
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
              position: 'relative',
              ...(isDesktop && sidebarOpen
                ? { width: `calc(100% - ${SIDEBAR_WIDTH}px)` }
                : { width: '100%' }),
            }}
          >
            <IconButton
              onClick={() => setSidebarOpen((v) => !v)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              {sidebarOpen ? <ChevronRightIcon /> : <TuneIcon />}
            </IconButton>

            <Typography variant="body2" color="textSecondary">
              Placeholder editor {selectedProductId && <b>({selectedProductId})</b>}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Drawer
        variant={drawerVariant as any}
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{
          sx: {
            width: SIDEBAR_WIDTH,
            p: 3,
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1">Informazioni contratto</Typography>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <TextField label="Nome documento" fullWidth />
          <TextField label="Versione" fullWidth />

          <TextField
            select
            label="Tipo prodotto"
            value={selectedProductId}
            fullWidth
            disabled={products.length === 0}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <MenuItem value="" disabled>
              Seleziona prodotto
            </MenuItem>

            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.id}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Drawer>
    </Box>
  );
}