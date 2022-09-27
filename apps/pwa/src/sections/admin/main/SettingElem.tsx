import { Box, Button, Typography } from '@mui/material';
import SvgIconStyle from 'components/SvgIconStyle';
import useLocales from 'hooks/useLocales';
import { useNavigate } from 'react-router';

function SettingElem({ title, name }: { title: string; name: string }) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/admin/dashboard/${name}`);
  };
  return (
    <Box
      component={Button}
      sx={{
        borderRadius: '8px',
        backgroundColor: '#fff',
        py: '15px',
        px: '22px',
        width: '170px',
        height: '160px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
      onClick={handleOnClick}
    >
      <Box
        sx={{
          backgroundColor: '#0E847829',
          width: '50px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
        flex={0.7}
      >
        <Box>{''}</Box>
        <Box>{''}</Box>
        <SvgIconStyle
          src={`/assets/icons/dashboard-navbar/${name}.svg`}
          sx={{ height: '20px', width: '20px', color: '#0E8478' }}
        />
      </Box>
      <Typography variant="h6" color="#000" fontWeight={700} flex={1}>
        {translate(title)}
      </Typography>
    </Box>
  );
}

export default SettingElem;
