import { Stack, Button, Box } from '@mui/material';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';

type PROPS = {
  onReturn: () => void;
  onSavingDraft: () => void;
  lastStep?: boolean;
};
const ActionBox = ({ onReturn, onSavingDraft, lastStep }: PROPS) => (
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
          رجوع
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
        >
          حفظ كمسودة
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
          {lastStep ? 'إرسال' : 'التالي'}
        </Button>
      </Stack>
    </Box>
  </Stack>
);

export default ActionBox;
