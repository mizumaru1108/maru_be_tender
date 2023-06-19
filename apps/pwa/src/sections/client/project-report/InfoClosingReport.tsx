// react
import { useParams, useNavigate } from 'react-router';
// @mui + component
import { Grid, Typography, Box, Stack, useTheme } from '@mui/material';
import ButtonDownloadFiles from 'components/button/ButtonDownloadFiles';
// hooks
import useLocales from 'hooks/useLocales';
// types
import { ClosingReportData } from './types';

// ------------------------------------------------------------------------------------------

export interface IPropsInfoClosing {
  data?: ClosingReportData;
}

// ------------------------------------------------------------------------------------------

export default function InfoClosingReport({ data }: IPropsInfoClosing) {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  const { id, actionType } = useParams();
  const navigate = useNavigate();

  return (
    <Stack direction="column" spacing={4} sx={{ pb: 10 }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>
          {translate('pages.common.close_report.text.main_information')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.number_of_beneficiaries.label')}:
            </Typography>
            <Typography variant="body1">{data?.number_of_beneficiaries}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.target_beneficiaries.label')}:
            </Typography>
            <Typography variant="body1">
              {/* {translate(`pages.common.close_report.text.option.${data?.target_beneficiaries}`)} */}
              {data?.target_beneficiaries}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.execution_place.label')}:
            </Typography>
            <Typography variant="body1">
              {translate(`pages.common.close_report.text.option.${data?.execution_place}`)}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.gender.label')}:
            </Typography>
            <Typography variant="body1">
              {translate(`section_portal_reports.heading.gender.${data?.gender}`)}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>
          {translate('pages.common.close_report.text.about_project')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.project_duration.label')}:
            </Typography>
            <Typography variant="body1">
              {translate(`pages.common.close_report.text.option.${data?.project_duration}`)}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.project_repeated.label')}:
            </Typography>
            <Typography variant="body1">
              {translate(`pages.common.close_report.text.option.${data?.project_repeated}`)}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.number_of_volunteer.label')}:
            </Typography>
            <Typography variant="body1">{data?.number_of_volunteer}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.number_of_staff.label')}:
            </Typography>
            <Typography variant="body1">{data?.number_of_staff}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.images.label')}:
            </Typography>
            <Grid container spacing={2}>
              {!data?.images.length
                ? null
                : data.images.map((el, i) => (
                    <Grid item xs={6} key={i}>
                      <Box sx={{ mt: 2 }}>
                        <ButtonDownloadFiles files={el} />
                      </Box>
                    </Grid>
                  ))}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '14px',
                mb: 0.5,
              }}
            >
              {translate('pages.common.close_report.text.details.attachments.label')}:
            </Typography>
            <Grid container spacing={2}>
              {!data?.attachments.length
                ? null
                : data.attachments.map((el, i) => (
                    <Grid item xs={6} key={i}>
                      <Box sx={{ mt: 2 }}>
                        <ButtonDownloadFiles files={el} />
                      </Box>
                    </Grid>
                  ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
