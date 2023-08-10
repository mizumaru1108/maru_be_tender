// react
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// @mui
import { Container, Stack, Button, styled, Typography } from '@mui/material';
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
import InfoClosingReport from 'sections/client/project-report/InfoClosingReport';
// types
import { CloseReportForm } from 'sections/client/project-report/types';

//
import { useQuery } from 'urql';
import { getProposalClosingReport } from 'queries/client/getProposalClosingReport';
import SubmitProjectReportFormCqrs from 'sections/client/project-report/forms/SubmitProjectReportFormCqrs';
import { FEATURE_NEW_CLOSING_REPORT_BY_CLIENT } from 'config';

// ------------------------------------------------------------------------------------------

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

  const [result] = useQuery({
    query: getProposalClosingReport,
    variables: {
      proposal_id: id,
    },
  });

  const { data, fetching, error: errorGetProposal } = result;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (formValues: CloseReportForm) => {
    setIsSubmitting(true);
    // const url = `/tender/proposal/payment/submit-closing-report`;
    const url = `/tender/proposal/payment/submit-closing-report-cqrs`;
    try {
      const { status } = await axiosInstance.post(url, formValues, {
        headers: { 'x-hasura-role': activeRole! },
      });

      if (status === 201) {
        enqueueSnackbar(translate('pages.common.close_report.notification.succes_send'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });

        setIsSubmitting(false);
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
        const statusCode = (err && err.statusCode) || 0;
        const message = (err && err.message) || null;
        if (message && statusCode !== 0) {
          enqueueSnackbar(err.message, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        } else {
          enqueueSnackbar(translate('pages.common.internal_server_error'), {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        }
      }

      setIsSubmitting(false);
    }
  };

  const initialValue: CloseReportForm = {
    proposal_id: proposal.id,
    // execution_place: '',
    // target_beneficiaries: '',
    number_of_beneficiaries: 0,
    // gender: undefined,
    project_duration: '',
    number_project_duration: 0,
    number_project_repeated: 0,
    project_repeated: '',
    number_of_staff: 0,
    number_of_volunteer: 0,
    attachments: [],
    images: [],
    genders: [
      {
        selected_values: '',
        selected_numbers: 0,
      },
    ],
    execution_places: [
      {
        selected_values: '',
        selected_numbers: 0,
      },
    ],
    beneficiaries: [
      {
        selected_values: '',
        selected_numbers: 0,
      },
    ],
  };

  useEffect(() => {
    dispatch(getProposal(id as string, role as string));
  }, [dispatch, id, role]);

  if (fetching || isLoading) return <>{translate('pages.common.loading')}</>;

  // if (error || errorGetProposal) return <>{error ? error : errorGetProposal}</>;

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
            {data && data.proposal_closing_report.length === 0 ? (
              <>
                {FEATURE_NEW_CLOSING_REPORT_BY_CLIENT ? (
                  <SubmitProjectReportFormCqrs
                    onSubmit={handleSubmitForm}
                    defaultValues={initialValue}
                    loading={isSubmitting}
                  />
                ) : (
                  <SubmitProjectReportForm
                    onSubmit={handleSubmitForm}
                    defaultValues={initialValue}
                    loading={isSubmitting}
                  />
                )}
              </>
            ) : (
              <InfoClosingReport
                data={
                  proposal?.proposal_closing_report && proposal?.proposal_closing_report.length > 0
                    ? proposal?.proposal_closing_report[0]
                    : data.proposal_closing_report[0]
                }
              />
            )}
          </Stack>
        </ContentStyle>
      </Container>
    </Page>
  );
}
