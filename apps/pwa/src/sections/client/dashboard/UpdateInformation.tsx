import { Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import useLocales from '../../../hooks/useLocales';
import React from 'react';

interface UpdateInformationProps {
  onClose: () => void;
  loading?: boolean;
}
const UpdateInformation = ({ onClose, loading }: UpdateInformationProps) => {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate('/client/my-profile');
    onClose();
  };

  return (
    <Container sx={{ paddingTop: '20px' }}>
      <Stack direction="column" justifyContent="center" sx={{ px: 20, py: 7 }}>
        <Typography variant="h6" textAlign="center">
          {translate('pages.client.information_content')}
        </Typography>
      </Stack>
      <Stack justifyContent="center" direction="row" gap={2} sx={{ mt: 10 }}>
        <Button
          onClick={navigateToProfile}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: 'background.paper',
            color: '#fff',
            width: { xs: '100%', sm: '200px' },
            height: { xs: '100%', sm: '40px' },
            '&:hover': { backgroundColor: '#13B2A2' },
          }}
        >
          {translate('pages.client.update_button_information')}
        </Button>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: '#FF4842',
            color: '#fff',
            ':hover': { backgroundColor: '#FF170F' },
          }}
        >
          {/* إغلاق */}
          {translate('pages.client.later_button_information')}
        </Button>
      </Stack>
    </Container>
  );
};

export default UpdateInformation;
