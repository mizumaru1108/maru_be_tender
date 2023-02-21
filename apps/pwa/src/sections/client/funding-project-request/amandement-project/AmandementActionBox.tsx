import { LoadingButton } from '@mui/lab';
import { Stack, Button, Box } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import { FEATURE_PROJECT_SAVE_DRAFT } from '../../../../config';

type PROPS = {
  onReturn: () => void;
  // onSavingDraft: () => void;
  step: number;
  isLoad?: boolean;
};
const AmandementActionBox = ({ onReturn, step, isLoad }: PROPS) => {
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
          <LoadingButton
            onClick={onReturn}
            loading={isLoad}
            endIcon={!isLoad && <MovingBack />}
            sx={{
              color: 'text.primary',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            {translate('going_back_one_step')}
          </LoadingButton>
          <Box sx={{ width: '10px' }} />
          <LoadingButton
            loading={isLoad}
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
            {step === 3 ? translate('send') : translate('next')}
          </LoadingButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default AmandementActionBox;
