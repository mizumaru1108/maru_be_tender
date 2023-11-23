import { Grid, Button, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ProjectOwnerDetails } from '../../../@types/project-details';
import { FEATURE_PROJECT_DETAILS } from '../../../config';

// ----------------------------------------------------------------------
interface SummaryClientInfoProps {
  dataClient: ProjectOwnerDetails;
}

function SummaryClientInfo({ dataClient }: SummaryClientInfoProps) {
  const { translate, currentLang } = useLocales();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const urls = location.pathname.split('/');
  const url = `/${urls[1]}/dashboard/${params.submiterId}/details`;

  const handleShowAllDetails = () => {
    navigate(`${url}`);
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems={{ xs: 'flex-start', lg: 'center' }}
      sx={{ mt: { xs: 0, md: 2 } }}
    >
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 700 }}>
          {translate('project_owner_details.summary.title_main')}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ fontWeight: 500, fontSize: { xs: 16, sm: 18, md: 20 } }}
          gutterBottom
        >
          {dataClient.entity}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ fontWeight: 500, fontSize: { xs: 16, sm: 18, md: 20 } }}
          gutterBottom
        >
          {dataClient.user.email}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{
            fontWeight: 500,
            fontSize: { xs: 16, sm: 18, md: 20 },
            direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr',
            textAlign: 'left',
          }}
          gutterBottom
        >
          {dataClient.phone}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 700 }}>
          {translate('project_owner_details.summary.title_contact')}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ fontWeight: 500, fontSize: { xs: 16, sm: 18, md: 20 } }}
          gutterBottom
        >
          {dataClient.region}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ fontWeight: 500, fontSize: { xs: 16, sm: 18, md: 20 } }}
          gutterBottom
        >
          {dataClient.governorate}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{
            fontWeight: 500,
            fontSize: { xs: 16, sm: 18, md: 20 },
          }}
          gutterBottom
        >
          {dataClient.center_administration}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 700 }}>
          {translate('project_owner_details.summary.title_license')}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ fontWeight: 500, fontSize: { xs: 16, sm: 18, md: 20 } }}
          gutterBottom
        >
          {dataClient.license_number}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ fontWeight: 500, fontSize: { xs: 16, sm: 18, md: 20 } }}
          gutterBottom
        >
          {dataClient.license_issue_date}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{
            fontWeight: 500,
            fontSize: { xs: 16, sm: 18, md: 20 },
          }}
          gutterBottom
        >
          {[
            'register_form1.headquarters.options.own',
            'register_form1.headquarters.options.rent',
          ].includes(dataClient.headquarters)
            ? translate(dataClient.headquarters)
            : dataClient.headquarters}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Button
          onClick={handleShowAllDetails}
          disabled={!FEATURE_PROJECT_DETAILS}
          color="primary"
          variant="contained"
          fullWidth
          size="large"
        >
          {translate('project_owner_details.summary.button_show_all')}
        </Button>
      </Grid>
    </Grid>
  );
}

export default SummaryClientInfo;
