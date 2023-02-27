import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import RegionsProjectLocationTable from 'sections/admin/regions-project-location';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function RegionsProjectLocation() {
  const { translate } = useLocales();
  return (
    // <Page title="Regions Project Location : Table">
    <Page title={translate('pages.admin.regions_project_location_table')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>{/* <RegionsProjectLocationTable /> */}</Box>
      </ContentStyle>
    </Page>
  );
}

export default RegionsProjectLocation;
