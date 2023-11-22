import { LoadingButton } from '@mui/lab';
import { Stack, Button, Box } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import { FEATURE_PROJECT_SAVE_DRAFT } from '../../../../config';

type PROPS = {
  onReturn: () => void;
  // onSavingDraft: () => void;
  lastStep?: boolean;
  step: number;
  isStep?: boolean;
  isDraft: (draft: boolean) => void;
  isLoad?: boolean;
};
const ActionBox = ({ onReturn, lastStep, step, isStep, isDraft, isLoad }: PROPS) => {
  const { translate } = useLocales();

  return (
    <Stack direction="row" justifyContent="center">
      <Box
        sx={{
          borderRadius: 2,
          height: 'auto',
          backgroundColor: '#fff',
          padding: '24px',
          width: '100%',
        }}
      >
        <Stack justifyContent="center" direction={{ xs: 'column', sm: 'row' }} gap={3}>
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
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }} />
          <LoadingButton
            loading={isLoad}
            variant="outlined"
            type="submit"
            sx={{
              color: 'text.primary',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              borderColor: '#000',
            }}
            onClick={() => isDraft(true)}
            disabled={!FEATURE_PROJECT_SAVE_DRAFT ? true : step < 5 ? false : true}
          >
            {translate('saving_as_draft')}
          </LoadingButton>
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
            {lastStep ? translate('send') : translate('next')}
          </LoadingButton>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ActionBox;
