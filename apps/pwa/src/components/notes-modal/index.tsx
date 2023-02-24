import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Typography, Stack, Grid, Button, MenuItem } from '@mui/material';
import { FormProvider, RHFTextField, RHFSelect } from 'components/hook-form';
import ModalDialog from 'components/modal-dialog';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import useLocales from 'hooks/useLocales';
//
import useAuth from 'hooks/useAuth';

interface ActionPropos {
  backgroundColor: string;
  hoverColor: string;
  actionLabel: string;
  actionType?: string;
}

interface Propos {
  title: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
  action: ActionPropos;
  loading?: boolean;
}

interface FormInput {
  reject_reason: string;
  notes: string;
}

function NotesModal({ title, onSubmit, onClose, action, loading }: Propos) {
  const { activeRole } = useAuth();
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    ...(action.actionType === 'REJECT' &&
      ['tender_project_manager', 'tender_project_supervisor'].includes(activeRole!) && {
        reject_reason: Yup.string().required(),
      }),
    notes: Yup.string().required(translate('errors.notes')),
  });

  const defaultValues = {
    ...(action.actionType === 'REJECT' && { reject_reason: '' }),
    notes: '',
  };

  const methods = useForm<FormInput>({
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
    <FormProvider methods={methods}>
      <ModalDialog
        maxWidth="md"
        title={
          <Stack>
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {title}
            </Typography>
          </Stack>
        }
        content={
          <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
            {action.actionType &&
            action.actionType === 'REJECT' &&
            ['tender_project_manager', 'tender_project_supervisor'].includes(activeRole!) ? (
              <Grid item md={12} xs={12}>
                <RHFSelect
                  name="reject_reason"
                  size="small"
                  label="سبب الرفض *"
                  placeholder="الرجاء اختيار سبب المشروع المرفوض"
                >
                  <MenuItem value="تكرار المشروع">تكرار المشروع</MenuItem>
                  <MenuItem value="ارتفاع التكاليف">ارتفاع التكاليف</MenuItem>
                  <MenuItem value="ضعف الجهة">ضعف الجهة</MenuItem>
                  <MenuItem value="عدم اختصاص الجهة">عدم اختصاص الجهة</MenuItem>
                  <MenuItem value="عدم تفاعل الجهة">عدم تفاعل الجهة</MenuItem>
                  <MenuItem value="عدم وجود بند">عدم وجود بند</MenuItem>
                  <MenuItem value="انتهاء الموازنة المخصصة للبند">
                    انتهاء الموازنة المخصصة للبند
                  </MenuItem>
                  <MenuItem value="عدم وجود عروض أسعار كافية">عدم وجود عروض أسعار كافية</MenuItem>
                  <MenuItem value="الجهة غير حاصلة على شهادة الحوكمة">
                    الجهة غير حاصلة على شهادة الحوكمة
                  </MenuItem>
                  <MenuItem value="المشروع غير متوافق مع احتياج المستفيدين">
                    المشروع غير متوافق مع احتياج المستفيدين
                  </MenuItem>
                  <MenuItem value="لا يوجد دراسة احتياج للمشروع">
                    لا يوجد دراسة احتياج للمشروع
                  </MenuItem>
                  <MenuItem value="المشروع ينقصه موافقة رسمية">المشروع ينقصه موافقة رسمية</MenuItem>
                  <MenuItem value="أخرى">أخرى</MenuItem>
                </RHFSelect>
              </Grid>
            ) : null}
            <Grid item md={12} xs={12}>
              <RHFTextField
                multiline
                minRows={3}
                name="notes"
                label="الملاحظات"
                placeholder="اكتب ملاحظاتك هنا"
                required
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
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: action.backgroundColor,
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: action.hoverColor },
              }}
            >
              {action.actionLabel}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default NotesModal;
