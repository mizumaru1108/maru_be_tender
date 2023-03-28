import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { role_url_map } from '../../../@types/commons';
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from 'redux/store';

function GetAuthCode() {
  const params = useParams();
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const location = useLocation();
  React.useEffect(() => {
    const authCode = window.location.href.split('code=')[1].split('&scope')[0];
    if (authCode) {
      // console.log({ authCode, activeRole });
      localStorage.setItem('authCodeMeeting', authCode);
      // dispatch(setAuthCodeGoogle(authCode));
      navigate(`/${role_url_map[activeRole!]}/dashboard/appointments-with-partners/booking`);
    } else {
      navigate(`/${role_url_map[activeRole!]}/dashboard/app`);
    }
  }, [activeRole, navigate, dispatch]);
  // const authCode = spliteCode[1].split('&scope')[0];
  return <></>;
}

export default GetAuthCode;
