import { Box, Button, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import { ProjectOwnerDetails } from '../../../@types/project-details';
import { getSummaryProjectOwner } from '../../../queries/client/getSummaryProjectOwner';

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

function SummaryClientInfo() {
  const [userInfo, setUserInfo] = React.useState<ProjectOwnerDetails>({
    entity: 'maru',
    // email: 'maru@gmail.com',
    user: {
      email: 'maru@gmail.com',
    },
    phone: '01000000000',
    region: 'Indonesia',
    governorate: 'DKI Jakarta',
    center_administration: 'Jakarta Selatan',
    license_number: '123456789',
    license_issue_date: moment().format('YYYY-MM-DD'),
  });
  const { id, submiterId } = useParams();

  const { translate } = useLocales();

  const [result, _] = useQuery({
    query: getSummaryProjectOwner,
    variables: { id: submiterId },
  });

  const { fetching, data, error } = result;

  React.useEffect(() => {
    if (data) {
      // console.log('data', data.user_by_pk.client_data);
      setUserInfo(data.user_by_pk.client_data);
    }
  }, [data, submiterId]);

  if (fetching) return <>Loading ....</>;

  if (error) return <>{error.message}</>;
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={StylTextTitle}>
          {translate('project_owner_details.summary.title_main')}
        </Typography>
        <Typography sx={StylTextContent}>{userInfo.entity}</Typography>
        <Typography sx={StylTextContent}>{userInfo.user.email}</Typography>
        <Typography sx={StylTextContent}>{userInfo.phone}</Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={StylTextTitle}>
          {translate('project_owner_details.summary.title_contact')}
        </Typography>
        <Typography sx={StylTextContent}>{userInfo.region}</Typography>
        <Typography sx={StylTextContent}>{userInfo.governorate}</Typography>
        <Typography sx={StylTextContent}>{userInfo.center_administration}</Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={StylTextTitle}>
          {translate('project_owner_details.summary.title_license')}
        </Typography>
        <Typography sx={StylTextContent}>{userInfo.license_number}</Typography>
        <Typography sx={StylTextContent}>{userInfo.license_issue_date}</Typography>
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
