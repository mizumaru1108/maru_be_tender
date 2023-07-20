import { Grid, Stack, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'redux/store';
import { Log } from '../../../../@types/proposal';
import { FEATURE_PROJECT_PATH_NEW } from '../../../../config';

interface Props {
  // stepGeneralLog: Log;
  stepGeneralLog: any;
  isConsultation: boolean;
}

function ProjectManagerRev({ stepGeneralLog, isConsultation = false }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  const [dataGrants, setDataGrants] = React.useState<any>();
  let batch: number = 0;
  if (stepGeneralLog && stepGeneralLog.message) {
    batch = Number(stepGeneralLog.message.split('_')[1]);
  }
  // console.log('test', stepGeneralLog?.new_values?.closing_report);
  React.useEffect(() => {
    if (proposal || stepGeneralLog) {
      setDataGrants((currentProposal: any) => {
        // console.log('test ');
        const tmpValues = { ...currentProposal };
        return {
          ...currentProposal,
          action: stepGeneralLog?.action || '',
          message: stepGeneralLog?.message || '',
          notes: stepGeneralLog?.notes || '',
          updated_at: stepGeneralLog?.updated_at || '',
          user_role: stepGeneralLog?.user_role || '',
          proposal: {
            accreditation_type_id: stepGeneralLog?.new_values?.accreditation_type_id,
            added_value: stepGeneralLog?.new_values?.added_value,
            been_made_before: stepGeneralLog?.new_values?.been_made_before,
            been_supported_before: stepGeneralLog?.new_values?.been_supported_before,
            closing_report: stepGeneralLog?.new_values?.closing_report,
            does_an_agreement: stepGeneralLog?.new_values?.does_an_agreement,
            chairman_of_board_of_directors:
              stepGeneralLog?.new_values?.chairman_of_board_of_directors,
            vat_percentage: stepGeneralLog?.new_values?.vat_percentage,
            vat: stepGeneralLog?.new_values?.vat,
            target_group_type: stepGeneralLog?.new_values?.target_group_type,
            target_group_num: stepGeneralLog?.new_values?.target_group_num,
            target_group_age: stepGeneralLog?.new_values?.target_group_age,
            support_type: stepGeneralLog?.new_values?.support_type,
            support_outputs: stepGeneralLog?.new_values?.support_outputs,
            support_goal_id: stepGeneralLog?.new_values?.support_goal_id,
            remote_or_insite: stepGeneralLog?.new_values?.remote_or_insite,
            clasification_field: stepGeneralLog?.new_values?.clasification_field,
            reasons_to_accept: stepGeneralLog?.new_values?.reasons_to_accept,
            number_of_payments_by_supervisor:
              stepGeneralLog?.new_values?.number_of_payments_by_supervisor,
            need_picture: stepGeneralLog?.new_values?.need_picture,
            inclu_or_exclu: stepGeneralLog?.new_values?.inclu_or_exclu,
            fsupport_by_supervisor: stepGeneralLog?.new_values?.fsupport_by_supervisor,
            clause: stepGeneralLog?.new_values?.clause,
            most_clents_projects: stepGeneralLog?.new_values?.most_clents_projects,
          },
        };
      });
    }
  }, [stepGeneralLog, proposal]);

  // console.log('dataGrants', dataGrants);
  // console.log('proposal.payments', proposal.payments);

  return (
    <React.Fragment>
      {isConsultation === false &&
        stepGeneralLog.action !== 'accepted_by_project_manager' &&
        stepGeneralLog.action !== 'set_by_supervisor' &&
        stepGeneralLog.action !== 'rejected_by_project_manager' && (
          <React.Fragment>
            <Stack>
              <Typography variant="h6">
                {/* {translate(`review.review_by_supervisor`)} */}
                {translate(
                  `${
                    stepGeneralLog?.user_role === 'CEO'
                      ? 'review.review_by_ceo'
                      : 'review.review_by_project_manager'
                  }`
                )}
              </Typography>
              <Typography>
                {translate(
                  `${
                    stepGeneralLog?.user_role === 'CEO'
                      ? 'project_already_reviewed_by_ceo'
                      : 'project_already_reviewed_by_project_manager'
                  }`
                )}{' '}
                {moment(stepGeneralLog.updated_at).locale(`${currentLang.value}`).fromNow()}
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.closing_report`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {!!stepGeneralLog?.new_values?.closing_report &&
                      stepGeneralLog?.new_values?.closing_report
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
                      {!!stepGeneralLog?.new_values?.does_an_agreement &&
                      stepGeneralLog?.new_values?.does_an_agreement
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
                        {!!stepGeneralLog?.new_values?.need_picture &&
                        stepGeneralLog?.new_values?.need_picture
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
                        {!!stepGeneralLog?.new_values?.inclu_or_exclu &&
                        stepGeneralLog?.new_values?.inclu_or_exclu
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
                    <Typography>{stepGeneralLog?.new_values?.vat_percentage ?? 0}</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.inclu_or_exclu`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {!!stepGeneralLog?.new_values?.inclu_or_exclu &&
                      stepGeneralLog?.new_values?.inclu_or_exclu
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
                      {stepGeneralLog?.new_values?.number_of_payments_by_supervisor}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.payment_support`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {stepGeneralLog?.new_values?.fsupport_by_supervisor} {translate('review.sar')}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{translate(`review.support_amount_inclu`)}</Typography>
                <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                  <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                    <Typography>
                      {!!stepGeneralLog?.new_values?.support_type &&
                      stepGeneralLog?.new_values?.support_type
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
                  {!!stepGeneralLog?.new_values?.support_goal_id &&
                  stepGeneralLog?.new_values?.support_goal_id
                    ? translate(
                        `review.support_goals.${stepGeneralLog?.new_values?.support_goal_id}`
                      )
                    : '-'}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h6">{translate(`review.note_on_project`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{stepGeneralLog?.notes ?? '-'}</Typography>
              </Stack>
            </Stack>
            <Typography variant="h6">{translate(`review.support_output`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{stepGeneralLog?.new_values?.support_outputs ?? '-'}</Typography>
              </Stack>
            </Stack>
          </React.Fragment>
        )}
      {dataGrants &&
        isConsultation &&
        stepGeneralLog.action !== 'accepted_by_project_manager' &&
        stepGeneralLog.action !== 'set_by_supervisor' &&
        stepGeneralLog.action !== 'rejected_by_project_manager' && (
          <Grid container spacing={2}>
            <Stack>
              <Typography variant="h6">
                {/* {translate(`review.review_by_supervisor`)} */}
                {translate(
                  `${
                    stepGeneralLog?.user_role === 'CEO'
                      ? 'review.review_by_ceo'
                      : 'review.review_by_project_manager'
                  }`
                )}
              </Typography>
              <Typography>
                {translate(
                  `${
                    stepGeneralLog?.user_role === 'CEO'
                      ? 'project_already_reviewed_by_ceo'
                      : 'project_already_reviewed_by_project_manager'
                  }`
                )}{' '}
                {moment(stepGeneralLog.updated_at).locale(`${currentLang.value}`).fromNow()}
              </Typography>
            </Stack>
            {Object.entries(dataGrants.proposal!)
              .filter(
                ([key]) => key !== 'inclu_or_exclu' && key !== 'vat' && key !== 'vat_percentage'
              )
              .map(([key, value]) => {
                // console.log({ stepGeneralLog });
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
                          {value === true
                            ? translate('partial_support')
                            : translate('full_support')}
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
                          <Typography>
                            {translate(`review.target_group_type_enum.${value}`)}
                            {/* {target_type_map[tmpVal.toUpperCase() as keyof BeneficiariesMap]
                          ? translate(`review.target_group_type_enum.${value}`)
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
            {dataGrants &&
              Object.entries(dataGrants.proposal!)
                .filter(
                  ([key]) => key === 'inclu_or_exclu' || key === 'vat' || key === 'vat_percentage'
                )
                .map(([key, value]) => {
                  if (key === 'inclu_or_exclu' && proposal?.vat) {
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
                  if (key === 'vat_percentage' && proposal?.vat) {
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
                <Typography>{stepGeneralLog.notes ?? '-'}</Typography>
              </Stack>
            </Grid>
          </Grid>
        )}
      {(stepGeneralLog.action === 'accepted_by_project_manager' ||
        stepGeneralLog.action === 'set_by_supervisor' ||
        stepGeneralLog.action === 'rejected_by_project_manager') && (
        <>
          {' '}
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
        </>
      )}
    </React.Fragment>
  );
}

export default ProjectManagerRev;
