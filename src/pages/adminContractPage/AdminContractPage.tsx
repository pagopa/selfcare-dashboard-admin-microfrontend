import { Container, Grid, Typography, Box } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useState } from 'react';
import LexicalEditor from './components/LexicalEditor';
import ContractPreview from './components/ContractPreview';

const AdminContractPage = () => {
  const [contractContent, setContractContent] = useState('');

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <TitleBox title="Contratti Admin" subTitle="Gestione dei contratti amministrativi" />
      
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Editor Contratto
              </Typography>
            </Box>
            <LexicalEditor onContentChange={setContractContent} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Anteprima
              </Typography>
            </Box>
            <ContractPreview content={contractContent} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminContractPage;
