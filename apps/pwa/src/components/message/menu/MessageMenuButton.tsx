import { Button, Stack, Typography } from '@mui/material';
import Iconify from '../../Iconify';

type Props = {
  onClick?: () => void;
};

export default function MessageMenuButton({ onClick }: Props) {
  return (
    <Stack alignItems="flex-end" sx={{ mt: '0 !important' }}>
      <Button
        onClick={() => {
          if (onClick !== undefined) onClick();
        }}
        sx={{
          backgroundColor: '#0E8478',
          color: '#fff',
          borderRadius: 2,
          padding: 2,
          width: '162px',
          height: '51px',
        }}
        endIcon={<Iconify icon={'bi:chat-square-text'} color="#fff" width={24} height={24} />}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '10px',
            color: '#fff',
          }}
        >
          Create a new message
        </Typography>
      </Button>
    </Stack>
  );
}
