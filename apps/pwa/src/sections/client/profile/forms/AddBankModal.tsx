import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Modal, Stack, Typography } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { FileProp } from 'components/upload';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import useLocales from '../../../../hooks/useLocales';
import { useSelector } from '../../../../redux/store';
import { AddBankData } from '../../funding-project-request/Forms-Data';
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
  bank_id?: string;
  card_image: FileProp;
  bank_list?: {
    is_deleted: boolean;
  };
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
  const { banks } = useSelector((state) => state.banks);
  const RegisterSchema = Yup.object().shape({
    bank_account_number: Yup.string()
      .min(27, translate('errors.register.bank_account_number.min'))
      .required(translate('errors.register.bank_account_number.required')),
    bank_account_name: Yup.string().required('Project outputs is required'),
    bank_name: Yup.string().required('Project strengths is required'),

    card_image: Yup.mixed()
      .test('size', translate('errors.register.card_image.size'), (value) => {
        if (value) {
          if (value.size > 1024 * 1024 * 3) {
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
    const bankId = getValues('bank_name');
    let newData = { ...data };
    let newBankAccNumber = getValues('bank_account_number');
    if (banks) {
      newData.bank_name = banks.find((bank) => bank.id === bankId)?.bank_name ?? '';
    }
    newData.bank_id = bankId;
    newBankAccNumber.substring(0, 2) !== 'SA'
      ? (newBankAccNumber = 'SA'.concat(`${getValues('bank_account_number')}`).replace(/\s/g, ''))
      : (newBankAccNumber = getValues('bank_account_number'));
    newData = { ...newData, bank_account_number: newBankAccNumber };
    // console.log('newData', newData);
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
    if (initialValues && initialValues?.id) {
      newData = { ...newData, id: initialValues?.id, bank_list: { is_deleted: false } };
      onSubmit(newData);
    } else {
      onSubmit(newData);
    }
    handleClose();
  };
  React.useEffect(() => {
    if (!!initialValues) {
      let newValues = { ...initialValues };
      const checkedBankNameById = listOfBank.find((bank: any) => {
        const isCheck = bank === initialValues?.bank_id;
        return isCheck;
      });
      if (!checkedBankNameById) {
        const checkBankNameByName = banks.filter((bank: any) => {
          const isCheck = bank.bank_name === initialValues?.bank_name;
          return isCheck;
        });
        if (checkBankNameByName.length > 0) {
          newValues = { ...newValues, bank_name: checkBankNameByName[0].id };
        } else {
          newValues = { ...newValues, bank_name: '' };
        }
      } else {
        newValues = { ...newValues, bank_name: checkedBankNameById };
      }
      //
      let newBankAccNumber = '';
      const subStringAccNumber = initialValues?.bank_account_number.substring(0, 2);
      if (subStringAccNumber === 'SA') {
        newBankAccNumber = initialValues?.bank_account_number
          ?.split('SA')[1]
          .replace(/(.{4})/g, '$1 ');
      } else if (subStringAccNumber === 'sa') {
        newBankAccNumber = initialValues?.bank_account_number
          ?.split('sa')[1]
          .replace(/(.{4})/g, '$1 ');
      } else {
        newBankAccNumber = initialValues?.bank_account_number.slice(2).replace(/(.{4})/g, '$1 ');
      }

      setValue('bank_account_number', newBankAccNumber);
      setValue('bank_account_name', initialValues?.bank_account_name);
      setValue('bank_name', newValues.bank_name);
      if (initialValues?.card_image) {
        if (
          initialValues?.card_image?.url &&
          initialValues?.card_image?.size &&
          initialValues?.card_image?.type
        ) {
          setValue('card_image', {
            url: initialValues?.card_image.url,
            size: initialValues?.card_image.size,
            type: initialValues?.card_image.type,
            base64Data: initialValues?.card_image.base64Data,
            fileExtension: initialValues?.card_image.fileExtension,
            fullName: initialValues?.card_image.fullName,
          });
        }
      }
    }
  }, [initialValues, setValue, listOfBank, banks]);
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
