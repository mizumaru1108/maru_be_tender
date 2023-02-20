import {
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardActions,
  CardContent,
  Divider,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { deleteDraftProposal } from 'queries/client/deleteDraftProposal';
import React from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from 'urql';
import { AmandementProposalList } from '../../../@types/proposal';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';

function AmandementProposal() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const role = activeRole!;
  const [tmpValues, setTmpValues] = React.useState<AmandementProposalList[] | null>(null);

  const navigate = useNavigate();

  const fetchingData = async () => {
    try {
      const rest = await axiosInstance.get('/tender-proposal/amandement-lists', {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        setTmpValues(rest.data.data);
      }
    } catch (error) {
      console.log('error', error.message);
    }
  };

  React.useEffect(() => {
    fetchingData();
  }, []);

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">
          {translate('content.client.main_page.amandement_projects')}
        </Typography>
        <Button
          sx={{
            backgroundColor: 'transparent',
            color: '#93A3B0',
            textDecoration: 'underline',
            ':hover': {
              backgroundColor: 'transparent',
            },
          }}
          onClick={() => {
            navigate('/client/dashboard/draft-funding-requests');
          }}
        >
          {translate('view_all')}
        </Button>
      </Stack>
      <Grid container sx={{ pt: 2 }} spacing={5}>
        {tmpValues &&
          tmpValues?.length > 0 &&
          tmpValues.map((item, index) => (
            <Grid item md={6} xs={12} key={index}>
              <Card sx={{ backgroundColor: '#fff' }}>
                <CardContent>
                  {/* The Title Section  */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      variant="h6"
                      color="text.tertiary"
                      gutterBottom
                      sx={{ fontSize: '15px !important' }}
                    >
                      {item.id}
                    </Typography>
                  </Stack>

                  {/* The Content Section  */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      mb: 1.5,
                      wordWrap: 'unset',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      maxWidth: '500px',
                    }}
                  >
                    {item.proposal.project_name}
                  </Typography>
                  {/* {content.organizationName && (
                    <React.Fragment>
                      <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                        {translate('project_management_headercell.clients_name')}
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          mb: 1.5,
                          wordWrap: 'unset',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          maxWidth: '500px',
                          fontSize: '14px !important',
                        }}
                      >
                        {content.organizationName}
                      </Typography>
                    </React.Fragment>
                  )} */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ marginBottom: '10px' }}
                  >
                    <Stack direction="column" gap={1}>
                      <Stack direction="row" gap={6}>
                        {role !== 'tender_moderator' && item.user.employee_name && (
                          <Stack>
                            <Typography
                              variant="h6"
                              color="#93A3B0"
                              sx={{ fontSize: '10px !important' }}
                            >
                              {translate('project_management_headercell.employee')}
                            </Typography>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ fontSize: '12px !important' }}
                            >
                              {translate('project_management_headercell.sent_by')}{' '}
                              {item.reviewer.employee_name}
                            </Typography>
                          </Stack>
                        )}
                        {/* {content.sentSection && (
                          <Stack>
                            <Typography
                              variant="h6"
                              color="#93A3B0"
                              sx={{ fontSize: '10px !important' }}
                            >
                              {translate('project_management_headercell.sent_section')}
                            </Typography>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ fontSize: '12px !important' }}
                            >
                              {translate(`project_card.${content.sentSection.toLowerCase()}`)}
                            </Typography>
                          </Stack>
                        )} */}
                      </Stack>
                    </Stack>
                  </Stack>
                  {/* {content.projectDetails && (
                    <>
                      <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                        {translate('project_details.heading')}
                      </Typography>
                      <Typography
                        sx={{
                          mb: 1.5,
                          display: '-webkit-box',
                          '-webkit-line-clamp': 2,
                          'line-clamp': 2,
                          '-webkit-box-orient': 'vertical',
                        }}
                        color="#1E1E1E"
                      >
                        {content.projectDetails}
                      </Typography>
                    </>
                  )} */}
                  <Divider sx={{ marginTop: '30px' }} />
                </CardContent>

                {/* The Footer Section  */}
                <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
                  <Grid container spacing={2}>
                    {/* {footer.payments && (
                      <Grid container item md={12} columnSpacing={1}>
                        {footer.payments.map((payment: any, index: any) => (
                          <Grid item key={index}>
                            <Typography
                              key={index}
                              color="#1E1E1E"
                              gutterBottom
                              sx={{
                                textDecorationLine: 'underline',
                                color: payment.status ? '#1E1E1E' : '#93A3B0',
                              }}
                            >
                              {payment.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    )} */}
                    <Grid item md={12}>
                      <Stack direction="row" justifyContent="space-between">
                        <Stack direction="column">
                          <Typography
                            variant="h6"
                            color="#93A3B0"
                            gutterBottom
                            sx={{ fontSize: '10px !important' }}
                          >
                            {translate('project_management_headercell.date_created')}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="#1E1E1E"
                            gutterBottom
                            sx={{ fontSize: '15px !important' }}
                          >
                            {item.created_at
                              ? moment(item.created_at)
                                  .locale(`${currentLang.value}`)
                                  .format('LLLL')
                              : // ? `${footer.createdAt.getDay()}.${footer.createdAt.getMonth()}.${footer.createdAt.getFullYear()} في ${footer.createdAt.getHours()}:${footer.createdAt.getMinutes()}`
                                '5 ساعات'}
                          </Typography>
                        </Stack>
                        <Button
                          variant="outlined"
                          sx={{
                            background: '#0E8478',
                            color: '#fff',
                          }}
                          // onClick={handleOnClick}
                        >
                          {/* {translate('continue_studying_the_project')} */}
                          {translate('revision_the_project')}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default AmandementProposal;
