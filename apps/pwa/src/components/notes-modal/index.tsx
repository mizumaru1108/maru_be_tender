import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Typography, Stack, Grid, Button } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import ModalDialog from 'components/modal-dialog';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface ActionPropos {
  backgroundColor: string;
  hoverColor: string;
  actionLabel: string;
}

interface Propos {
  title: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
  action: ActionPropos;
}

interface FormInput {
  notes: string;
}

function NotesModal({ title, onSubmit, onClose, action }: Propos) {
  const validationSchema = Yup.object().shape({
    notes: Yup.string().required(),
  });

  const defaultValues = {
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
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="notes"
                label="الملاحظات"
                placeholder="اكتب ملاحظاتك هنا"
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
