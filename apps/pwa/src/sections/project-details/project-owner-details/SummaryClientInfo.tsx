import { Box, Button, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ProjectOwnerDetails } from '../../../@types/project-details';

// ----------------------------------------------------------------------
const StylTextContent = {
  fontWeight: 500,
  fontSize: '22px',
  fontFamily: 'Cairo',
};
const StylTextTitle = {
  fontWeight: 700,
  fontSize: '24px',
  fontFamily: 'Cairo',
};
// ----------------------------------------------------------------------
interface SummaryClientInfoProps {
  dataClient: ProjectOwnerDetails;
}

function SummaryClientInfo({ dataClient }: SummaryClientInfoProps) {
  const { translate } = useLocales();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const urls = location.pathname.split('/');
  const url = `/${urls[1]}/dashboard/${params.submiterId}/details`;

  const handleShowAllDetails = () => {
    navigate(`${url}`);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={StylTextTitle}>
          {translate('project_owner_details.summary.title_main')}
        </Typography>
        <Typography sx={StylTextContent}>{dataClient.entity}</Typography>
        <Typography sx={StylTextContent}>{dataClient.user.email}</Typography>
        <Typography sx={StylTextContent}>{dataClient.phone}</Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={StylTextTitle}>
          {translate('project_owner_details.summary.title_contact')}
        </Typography>
        <Typography sx={StylTextContent}>{dataClient.region}</Typography>
        <Typography sx={StylTextContent}>{dataClient.governorate}</Typography>
        <Typography sx={StylTextContent}>{dataClient.center_administration}</Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={StylTextTitle}>
          {translate('project_owner_details.summary.title_license')}
        </Typography>
        <Typography sx={StylTextContent}>{dataClient.license_number}</Typography>
        <Typography sx={StylTextContent}>{dataClient.license_issue_date}</Typography>
        <Typography sx={StylTextContent}>{'Classification'}</Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={handleShowAllDetails}
          disabled
          sx={{
            background: '#0E8478',
            color: '#fff',
            borderColor: '#000',
          }}
        >
          {translate('project_owner_details.summary.button_show_all')}
        </Button>
      </Box>
    </Box>
  );
}

export default SummaryClientInfo;
