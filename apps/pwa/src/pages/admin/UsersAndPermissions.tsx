import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import UsersAndPermissionsTable from 'sections/admin/users-and-permissions';
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
    // <Page title="Users and Permissions | Table">
    <Page title={translate('pages.admin.users_permissions_table')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <UsersAndPermissionsTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default UsersAndPermissions;
