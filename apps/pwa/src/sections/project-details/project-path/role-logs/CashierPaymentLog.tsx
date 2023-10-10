import { Grid, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'redux/store';
import { Log } from '../../../../@types/proposal';

interface Props {
  stepGeneralLog: Log;
}

function CashierPaymentLog({ stepGeneralLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  let batch: number = 0;
  if (stepGeneralLog && stepGeneralLog.message) {
    batch = Number(stepGeneralLog.message.split('_')[1]);
  }
  // console.log('proposal.payments', proposal.payments);

  return (
    <React.Fragment>
      <React.Fragment>
        <Typography variant="h6">{translate(`review.payment`)}</Typography>
        {proposal &&
          proposal.payments &&
          proposal.payments.length > 0 &&
          proposal.payments
            .filter((item) => Number(item.order) === batch)
            .map((payment, index) => (
              <Grid container key={index} sx={{ mb: 4 }}>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">
                    {translate('review.Batch') + ' ' + payment.order}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    {moment(payment.payment_date).locale(`${currentLang.value}`).format('LLLL')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">
                    {payment.payment_amount
                      ? `${String(payment.payment_amount) + ' ' + translate('review.sar')}`
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>
            ))}
      </React.Fragment>
    </React.Fragment>
  );
}

export default CashierPaymentLog;
