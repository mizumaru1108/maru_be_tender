// @mui
import { styled } from '@mui/material/styles';
// routes
// components
import Page from '../../components/Page';
// sections
import useLocales from 'hooks/useLocales';
import { VerifyRegister } from 'sections/auth/register/verify-register-code';
import { FEATURE_VERIFICATION_SIGN_UP } from 'config';
import React from 'react';
import { useNavigate } from 'react-router';
// ----------------------------------------------------------------------

export default function SendMail() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!FEATURE_VERIFICATION_SIGN_UP) {
      navigate('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Page title={translate('pages.common.verify_register_code')}>
      {FEATURE_VERIFICATION_SIGN_UP ? <VerifyRegister /> : <>Under Construction</>}
      {/* <VerifyRegister /> */}
    </Page>
  );
}
