import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { role_url_map } from '../../../@types/commons';
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from 'redux/store';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import axiosInstance from 'utils/axios';

interface Payload {
  authCode: string;
  client_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

function GetAuthCode() {
  const params = useParams();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const bookingMeeting = async (code: string) => {
    let payload: Payload = JSON.parse(localStorage.getItem('createAppoitmentPayload') || '{}');
    if (code) {
      payload.authCode = code;
    }
    try {
      const rest = await axiosInstance.post(
        'tender/appointments/create-appointment',
        {
          ...payload,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Meeting has been created', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        // setReSubmit(false);
      }
    } catch (err) {
      // console.log('error');
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      localStorage.removeItem('partnerMeetingId');
      localStorage.removeItem('createAppoitmentPayload');
      navigate(`/${role_url_map[activeRole!]}/dashboard/appointments-with-partners`);
    }
  };

  // const location = useLocation();
  React.useEffect(() => {
    const authCode = window.location.href.split('code=')[1].split('&scope')[0];
    // console.log('test typing', payload.date || '');
    // console.log('masuk sini : ',authCode);
    if (authCode) {
      // console.log({ authCode, activeRole });
      localStorage.setItem('authCodeMeeting', authCode);
      bookingMeeting(authCode);
      // dispatch(setAuthCodeGoogle(authCode));
      // navigate(`/${role_url_map[activeRole!]}/dashboard/appointments-with-partners/booking`);
    } else {
      navigate(`/${role_url_map[activeRole!]}/dashboard/app`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, navigate, dispatch]);
  // const authCode = spliteCode[1].split('&scope')[0];
  return <></>;
}

export default GetAuthCode;
