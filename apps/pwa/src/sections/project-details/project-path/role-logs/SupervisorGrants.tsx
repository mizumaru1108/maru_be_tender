import { Grid, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'redux/store';
import { PropsalLogGrants } from '../../../../@types/proposal';
import {
  BeneficiariesMap,
  target_age_map,
  target_type_map,
} from '../../../../@types/supervisor-accepting-form';

interface Props {
  stepGransLog: PropsalLogGrants;
}

function SupervisorGrants({ stepGransLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  // console.log({ stepGransLog });
  // const [isVat, setIsVat] = React.useState(false);
  let batch: number = 0;
  if (stepGransLog && stepGransLog.message) {
    batch = Number(stepGransLog.message.split('_')[1]);
  }
  const isVat = Object.entries(stepGransLog.proposal!)
    .filter(([key]) => key === 'vat')
    .map(([key, value]) => {
      if (value && value === true) {
        return true;
      } else {
        return false;
      }
    });
  // console.log(proposal.payments, 'proposal grant');

  return (
    <React.Fragment>
      {stepGransLog.action !== 'insert_payment' && stepGransLog.action !== 'issued_by_supervisor' && (
        <Grid container spacing={2}>
          <Stack direction="column" gap={2} sx={{ pb: 2, px: 2 }}>
            <Typography>
              {translate('project_already_reviewed_by_supervisor')}{' '}
              {moment(stepGransLog.updated_at).locale(`${currentLang.value}`).fromNow()}
            </Typography>
          </Stack>
          {Object.entries(stepGransLog.proposal!)
            .filter(
              ([key]) => key !== 'inclu_or_exclu' && key !== 'vat' && key !== 'vat_percentage'
            )
            .map(([key, value]) => {
              // console.log({ stepGransLog });
              // if (!value) {
              //   return null;
              // }
              if (key === 'created_at' || key === 'updated_at') {
                return null; // Exclude these properties from rendering
              }
              if (key === 'support_goal_id') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate(`review.support_goals.${String(value)}`) : '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'accreditation_type_id') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate(`review.accreditation_type.${String(value)}`) : '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'been_supported_before') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate('review.yes') : translate('review.no')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'been_made_before') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate('review.yes') : translate('review.no')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'does_an_agreement') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate('review.yes') : translate('review.no')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'closing_report') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate('review.yes') : translate('review.no')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'need_picture') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate('review.yes') : translate('review.no')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'fsupport_by_supervisor') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? `${String(value) + ' ' + translate('review.sar')}` : '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'remote_or_insite') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value && value === 'both'
                          ? translate('remote_or_insite.both')
                          : value === 'online'
                          ? translate('remote_or_insite.remote')
                          : translate('remote_or_insite.insite')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'support_type') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value === true ? translate('partial_support') : translate('full_support')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'target_group_type') {
                const tmpVal: string = value as string;
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {target_type_map[tmpVal.toUpperCase() as keyof BeneficiariesMap]
                          ? translate(`review.target_group_type_enum.${value}`)
                          : value}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'target_group_age') {
                const tmpVal: string = value as string;
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {target_age_map[tmpVal.toUpperCase() as keyof BeneficiariesMap]
                          ? translate(`review.target_group_age_enum.${value}`)
                          : value}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key !== 'clasification_field' && key !== 'clause') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">{translate(`review.${key}`)}</Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>{value ? String(value) : '-'}</Typography>
                    </Stack>
                  </Grid>
                );
              } else {
                return null;
              }
            })}
          {Object.entries(stepGransLog.proposal!)
            .filter(
              ([key]) => key === 'inclu_or_exclu' || key === 'vat' || key === 'vat_percentage'
            )
            .map(([key, value]) => {
              if (key === 'inclu_or_exclu' && isVat[0] === true) {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate('review.yes') : translate('review.no')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'vat_percentage' && isVat[0] === true) {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        <Typography>{value ? String(value) : '-'}</Typography>
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              if (key === 'vat') {
                return (
                  <Grid item xs={6} key={key}>
                    <Typography variant="h6">
                      {
                        // key
                        translate(`review.${key}`)
                      }
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                      <Typography>
                        {value ? translate('review.yes') : translate('review.no')}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              }
              return null;
            })}
          <Grid item xs={6}>
            <Typography variant="h6">
              {
                // key
                translate(`review.notes`)
              }
            </Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Typography>{stepGransLog.notes ?? '-'}</Typography>
            </Stack>
          </Grid>
        </Grid>
      )}
      {stepGransLog.action === 'insert_payment' && (
        <React.Fragment>
          <Typography variant="h6">{translate(`review.payment_insert`)}</Typography>
          {proposal &&
            proposal.payments &&
            proposal.payments.length > 0 &&
            proposal.payments.map((payment, index) => (
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
      {stepGransLog.action === 'issued_by_supervisor' && (
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

export default SupervisorGrants;
