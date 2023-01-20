import { Box, Button, Stack, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { FusionAuthRoles } from '../../@types/commons';

import Iconify from '../Iconify';

interface FloatingActionBarProps {
  role: FusionAuthRoles;
  handleAccept: () => void;
  handleReject: () => void;
}

function FloatingActionBar(props: FloatingActionBarProps) {
  const theme = useTheme();
  const { currentLang, translate } = useLocales();

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 3,
        borderRadius: 1,
        position: 'sticky',
        width: '100%',
        bottom: 24,
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="space-between">
        <Stack flexDirection={{ sm: 'column', md: 'row' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: { md: '1em' } }}
            onClick={() => {
              props.handleAccept();
            }}
          >
            {translate('account_manager.accept_project')}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ my: { xs: '1.3em', md: '0' }, mr: { md: '1em' } }}
            onClick={() => {
              props.handleReject();
            }}
          >
            {translate('account_manager.reject_project')}
          </Button>

          {props.role === 'tender_moderator' && (
            <Button variant="outlined" color="primary" sx={{ my: { xs: '1.3em', md: '0' } }}>
              {translate('send_message_to_partner')}
            </Button>
          )}
        </Stack>

        <Button variant="contained" color="info" endIcon={<Iconify icon="eva:edit-2-outline" />}>
          {translate('submit_amendment_request')}
        </Button>
      </Stack>
    </Box>
  );
}

export default FloatingActionBar;
