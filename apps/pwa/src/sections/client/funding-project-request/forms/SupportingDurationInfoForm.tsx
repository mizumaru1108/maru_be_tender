import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Grid, Stack, Typography } from '@mui/material';
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
  const [agreeOn, setAgreeOn] = useState(false);
  const id = user?.id;
  const [result, reexxecuteUserBankInformation] = useQuery({
    query: getUserBankInformation,
    variables: { user_id: id },
  });
  const { data, fetching, error } = result;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isCreatedOne, setIsCreatedOne] = useState<Boolean>(false);

  const onBankInfoSubmit = () => {
    console.log(data.bank_information[0].user.bank_informations[selectedCard as number]);
    console.log('onBankInfoSubmit');
    onSubmit(data.bank_information[0].user.bank_informations[selectedCard as number].id);
  };

  const [selectedCard, setSelectedCard] = useState<number>();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeOn(event.target.checked);
  };
  useEffect(() => {
    reexxecuteUserBankInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatedOne]);

  if (fetching) return <>...Loading</>;
  if (error) return <>Something went wrong, please go back one step</>;
  return (
    <Grid container rowSpacing={4} columnSpacing={7}>
      {data.bank_information[0].user.bank_informations.map((item: any, index: number) => (
        <Grid
          item
          md={6}
          xs={12}
          key={index}
          sx={{
            '& .MuiButtonBase-root': {
              display: 'inherit',
            },
          }}
        >
          <Box
            component={Button}
            sx={{
              width: '100%',
              color: '#2b9d23',
              ...(selectedCard === index && { border: `3px solid` }),
              backgroundColor: '#fff',
              ':hover': { backgroundColor: '#fff' },
            }}
            onClick={() => {
              setSelectedCard(index);
            }}
          >
            <BankImageComp
              enableButton={true}
              accountNumber={item.bank_account_number}
              bankAccountName={item.bank_account_name}
              bankName={item.bank_name}
              imageUrl={item.card_image}
            />
          </Box>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Stack justifyContent="center">
          <Button sx={{ textDecoration: 'underline', margin: '0 auto' }} onClick={handleOpen}>
            اضافة تفاصيل بنك جديد
          </Button>
          <AddBankModal open={open} handleClose={handleClose} setIsCreatedOne={setIsCreatedOne} />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Checkbox onChange={handleChange} />
          <Typography>أقر بصحة المعلومات الواردة في هذا النموذج وأتقدم بطلب دعم المشروع</Typography>
        </Stack>
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
                onClick={onBankInfoSubmit}
                variant="outlined"
                sx={{
                  backgroundColor: 'background.paper',
                  color: '#fff',
                  width: { xs: '100%', sm: '200px' },
                  hieght: { xs: '100%', sm: '50px' },
                  '&:hover': { backgroundColor: '#0E8478' },
                }}
                disabled={agreeOn ? false : true}
              >
                {lastStep ? 'إرسال' : 'التالي'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SupportingDurationInfoForm;
