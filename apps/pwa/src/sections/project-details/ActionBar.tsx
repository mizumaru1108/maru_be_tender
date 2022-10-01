import { Taps } from './action-bar-taps';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Box, Button } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { Role } from 'guards/RoleBasedGuard';
import useLocales from 'hooks/useLocales';

function ActionBar() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const location = useLocation();
  const locationArray = location.pathname.split('/');
  const { user } = useAuth();
  const { actionType } = useParams();
  const role = user?.registrations[0].roles[0] as Role;
  const handleOnClick = (title: any) => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/${title}`);
  };
  return (
    <Box
      sx={{ padding: '10px', backgroundColor: '#fff', display: 'flex', direction: 'row', gap: 2 }}
    >
      {Taps[`${role}`][`${actionType}`].map((item, index) => (
        <Button
          key={index}
          sx={{
            color: item.value === locationArray[locationArray.length - 1] ? '#fff' : '#93A3B0',
            backgroundColor:
              item.value === locationArray[locationArray.length - 1] ? '#0E8478' : undefined,
            height: '50px',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          onClick={() => {
            handleOnClick(item?.value);
          }}
        >
          {translate(item?.title)}
        </Button>
      ))}
    </Box>
  );
}

export default ActionBar;
