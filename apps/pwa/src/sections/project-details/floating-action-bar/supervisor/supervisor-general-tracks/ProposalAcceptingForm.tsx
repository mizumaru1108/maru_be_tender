// @ts-nocheck
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { ModalProposalType } from '../../../../../@types/project-details';
import * as Yup from 'yup';
import { ProposalApprovePayloadSupervisor } from '../../types';
import BaseField from 'components/hook-form/BaseField';
import { useEffect } from 'react';
import ModalDialog from 'components/modal-dialog';
import { Stack, Typography, Grid, Button } from '@mui/material';
import { _supportGoals } from '_mock/_supportgoals';
import { useSelector } from 'redux/store';
import { LoadingButton } from '@mui/lab';

function ProposalAcceptingForm({ onClose, onSubmit }: ModalProposalType) {
  const { proposal } = useSelector((state) => state.proposal);

  const validationSchema = Yup.object().shape({
    clasification_field: Yup.string().required('clasification_field is required!'),
    clause: Yup.string().required('clause is required!'),
    support_type: Yup.boolean().required('support_type is required!'),
    closing_report: Yup.boolean().required('closing_report is required!'),
    need_picture: Yup.boolean().required('need_picture is required!'),
    does_an_agreement: Yup.boolean().required('does_an_agreement is required!'),
    fsupport_by_supervisor: Yup.number().required('fsupport_by_supervisor is required!'),
    number_of_payments_by_supervisor: Yup.number().required(
      'number_of_payments_by_supervisor is required!'
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
    support_type: undefined,
    closing_report: undefined,
    need_picture: undefined,
    does_an_agreement: undefined,
    fsupport_by_supervisor: undefined,
    number_of_payments_by_supervisor: undefined,
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
  } = methods;

  const onSubmitForm = async (data: ProposalApprovePayloadSupervisor) => {
    onSubmit(data);
  };

  const vat = watch('vat');

  const support_type = watch('support_type');

  useEffect(() => {
    if (support_type === 'true') resetField('fsupport_by_supervisor');
    if (support_type === 'false')
      setValue('fsupport_by_supervisor', proposal.amount_required_fsupport);
  }, [proposal.amount_required_fsupport, resetField, setValue, support_type]);

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="#000000">
              قبول المشروع
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={6} xs={12}>
              <BaseField
                type="select"
                name="clause"
                label="البند حسب التصنيف*"
                placeholder="الرجاء اختيار البند"
                children={
                  <>
                    <option value="مشروع يخص المساجد" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص المساجد
                    </option>
                    <option value="مشروع يخص المنح الميسر" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص المنح الميسر
                    </option>
                    <option value="مشروع يخص المبادرات" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص المبادرات
                    </option>
                    <option value="مشروع يخص تعميدات" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص تعميدات
                    </option>
                  </>
                }
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="select"
                name="clasification_field"
                label="مجال التصنيف*"
                placeholder="الرجاء اختيار مجال التصنيف"
                children={
                  <>
                    <option value="test" style={{ backgroundColor: '#fff' }}>
                      test
                    </option>
                    <option value="test" style={{ backgroundColor: '#fff' }}>
                      test
                    </option>
                    <option value="test" style={{ backgroundColor: '#fff' }}>
                      test
                    </option>
                    <option value="test" style={{ backgroundColor: '#fff' }}>
                      test
                    </option>
                  </>
                }
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
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
              <BaseField
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
              <BaseField
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
              <BaseField
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
              <BaseField
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
              <BaseField
                type="select"
                name="support_goal_id"
                placeholder="الرجاء اختيار أهداف الدعم"
                label="اهداف الدعم*"
                children={_supportGoals[
                  `${proposal.project_track as keyof typeof _supportGoals}`
                ].map((item) => (
                  <>
                    <option value={item.value} style={{ backgroundColor: '#fff' }}>
                      {item.title}
                    </option>
                  </>
                ))}
              />
            </Grid>
            {vat === 'true' && (
              <Grid item md={6} xs={12}>
                <BaseField
                  type="textField"
                  name="vat_percentage"
                  label="النسبة المئوية من الضريبة"
                  placeholder="النسبة المئوية من الضريبة"
                />
              </Grid>
            )}
            {vat === 'true' && (
              <Grid item md={6} xs={12}>
                <BaseField
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
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="fsupport_by_supervisor"
                label="مبلغ الدعم*"
                placeholder="مبلغ الدعم"
                disabled={support_type === 'false' ? true : false}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="number_of_payments_by_supervisor"
                label="عدد الدفعات*"
                placeholder="1"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="notes"
                label="ملاحظات على المشروع"
                placeholder="اكتب ملاحظاتك هنا"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="support_outputs"
                label="مخرجات الدعم (لصالح)*"
                placeholder="اكتب هنا"
              />
            </Grid>
          </Grid>
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
              loading={isSubmitting}
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
