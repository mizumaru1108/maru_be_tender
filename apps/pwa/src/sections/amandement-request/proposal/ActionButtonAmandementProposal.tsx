import { LoadingButton } from '@mui/lab';
import { Box, Grid, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';
// import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
// import ConfirmApprovedEditRequest from './ConfirmApprovedEditRequest';
interface Props {
  // EditStatus: string;
  // setOpen: () => void;
  isLoad: boolean;
  isDisabled: boolean;
}
function ActionButtonAmandementProposal({ isLoad, isDisabled }: Props) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleRejected = () => {
    // setOpen();
    alert('Accept Edit Request');
  };

  const handleAccepted = async () => {
    // setOpenModal(!openModal);
    alert('Accept Edit Request');
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 3,
        borderRadius: 1,
        position: 'sticky',
        width: '53%',
        bottom: 24,
        border: `1px solid ${theme.palette.grey[400]}`,
      }}
    >
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item xs={12} md={6}>
          {/* <Button
            onClick={() => handleAccepted()}
            variant="contained"
            color="primary"
            // disabled={EditStatus === 'REJECTED' || EditStatus === 'APPROVED'}
            // disabled
          >
            {translate('account_manager.button.approveEdit')}
          </Button> */}
          <LoadingButton
            loading={isLoad}
            type="submit"
            variant="outlined"
            disabled={isDisabled}
            endIcon={!isLoad && <CheckOutlinedIcon />}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              '&:hover': { backgroundColor: '#0E8478' },
            }}
          >
            {translate('send')}
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={6}>
          {
            /* <Button
            variant="contained"
            color="error"
            onClick={() => handleRejected()}
            // disabled={EditStatus === 'REJECTED' || EditStatus === 'APPROVED'}
            // disabled
          >
            {translate('account_manager.button.rejectEdit')}
          </Button> */
            <LoadingButton
              onClick={() => navigate(-1)}
              loading={isLoad}
              endIcon={!isLoad && <ReplyOutlinedIcon />}
              sx={{
                color: 'text.primary',
                width: { xs: '100%', sm: '200px' },
                // hieght: { xs: '100%', sm: '50px' },
              }}
            >
              {translate('going_back_one_step')}
            </LoadingButton>
          }
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActionButtonAmandementProposal;
