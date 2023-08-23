import { Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import {
  BankInformation,
  BaseAttachement,
  ItemBudget,
  timeline,
} from '../../../../@types/proposal';
import ButtonDownloadFiles from '../../../../components/button/ButtonDownloadFiles';
import { FormProvider, RHFDatePicker, RHFTextField } from '../../../../components/hook-form';
import { formatCapitalizeText } from '../../../../utils/formatCapitalizeText';
import BankImageComp from '../../../shared/BankImageComp';

interface Props {
  // stepGeneralLog: Log;
  stepGeneralLog: any;
  // isConsultation: boolean;
}

function RevisionLog({ stepGeneralLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  const [dataGrants, setDataGrants] = React.useState<any>();
  // let batch: number = 0;
  // if (stepGeneralLog && stepGeneralLog.message) {
  //   batch = Number(stepGeneralLog.message.split('_')[1]);
  // }
  // console.log('stepGeneralLog ', stepGeneralLog);
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
            ...stepGeneralLog?.new_values,
            bank_informations: stepGeneralLog?.new_values?.bank_informations
              ? stepGeneralLog?.new_values?.bank_informations
              : {},
          },
        };
      });
    }
  }, [stepGeneralLog, proposal]);

  const bankInfromation = React.useMemo(() => {
    let tmpBankInformation: BankInformation | undefined = undefined;
    if (dataGrants?.proposal && dataGrants?.proposal?.bank_informations) {
      tmpBankInformation = dataGrants?.proposal?.bank_informations as BankInformation;
    }
    return tmpBankInformation;
  }, [dataGrants]);

  const latterOfSupport = React.useMemo(() => {
    let tmpLatterOfSupport: BaseAttachement | undefined = undefined;
    if (dataGrants?.proposal && dataGrants?.proposal?.letter_ofsupport_req) {
      tmpLatterOfSupport = dataGrants?.proposal?.letter_ofsupport_req as BaseAttachement;
    }
    return tmpLatterOfSupport;
  }, [dataGrants]);

  const projectAttachment = React.useMemo(() => {
    let tmpProjectAttachment: BaseAttachement | undefined = undefined;
    if (dataGrants?.proposal && dataGrants?.proposal?.project_attachments) {
      tmpProjectAttachment = dataGrants?.proposal?.project_attachments as BaseAttachement;
    }
    return tmpProjectAttachment;
  }, [dataGrants]);

  const projectTimelines = React.useMemo(() => {
    let tmpProjectTimelines: timeline[] | [] = [];
    if (
      dataGrants?.proposal &&
      dataGrants?.proposal?.project_timeline &&
      dataGrants?.proposal?.project_timeline.length > 0
    ) {
      tmpProjectTimelines = dataGrants?.proposal?.project_timeline as timeline[];
    }
    return tmpProjectTimelines;
  }, [dataGrants]);

  const proposalItemBudgets = React.useMemo(() => {
    let tmpProposalItemBudgets: ItemBudget[] | [] = [];
    if (
      dataGrants?.proposal &&
      dataGrants?.proposal?.proposal_item_budgets &&
      dataGrants?.proposal?.proposal_item_budgets.length > 0
    ) {
      tmpProposalItemBudgets = dataGrants?.proposal?.proposal_item_budgets as ItemBudget[];
    }
    return tmpProposalItemBudgets;
  }, [dataGrants]);

  const methods = useForm<any>({
    defaultValues: {},
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // console.log('dataGrants', dataGrants);

  return (
    <React.Fragment>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit((data) => {
          console.log('data', data);
        })}
      >
        {stepGeneralLog.action === 'send_revision_for_finance_amandement' &&
        bankInfromation?.card_image?.url ? (
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography variant="h6">
                {/* {translate(`review.review_by_supervisor`)} */}
                {translate('review.revised_by_client')}
              </Typography>
              <Typography>
                {translate('project_already_revised_by_client')}{' '}
                {moment(stepGeneralLog.updated_at).locale(`${currentLang.value}`).fromNow()}
              </Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              {/* {'test'} */}
              {bankInfromation ? (
                <BankImageComp
                  enableButton={true}
                  bankName={bankInfromation?.bank_name || ''}
                  accountNumber={bankInfromation?.bank_account_number || ''}
                  bankAccountName={bankInfromation?.bank_account_name || ''}
                  imageUrl={bankInfromation?.card_image?.url || '#'}
                  size={bankInfromation?.card_image.size || undefined}
                  type={bankInfromation?.card_image.type || ''}
                  borderColor={bankInfromation?.card_image.border_color ?? 'transparent'}
                />
              ) : null}
            </Grid>
          </Grid>
        ) : null}
        {stepGeneralLog.action === 'send_revision_for_supervisor_amandement' ? (
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography variant="h6">{translate('review.revised_by_client')}</Typography>
              <Typography>
                {translate('project_already_revised_by_client')}{' '}
                {moment(stepGeneralLog.updated_at).locale(`${currentLang.value}`).fromNow()}
              </Typography>
            </Grid>
            {dataGrants &&
              dataGrants.proposal &&
              Object.entries(dataGrants.proposal)
                .filter(
                  ([key]) =>
                    key !== 'bank_informations' &&
                    key !== 'outter_status' &&
                    key !== 'state' &&
                    key !== 'id' &&
                    key !== 'letter_ofsupport_req' &&
                    key !== 'project_attachments' &&
                    key !== 'project_timeline' &&
                    key !== 'timelines' &&
                    key !== 'proposal_item_budgets'
                )
                .map(([key, value]: any) => {
                  const tmpValue = value || '';
                  if (!tmpValue) return null;
                  if (key === 'project_implement_date' && tmpValue) {
                    return (
                      <Grid key={key} item md={6} xs={12}>
                        <Typography variant="h6">{translate(`review.${key}`)}</Typography>
                        <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                          <Typography>{dayjs(tmpValue).format('YYYY-MM-DD')}</Typography>
                        </Stack>
                      </Grid>
                    );
                  }
                  return (
                    <Grid key={key} item md={6} xs={12}>
                      <Typography variant="h6">{translate(`review.${key}`)}</Typography>
                      <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                        <Typography>{formatCapitalizeText(String(tmpValue))}</Typography>
                      </Stack>
                    </Grid>
                  );
                })}
            <Grid item md={12} xs={12}>
              <Grid container>
                {latterOfSupport && latterOfSupport?.url ? (
                  <Grid item md={6} xs={12}>
                    <Typography variant="h6">{translate(`review.letter_ofsupport_req`)}</Typography>
                    <Stack direction="column" gap={2} sx={{ padding: '0 0 8px 0' }}>
                      <ButtonDownloadFiles files={latterOfSupport} />
                    </Stack>
                  </Grid>
                ) : null}
                {projectAttachment && projectAttachment?.url ? (
                  <Grid item md={6} xs={12}>
                    <Typography variant="h6" sx={{ padding: '0 0 0 8px' }}>
                      {translate(`review.project_attachments`)}
                    </Typography>
                    <Stack direction="column" gap={2} sx={{ padding: '0 0 8px 8px' }}>
                      <ButtonDownloadFiles files={projectAttachment} />
                    </Stack>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            {projectTimelines && projectTimelines.length > 0 ? (
              <Grid item md={12} xs={12}>
                <Typography variant="h6" sx={{ padding: '0 0 16px 0' }}>
                  {translate(`review.project_timeline`)}
                </Typography>
                <Grid container>
                  {projectTimelines.map((item: timeline, index: number) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} md={5} sx={{ margin: '8px 8px' }}>
                        <RHFTextField
                          disabled={true}
                          type={'textField'}
                          value={item.name}
                          name={'name'}
                          label={translate(
                            `funding_project_request_project_timeline.activity.label`
                          )}
                          placeholder={translate(
                            `funding_project_request_project_timeline.activity.placeholder`
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={3} sx={{ margin: '8px 8px' }}>
                        <RHFDatePicker
                          disabled={true}
                          value={moment(item.start_date).format('LLL')}
                          type={'datePicker'}
                          name={'start_date'}
                          label={translate(
                            `funding_project_request_project_timeline.start_date.label`
                          )}
                          placeholder={translate(
                            `funding_project_request_project_timeline.start_date.placeholder`
                          )}
                          minDate={
                            new Date(new Date().setDate(new Date().getDate() + 1))
                              .toISOString()
                              .split('T')[0]
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={3} sx={{ margin: '8px 8px' }}>
                        <RHFDatePicker
                          disabled={true}
                          type={'datePicker'}
                          value={moment(item.end_date).format('LLL')}
                          name={'end_date'}
                          label={translate(
                            `funding_project_request_project_timeline.end_date.label`
                          )}
                          placeholder={translate(
                            `funding_project_request_project_timeline.start_date.placeholder`
                          )}
                          minDate={
                            new Date(new Date().setDate(new Date().getDate() + 1))
                              .toISOString()
                              .split('T')[0]
                          }
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
            ) : null}
            {proposalItemBudgets && proposalItemBudgets.length > 0 ? (
              <Grid item md={12} xs={12}>
                <Typography variant="h6" sx={{ padding: '0 0 16px 0' }}>
                  {translate(`review.item_budgets`)}
                </Typography>
                <Grid container>
                  {proposalItemBudgets.map((item: ItemBudget, index: number) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} md={4} sx={{ margin: '8px 4px' }}>
                        <RHFTextField
                          disabled={true}
                          type={'textField'}
                          value={item.clause}
                          name={'name'}
                          label={translate(`funding_project_request_form4.item.label`)}
                          placeholder={translate(`funding_project_request_form4.item.placeholder`)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ margin: '8px 4px' }}>
                        <RHFTextField
                          disabled={true}
                          type={'textField'}
                          value={item.explanation}
                          name={'explanation'}
                          label={translate(`funding_project_request_form4.explanation.label`)}
                          placeholder={translate(
                            `funding_project_request_form4.explanation.placeholder`
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={3} sx={{ margin: '8px 4px' }}>
                        <RHFTextField
                          disabled={true}
                          type={'textField'}
                          value={item.amount}
                          name={'amount'}
                          label={translate(`funding_project_request_form4.amount.label`)}
                          placeholder={translate(
                            `funding_project_request_form4.amount.placeholder`
                          )}
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        ) : null}
      </FormProvider>
    </React.Fragment>
  );
}

export default RevisionLog;
