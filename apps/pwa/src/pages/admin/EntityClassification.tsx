import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import EntityClassificationTable from 'sections/admin/entity-classification';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function EntityClassification() {
  const { translate } = useLocales();
  return (
    // <Page title="Entity Classification : Table">
    <Page title={translate('pages.admin.entity_class_table')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <EntityClassificationTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default EntityClassification;
