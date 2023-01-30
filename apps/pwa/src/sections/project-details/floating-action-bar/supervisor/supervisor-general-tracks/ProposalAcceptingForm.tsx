// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelect, RHFRadioGroup, RHFTextField } from 'components/hook-form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ModalProposalType } from '../../../../../@types/project-details';
import * as Yup from 'yup';
import { ProposalApprovePayloadSupervisor } from '../../types';
import { useEffect, useState } from 'react';
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

function ProposalAcceptingForm({ onClose, onSubmit, loading }: ModalProposalType) {
  const { translate } = useLocales();
  // const { proposal } = useSelector((state) => state.proposal);
  const { enqueueSnackbar } = useSnackbar();
  const { id: pid } = useParams();
  const [basedBudget, setBasedBudget] = useState<
    | { id?: string; amount?: number | undefined | null; clause?: string; explanation?: string }[]
    | []
  >([]);
  const [tempDeletedBudget, setTempDeletedBudget] = useState<
    | { id?: string; amount?: number | undefined | null; clause?: string; explanation?: string }[]
    | []
  >([]);

  const [proposalResult] = useQuery({
    query: getOneProposal,
    variables: {
      id: pid,
    },
  });

  const { data: proposalData, fetching: fetchingProposal, error: errorProposal } = proposalResult;

  const validationSchema = Yup.object().shape({
    clasification_field: Yup.string().required('clasification_field is required!'),
    clause: Yup.string().required('clause is required!'),
    support_type: Yup.boolean().required('support_type is required!'),
    closing_report: Yup.boolean().required('closing_report is required!'),
    need_picture: Yup.boolean().required('need_picture is required!'),
    does_an_agreement: Yup.boolean().required('does_an_agreement is required!'),
    // fsupport_by_supervisor: Yup.number().required('fsupport_by_supervisor is required!'),
    // number_of_payments_by_supervisor: Yup.number().required(
    //   'number_of_payments_by_supervisor is required!'
    // ),
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
    support_outputs: Yup.string().required('support_outputs is required!'),
    vat: Yup.boolean(),
    support_goal_id: Yup.string().required('Procedures is required!'),
    vat_percentage: Yup.number(),
    inclu_or_exclu: Yup.boolean(),
  });

  const defaultValues = {
    clause: '',
    clasification_field: '',
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
    vat_percentage: 0,
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

  const {
    fields: itemBudgets,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'detail_project_budgets',
  });

  const onSubmitForm = async (data: ProposalApprovePayloadSupervisor) => {
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

      const deleted_proposal_budget = tempDeletedBudget;

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

      // console.log('newData', newData);

      onSubmit(newData);
    } else {
      enqueueSnackbar(translate('notification.proposal_item_budget_empty'), {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });

      resetField('detail_project_budgets');
    }
  };

  useEffect(() => {
    if (!fetchingProposal && proposalData && proposalData.proposal.proposal_item_budgets.length) {
      setBasedBudget(proposalData.proposal.proposal_item_budgets);
      setValue('detail_project_budgets', proposalData.proposal.proposal_item_budgets);
    } else {
      resetField('detail_project_budgets');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalData, fetchingProposal, setValue, resetField]);

  if (errorProposal) return <>Something when wrong on get proposal details</>;

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
            {fetchingProposal && !proposalData ? (
              <>loading...</>
            ) : (
              <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: 0.5 }}>
                <Grid item md={6} xs={12}>
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
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFSelect
                    name="clasification_field"
                    label="مجال التصنيف*"
                    placeholder="الرجاء اختيار مجال التصنيف"
                    size="small"
                  >
                    <MenuItem value="عام">عام</MenuItem>
                  </RHFSelect>
                </Grid>
                <Grid item md={6} xs={12}>
                  <RHFRadioGroup
                    type="radioGroup"
                    name="support_type"
                    label="نوع الدعم"
                    options={[
                      { label: 'دعم جزئي', value: true },
                      { label: 'دعم كلي', value: false },
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
                <Grid item md={6} xs={12}>
                  <RHFSelect
                    type="select"
                    size="small"
                    name="support_goal_id"
                    placeholder="الرجاء اختيار أهداف الدعم"
                    label="اهداف الدعم*"
                  >
                    {_supportGoals[
                      `${proposalData.proposal.project_track as keyof typeof _supportGoals}`
                    ].map((item) => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                {vat === 'true' && (
                  <Grid item md={6} xs={12}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="vat_percentage"
                      label="النسبة المئوية من الضريبة"
                      placeholder="النسبة المئوية من الضريبة"
                      InputProps={{ inputProps: { min: 0 } }}
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
                                  ? true
                                  : false
                              }
                              sx={{
                                '& > .MuiFormHelperText-root': {
                                  backgroundColor: 'white',
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
                                  ? true
                                  : false
                              }
                              sx={{
                                '& > .MuiFormHelperText-root': {
                                  backgroundColor: 'white',
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
                                  ? true
                                  : false
                              }
                              sx={{
                                '& > .MuiFormHelperText-root': {
                                  backgroundColor: 'white',
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          color="error"
                          variant="contained"
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
                            support_type === 'false' || support_type === undefined ? true : false
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
                    disabled={support_type === 'false' || support_type === undefined ? true : false}
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
