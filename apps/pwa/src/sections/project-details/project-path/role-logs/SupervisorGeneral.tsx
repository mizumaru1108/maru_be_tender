import { Grid, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'redux/store';
import { Log } from '../../../../@types/proposal';

interface Props {
  stepGeneralLog: Log;
}

function SupervisorGeneral({ stepGeneralLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();

  return (
    <React.Fragment>
      <React.Fragment>
        <Typography variant="h6">{translate(`review.review_by_supervisor`)}</Typography>
        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            <Typography>
              {translate('project_already_reviewed_by_supervisor')}{' '}
              {moment(stepGeneralLog.proposal.updated_at).locale(`${currentLang.value}`).fromNow()}
            </Typography>
          </Stack>
          {/* {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      
                    )}
                  </React.Fragment>
                ))} */}
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.closing_report`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog.proposal.closing_report
                    ? `${translate('review.yes')}`
                    : `${translate('review.no')}`}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.closing_agreement`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              {/* {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                          
                        )}
                      </React.Fragment>
                    ))} */}
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog.proposal.does_an_agreement
                    ? `${translate('review.yes')}`
                    : `${translate('review.no')}`}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.vat_in_project`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              {/* {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                         
                        )}
                      </React.Fragment>
                    ))} */}
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog.proposal.vat
                    ? `${translate('review.yes')}`
                    : `${translate('review.no')}`}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.vat`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              {/* {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                        
                        )}
                      </React.Fragment>
                    ))} */}
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{stepGeneralLog.proposal.vat_percentage ?? 0}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.inclu_or_exclu`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              {/* {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                         
                        )}
                      </React.Fragment>
                    ))} */}
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog.proposal.inclu_or_exclu
                    ? `${translate('review.yes')}`
                    : `${translate('review.no')}`}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.number_of_payment`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              {/* {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                         
                        )}
                      </React.Fragment>
                    ))} */}
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog.proposal.number_of_payments_by_supervisor}{' '}
                  {translate('review.sar')}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.payment_support`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              {/* {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                        
                        )}
                      </React.Fragment>
                    ))} */}
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog.proposal.fsupport_by_supervisor} {translate('review.sar')}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.support_amount_inclu`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              {/* {followUps.log.map((item: Log, index: number) => (
                      <React.Fragment key={index}>
                        {index === activeStep && (
                        
                        )}
                      </React.Fragment>
                    ))} */}
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {stepGeneralLog.proposal.support_type
                    ? `${translate('review.yes')}`
                    : `${translate('review.no')}`}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Typography variant="h6">{translate(`review.procedure`)}</Typography>
        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
          {/* {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                     
                    )}
                  </React.Fragment>
                ))} */}
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            <Typography>
              {stepGeneralLog.proposal.support_goal_id
                ? translate(`review.support_goals.${stepGeneralLog.proposal.support_goal_id}`)
                : '-'}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="h6">{translate(`review.note_on_project`)}</Typography>
        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
          {/* {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      
                    )}
                  </React.Fragment>
                ))} */}
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            <Typography>{stepGeneralLog.notes ?? '-'}</Typography>
          </Stack>
        </Stack>
        <Typography variant="h6">{translate(`review.support_output`)}</Typography>
        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
          {/* {followUps.log.map((item: Log, index: number) => (
                  <React.Fragment key={index}>
                    {index === activeStep && (
                      
                    )}
                  </React.Fragment>
                ))} */}
          <Stack direction="column" gap={2} sx={{ pb: 2 }}>
            <Typography>{stepGeneralLog.proposal.support_outputs ?? '-'}</Typography>
          </Stack>
        </Stack>
      </React.Fragment>
    </React.Fragment>
  );
}

export default SupervisorGeneral;
