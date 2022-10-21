import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { FormProvider, RHFCheckbox } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BankImage } from '../../../../assets';
import BankImageComp from 'sections/shared/BankImageComp';
import AddBankModal from './AddBankModal';
import { getUserBankInformation } from 'queries/client/getUserBankInformation';
import useAuth from 'hooks/useAuth';
import { useQuery } from 'urql';
import { FileProp } from 'components/upload';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';

type FormValuesProps = {
  agree_on: boolean;
  proposal_bank_informations: {
    bank_account_number: string;
    card_image: FileProp;
    bank_name: string;
    bank_account_name: string;
    bank_information_id: string;
  }[];
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  onReturn: () => void;
  onSavingDraft: () => void;
  lastStep?: boolean;
  step: number;
};
const SupportingDurationInfoForm = ({
  onReturn,
  onSavingDraft,
  lastStep,
  step,
  onSubmit,
  children,
  defaultValues,
}: Props) => {
  //  TODO: Fetch the user's Bank Information and assign them to the state that we have here
  //        without sending or assiging them to the general state, and keeping that for the next button
  const { user } = useAuth();
  const [isDone, setIsDone] = useState(false);
  const id = user?.id;
  const [result, _] = useQuery({
    query: getUserBankInformation,
    variables: { user_id: id },
  });
  const { data, fetching, error } = result;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const RegisterSchema = Yup.object().shape({
    agree_on: Yup.boolean().required(),
    proposal_bank_informations: Yup.array().of(
      Yup.object().shape({
        bank_account_number: Yup.string().required(),
        card_image: Yup.object().shape({
          url: Yup.string().required(),
          size: Yup.number(),
          type: Yup.string().required(),
        }),
        bank_name: Yup.string().required(),
        bank_account_name: Yup.string().required(),
        bank_information_id: Yup.string().required(),
      })
    ),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { reset, setError, handleSubmit, setValue, watch } = methods;

  useEffect(() => {
    if (data !== undefined) {
      const proposal_bank_informations_BE = data.bank_information[0].user.bank_informations.map(
        (item: any, index: any) => ({
          bank_account_number: item.bank_account_number,
          bank_name: item.bank_name,
          bank_account_name: item.bank_account_name,
          bank_information_id: item.id,
          card_image: {
            url: item.card_image,
            size: undefined,
            type: 'image/jpeg',
          },
        })
      );
      console.log(proposal_bank_informations_BE);
      setValue('proposal_bank_informations', proposal_bank_informations_BE);
      setIsDone(true);
    }
    window.scrollTo(0, 0);
  }, [data, setValue]);
  const proposal_bank_informations = watch('proposal_bank_informations');
  const agree_on = watch('agree_on');
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        {isDone &&
          proposal_bank_informations.map((item, index) => (
            <Grid item md={6} xs={12} key={index}>
              <BankImageComp
                enableButton={true}
                accountNumber={item.bank_account_number}
                bankAccountName={item.bank_account_name}
                bankName={item.bank_name}
                imageUrl={item.card_image.url}
              />
            </Grid>
          ))}
        <Grid item xs={12}>
          <Stack justifyContent="center">
            <Button sx={{ textDecoration: 'underline', margin: '0 auto' }} onClick={handleOpen}>
              اضافة تفاصيل بنك جديد
            </Button>
            <AddBankModal open={open} handleClose={handleClose} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <RHFCheckbox
            name="agree_on"
            label="أقر بصحة المعلومات الواردة في هذا النموذج وأتقدم بطلب دعم المشروع"
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: '10px' }}>
          <Stack direction="row" justifyContent="center">
            <Box
              sx={{
                borderRadius: 2,
                height: '90px',
                backgroundColor: '#fff',
                padding: '24px',
              }}
            >
              <Stack justifyContent="center" direction="row" gap={3}>
                <Button
                  onClick={onReturn}
                  endIcon={<MovingBack />}
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                >
                  رجوع
                </Button>
                <Box sx={{ width: '10px' }} />
                <Button
                  variant="outlined"
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                    borderColor: '#000',
                  }}
                  onClick={onSavingDraft}
                  disabled={step ? false : true}
                >
                  حفظ كمسودة
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'background.paper',
                    color: '#fff',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                    '&:hover': { backgroundColor: '#0E8478' },
                  }}
                  disabled={agree_on ? false : true}
                >
                  {lastStep ? 'إرسال' : 'التالي'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default SupportingDurationInfoForm;
