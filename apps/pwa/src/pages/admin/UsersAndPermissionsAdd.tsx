import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import AddNewUser from 'sections/admin/users-and-permissions/list/AddNewUser';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function UsersAndPermissions() {
  const { translate } = useLocales();
  return (
    // <Page title="Add New Employee | Admin">
    <Page title={translate('pages.admin.add_new_employee')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <AddNewUser />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default UsersAndPermissions;
