import { Typography, Grid, Box } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import useAuth from 'hooks/useAuth';
import { getProposals } from 'queries/commons/getProposal';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';
import React from 'react';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios';
import EmptyContent from '../../../components/EmptyContent';

function ExchangePermission() {
  const { translate } = useLocales();
  const { user } = useAuth();
  const [result] = useQuery({
    query: getProposals,
    variables: {
      order_by: { updated_at: 'desc' },
      limit: 4,
      offset: 0,
      where: {
        project_manager_id: { _eq: user?.id },
        _and: {
          // inner_status: { _eq: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR' },
          // outter_status: { _nin: ['ON_REVISION', 'ASKED_FOR_AMANDEMENT'] },
          payments: { status: { _in: ['accepted_by_supervisor', 'issued_by_supervisor'] } },
        },
      },
    },
  });

  const { data, fetching, error } = result;

  // fetching by API
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`tender-proposal/payment-adjustment?limit=4`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        // console.log('rest total :', rest.data);
        setCardData(
          rest.data.data.map((item: any) => ({
            ...item,
          }))
        );
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(`Something went wrong ${err.message}`, {
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

  if (fetching || isLoading) {
    return (
      <Grid item md={12}>
        {translate('pages.common.loading')}
      </Grid>
    );
  }
  // const props = data?.data ?? [];
  // if (!props || props.length === 0) return null;
  return (
    <Grid item md={12}>
      <Typography variant="h4" sx={{ mb: '20px' }}>
        {translate('exchange_permission')}
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {cardData.length > 0 ? (
          cardData.map((item: any, index: any) => (
            <Grid item md={6} key={index}>
              <ProjectCard
                title={{
                  id: item.id,
                  project_number: generateHeader(
                    item && item.project_number && item.project_number
                      ? item.project_number
                      : item.id
                  ),
                  inquiryStatus: item.outter_status.toLowerCase(),
                }}
                content={{
                  projectName: item.project_name,
                  organizationName: (item && item.user && item.user.employee_name) ?? '-',
                  sentSection: item.state,
                  // employee: item.user.employee_name,
                  employee:
                    item.proposal_logs &&
                    item.proposal_logs.length > 0 &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer &&
                    item.proposal_logs[item.proposal_logs.length - 1].reviewer.employee_name,
                  createdAtClient: new Date(item.created_at),
                }}
                footer={{
                  createdAt: new Date(item.updated_at),
                }}
                cardFooterButtonAction="completing-exchange-permission"
                destination="exchange-permission"
              />
            </Grid>
          ))
        ) : (
          <Grid item md={12}>
            {/* {'test'} */}
            <EmptyContent
              title="No Data"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ExchangePermission;
