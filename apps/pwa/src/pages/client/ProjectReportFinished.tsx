// react
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// @mui
import { Container, Box, Stack, Button, styled, Typography } from '@mui/material';
// components
import Page from 'components/Page';
import Iconify from 'components/Iconify';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { getProposal } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import axiosInstance from 'utils/axios';
import { useSnackbar } from 'notistack';
//
import ProjectStatus from 'sections/project-details/ProjectStatus';
import AmandementProposalDialog from 'sections/client/funding-project-request/AmandementProposalDialog';
import SubmitProjectReportForm from 'sections/client/project-report/forms/SubmitProjectReportForm';
// types
import { CloseReportForm } from 'sections/client/project-report/types';

export default function ProjectReports() {
  const { user } = useAuth();
  const { id, actionType } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  const dispatch = useDispatch();

  const { activeRole } = useAuth();
  const role = activeRole!;

  const { translate, currentLang } = useLocales();

  const { proposal, isLoading, error } = useSelector((state) => state.proposal);

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (formValues: CloseReportForm) => {
    setIsSubmitting(true);

    try {
      const { status, data } = await axiosInstance.post(
        '/tender/proposal/payment/submit-closing-report',
        formValues,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        setIsSubmitting(false);

        enqueueSnackbar(translate('pages.common.close_report.notification.succes_send'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });

        navigate('/client/dashboard/project-report');
      }
    } catch (err) {
      if (typeof err.message === 'object') {
        err.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }

      setIsSubmitting(false);
    }
  };

  const initialValue: CloseReportForm = {
    proposal_id: proposal.id,
    execution_place: '',
    target_beneficiaries: '',
    number_of_beneficiaries: 0,
    gender: undefined,
    project_duration: '',
    project_repeated: '',
    number_of_staff: 0,
    number_of_volunteer: 0,
    attachments: [],
    images: [],
  };

  useEffect(() => {
    dispatch(getProposal(id as string, role as string));
  }, [dispatch, id, role]);

  if (isLoading) return <>... Loading</>;

  if (error) return <>{error}</>;

  return (
    <Page title={translate('pages.common.close_report.text.project_report')}>
      <Container>
        <ContentStyle>
          <Stack spacing={2} direction="column">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              component="div"
            >
              <Button
                color="inherit"
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
              >
                <Iconify
                  icon={
                    currentLang.value === 'en'
                      ? 'eva:arrow-ios-back-outline'
                      : 'eva:arrow-ios-forward-outline'
                  }
                  width={25}
                  height={25}
                />
              </Button>

              {role === 'tender_client' && proposal.outter_status === 'ON_REVISION' && (
                <AmandementProposalDialog />
              )}
              <ProjectStatus />
            </Stack>
            <Stack direction="column" justifyContent="space-between" component="div">
              <Typography
                variant="h4"
                sx={{
                  maxWidth: '700px',
                }}
              >
                {proposal.project_name}
              </Typography>
              <Typography sx={{ color: '#93A3B0', fontSize: '14px', mb: '5px' }}>
                {` ${translate('pages.project_details.created_by')} ${
                  proposal.user.employee_name
                } - ${new Date(proposal.created_at).toLocaleString()}`}
              </Typography>
            </Stack>

            <SubmitProjectReportForm
              onSubmit={handleSubmitForm}
              defaultValues={initialValue}
              loading={isSubmitting}
            />
          </Stack>
        </ContentStyle>
      </Container>
    </Page>
  );
}
