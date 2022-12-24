// @mui
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  SxProps,
  Button,
  Box,
} from '@mui/material';
import IconClose from '../../assets/employee/ic-close.svg';
import Image from 'components/Image';

// ----------------------------------------------------------------------

type Props = {
  isOpen: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  styleContent?: SxProps;
  content?: string | React.ReactNode;
  title?: string | React.ReactNode;
  onClose: () => void;
  actionBtn?: React.ReactNode;
  showCancelBtn?: boolean;
  showCloseIcon?: boolean;
  stepper: React.ReactNode;
};

const defaultProps = {
  fullWidth: true,
  maxWidth: 'sm',
  styleContent: {},
  showCancelBtn: false,
  showCloseIcon: false,
};

export function ModalDialogStepper({
  fullWidth,
  maxWidth,
  isOpen,
  title,
  content,
  styleContent,
  onClose,
  showCancelBtn,
  showCloseIcon,
  actionBtn,
  stepper,
}: Props) {
  return (
    <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={isOpen} onClose={() => onClose()}>
      {title && (
        <DialogTitle sx={styleContent}>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ flexDirection: 'column', gap: 2 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {title}
              {showCloseIcon && (
                <Image
                  onClick={() => onClose()}
                  alt="close-icon"
                  src={IconClose}
                  width={12}
                  height={12}
                  sx={{ cursor: 'pointer' }}
                />
              )}
            </Box>
            {stepper}
          </Box>
        </DialogTitle>
      )}
      <DialogContent sx={styleContent}>{content}</DialogContent>
      <DialogActions
        style={{ padding: !showCancelBtn && !actionBtn ? 0 : 24, justifyContent: 'center' }}
        sx={styleContent}
      >
        {showCancelBtn && (
          <Button variant="outlined" size="medium" color="inherit" onClick={() => onClose()}>
            Cancel
          </Button>
        )}
        {actionBtn && actionBtn}
      </DialogActions>
    </Dialog>
  );
}
ModalDialogStepper.defaultProps = defaultProps;
