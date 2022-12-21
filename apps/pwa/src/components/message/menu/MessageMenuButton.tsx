import { Button, Stack, Typography } from '@mui/material';
import useLocales from '../../../hooks/useLocales';
import Iconify from '../../Iconify';

type Props = {
  onClick?: () => void;
};

export default function MessageMenuButton({ onClick }: Props) {
  const { translate } = useLocales();
  return (
    <Stack alignItems="flex-start">
      <Button
        variant="contained"
        size="medium"
        onClick={() => {
          if (onClick !== undefined) onClick();
        }}
      >
        <Iconify
          icon={'bi:chat-square-text'}
          width={16}
          height={16}
          sx={{ mr: 1 }}
        />
        {translate('new_message_modal.title')}
      </Button>
    </Stack>
  );
}
