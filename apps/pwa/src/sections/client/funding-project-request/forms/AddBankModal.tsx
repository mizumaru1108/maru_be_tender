import * as Yup from 'yup';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Grid, Stack, Modal, Box, Button, Typography } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddBankData } from '../Forms-Data';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '52%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: '#fff',
  border: '2px solid #000',
  p: 4,
  h: '1000px',
};

type FormValuesProps = {
  bank_account_number: number;
  bank_account_name: string;
  bank_name: string;
  bank_account_card_image: string;
};

export default function AddBankModal({ open, handleClose }: any) {
  const RegisterSchema = Yup.object().shape({
    bank_account_number: Yup.number().required('Project goals required'),
    bank_account_name: Yup.string().required('Project outputs is required'),
    bank_name: Yup.string().required('Project strengths is required'),
    bank_account_card_image: Yup.string().required('Project risk is required'),
  });
  const defaultValues = {
    bank_account_number: undefined,
    bank_account_name: '',
    bank_name: '',
    bank_account_card_image: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    console.log('asdkmasdkmadslk');
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: '50px' }}>
            اضافة حساب بنكي جديد
          </Typography>
          <FormProvider {...methods} {...handleSubmit(onSubmit)}>
            <Grid container rowSpacing={4} columnSpacing={7}>
              <FormGenerator data={AddBankData} />
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="center">
                  <Stack justifyContent="center" direction="row" gap={3}>
                    <Button
                      onClick={handleClose}
                      sx={{
                        color: 'text.primary',
                        width: { xs: '100%', sm: '200px' },
                        hieght: { xs: '100%', sm: '50px' },
                      }}
                    >
                      رجوع
                    </Button>
                    <Button
                      // type="submit"
                      onClick={() => {
                        console.log('asdasodmpams');
                      }}
                      variant="outlined"
                      sx={{
                        backgroundColor: 'background.paper',
                        color: '#fff',
                        width: { xs: '100%', sm: '200px' },
                        hieght: { xs: '100%', sm: '50px' },
                      }}
                    >
                      إضافة
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
