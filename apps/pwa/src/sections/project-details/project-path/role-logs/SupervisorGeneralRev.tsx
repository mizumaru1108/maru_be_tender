import { Grid, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'redux/store';
import { Log } from '../../../../@types/proposal';
import { FEATURE_PROJECT_PATH_NEW } from '../../../../config';

interface Props {
  stepGeneralLog: Log;
}

function SupervisorGeneralRev({ stepGeneralLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  let batch: number = 0;
  if (stepGeneralLog && stepGeneralLog.message) {
    batch = Number(stepGeneralLog.message.split('_')[1]);
  }
  // console.log('stepGeneralLog', stepGeneralLog);
  // console.log('proposal', proposal);
  // console.log('proposal.payments', proposal.payments);

  return (
    <React.Fragment>
      {stepGeneralLog.action !== 'insert_payment' &&
        stepGeneralLog.action !== 'issued_by_supervisor' && (
          // <Typography variant="h4">{translate(`under maintenance`)}</Typography>
          <React.Fragment>
            <Typography variant="h6">{translate(`review.review_by_supervisor`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {translate('project_already_reviewed_by_supervisor')}{' '}
                  {moment(stepGeneralLog.updated_at).locale(`${currentLang.value}`).fromNow()}
                </Typography>
              </Stack>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.closing_report`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.new_values?.closing_report || proposal?.closing_report
                        ? `${translate('review.yes')}`
                        : `${translate('review.no')}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.closing_agreement`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.new_values?.does_an_agreement || proposal?.does_an_agreement
                        ? `${translate('review.yes')}`
                        : `${translate('review.no')}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              {FEATURE_PROJECT_PATH_NEW ? (
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.need_picture`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {stepGeneralLog?.new_values?.need_picture || proposal?.need_picture
                          ? `${translate('review.yes')}`
                          : `${translate('review.no')}`}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <Typography variant="h6">{translate(`review.vat_in_project`)}</Typography>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {stepGeneralLog?.new_values?.inclu_or_exclu || proposal?.inclu_or_exclu
                          ? `${translate('review.yes')}`
                          : `${translate('review.no')}`}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              )}

              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.vat`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {(stepGeneralLog?.new_values?.vat_percentage || proposal?.vat_percentage) ??
                        0}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.inclu_or_exclu`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.new_values?.inclu_or_exclu || proposal?.inclu_or_exclu
                        ? `${translate('review.yes')}`
                        : `${translate('review.no')}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.number_of_payment`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.new_values?.number_of_payments_by_supervisor ||
                        proposal?.number_of_payments_by_supervisor}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.payment_support`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.new_values?.fsupport_by_supervisor ||
                        proposal?.fsupport_by_supervisor}{' '}
                      {translate('review.sar')}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.support_amount_inclu`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.new_values?.support_type || proposal?.support_type
                        ? `${translate('review.yes')}`
                        : `${translate('review.no')}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Typography variant="h6">{translate(`review.procedure`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog?.new_values?.support_goal_id || proposal?.support_goal_id
                    ? translate(
                        `review.support_goals.${
                          stepGeneralLog?.new_values?.support_goal_id || proposal?.support_goal_id
                        }`
                      )
                    : '-'}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h6">{translate(`review.note_on_project`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{stepGeneralLog.notes ?? '-'}</Typography>
              </Stack>
            </Stack>
            <Typography variant="h6">{translate(`review.support_output`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {(stepGeneralLog?.new_values?.support_outputs || proposal?.support_outputs) ??
                    '-'}
                </Typography>
              </Stack>
            </Stack>
          </React.Fragment>
        )}
      {stepGeneralLog.action === 'insert_payment' && (
        <React.Fragment>
          <Typography variant="h6">{translate(`review.payment_insert`)}</Typography>
          {proposal &&
            proposal.payments &&
            proposal.payments.length > 0 &&
            [...proposal.payments]
              .sort((a: any, b: any) => parseInt(a.order) - parseInt(b.order))
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
      )}
      {stepGeneralLog.action === 'issued_by_supervisor' && (
        <React.Fragment>
          <Typography variant="h6">{translate(`review.payment_insert`)}</Typography>
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
      )}
    </React.Fragment>
  );
}

export default SupervisorGeneralRev;
