import { Typography, Grid, Stack, Button } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { getProposals } from 'queries/commons/getProposal';
import React from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import axiosInstance from '../../../utils/axios';
import { generateHeader } from '../../../utils/generateProposalNumber';

function RequestsInProcess() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      limit: 10,
      order_by: { updated_at: 'desc' },
      where: {
        // inner_status: { _eq: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' },
        // payments: { status: { _eq: 'accepted_by_finance' } },
        // _and: { cashier_id: { _eq: user?.id } },
        cashier_id: { _eq: user?.id },
        _or: [
          {
            inner_status: {
              _in: ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'],
            },
            payments: { status: { _in: ['accepted_by_finance'] } },
          },
          {
            payments: { status: { _in: ['accepted_by_finance', 'done'] } },
            _not: {
              payments: {
                status: {
                  _in: ['set_by_supervisor', 'issued_by_supervisor', 'accepted_by_project_manager'],
                },
              },
            },
            _and: [
              {
                _not: {
                  inner_status: {
                    _in: ['DONE_BY_CASHIER', 'PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`tender-proposal/request-in-process?limit=4`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        // console.log('rest total :', rest.data.total);
        setCardData(
          rest.data.data.map((item: any) => ({
            ...item,
          }))
        );
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingIncoming();
    // fetchingPrevious();
  }, [fetchingIncoming]);

  const { data, fetching, error } = result;
  if (fetching || isLoading) {
    return <>{translate('pages.common.loading')}</>;
  }
  const props = data?.data ?? [];
  if (props.length === 0) return <></>;
  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">
            {translate('finance_pages.heading.proccess_request')}
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
              navigate('/cashier/dashboard/requests-in-process');
            }}
          >
            {translate('finance_pages.heading.link_view_all')}
          </Button>
        </Stack>
      </Grid>
      {!isLoading &&
        cardData.map((item: any, index: any) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              title={{
                id: item.id,
                project_number: generateHeader(
                  item && item.project_number && item.project_number ? item.project_number : item.id
                ),
                inquiryStatus: item.outter_status.toLowerCase(),
              }}
              content={{
                projectName: item.project_name,
                organizationName: (item && item.user && item.user.employee_name) ?? '-',
                sentSection: item.state,
                employee:
                  item.proposal_logs &&
                  item.proposal_logs.length > 0 &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                  item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                // employee: item.user.employee_name,
                createdAtClient: new Date(item.created_at),
              }}
              footer={{
                createdAt: new Date(item.updated_at),
                payments: item.payments,
              }}
              cardFooterButtonAction="completing-exchange-permission"
              destination="requests-in-process"
            />
          </Grid>
        ))}
    </Grid>
  );
}

export default RequestsInProcess;
