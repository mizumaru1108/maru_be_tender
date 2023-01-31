import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, MenuItem } from '@mui/material';
import { FormProvider, RHFTextField, RHFSelect } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import ModalDialog from 'components/modal-dialog';
import useLocales from 'hooks/useLocales';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type FormData = {
  notes: string;
  path: string;
};

interface FormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  loading?: boolean;
}

function ProposalRejectingForm({ onSubmit, onClose, loading }: FormProps) {
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    notes: Yup.string(),
    path: Yup.string().required('Path is required!'),
    reject_reason: Yup.string().required(),
  });

  const defaultValues = {
    notes: '',
    path: '',
    reject_reason: '',
  };

  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: any) => {
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <ModalDialog
        onClose={onClose}
        isOpen={true}
        showCloseIcon={true}
        title={translate('accept_project')}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={12} xs={12}>
              <RHFSelect type="select" name="path" label="المسار" placeholder="المسار" size="small">
                <MenuItem value="MOSQUES">مشروع يخص المساجد</MenuItem>
                <MenuItem value="CONCESSIONAL_GRANTS">مشروع يخص المنح الميسر</MenuItem>
                <MenuItem value="INITIATIVES">مشروع يخص المبادرات</MenuItem>
                <MenuItem value="BAPTISMS">مشروع يخص تعميدات</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12}>
              <RHFSelect
                name="reject_reason"
                size="small"
                label="سبب الرفض *"
                placeholder="الرجاء اختيار سبب المشروع المرفوض"
              >
                <MenuItem value="تكرار المشروع">تكرار المشروع</MenuItem>
                <MenuItem value="للجهة مشروع آخر تحت الدراسة">للجهة مشروع آخر تحت الدراسة</MenuItem>
                <MenuItem value="للجهة مشروع آخر مدعوم">للجهة مشروع آخر مدعوم</MenuItem>
                <MenuItem value="عدم وجود تصريح">عدم وجود تصريح</MenuItem>
                <MenuItem value="التصريح منتهي">التصريح منتهي</MenuItem>
                <MenuItem value="لا يوجد خطاب طلب دعم">لا يوجد خطاب طلب دعم</MenuItem>
                <MenuItem value="الخطاب موجه لجهة أخرى">الخطاب موجه لجهة أخرى</MenuItem>
                <MenuItem value="لا يوجد مرفقات">لا يوجد مرفقات</MenuItem>
                <MenuItem value="نواقص في المرفقات">نواقص في المرفقات</MenuItem>
                <MenuItem value="الحساب البنكي غير صالح">الحساب البنكي غير صالح</MenuItem>
                <MenuItem value="أخرى">أخرى</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="notes"
                label="الملاحظات"
                placeholder="الرجاء كتابة الملاحظات"
              />
            </Grid>
          </Grid>
        }
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
              {translate('close')}
            </Button>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#FF170F',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#FF4842' },
              }}
            >
              {translate('reject')}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default ProposalRejectingForm;
