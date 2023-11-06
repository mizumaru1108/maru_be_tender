import { Box, Typography } from '@mui/material';
import { useSelector } from 'redux/store';
import useLocales from 'hooks/useLocales';
import useAuth from '../../hooks/useAuth';

function ProjectStatus() {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const outterStatus =
    activeRole === 'tender_client' && proposal.outter_status === 'PENDING_CANCELED'
      ? 'ONGOING'
      : proposal.outter_status;

  return (
    <Box
      sx={{
        borderRadius: '10px',
        backgroundColor: '#0E847829',
        p: 1,
      }}
    >
      {/* <Typography
        variant="h6"
        sx={{
          color: '#0E8478',
        }}
      >
        {translate(`state`) + ' : ' + translate(`permissions.${proposal.state}`) || 'حالة المشروع'}
      </Typography> */}
      <Typography
        sx={{
          color: {
            COMPLETED: '#0E8478',
            ONGOING: '#0E8478',
            PENDING: '#000',
            ON_REVISION: '#F2994A',
            ASKED_FOR_AMANDEMENT: '#F2994A',
            ASKED_FOR_AMANDEMENT_PAYMENT: '#F2994A',
            CANCELED: '#EB5757',
            PENDING_CANCELED: activeRole === 'tender_client' ? '#0E8478' : '#EB5757',
          }[`${proposal.outter_status}`],
          fontWeight: 600,
        }}
      >
        {translate('status') + ' : ' + translate(`outter_status.${outterStatus}`) || 'status'}
      </Typography>
    </Box>
  );
}

export default ProjectStatus;
