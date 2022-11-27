import { Stack, Button, Box } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';

type PROPS = {
  onReturn: () => void;
  onSavingDraft: () => void;
  lastStep?: boolean;
  step: number;
};
const ActionBox = ({ onReturn, onSavingDraft, lastStep, step }: PROPS) => {
  const { translate } = useLocales();

  return (
    <Stack direction="row" justifyContent="center">
      <Box
        sx={{
          borderRadius: 2,
          height: '90px',
          backgroundColor: '#fff',
          padding: '24px',
        }}
      >
        <Stack justifyContent="center" direction="row" gap={3}>
          <Button
            onClick={onReturn}
            endIcon={<MovingBack />}
            sx={{
              color: 'text.primary',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            {translate('going_back_one_step')}
          </Button>
          <Box sx={{ width: '10px' }} />
          <Button
            variant="outlined"
            sx={{
              color: 'text.primary',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              borderColor: '#000',
            }}
            onClick={onSavingDraft}
            // disabled={step ? false : true}
            disabled
          >
            {translate('saving_as_draft')}
          </Button>
          <Button
            type="submit"
            variant="outlined"
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              '&:hover': { backgroundColor: '#0E8478' },
            }}
          >
            {lastStep ? translate('send') : translate('next')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ActionBox;
