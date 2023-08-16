import React, { useState } from 'react';
import { Alert, Box, Button, Checkbox, Grid, Stack, Typography } from '@mui/material';
import BankImageComp from 'sections/shared/BankImageComp';
import { getUserBankInformation } from 'queries/client/getUserBankInformation';
import useAuth from 'hooks/useAuth';
import { useQuery } from 'urql';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import useLocales from 'hooks/useLocales';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { AmandementFields } from '../../../../@types/proposal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from '../../../../components/hook-form';

type FormValuesProps = {
  proposal_bank_id?: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
  revised?: AmandementFields;
};
const ProposalBankInformation = ({ onSubmit, children, defaultValues, revised }: Props) => {
  // console.log('test proposal id:', defaultValues?.proposal_bank_id);
  const { user } = useAuth();
  const { translate } = useLocales();

  const isDisabled = !!revised && revised.hasOwnProperty('proposal_bank_id') ? false : true;
  const id = user?.id;
  const [oprnError, setOpenError] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const isSelected = React.useMemo(() => {
    if (selectedCard === '') return false;
    return true;
  }, [selectedCard]);

  const [{ data, fetching, error }] = useQuery({
    query: getUserBankInformation,
    variables: { user_id: id },
  });

  // const onBankInfoSubmit = () => {
  //   // const newValue = {
  //   //   proposal_id,
  //   //   selectedCard,
  //   // };
  //   if (!!proposal_id) {
  //     onUpdate(selectedCard);
  //   } else {
  //     if (selectedCard === '') {
  //       setOpenError(true);
  //       window.scrollTo(0, 0);
  //     } else {
  //       onLoader(true);
  //       onSubmit(selectedCard);
  //     }
  //   }
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAgreeOn(event.target.checked);
  // };

  const ProjectTimeLineSchema = Yup.object().shape({
    proposal_bank_id: Yup.string().required(
      translate('errors.cre_proposal.project_timeline.name.required')
    ),
  });

  // const defaultValuesTmp = (defaultValues?.length && defaultValues) || [];

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ProjectTimeLineSchema),
    defaultValues: {
      proposal_bank_id: defaultValues?.proposal_bank_id || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const handleSelectedBank = (id: string) => {
    setSelectedCard(id);
    setValue('proposal_bank_id', id);
  };

  const handleOnSubmit = (data: FormValuesProps) => {
    if (isSelected) {
      setOpenError(false);
    } else {
      setOpenError(true);
    }
    // console.log({ isSelected, selectedCard });
    onSubmit(data);
  };

  // console.log({ isSelected });
  React.useEffect(() => {
    if (data && defaultValues?.proposal_bank_id) {
      setSelectedCard(defaultValues?.proposal_bank_id);
    }
  }, [data, defaultValues]);

  if (fetching) return <>...Loading</>;

  if (error) return <>Something went wrong, please go back one step</>;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        {!isSelected && oprnError && (
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
              disabled={isDisabled}
              component={Button}
              sx={{
                width: '100%',
                color: '#2b9d23',
                ...(selectedCard === item.id && { border: `3px solid` }),
                backgroundColor: '#fff',
                ':hover': { backgroundColor: '#fff' },
              }}
              onClick={() => {
                handleSelectedBank(item.id);
              }}
            >
              <BankImageComp
                enableButton={true}
                accountNumber={item.bank_account_number}
                bankAccountName={item.bank_account_name}
                bankName={item.bank_name}
                imageUrl={item.card_image.url}
                size={item.card_image.size}
                type={item.card_image.type}
                borderColor={item?.color ?? 'transparent'}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      {children}
    </FormProvider>
  );
};

export default ProposalBankInformation;
