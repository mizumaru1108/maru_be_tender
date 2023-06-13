// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelect, RHFRadioGroup, RHFTextField } from 'components/hook-form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ModalProposalType } from '../../../../../@types/project-details';
import * as Yup from 'yup';
import { ProposalApprovePayloadSupervisor } from '../../types';
import React, { useEffect, useState } from 'react';
import ModalDialog from 'components/modal-dialog';
import {
  Stack,
  Typography,
  Grid,
  Button,
  MenuItem,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import { _supportGoals } from '_mock/_supportgoals';
import { useSelector } from 'redux/store';
import { LoadingButton } from '@mui/lab';
import useLocales from 'hooks/useLocales';
import CloseIcon from '@mui/icons-material/Close';

import { useQuery } from 'urql';
import uuidv4 from 'utils/uuidv4';
import { getOneProposal } from 'queries/commons/getOneProposal';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import useAuth from '../../../../../hooks/useAuth';
import axiosInstance from '../../../../../utils/axios';
import { _supportGoalsArr } from '../../../../../_mock/_supportGoalsArr';

function ProposalAcceptingForm({ onClose, onSubmit, loading }: ModalProposalType) {
  const { translate } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);
  const { enqueueSnackbar } = useSnackbar();
  const { id: pid } = useParams();
  const [basedBudget, setBasedBudget] = useState<
    | { id?: string; amount?: number | undefined | null; clause?: string; explanation?: string }[]
    | []
  >([]);
  // console.log({ basedBudget, proposal });
  const [tempDeletedBudget, setTempDeletedBudget] = useState<
    | { id?: string; amount?: number | undefined | null; clause?: string; explanation?: string }[]
    | []
  >([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const { activeRole } = useAuth();
  // const [proposals, setProposal] = useState<any>();

  // const [proposalResult] = useQuery({
  //   query: getOneProposal,
  //   variables: {
  //     id: pid,
  //   },
  // });

  // const { data: proposalData, fetching: fetchingProposal, error: errorProposal } = proposalResult;

  const validationSchema = Yup.object().shape({
    support_type: Yup.boolean().required('support_type is required!'),
    closing_report: Yup.boolean().required('closing_report is required!'),
    need_picture: Yup.boolean().required('need_picture is required!'),
    does_an_agreement: Yup.boolean().required('does_an_agreement is required!'),
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
    notes: Yup.string(),
    support_outputs: Yup.string().required('Procedures is required!'),
    vat: Yup.boolean().required('Procedures is required!'),
    vat_percentage: Yup.number()
      .integer()
      .min(1, translate('errors.cre_proposal.vat_percentage.greater_than_0')),
    inclu_or_exclu: Yup.boolean(),
    support_goal_id: Yup.string().required('Procedures is required!'),
  });

  const defaultValues = {
    clasification_field: 'عام',
    support_type: true,
    closing_report: undefined,
    need_picture: undefined,
    does_an_agreement: undefined,
    // fsupport_by_supervisor: undefined,
    // number_of_payments_by_supervisor: undefined,
    detail_project_budgets: [
      {
        clause: '',
        explanation: '',
        amount: undefined,
      },
    ],
    notes: '',
    support_outputs: '',
    vat: undefined,
    vat_percentage: undefined,
    inclu_or_exclu: undefined,
    support_goal_id: '',
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
    control,
  } = methods;

  const vat = watch('vat');
  const support_type = watch('support_type');
  const paymentNumber = watch('payment_number');
  const item_budgets = watch('detail_project_budgets');
  // console.log({ item_budgets });

  const {
    fields: itemBudgets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'detail_project_budgets',
  });

  const onSubmitForm = async (data: ProposalApprovePayloadSupervisor) => {
    let totalSupportProposal: number | undefined = undefined;
    if (proposal.proposal_item_budgets) {
      totalSupportProposal = proposal
        .proposal_item_budgets!.map((item) => parseInt(item.amount))
        .reduce((acc, curr) => acc! + curr!, 0);
    }
    let totalAmount: number | undefined = undefined;
    if (data.detail_project_budgets) {
      totalAmount = data
        .detail_project_budgets!.map((item) => item.amount)
        .reduce((acc, curr) => acc! + curr!, 0);
    }
    let checkPassAmount = false;
    if (data.support_type) {
      if (totalAmount <= totalSupportProposal) {
        checkPassAmount = true;
      } else {
        checkPassAmount = false;
      }
    } else {
      if (totalAmount < totalSupportProposal) {
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

      const deleted_proposal_budget = tempDeletedBudget.map((el) => ({
        ...el,
        amount: Number(el.amount),
      }));

      const { length } = data.detail_project_budgets;
      const totalFSupport = data.detail_project_budgets
        .map((el) => Number(el.amount))
        .reduce((acc, curr) => acc + (curr || 0), 0);

      delete data.detail_project_budgets;

      let newData: any = {
        fsupport_by_supervisor: totalFSupport,
        number_of_payments_by_supervisor: length,
        created_proposal_budget,
        updated_proposal_budget,
        deleted_proposal_budget,
        ...data,
      };
      if (newData.payment_number) {
        delete newData.payment_number;
      }
      // console.log({ newData });

      if (checkPassAmount) {
        onSubmit(newData);
      } else {
        // console.log('false');
        enqueueSnackbar(
          `${translate('notification.error_exceeds_amount')}: ${
            data.support_type ? totalSupportProposal : totalSupportProposal - 1
          }`,
          {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          }
        );
      }
    } else {
      enqueueSnackbar(translate('notification.proposal_item_budget_empty'), {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

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
        // console.log('rest total :', rest.data.data);
        // setProposal(rest.data.data);
        setBasedBudget(rest.data.data.proposal_item_budgets);
        setValue('detail_project_budgets', rest.data.data.proposal_item_budgets);
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(err.message, {
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
      resetField('detail_project_budgets');
    } finally {
      setIsLoading(false);
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

    if (paymentNumber > item_budgets.length) {
      loopNumber = Number(paymentNumber) - item_budgets.length;
      if (loopNumber > 0) {
        handleLoop(loopNumber);
      }
    }
    if (paymentNumber < item_budgets.length) {
      loopNumber = Number(paymentNumber);
      // console.log('masuk else', loopNumber);
      if (loopNumber >= proposal.proposal_item_budgets.length) {
        handleRemoveLoop(loopNumber);
      }
    }
    // console.log({ paymentNumber, loopNumber });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentNumber, handleLoop, handleRemoveLoop]);

  React.useEffect(() => {
    setBasedBudget(proposal.proposal_item_budgets);
    setValue('detail_project_budgets', proposal.proposal_item_budgets);
  }, [proposal, setValue]);

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {translate('account_manager.accept_project')}
            </Typography>
          </Stack>
        }
        content={
          <>
            {isLoading ? (
              <>loading...</>
            ) : (
              <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: 0.5 }}>
                {/* <Grid item md={6} xs={12}>
                  <RHFSelect
                    name="clause"
                    size="small"
                    label="البند حسب التصنيف*"
                    placeholder="الرجاء اختيار البند"
                  >
                    <MenuItem value="مشروع يخص المساجد">مشروع يخص المساجد</MenuItem>
                    <MenuItem value="مشروع يخص المنح الميسر">مشروع يخص المنح الميسر</MenuItem>
                    <MenuItem value="مشروع يخص المبادرات">مشروع يخص المبادرات</MenuItem>
                    <MenuItem value="مشروع يخص تعميدات">مشروع يخص تعميدات</MenuItem>
                  </RHFSelect>
                </Grid> */}
                {/* <Grid item md={6} xs={12}>
                  <RHFSelect
                    name="clasification_field"
                    label="مجال التصنيف*"
                    placeholder="الرجاء اختيار مجال التصنيف"
                    size="small"
                  >
                    <MenuItem value="عام">عام</MenuItem>
                  </RHFSelect>
                </Grid> */}
                <Grid item md={6} xs={12}>
                  <RHFRadioGroup
                    type="radioGroup"
                    name="support_type"
                    label="نوع الدعم"
                    options={[
                      { label: 'دعم جزئي', value: false },
                      { label: 'دعم كلي', value: true },
                    ]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFRadioGroup
                    type="radioGroup"
                    name="closing_report"
                    label="تقرير الإغلاق"
                    options={[
                      { label: 'نعم', value: true },
                      { label: 'لا', value: false },
                    ]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFRadioGroup
                    type="radioGroup"
                    name="need_picture"
                    label="هل يحتاج إلى صور"
                    options={[
                      { label: 'نعم', value: true },
                      { label: 'لا', value: false },
                    ]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFRadioGroup
                    type="radioGroup"
                    name="does_an_agreement"
                    label="هل يحتاج اتفاقية"
                    options={[
                      { label: 'نعم', value: true },
                      { label: 'لا', value: false },
                    ]}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFRadioGroup
                    type="radioGroup"
                    name="vat"
                    label="هل يشمل المشروع ضريبة القيمة المضافة"
                    options={[
                      { label: 'نعم', value: true },
                      { label: 'لا', value: false },
                    ]}
                  />
                </Grid>
                {/* <Grid item md={6} xs={12}>
                  <RHFSelect
                    type="select"
                    size="small"
                    name="support_goal_id"
                    placeholder="الرجاء اختيار أهداف الدعم"
                    label="اهداف الدعم*"
                  >
                    {!proposal
                      ? null
                      : _supportGoals[
                          `${proposal.project_track as keyof typeof _supportGoals}`
                        ].map((item) => (
                          <MenuItem value={item.value} key={item.value}>
                            {item.title}
                          </MenuItem>
                        ))}
                  </RHFSelect>
                </Grid> */}
                <Grid item md={6} xs={12}>
                  <RHFSelect
                    type="select"
                    size="small"
                    name="support_goal_id"
                    placeholder="الرجاء اختيار أهداف الدعم"
                    label="اهداف الدعم*"
                  >
                    {/* {!proposal
                      ? null
                      : _supportGoals[
                          `${proposal.project_track as keyof typeof _supportGoals}`
                        ].map((item) => (
                          <MenuItem value={item.value} key={item.value}>
                            {item.title}
                          </MenuItem>
                        ))} */}

                    {_supportGoalsArr.map((item) => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFTextField
                    type={'number'}
                    size={'small'}
                    name="payment_number"
                    placeholder="عدد المدفوعات"
                    label="عدد المدفوعات"
                  />
                </Grid>
                {vat === 'true' && (
                  <Grid item md={6} xs={12}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="vat_percentage"
                      label="النسبة المئوية من الضريبة"
                      placeholder="النسبة المئوية من الضريبة"
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                )}
                {vat === 'true' && (
                  <Grid item md={6} xs={12}>
                    <RHFRadioGroup
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
                {/* <Grid item md={6} xs={12}>
                  <RHFTextField
                    type="number"
                    size="small"
                    name="fsupport_by_supervisor"
                    label="مبلغ الدعم*"
                    placeholder="مبلغ الدعم"
                    disabled={true}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFTextField
                    type="number"
                    size="small"
                    name="number_of_payments_by_supervisor"
                    label="عدد الدفعات*"
                    InputProps={{ inputProps: { min: 0 } }}
                    disabled={true}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <Typography sx={{ mb: 2 }}>الموازنة التفصيلية للمشروع</Typography>
                  {itemBudgets.map((v, i) => (
                    <Grid container key={v.id} spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={3}>
                        <Controller
                          name={`detail_project_budgets[${i}].clause`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              size="small"
                              error={!!error}
                              helperText={error?.message}
                              disabled={
                                support_type === 'false' || support_type === undefined
                                  ? false
                                  : true
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
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              size="small"
                              error={!!error}
                              helperText={error?.message}
                              disabled={
                                support_type === 'false' || support_type === undefined
                                  ? false
                                  : true
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
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              size="small"
                              type="number"
                              error={!!error}
                              helperText={error?.message}
                              disabled={
                                support_type === 'false' || support_type === undefined
                                  ? false
                                  : true
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
                      <Grid item xs={2}>
                        <IconButton
                          color="error"
                          onClick={() => {
                            const idGetValues = getValues(`detail_project_budgets.${i}.id`);
                            const deleteValues = basedBudget.filter(
                              (item) => item.id === idGetValues
                            );

                            const existingData = tempDeletedBudget.find(
                              (item) => item.id === idGetValues
                            );

                            if (!existingData) {
                              setTempDeletedBudget([...tempDeletedBudget, ...deleteValues]);
                            }

                            remove(i);
                          }}
                          disabled={
                            support_type === 'false' || support_type === undefined ? false : true
                          }
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Button
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
                    disabled={support_type === 'false' || support_type === undefined ? false : true}
                  >
                    {translate('add_new_line')}
                  </Button>
                </Grid>
                <Grid item md={12} xs={12}>
                  <RHFTextField
                    name="notes"
                    multiline
                    minRows={3}
                    label="ملاحظات على المشروع"
                    placeholder="اكتب ملاحظاتك هنا"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <RHFTextField
                    name="support_outputs"
                    multiline
                    minRows={3}
                    label="مخرجات الدعم (لصالح)*"
                    placeholder="اكتب هنا"
                  />
                </Grid>
              </Grid>
            )}
          </>
        }
        isOpen={true}
        onClose={onClose}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        showCloseIcon={true}
        actionBtn={
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={onClose}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                ':hover': { backgroundColor: '#efefef' },
              }}
            >
              إغلاق
            </Button>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'background.paper',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#13B2A2' },
              }}
            >
              قبول
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default ProposalAcceptingForm;
