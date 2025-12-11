import { Box, Typography } from '@mui/material';

const ContractHeader = (): JSX.Element => (
  <Box
    sx={{
      textAlign: 'center',
      mb: 4,
      pb: 3,
      borderBottom: '2px solid #333',
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
      CONTRATTO AMMINISTRATIVO
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {new Date().toLocaleDateString('it-IT')}
    </Typography>
  </Box>
);

export default ContractHeader;
