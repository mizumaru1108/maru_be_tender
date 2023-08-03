// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFTextField } from 'components/hook-form';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { _supportGoals } from '_mock/_supportgoals';
import { EditAccModalForm, ModalProposalType } from '../../../../../@types/project-details';
import { ProposalApprovePayloadSupervisor } from '../../types';

import { useSnackbar } from 'notistack';
import { getOneProposal } from 'queries/commons/getOneProposal';
import { useLocation, useParams } from 'react-router';
import { useQuery } from 'urql';
import uuidv4 from 'utils/uuidv4';
import { dispatch, useSelector } from '../../../../../redux/store';
import {
  getProposal,
  getProposalCount,
  updateAcceptedDataProposalNonGrants,
} from '../../../../../redux/slices/proposal';
import useAuth from '../../../../../hooks/useAuth';
import { _supportGoalsArr } from '../../../../../_mock/_supportGoalsArr';
import axiosInstance from '../../../../../utils/axios';
import { FEATURE_PROPOSAL_COUNTING, REOPEN_TMRA_S568 } from 'config';
import { getMissingItems } from '../../../../../utils/checkDeletedArray';

function AcceptedForm({ onEdit }: EditAccModalForm) {
  const { translate, currentLang } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);
  const { activeRole } = useAuth();
  const location = useLocation();
  const { id: pid } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [save, setSave] = useState<boolean>(true);
  const [isVat, setIsVat] = useState<boolean>(proposal.vat);
  const [basedBudget, setBasedBudget] = useState<
    | { id?: string; amount?: number | undefined | null; clause?: string; explanation?: string }[]
    | []
  >([]);
  const [tempDeletedBudget, setTempDeletedBudget] = useState<
    | { id?: string; amount?: number | undefined | null; clause?: string; explanation?: string }[]
    | []
  >([]);
  // console.log({ tempDeletedBudget });

  const [oneProposal, setOneProposal] = useState<any>();
  const [proposalResult] = useQuery({
    query: getOneProposal,
    variables: {
      id: pid,
    },
  });

  const { data: proposalData, fetching: fetchingProposal, error: errorProposal } = proposalResult;

  const validationSchema = React.useMemo(() => {
    const tmpIsVat = isVat;
    return Yup.object().shape({
      support_type: Yup.boolean().required(translate('errors.cre_proposal.support_type.required')),
      closing_report: Yup.boolean().required(
        translate('errors.cre_proposal.closing_report.required')
      ),
      need_picture: Yup.boolean().required(translate('errors.cre_proposal.need_picture.required')),
      does_an_agreement: Yup.boolean().required(
        translate('errors.cre_proposal.does_an_agreement.required')
      ),
      detail_project_budgets: Yup.array().of(
        Yup.object().shape({
          clause: Yup.string().required(
            translate('errors.cre_proposal.detail_project_budgets.clause.required')
          ),
          explanation: Yup.string().required(
            translate('errors.cre_proposal.detail_project_budgets.explanation.required')
          ),
          amount: Yup.number()
            .typeError(translate('errors.cre_proposal.detail_project_budgets.amount.message'))
            .integer()
            .required(translate('errors.cre_proposal.detail_project_budgets.amount.required')),
        })
      ),
      // notes: Yup.string(),
      support_outputs: Yup.string().required(
        translate('errors.cre_proposal.support_outputs.required')
      ),
      vat: Yup.boolean().required(translate('errors.cre_proposal.vat.required')),
      // vat_percentage: Yup.string()
      //   // .integer()
      //   .nullable()
      //   .test('len', translate('errors.cre_proposal.vat_percentage.greater_than_0'), (val) => {
      //     if (!val) return true;
      //     return Number(val) > 0;
      //   }),
      ...(tmpIsVat && {
        vat_percentage: Yup.string()
          // .integer()
          .required(translate('errors.cre_proposal.vat_percentage.greater_than_0'))
          // .nullable()
          .test('len', translate('errors.cre_proposal.vat_percentage.greater_than_0'), (val) => {
            if (!val) return true;
            return Number(val) > 0;
          }),
      }),
      // .min(1, translate('errors.cre_proposal.vat_percentage.greater_than_0'))
      inclu_or_exclu: Yup.boolean(),
      support_goal_id: Yup.string().required(
        translate('errors.cre_proposal.support_goal_id.required')
      ),
      payment_number: Yup.string()
        .required(translate('errors.cre_proposal.payment_number.required'))
        .test('len', `${translate('errors.cre_proposal.payment_number.greater_than')} 1`, (val) => {
          const number_of_payment = Number(val) > 0;
          console.log('number_of_payment', number_of_payment);
          return number_of_payment;
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVat]);

  // const validationSchema =

  const defaultValues = {
    clasification_field: 'عام',
    support_type: proposal.support_type,
    closing_report: proposal.closing_report,
    need_picture: proposal.need_picture,
    does_an_agreement: proposal.does_an_agreement,
    // fsupport_by_supervisor: undefined,
    // number_of_payments_by_supervisor: undefined,
    detail_project_budgets: [
      {
        clause: '',
        explanation: '',
        amount: undefined,
      },
    ],
    support_outputs: proposal.support_outputs,
    vat: proposal.vat,
    vat_percentage: proposal.vat_percentage ?? undefined,
    inclu_or_exclu: proposal.inclu_or_exclu ?? undefined,
    support_goal_id: proposal.support_goal_id,
  };

  const methods = useForm<ProposalApprovePayloadSupervisor>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    resetField,
    getValues,
    reset,
    control,
  } = methods;

  const vat = watch('vat');
  const paymentNumber = watch('payment_number');
  const support_type = watch('support_type');
  const item_budgets = watch('detail_project_budgets');

  const {
    fields: itemBudgets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'detail_project_budgets',
  });
  const onSubmitForm = async (data: ProposalApprovePayloadSupervisor) => {
    setIsLoading(true);
    // get total from amount_required_fsupport
    const limitSupport = Number(proposal?.amount_required_fsupport);
    let totalAmount: number | undefined = undefined;
    if (data.detail_project_budgets) {
      totalAmount = Number(
        data
          .detail_project_budgets!.map((item) => item.amount)
          .reduce((acc, curr) => acc! + curr!, 0)
      );
    }
    let checkPassAmount = false;
    if (data.support_type) {
      if (totalAmount === limitSupport) {
        checkPassAmount = true;
      } else {
        checkPassAmount = false;
      }
    } else {
      if (totalAmount < limitSupport) {
        checkPassAmount = true;
      } else {
        checkPassAmount = false;
      }
    }
    if (data.detail_project_budgets.length) {
      const created_proposal_budget = data.detail_project_budgets
        .filter((item) => !basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(el.amount),
        }));

      const updated_proposal_budget = data.detail_project_budgets
        .filter((item) => basedBudget.find((i) => i.id === item.id))
        .map((el) => ({
          ...el,
          amount: Number(el.amount),
        }));

      // const deleted_proposal_budget =
      //   tempDeletedBudget.length > 0
      //     ? tempDeletedBudget.map((el) => ({
      //         ...el,
      //         amount: Number(el.amount),
      //       }))
      //     : getMissingItems(proposal.proposal_item_budgets, data.detail_project_budgets);
      const deleted_proposal_budget = getMissingItems(
        proposal.proposal_item_budgets,
        data.detail_project_budgets
      ).map((el) => ({
        ...el,
        amount: Number(el.amount),
      }));

      const { length } = data.detail_project_budgets;
      const totalFSupport = data.detail_project_budgets
        .map((el) => Number(el.amount))
        .reduce((acc, curr) => acc + (curr || 0), 0);

      delete data.detail_project_budgets;

      const newData = {
        fsupport_by_supervisor: totalFSupport,
        number_of_payments_by_supervisor: length,
        created_proposal_budget,
        updated_proposal_budget,
        deleted_proposal_budget,
        ...data,
      };
      newData.vat_percentage = Number(data.vat_percentage);
      const editedBy = location.pathname.split('/')[1];

      let payload = {
        proposal_id: pid,
        action: 'update',
        message: 'تم قبول المشروع من قبل مشرف المشاريع ',
        selectLang: currentLang.value,
      };
      if (editedBy === 'project-manager') {
        payload = {
          ...payload,
          project_manager_payload: {
            ...newData,
          },
        };
      } else {
        payload = {
          ...payload,
          ceo_payload: {
            ...newData,
          },
        };
      }
      // console.log({ payload });
      // onSubmit(newData);

      if (checkPassAmount) {
        // console.log('masuk true');
        try {
          await dispatch(updateAcceptedDataProposalNonGrants(payload, activeRole!)).then(() => {
            if (FEATURE_PROPOSAL_COUNTING) {
              dispatch(getProposalCount(activeRole ?? 'test'));
            }
            setSave(true);
            onEdit(false);
            dispatch(getProposal(pid as string, activeRole! as string));
            enqueueSnackbar('تم إرسال الشيك بنجاح, بالإضافة إلى تعديل حالة الدفعة', {
              variant: 'success',
              preventDuplicate: true,
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
              },
            });
            setIsLoading(false);
          });
        } catch (error) {
          setIsLoading(false);
          reset(defaultValues);
          const statusCode = (error && error.statusCode) || 0;
          const message = (error && error.message) || null;
          enqueueSnackbar(
            `${
              statusCode < 500 && message
                ? message
                : translate('pages.common.internal_server_error')
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
        setSave(true);
        onEdit(false);
      } else {
        setIsLoading(false);
        enqueueSnackbar(`${translate('notification.error_exceeds_amount')}: ${limitSupport}`, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }
    } else {
      enqueueSnackbar(translate('notification.proposal_item_budget_empty'), {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      setIsLoading(false);
      resetField('detail_project_budgets');
    }
  };

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`/tender-proposal/fetch-by-id?id=${pid}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        setOneProposal(rest.data.data);
        setBasedBudget(rest.data.data.proposal_item_budgets);
        setValue('detail_project_budgets', rest.data.data.proposal_item_budgets);
        // console.log('test', rest.data.data.proposal_item_budgets.length);
        if (REOPEN_TMRA_S568) {
          setValue('payment_number', rest.data.data.proposal_item_budgets.length);
        }
      }
    } catch (err) {
      console.log('err', err);
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
      resetField('detail_project_budgets');
    } finally {
      setIsLoading(false);
      // onEdit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, pid, setValue, resetField]);

  const handleLoop = (loopNumber: number) => {
    for (let i = 0; i < loopNumber; i++) {
      append({
        amount: undefined,
        clause: '',
        explanation: '',
        id: uuidv4(),
      });
    }
  };

  const handleRemoveLoop = (loopNumber: number) => {
    for (let i = 0; i < loopNumber; i++) {
      remove(item_budgets.length - 1 - i);
    }
  };

  React.useEffect(() => {
    let loopNumber = -1;
    // console.log({ item_budgets });
    // if (paymentNumber > item_budgets.length) {
    //   loopNumber = Number(paymentNumber) - item_budgets.length;
    //   if (loopNumber > 0) {
    //     handleLoop(loopNumber);
    //   }
    // }
    // if (paymentNumber < item_budgets.length) {
    //   loopNumber = Number(paymentNumber);
    //   // console.log('masuk else', loopNumber);
    //   if (loopNumber >= proposal.proposal_item_budgets.length) {
    //     handleRemoveLoop(loopNumber);
    //   }
    // }

    if (paymentNumber > item_budgets.length) {
      loopNumber = Number(paymentNumber) - item_budgets.length;
      if (loopNumber > 0) {
        handleLoop(loopNumber);
      }
    }
    if (paymentNumber < item_budgets.length) {
      loopNumber = item_budgets.length - Number(paymentNumber);
      // console.log('masuk else', <loo></loo>pNumber);
      handleRemoveLoop(loopNumber);
      // if (loopNumber >= proposal.proposal_item_budgets.length) {
      // }
    }
    // console.log({ paymentNumber, loopNumber });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentNumber, handleLoop, handleRemoveLoop]);

  React.useEffect(() => {
    // console.log('masuk sini');
    fetchingIncoming();
    // fetchingPrevious();
  }, [fetchingIncoming]);

  React.useEffect(() => {
    if (oneProposal && save) onEdit(false);
  }, [oneProposal, onEdit, save]);

  if (errorProposal) return <>Something when wrong on get proposal details</>;

  // console.log({ support_type });

  return (
    <FormProvider methods={methods}>
      {!fetchingProposal && (
        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid item md={6} xs={12}>
            <RHFRadioGroup
              data-cy="acc_form_non_consulation_support_type"
              disabled={save}
              type="radioGroup"
              name="support_type"
              label="نوع الدعم*"
              options={[
                { label: 'دعم جزئي', value: false },
                { label: 'دعم كلي', value: true },
              ]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFRadioGroup
              data-cy="acc_form_non_consulation_closing_report"
              disabled={save}
              type="radioGroup"
              name="closing_report"
              label="تقرير الإغلاق*"
              options={[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFRadioGroup
              data-cy="acc_form_non_consulation_need_picture"
              disabled={save}
              type="radioGroup"
              name="need_picture"
              label="هل يحتاج إلى صور*"
              options={[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFRadioGroup
              data-cy="acc_form_non_consulation_agreement"
              disabled={save}
              type="radioGroup"
              name="does_an_agreement"
              label="هل يحتاج اتفاقية*"
              options={[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFRadioGroup
              data-cy="acc_form_non_consulation_vat"
              disabled={save}
              type="radioGroup"
              name="vat"
              onClick={(e) => {
                if (e && e.target.value) {
                  if (e.target.value === 'true') {
                    setIsVat(true);
                    setValue('vat_percentage', '0');
                    // console.log('test 1');
                  } else {
                    setIsVat(false);
                    setValue('vat_percentage', '');
                    // console.log('test 2');
                  }
                }
                console.log('e.target.value', e.target.value);
              }}
              label="هل مبلغ السداد شامل لضريبة القيمة المضافة*"
              options={[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFSelect
              data-cy="acc_form_non_consulation_support_goal"
              disabled={save}
              type="select"
              size="small"
              name="support_goal_id"
              placeholder="الرجاء اختيار أهداف الدعم"
              label="اهداف الدعم*"
            >
              {/* {_supportGoals[
                `${proposalData.proposal.project_track as keyof typeof _supportGoals}`
              ].map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.title}
                </MenuItem>
              ))} */}
              {_supportGoalsArr.map((item) => (
                <MenuItem
                  data-cy={`acc_form_non_consulation_support_goal_id_${item.index}`}
                  value={item.value}
                  key={item.value}
                >
                  {item.title}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
          <Grid item md={6} xs={12}>
            <RHFTextField
              data-cy="acc_form_non_consulation_payment_number"
              type={'number'}
              size={'small'}
              disabled={
                // save
                //   ? true
                //   : support_type === 'false' || !support_type || support_type === undefined
                //   ? false
                //   : true
                save
              }
              name="payment_number"
              placeholder="عدد الدفعات"
              label="عدد الدفعات*"
            />
          </Grid>
          {isVat && (
            <Grid item md={6} xs={12}>
              <RHFTextField
                data-cy="acc_form_non_consulation_vat_percentage"
                disabled={save}
                type="number"
                size="small"
                name="vat_percentage"
                label="النسبة المئوية من الضريبة*"
                placeholder="النسبة المئوية من الضريبة"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          )}
          {isVat && (
            <Grid item md={6} xs={12}>
              <RHFRadioGroup
                data-cy="acc_form_non_consulation_inclu_or_exclu"
                disabled={save}
                type="radioGroup"
                name="inclu_or_exclu"
                label="هل مبلغ السداد شامل أو غير شامل لضريبة القيمة المضافة"
                options={[
                  { label: 'نعم', value: true },
                  { label: 'لا', value: false },
                ]}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography sx={{ mb: 2 }}>الموازنة التفصيلية للمشروع*</Typography>
            {itemBudgets.map((v, i) => (
              <Grid container key={v.id} spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <Controller
                    name={`detail_project_budgets[${i}].clause`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].explanation`}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                        disabled={
                          // (support_type === 'false' || !support_type || support_type === undefined
                          //   ? false
                          //   : true) || save
                          save
                        }
                        sx={{
                          '& > .MuiFormHelperText-root': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Controller
                    name={`detail_project_budgets[${i}].explanation`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].explanation`}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                        disabled={
                          // (support_type === 'false' || !support_type || support_type === undefined
                          //   ? false
                          //   : true) || save
                          save
                        }
                        sx={{
                          '& > .MuiFormHelperText-root': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name={`detail_project_budgets[${i}].amount`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].amount`}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        type="number"
                        error={!!error}
                        helperText={error?.message}
                        disabled={
                          // (support_type === 'false' || !support_type || support_type === undefined
                          //   ? false
                          //   : true) || save
                          save
                        }
                        sx={{
                          '& > .MuiFormHelperText-root': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={2}>
                  <IconButton
                    data-cy={`acc_form_non_consulation_detail_project_budgets[${i}].delete`}
                    color="error"
                    onClick={() => {
                      const idGetValues = getValues(`detail_project_budgets.${i}.id`);
                      const deleteValues = basedBudget.filter((item) => item.id === idGetValues);

                      const existingData = tempDeletedBudget.find(
                        (item) => item.id === idGetValues
                      );

                      if (!existingData) {
                        setTempDeletedBudget([...tempDeletedBudget, ...deleteValues]);
                      }

                      remove(i);
                    }}
                    disabled={
                      // (support_type === 'false' || !support_type || support_type === undefined
                      //   ? false
                      //   : true) || save
                      save
                    }
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid> */}
              </Grid>
            ))}
            {/* <Button
              type="button"
              variant="contained"
              color="inherit"
              fullWidth
              size="medium"
              onClick={async () => {
                append({
                  amount: undefined,
                  clause: '',
                  explanation: '',
                  id: uuidv4(),
                });
              }}
              disabled={
                (support_type === 'false' || !support_type || support_type === undefined
                  ? false
                  : true) || save
              }
            >
              {translate('add_new_line')}
            </Button> */}
          </Grid>
          <Grid item md={12} xs={12}>
            <RHFTextField
              data-cy="acc_form_non_consulation_support_outputs"
              disabled={save}
              name="support_outputs"
              multiline
              minRows={3}
              label="مخرجات الدعم (لصالح)*"
              placeholder="اكتب هنا"
            />
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {!save ? (
              <LoadingButton
                data-cy="acc_form_non_consulation_support_save_button"
                loading={isLoading}
                onClick={handleSubmit(onSubmitForm)}
                variant="outlined"
              >
                {/* Save */}
                {REOPEN_TMRA_S568 ? translate('button.save') : 'Save'}
              </LoadingButton>
            ) : (
              <LoadingButton
                data-cy="acc_form_non_consulation_support_edit_button"
                loading={isLoading}
                onClick={() => {
                  onEdit(true);
                  setSave(false);
                }}
                variant="contained"
              >
                {translate('button.re_edit')}
              </LoadingButton>
            )}
          </Grid>
        </Grid>
      )}
    </FormProvider>
  );
}

export default AcceptedForm;
