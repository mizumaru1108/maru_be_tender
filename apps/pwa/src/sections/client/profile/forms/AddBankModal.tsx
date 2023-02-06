import * as Yup from 'yup';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'components/hook-form';
import { Grid, Stack, Modal, Box, Button, Typography } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddBankData } from '../../funding-project-request/Forms-Data';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import { FileProp } from 'components/upload';
import { useMutation } from 'urql';
import { addNewBankInformation } from 'queries/client/addNewBankInformation';
import useAuth from 'hooks/useAuth';
import { nanoid } from 'nanoid';
import useLocales from '../../../../hooks/useLocales';
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
  card_image: FileProp;
  id: string;
};

export default function AddBankModal({
  open,
  handleClose,
  onSubmit,
  initialValues,
  listOfBank,
}: any) {
  const { translate } = useLocales();
  const rootRef = React.useRef<HTMLDivElement>(null);
  // const { user } = useAuth();
  // const id = user?.id;
  // addNewBankInformation
  // const [_, addingNewBankInfo] = useMutation(addNewBankInformation);
  const RegisterSchema = Yup.object().shape({
    bank_account_number: Yup.string()
      .min(27, translate('errors.register.bank_account_number.min'))
      .required(translate('errors.register.bank_account_number.required')),
    bank_account_name: Yup.string().required('Project outputs is required'),
    bank_name: Yup.string().required('Project strengths is required'),

    card_image: Yup.mixed()
      .test('size', translate('errors.register.card_image.size'), (value) => {
        if (value) {
          if (value.size > 1024 * 1024 * 5) {
            return false;
          }
        }
        return true;
      })
      .test('fileExtension', translate('errors.register.card_image.fileExtension'), (value) => {
        if (value) {
          if (
            value.type !== 'image/png' &&
            value.type !== 'image/jpeg' &&
            value.type !== 'image/jpg'
          ) {
            return false;
          }
        }
        return true;
      })
      .required(translate('errors.register.card_image.required')),
  });
  const defaultValues = {
    bank_account_number: '',
    bank_account_name: '',
    bank_name: '',
    card_image: {
      url: '',
      size: undefined,
      type: '',
      base64Data: '',
      fileExtension: '',
      fullName: '',
    },
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues,
  } = methods;

  const onClonseModal = () => {
    setValue('bank_account_number', '');
    setValue('bank_account_name', '');
    setValue('bank_name', '');
    setValue('card_image', {
      url: '',
      size: undefined,
      type: '',
      base64Data: '',
      fileExtension: '',
      fullName: '',
    });
    handleClose();
  };

  const onSubmitForm = async (data: FormValuesProps) => {
    let newData = { ...data };
    let newBankAccNumber = getValues('bank_account_number');
    newBankAccNumber.substring(0, 2) !== 'SA'
      ? (newBankAccNumber = 'SA'.concat(`${getValues('bank_account_number')}`).replace(/\s/g, ''))
      : (newBankAccNumber = getValues('bank_account_number'));
    newData = { ...newData, bank_account_number: newBankAccNumber };
    setValue('bank_account_number', '');
    setValue('bank_account_name', '');
    setValue('bank_name', '');
    setValue('card_image', {
      url: '',
      size: undefined,
      type: '',
      base64Data: '',
      fileExtension: '',
      fullName: '',
    });
    if (initialValues && initialValues.id) {
      newData = { ...newData, id: initialValues.id };
      onSubmit(newData);
    } else {
      onSubmit(newData);
    }
    handleClose();
  };
  React.useEffect(() => {
    if (!!initialValues) {
      let newValues = { ...initialValues };
      const checkedBankName = listOfBank.find((bank: any) => {
        console.log('bank.value', bank);
        return bank === initialValues.bank_name;
      });
      if (!checkedBankName) {
        newValues = { ...newValues, bank_name: '' };
      } else {
        newValues = { ...newValues, bank_name: checkedBankName };
      }

      const newBankAccNumber = initialValues.bank_account_number.replace(/(.{4})/g, '$1 ');
      setValue('bank_account_number', newBankAccNumber);
      setValue('bank_account_name', initialValues.bank_account_name);
      setValue('bank_name', newValues.bank_name);
      setValue('card_image', {
        url: initialValues.card_image.url,
        size: initialValues.card_image.size,
        type: initialValues.card_image.type,
        base64Data: initialValues.card_image.base64Data,
        fileExtension: initialValues.card_image.fileExtension,
        fullName: initialValues.card_image.fullName,
      });
    }
  }, [initialValues, setValue, listOfBank]);
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
      onClose={onClonseModal}
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
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container rowSpacing={4} columnSpacing={7}>
            <FormGenerator data={AddBankData} />
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="center">
                <Stack justifyContent="center" direction="row" gap={3}>
                  <Button
                    onClick={onClonseModal}
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
