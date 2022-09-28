import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import RegionsProjectLocationTable from 'sections/admin/regions-project-location';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function RegionsProjectLocation() {
  return (
    <Page title="Bank Name : Table">
      <ContentStyle>
        <Box sx={{ px: '30px' }}>{/* <RegionsProjectLocationTable /> */}</Box>
      </ContentStyle>
    </Page>
  );
}

export default RegionsProjectLocation;
