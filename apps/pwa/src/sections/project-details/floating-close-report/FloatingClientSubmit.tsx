// react
import { useNavigate, useParams } from 'react-router';
// material
import { Box, useTheme, Typography, Button } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
//
import { role_url_map } from '../../../@types/commons';
import { useDispatch } from '../../../redux/store';

// ------------------------------------------------------------------------------------------

export default function FloatingClientSubmit() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id, actionType } = useParams();
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  return (
    <Box
      sx={{
        backgroundColor: 'transparent',
        p: 2,
        position: 'sticky',
        margin: 'auto',
        width: '100%',
        bottom: 24,
        textAlign: 'center',
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          navigate(
            `/${role_url_map[activeRole!]}/dashboard/project-report/${id}/${actionType}/finished`
          );
        }}
      >
        <Typography variant="button" component="span">
          {translate('pages.common.close_report.text.project_report')}
        </Typography>
        {/* &nbsp; */}
        {/* <Typography variant="button" component="span">
          {`(${translate('pages.common.close_report.text.finished')})`}
        </Typography> */}
      </Button>
    </Box>
  );
}
