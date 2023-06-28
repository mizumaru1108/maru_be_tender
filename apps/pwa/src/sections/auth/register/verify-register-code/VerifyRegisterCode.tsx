import axios from 'axios';
import LoadingScreen from 'components/LoadingScreen';
import { FEATURE_VERIFICATION_SIGN_UP, TMRA_RAISE_URL } from 'config';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate, useParams } from 'react-router';

export default function VerirfyRegeistercode() {
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const [isLoading, setIsLoading] = React.useState(true);
  // console.log('params code:', params.code);
  const verifyRegisterCode = async (verifyCode: string) => {
    setIsLoading(true);
    try {
      const { status } = await axios.post(
        `${TMRA_RAISE_URL}/tender-auth/verify-email/${verifyCode}`,
        {}
      );
      if (status) {
        navigate('/auth/login');
        enqueueSnackbar(translate('snackbar.auth.register.verify_register_code.success'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
      navigate('/auth/send-email/resend');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (params.code) {
      verifyRegisterCode(params.code);
    } else {
      navigate('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return <React.Fragment>{!isLoading ? null : <LoadingScreen />}</React.Fragment>;
}
