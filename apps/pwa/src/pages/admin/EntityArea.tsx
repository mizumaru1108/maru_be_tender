import { Box, styled } from '@mui/material';
import React from 'react';
import GovernoratesTable from 'sections/admin/governorate';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));
function EntityArea() {
  const { translate } = useLocales();

  // return <div>EntityArea</div>;
  return (
    <Page title={translate('pages.admin.settings.label.governorate.list_of_governorate')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <GovernoratesTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default EntityArea;
