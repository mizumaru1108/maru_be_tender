import { Button, Grid, Stack, styled, Typography } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import RHFTextArea from 'components/hook-form/RHFTextArea';
import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ModalDialog from 'components/modal-dialog';
import { LoadingButton } from '@mui/lab';
// MuiFormControl-root
const FormStyle = styled('div')(({ theme }) => ({
  '&.MuiGrid-container .MuiGrid-item .MuiFormControl-root .MuiFormHelperText- .Mui-error': {
    margin: '0px 0px 0px 0px !important',
    backgroundColor: '#fff !important',
  },
}));
type FormValuesProps = {
  notes: string;
};

function RescheduleRequest({ open, handleClose }: any) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const RescheduleRequestSchema = Yup.object().shape({
    notes: Yup.string().required('notes are required'),
  });

  const defaultValues = {
    notes: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RescheduleRequestSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    console.log('in RescheduleRequest callBack function');
  };
  return (
    <ModalDialog
      isOpen={open}
      onClose={handleClose}
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            طلب إعادة جدولة
          </Typography>
        </Stack>
      }
      content={
        <FormStyle className="formstyle">
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '8px' }}>
              <Grid item md={12} xs={12}>
                <RHFTextArea
                  name="notes"
                  label="اكتب ملاحظاتك هنا"
                  placeholder="اكتب ملاحظاتك هنا"
                />
              </Grid>
              <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
                <Stack justifyContent="center" direction="row" gap={2}>
                  <Button
                    onClick={handleClose}
                    sx={{
                      color: '#000',
                      size: 'large',
                      width: { xs: '100%', sm: '200px' },
                      hieght: { xs: '100%', sm: '50px' },
                      ':hover': {
                        backgroundColor: '#fff',
                      },
                    }}
                  >
                    رجوع
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      console.log('asdkmasdlkmasd');
                    }}
                    sx={{
                      backgroundColor: 'background.paper',
                      color: '#fff',
                      size: 'large',
                      width: { xs: '100%', sm: '200px' },
                      hieght: { xs: '100%', sm: '50px' },
                      ':hover': {
                        backgroundColor: '#13B2A2',
                      },
                    }}
                  >
                    ارسال
                  </Button>
                  {/* <LoadingButton
                  // loading={isLoading}
                  // loadingIndicator={
                  //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  //     <CircularProgress size={20} sx={{ color: 'white' }} thickness={4} />
                  //     <Typography sx={{ color: 'white', fontSize: '1em', ml: 1 }}>
                  //       Saving...
                  //     </Typography>
                  //   </Box>
                  // }
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
                    color: '#fff',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                    // when button is disabled, reduce opacity to 0.5
                    '&.Mui-disabled': {
                      backgroundColor: action === 'accept' ? 'background.paper' : '#FF0000',
                      color: '#fff',
                      opacity: 0.48,
                    },
                    '&:hover': { backgroundColor: action === 'reject' ? '#FF170' : '#13B2A2' },
                  }}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <CircularProgress size={23} sx={{ color: 'white' }} thickness={10} />
                  )}
                  {action === 'accept' ? 'Accept' : 'Reject'}
                </LoadingButton> */}
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </FormStyle>
      }
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default RescheduleRequest;
