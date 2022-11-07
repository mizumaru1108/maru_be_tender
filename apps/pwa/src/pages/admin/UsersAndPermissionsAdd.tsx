import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import AddNewUser from 'sections/admin/users-and-permissions/list/AddNewUser';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function UsersAndPermissions() {
  return (
    <Page title="Add New Employee | Admin">
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <AddNewUser />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default UsersAndPermissions;
