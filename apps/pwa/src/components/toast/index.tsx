import { sentenceCase } from 'change-case';
// @mui
import { Snackbar, Alert, AlertTitle } from '@mui/material';

// ----------------------------------------------------------------------

type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';
type ToastType = 'success' | 'warning' | 'error' | 'info';
type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right' | 'center';
type ToastVariant = 'outlined' | 'filled' | 'standard';

type Props = {
  isOpen: boolean;
  autoHideDuration?: number;
  position?: ToastPosition;
  title?: string;
  message?: string;
  onClose: () => void;
  toastType: ToastType;
  variant: ToastVariant;
};

export default function Toast({
  isOpen,
  autoHideDuration,
  position,
  title,
  message,
  onClose,
  toastType,
  variant,
}: Props) {
  const verticalPos: VerticalPosition =
    ((position && position.split('-')[0]) as VerticalPosition) || 'top';
  const horizontalPos: HorizontalPosition =
    ((position && position.split('-')[1]) as HorizontalPosition) || 'right';

  return (
    <Snackbar
      autoHideDuration={autoHideDuration || 3000}
      open={isOpen}
      anchorOrigin={{
        vertical: verticalPos,
        horizontal: horizontalPos,
      }}
      onClose={() => onClose()}
    >
      <Alert
        variant={variant}
        sx={{ color: `${toastType}.darker`, bgcolor: `${toastType}.lighter` }}
        severity={toastType}
        onClose={() => onClose()}
      >
        <AlertTitle>{title || sentenceCase(toastType)}</AlertTitle>
        {message || ''}
      </Alert>
    </Snackbar>
  );
}
