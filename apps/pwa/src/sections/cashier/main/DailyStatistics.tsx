import { Box, Grid, Typography } from '@mui/material';
import { getDailyCashierStatistics } from 'queries/Cashier/getDailyCashierStatistics';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
//
import { FEATURE_DAILY_STATUS } from 'config';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { PaymentStatus } from '../../../@types/proposal';
import { useSelector } from '../../../redux/store';

type Payment = {
  status: PaymentStatus;
};

type Node = {
  payments: Payment[];
};

type Data = {
  aggregate: {
    count: number;
  };
  nodes: Node[];
};

function DailyStatistics() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadingCount, proposalCount } = useSelector((state) => state.proposal);

  // const base_date = new Date();
  const [result] = useQuery({
    query: getDailyCashierStatistics,
    variables: {
      user_id: user?.id,
    },
  });
  const { data, fetching, error } = result;

  const counts = useMemo(() => {
    let incoming = 0;
    if (proposalCount?.payment_adjustment || proposalCount?.inprocess) {
      incoming = (proposalCount?.payment_adjustment || 0) + (proposalCount?.inprocess || 0);
    }
    return {
      acceptableRequest: data?.acceptableRequest?.aggregate?.count || 0,
      incomingRequest: incoming,
    };
  }, [data, proposalCount]);

  const handleClick = (link: string) => {
    navigate(link);
  };

  if (fetching || loadingCount) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">{translate('finance_pages.heading.daily_stats')}</Typography>
      </Grid>
      {!FEATURE_DAILY_STATUS ? (
        <Grid item md={12}>
          <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
            {translate('commons.maintenance_feature_flag')} ...
          </Typography>
        </Grid>
      ) : (
        <React.Fragment>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                p: 2,
                cursor: 'pointer',
              }}
              onClick={() => {
                handleClick('/cashier/dashboard/old-proposal');
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                {translate('finance_pages.card.total_projects')}
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {counts.acceptableRequest} &nbsp;
                </Typography>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {translate('finance_pages.heading.projects')}
                </Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                p: 2,
                cursor: 'pointer',
              }}
              onClick={() => {
                handleClick('/cashier/dashboard/requests-in-process');
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                {translate('finance_pages.card.new_incoming_projects')}
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {counts.incomingRequest} &nbsp;
                </Typography>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {translate('finance_pages.heading.projects')}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
}

export default DailyStatistics;
