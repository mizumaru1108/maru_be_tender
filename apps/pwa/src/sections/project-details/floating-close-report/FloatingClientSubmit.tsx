// react
import { useNavigate, useParams } from 'react-router';
// material
import { Box, useTheme, Typography, Button } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';

// ------------------------------------------------------------------------------------------

export default function FloatingClientSubmit() {
  const theme = useTheme();
  const { id, actionType } = useParams();
  const navigate = useNavigate();
  const { translate } = useLocales();

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
          navigate(`/client/dashboard/project-report/${id}/${actionType}/finished`);
        }}
      >
        <Typography variant="button" component="span">
          {translate('pages.common.close_report.text.project_report')}
        </Typography>
        &nbsp;
        <Typography variant="button" component="span">
          {`(${translate('pages.common.close_report.text.finished')})`}
        </Typography>
      </Button>
    </Box>
  );
}
