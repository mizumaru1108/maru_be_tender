import { Box, styled } from '@mui/material';
import React from 'react';
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
    <Page title={translate('pages.admin.entity_area_table')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          {/* <EntityClassificationTable /> */}
          entity area
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default EntityArea;
