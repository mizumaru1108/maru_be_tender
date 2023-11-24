import { Grid, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useSelector } from 'redux/store';
import { PropsalLogGrants } from '../../../../@types/proposal';
import { selectSectionProjectPath } from 'utils/generateParentChild';
import { getOldTargetGroupType } from '../../../../utils/getFileData';

interface Props {
  stepGransLog: PropsalLogGrants;
}

function SupervisorGrantsRev({ stepGransLog }: Props) {
  // console.log({ stepGransLog });
  const { proposal } = useSelector((state) => state.proposal);
  const { track } = useSelector((state) => state.tracks);
  const { translate, currentLang } = useLocales();
  const [newProposal, setNewProposal] = React.useState<any>();

  let batch: number = 0;

  if (stepGransLog && stepGransLog.message) {
    batch = Number(stepGransLog.message.split('_')[1]);
  }

  useEffect(() => {
    if (proposal) {
      setNewProposal((currentProposal: any) => {
        const generate = selectSectionProjectPath({
          parent: track.sections!,
          section_id: proposal.section_id,
        });

        return {
          ...currentProposal,
          action: stepGransLog.action,
          message: stepGransLog.message,
          notes: stepGransLog.notes,
          updated_at: stepGransLog.updated_at,
          user_role: stepGransLog.user_role,
          proposal: {
            section_level_one: generate.levelOne ? generate.levelOne.name : null,
            section_level_two: generate.levelTwo ? generate.levelTwo.name : null,
            section_level_three: generate.levelThree ? generate.levelThree.name : null,
            section_level_four: generate.levelFour ? generate.levelFour.name : null,
            accreditation_type_id: stepGransLog?.new_values?.accreditation_type_id,
            added_value: stepGransLog?.new_values?.added_value,
            been_made_before: stepGransLog?.new_values?.been_made_before,
            been_supported_before: stepGransLog?.new_values?.been_supported_before,
            closing_report: stepGransLog?.new_values?.closing_report,
            does_an_agreement: stepGransLog?.new_values?.does_an_agreement,
            chairman_of_board_of_directors:
              stepGransLog?.new_values?.chairman_of_board_of_directors,
            vat_percentage: stepGransLog?.new_values?.vat_percentage,
            vat: stepGransLog?.new_values?.vat,
            target_group_type: stepGransLog?.new_values?.target_group_type,
            target_group_num: stepGransLog?.new_values?.target_group_num,
            target_group_age: stepGransLog?.new_values?.target_group_age,
            support_type: stepGransLog?.new_values?.support_type,
            support_outputs: stepGransLog?.new_values?.support_outputs,
            // support_goal_id: stepGransLog?.new_values?.support_goal_id,
            remote_or_insite: stepGransLog?.new_values?.remote_or_insite,
            clasification_field: stepGransLog?.new_values?.clasification_field,
            reasons_to_accept: stepGransLog?.new_values?.reasons_to_accept,
            number_of_payments_by_supervisor:
              stepGransLog?.new_values?.number_of_payments_by_supervisor,
            need_picture: stepGransLog?.new_values?.need_picture,
            inclu_or_exclu: stepGransLog?.new_values?.inclu_or_exclu,
            fsupport_by_supervisor: stepGransLog?.new_values?.fsupport_by_supervisor,
            clause: stepGransLog?.new_values?.clause,
            most_clents_projects: stepGransLog?.new_values?.most_clents_projects,
          },
        };
      });
    }
  }, [stepGransLog, proposal, track]);

  return (
    <React.Fragment>
      {newProposal &&
        stepGransLog.action !== 'insert_payment' &&
        stepGransLog.action !== 'issued_by_supervisor' &&
        stepGransLog?.new_values && (
          <Grid container spacing={2}>
            <Stack direction="column" gap={2} sx={{ pb: 2, px: 2 }}>
              <Typography>
                {translate('project_already_reviewed_by_supervisor')}{' '}
                {moment(stepGransLog.updated_at).locale(`${currentLang.value}`).fromNow()}
              </Typography>
            </Stack>
            {Object.entries(newProposal.proposal!)
              .filter(
                ([key]) =>
                  key !== 'inclu_or_exclu' &&
                  key !== 'vat' &&
                  key !== 'vat_percentage' &&
                  key !== 'been_supported_before' &&
                  // key !== 'support_goal_id' &&
                  key !== 'accreditation_type_id' &&
                  key !== 'chairman_of_board_of_directors'
              )
              .map(([key, value]) => {
                // console.log({ stepGransLog });
                // if (!value) {
                //   return null;
                // }
                if (key === 'created_at' || key === 'updated_at') {
                  return null; // Exclude these properties from rendering
                }
                // if (key === 'support_goal_id') {
                //   return (
                //     <Grid item xs={6} key={key}>
                //       <Typography variant="h6">
                //         {
                //           // key
                //           translate(`review.${key}`)
                //         }
                //       </Typography>
                //       <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                //         <Typography>
                //           {value ? translate(`review.support_goals.${String(value)}`) : '-'}
                //         </Typography>
                //       </Stack>
                //     </Grid>
                //   );
                // }
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
                // if (key === 'been_supported_before') {
                //   return (
                //     <Grid item xs={6} key={key}>
                //       <Typography variant="h6">
                //         {
                //           // key
                //           translate(`review.${key}`)
                //         }
                //       </Typography>
                //       <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                //         <Typography>
                //           {value ? translate('review.yes') : translate('review.no')}
                //         </Typography>
                //       </Stack>
                //     </Grid>
                //   );
                // }
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
                          {value ? translate(`remote_or_insite.${value}`) : '-No data-'}
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
                          {value === true
                            ? translate('full_support')
                            : translate('partial_support')}
                        </Typography>
                      </Stack>
                    </Grid>
                  );
                }
                if (key === 'target_group_type') {
                  const tmpVal: string = value as string;
                  if (tmpVal) {
                    return (
                      <Grid item xs={6} key={key}>
                        <Typography variant="h6">
                          {
                            // key
                            translate(`review.${key}`)
                          }
                        </Typography>
                        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                          <Typography>{translate(getOldTargetGroupType(tmpVal))}</Typography>
                        </Stack>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid item xs={6} key={key}>
                        <Typography variant="h6">
                          {
                            // key
                            translate(`review.${key}`)
                          }
                        </Typography>
                        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                          <Typography>{'-'}</Typography>
                        </Stack>
                      </Grid>
                    );
                  }
                }
                if (key === 'target_group_age') {
                  const tmpVal: string = value as string;
                  if (tmpVal) {
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
                            {translate(`review.target_group_age_enum.${value}`)}
                            {/* {target_age_map[tmpVal.toUpperCase() as keyof BeneficiariesMap]
                              ? translate(`review.target_group_age_enum.${value}`)
                              : value} */}
                          </Typography>
                        </Stack>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid item xs={6} key={key}>
                        <Typography variant="h6">
                          {
                            // key
                            translate(`review.${key}`)
                          }
                        </Typography>
                        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                          <Typography>{'-'}</Typography>
                        </Stack>
                      </Grid>
                    );
                  }
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
            {newProposal.proposal &&
              Object.entries(newProposal.proposal)
                .filter(
                  ([key]) => key === 'inclu_or_exclu' || key === 'vat' || key === 'vat_percentage'
                )
                .map(([key, value]) => {
                  if (key === 'inclu_or_exclu' && newProposal?.proposal?.vat) {
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
                  if (key === 'vat_percentage' && newProposal?.proposal?.vat) {
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
            [...proposal.payments]
              .sort((a: any, b: any) => parseInt(a.order) - parseInt(b.order))
              .map((payment, index) => (
                <Grid container key={index} sx={{ mb: 4 }}>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {translate('review.Batch') + ' ' + payment.order}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">
                      {moment(payment.payment_date).locale(`${currentLang.value}`).format('LLLL')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {payment.payment_amount
                        ? `${String(payment.payment_amount) + ' ' + translate('review.sar')}`
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {payment.notes && payment.notes !== '' ? payment.notes : '-'}
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
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {translate('review.Batch') + ' ' + payment.order}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">
                      {moment(payment.payment_date).locale(`${currentLang.value}`).format('LLLL')}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {payment.payment_amount
                        ? `${String(payment.payment_amount) + ' ' + translate('review.sar')}`
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1">
                      {payment.notes && payment.notes !== '' ? payment.notes : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
        </React.Fragment>
      )}
      {stepGransLog.action === 'reject_amandement_payment' && (
        <Grid container spacing={2}>
          <Stack direction="column" gap={2} sx={{ pb: 2, px: 2 }}>
            <Typography>
              {translate('project_already_reviewed_by_supervisor')}{' '}
              {moment(stepGransLog.updated_at).locale(`${currentLang.value}`).fromNow()}
            </Typography>
          </Stack>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.reject_reason`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{stepGransLog?.reject_reason || '-'}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default SupervisorGrantsRev;
