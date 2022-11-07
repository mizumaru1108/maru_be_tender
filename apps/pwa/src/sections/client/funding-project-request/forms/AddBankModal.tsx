import * as Yup from 'yup';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'components/hook-form';
import { Grid, Stack, Modal, Box, Button, Typography } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddBankData } from '../Forms-Data';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import { FileProp } from 'components/upload';
import { useMutation } from 'urql';
import { addNewBankInformation } from 'queries/client/addNewBankInformation';
import useAuth from 'hooks/useAuth';
import { nanoid } from 'nanoid';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '52%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: '#fff',
  border: '2px solid #000',
  p: 4,
};

type FormValuesProps = {
  bank_account_number: string;
  bank_account_name: string;
  bank_name: string;
  bank_account_card_image: FileProp;
};

export default function AddBankModal({ open, handleClose, setIsCreatedOne }: any) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const id = user?.id;
  const [_, addingNewBankInfo] = useMutation(addNewBankInformation);
  const RegisterSchema = Yup.object().shape({
    bank_account_number: Yup.string().required('Project goals required'),
    bank_account_name: Yup.string().required('Project outputs is required'),
    bank_name: Yup.string().required('Project strengths is required'),
    bank_account_card_image: Yup.object().shape({
      url: Yup.string().required(),
      size: Yup.number(),
      type: Yup.string().required(),
    }),
  });
  const defaultValues = {
    bank_account_number: '',
    bank_account_name: '',
    bank_name: '',
    bank_account_card_image: {
      url: '',
      size: undefined,
      type: 'image/jpeg',
    },
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
    const res = await addingNewBankInfo({
      payload: {
        bank_account_name: data.bank_account_name,
        bank_account_number: data.bank_account_number,
        bank_name: data.bank_name,
        card_image: data.bank_account_card_image.url,
        user_id: id,
      },
    });
    setIsCreatedOne(true);
    handleClose();
  };
  return (
    <Modal
      open={open}
      aria-labelledby="server-modal-title"
      aria-describedby="server-modal-description"
      sx={{
        display: 'flex',
        p: 1,
        alignItems: 'center',
        justifyContent: 'center',
        bacgroundColor: 'background.default',
      }}
      container={() => rootRef.current}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'relative',
          width: 500,
          bgcolor: 'background.default',
          border: '2px solid #000',
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: '50px' }}>
          اضافة حساب بنكي جديد
        </Typography>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                    type="submit"
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
  );
}
