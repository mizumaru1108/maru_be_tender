import { OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack';
import useLocales from '../hooks/useLocales';

export function CatchError(error: any) {
  // const { translate } = useLocales();
  const statusCode = (error && error.statusCode) || 0;
  const message = (error && error.message) || 'pages.common.internal_server_error';
  return {
    statusCode,
    message,
  };
  // return message;
}

export function CatchErrorMessage(error: any): string {
  // const { translate } = useLocales();
  const message = (error && error.message) || 'pages.common.internal_server_error';
  return message;
}

export function ErrorSnackBar(
  error: any,
  enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey,
  translate: (text: any, options?: any) => string
) {
  enqueueSnackbar(translate(CatchErrorMessage(error)), {
    variant: 'error',
    preventDuplicate: true,
    autoHideDuration: 3000,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
  });
}
