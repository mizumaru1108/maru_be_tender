import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
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
}

function ProposalRejectingForm({ onSubmit, onClose }: FormProps) {
  const { translate } = useLocales();

  const validationSchema = Yup.object().shape({
    notes: Yup.string(),
    path: Yup.string().required('Path is required!'),
  });

  const defaultValues = {
    notes: '',
    path: '',
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
              <BaseField
                type="select"
                name="path"
                label="المسار"
                placeholder="المسار"
                children={
                  <>
                    <option value="MOSQUES" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص المساجد
                    </option>
                    <option value="CONCESSIONAL_GRANTS" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص المنح الميسر
                    </option>
                    <option value="INITIATIVES" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص المبادرات
                    </option>
                    <option value="BAPTISMS" style={{ backgroundColor: '#fff' }}>
                      مشروع يخص تعميدات
                    </option>
                  </>
                }
              />
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
              loading={isSubmitting}
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
