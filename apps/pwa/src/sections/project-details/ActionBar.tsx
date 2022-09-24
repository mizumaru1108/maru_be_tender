import { Taps } from './action-bar-taps';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';

function ActionBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationArray = location.pathname.split('/');
  // const role = 'tender_moderator';
  const role = 'tender_client';
  const handleOnClick = (title: any) => {
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/${title}`);
  };
  useEffect(() => {
    console.log('role : ', role);
  }, [role]);

  return (
    <Box
      sx={{ padding: '10px', backgroundColor: '#fff', display: 'flex', direction: 'row', gap: 2 }}
    >
      {Taps[`${role}`].map((item, index) => (
        <Button
          key={index}
          sx={{
            color: item.title === locationArray[locationArray.length - 1] ? '#fff' : '#93A3B0',
            backgroundColor:
              item.title === locationArray[locationArray.length - 1] ? '#0E8478' : undefined,
            height: '50px',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          onClick={() => {
            handleOnClick(item.title);
          }}
        >
          {item.title}
        </Button>
      ))}
    </Box>
  );
}

export default ActionBar;
