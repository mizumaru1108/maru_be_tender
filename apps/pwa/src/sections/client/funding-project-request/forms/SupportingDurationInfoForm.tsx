import { useState } from 'react';
import { Alert, Box, Button, Checkbox, Grid, Stack, Typography } from '@mui/material';
import BankImageComp from 'sections/shared/BankImageComp';
import { getUserBankInformation } from 'queries/client/getUserBankInformation';
import useAuth from 'hooks/useAuth';
import { useQuery } from 'urql';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import useLocales from 'hooks/useLocales';

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  onReturn: () => void;
  onSavingDraft: () => void;
  lastStep?: boolean;
};
const SupportingDurationInfoForm = ({ onReturn, onSavingDraft, lastStep, onSubmit }: Props) => {
  const { user } = useAuth();

  const { translate } = useLocales();

  const [agreeOn, setAgreeOn] = useState(false);

  const id = user?.id;

  const [{ data, fetching, error }] = useQuery({
    query: getUserBankInformation,
    variables: { user_id: id },
  });

  const [oprnError, setOpenError] = useState(false);

  const onBankInfoSubmit = () => {
    if (selectedCard === '') {
      setOpenError(true);
      window.scrollTo(0, 0);
    } else onSubmit(selectedCard);
  };

  const [selectedCard, setSelectedCard] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeOn(event.target.checked);
  };

  if (fetching) return <>...Loading</>;

  if (error) return <>Something went wrong, please go back one step</>;
  return (
    <Grid container rowSpacing={4} columnSpacing={7}>
      {oprnError && (
        <Grid item md={12}>
          <Alert severity="error">{translate('banking_error_message')}</Alert>
        </Grid>
      )}
      {data.bank_information.map((item: any, index: number) => (
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
              ...(selectedCard === item.id && { border: `3px solid` }),
              backgroundColor: '#fff',
              ':hover': { backgroundColor: '#fff' },
            }}
            onClick={() => {
              setSelectedCard(item.id);
            }}
          >
            <BankImageComp
              enableButton={true}
              accountNumber={item.bank_account_number}
              bankAccountName={item.bank_account_name}
              bankName={item.bank_name}
              imageUrl={item.card_image.url}
              size={item.card_image.size}
            />
          </Box>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Checkbox onChange={handleChange} />
          <Typography>{translate('funding_project_request_form5.agree_on.label')}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sx={{ mt: '10px' }}>
        <Stack direction="row" justifyContent="center">
          <Box
            sx={{
              borderRadius: 2,
              height: '100%',
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
                {translate('going_back_one_step')}
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
                // disabled={step ? false : true}
                disabled
              >
                {translate('saving_as_draft')}
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
                {lastStep ? translate('send') : translate('next')}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SupportingDurationInfoForm;
