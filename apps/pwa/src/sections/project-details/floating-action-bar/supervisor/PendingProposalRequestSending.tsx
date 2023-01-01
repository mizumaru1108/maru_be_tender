import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import ModalDialog from 'components/modal-dialog';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { PendingRequest } from '../../../../@types/project-details';

interface Props {
  onClose: () => void;
  onSubmit: (data: PendingRequest) => void;
}

function PendingProposalRequestSending({ onClose, onSubmit }: Props) {
  const validationSchema = Yup.object().shape({
    pending_date: Yup.string().required('pending_date is required!'),
    notes: Yup.string().required('notes are required!'),
  });

  const defaultValues = {
    pending_date: '',
    notes: '',
  };

  const methods = useForm<PendingRequest>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        title={
          <Stack gap={2}>
            <Typography variant="h4" fontWeight="bold" color="#000000">
              ارسال طلب اعادة رفع للمشروع
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#93A3B0">
              قم بتحديد التاريخ المناسب لإعادة رفع المشروع و كتابة الملاحظات المناسبة لإعلام الشريك
              بالتعديل
            </Typography>
          </Stack>
        }
        isOpen={true}
        showCloseIcon={true}
        onClose={onClose}
        maxWidth="md"
        content={
          <Grid container spacing={5} sx={{ mt: '5px' }}>
            <Grid item md={12} xs={12}>
              <BaseField
                type="datePicker"
                name="pending_date"
                placeholder="الرجاء اختيار التاريخ"
                label="التاريخ الذي يمكنه الشريك إعادة رفع مشروعه*"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="notes"
                placeholder="اكتب ملاحظاتك هنا"
                label="ملاحظات على الطلب*"
              />
            </Grid>
          </Grid>
        }
        actionBtn={
          <Stack direction="row" justifyContent="center" gap={3}>
            <Button
              onClick={onClose}
              sx={{
                color: '#000',
                backgroundColor: '#fff',
                ':hover': { backgroundColor: '#efefef' },
              }}
            >
              رجوع
            </Button>
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
              sx={{ color: '', backgroundColor: '', ':hover': { backgroundColor: '' } }}
            >
              تأكيد
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default PendingProposalRequestSending;
