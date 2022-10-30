import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Button, Grid, Stack } from '@mui/material';
import BankImageComp from 'sections/shared/BankImageComp';
import AddBankModal from './AddBankModal';
import { BankingValuesProps } from '../../../../@types/register';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  initialValue: Array<BankingValuesProps>;
  onDelete: (data: number) => void;
};

const BankingInfoForm = ({ children, onSubmit, initialValue, onDelete }: FormProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onEdit = () => {
    console.log('edit');
  };
  return (
    <Grid container rowSpacing={4} columnSpacing={7}>
      {initialValue.map((item: any, index: any) => (
        <>
          <Grid item md={6} xs={12} key={index}>
            <BankImageComp
              enableButton={true}
              accountNumber={item.bank_account_number}
              bankAccountName={item.bank_account_number}
              bankName={item.bank_name}
              imageUrl={item.card_image}
            />
            <Stack direction="row" justifyContent="space-around" gap={5} sx={{ mt: '10px' }}>
              <Button
                sx={{
                  backgroundColor: '#0169DE',
                  color: '#fff',
                  ':hover': { backgroundColor: '#1482FE' },
                }}
                startIcon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2200_38738)">
                      <path
                        d="M15.2353 0.765303C14.7821 0.312767 14.1678 0.0585938 13.5273 0.0585938C12.8869 0.0585938 12.2726 0.312767 11.8193 0.765303L0.976677 11.608C0.666178 11.9167 0.419985 12.284 0.252342 12.6885C0.0846994 13.093 -0.00106532 13.5268 9.98748e-06 13.9646V15.3333C9.98748e-06 15.5101 0.0702479 15.6797 0.195272 15.8047C0.320296 15.9297 0.489866 16 0.666677 16H2.03534C2.47319 16.0012 2.90692 15.9156 3.31145 15.748C3.71597 15.5805 4.08325 15.3344 4.39201 15.024L15.2353 4.18064C15.6877 3.72743 15.9417 3.11328 15.9417 2.47297C15.9417 1.83266 15.6877 1.21851 15.2353 0.765303ZM3.44934 14.0813C3.07335 14.4548 2.56532 14.6651 2.03534 14.6666H1.33334V13.9646C1.33267 13.7019 1.38411 13.4417 1.4847 13.1989C1.58529 12.9562 1.73302 12.7359 1.91934 12.5506L10.148 4.32197L11.6813 5.8553L3.44934 14.0813ZM14.292 3.23797L12.6213 4.9093L11.088 3.3793L12.7593 1.70797C12.86 1.60751 12.9795 1.52786 13.111 1.47358C13.2424 1.41929 13.3833 1.39143 13.5255 1.39158C13.6678 1.39174 13.8086 1.41991 13.9399 1.47448C14.0712 1.52905 14.1905 1.60896 14.291 1.70964C14.3915 1.81032 14.4711 1.9298 14.5254 2.06126C14.5797 2.19272 14.6076 2.33359 14.6074 2.47581C14.6072 2.61804 14.5791 2.75885 14.5245 2.89019C14.4699 3.02153 14.39 3.14084 14.2893 3.2413L14.292 3.23797Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2200_38738">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                }
              >
                تعديل
              </Button>
              <Button
                sx={{
                  backgroundColor: '#FF170F',
                  color: '#fff',
                  ':hover': { backgroundColor: '#FF4842' },
                }}
                startIcon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2200_38732)">
                      <path
                        d="M14.0007 2.66667H11.934C11.7793 1.91428 11.3699 1.23823 10.7748 0.752479C10.1798 0.266727 9.43545 0.000969683 8.66732 0L7.33398 0C6.56585 0.000969683 5.82153 0.266727 5.22648 0.752479C4.63144 1.23823 4.22205 1.91428 4.06732 2.66667H2.00065C1.82384 2.66667 1.65427 2.7369 1.52925 2.86193C1.40422 2.98695 1.33398 3.15652 1.33398 3.33333C1.33398 3.51014 1.40422 3.67971 1.52925 3.80474C1.65427 3.92976 1.82384 4 2.00065 4H2.66732V12.6667C2.66838 13.5504 3.01991 14.3976 3.6448 15.0225C4.26969 15.6474 5.11692 15.9989 6.00065 16H10.0007C10.8844 15.9989 11.7316 15.6474 12.3565 15.0225C12.9814 14.3976 13.3329 13.5504 13.334 12.6667V4H14.0007C14.1775 4 14.347 3.92976 14.4721 3.80474C14.5971 3.67971 14.6673 3.51014 14.6673 3.33333C14.6673 3.15652 14.5971 2.98695 14.4721 2.86193C14.347 2.7369 14.1775 2.66667 14.0007 2.66667ZM7.33398 1.33333H8.66732C9.08083 1.33384 9.48407 1.46225 9.82173 1.70096C10.1594 1.93967 10.4149 2.27699 10.5533 2.66667H5.44798C5.58637 2.27699 5.84192 1.93967 6.17958 1.70096C6.51723 1.46225 6.92047 1.33384 7.33398 1.33333ZM12.0007 12.6667C12.0007 13.1971 11.7899 13.7058 11.4149 14.0809C11.0398 14.456 10.5311 14.6667 10.0007 14.6667H6.00065C5.47022 14.6667 4.96151 14.456 4.58644 14.0809C4.21136 13.7058 4.00065 13.1971 4.00065 12.6667V4H12.0007V12.6667Z"
                        fill="white"
                      />
                      <path
                        d="M6.66667 12C6.84348 12 7.01305 11.9297 7.13807 11.8047C7.2631 11.6797 7.33333 11.5101 7.33333 11.3333V7.33329C7.33333 7.15648 7.2631 6.98691 7.13807 6.86189C7.01305 6.73686 6.84348 6.66663 6.66667 6.66663C6.48986 6.66663 6.32029 6.73686 6.19526 6.86189C6.07024 6.98691 6 7.15648 6 7.33329V11.3333C6 11.5101 6.07024 11.6797 6.19526 11.8047C6.32029 11.9297 6.48986 12 6.66667 12Z"
                        fill="white"
                      />
                      <path
                        d="M9.33268 12C9.50949 12 9.67906 11.9297 9.80409 11.8047C9.92911 11.6797 9.99935 11.5101 9.99935 11.3333V7.33329C9.99935 7.15648 9.92911 6.98691 9.80409 6.86189C9.67906 6.73686 9.50949 6.66663 9.33268 6.66663C9.15587 6.66663 8.9863 6.73686 8.86128 6.86189C8.73625 6.98691 8.66602 7.15648 8.66602 7.33329V11.3333C8.66602 11.5101 8.73625 11.6797 8.86128 11.8047C8.9863 11.9297 9.15587 12 9.33268 12Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2200_38732">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                }
                onClick={() => {
                  console.log(onDelete);
                  onDelete(index);
                }}
              >
                حذف
              </Button>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12} key={index}>
            <BankImageComp
              enableButton={true}
              accountNumber={item.bank_account_number}
              bankAccountName={item.bank_account_number}
              bankName={item.bank_name}
              imageUrl={item.card_image}
            />
            <Stack direction="row" justifyContent="space-around" gap={5} sx={{ mt: '10px' }}>
              <Button sx={{ backgroundColor: '#0169DE', color: '#fff' }}>تعديل</Button>
              <Button sx={{ backgroundColor: '#FF4842', color: '#fff' }}>حذف</Button>
            </Stack>
          </Grid>
        </>
      ))}
      <Grid item xs={12}>
        <Stack justifyContent="center">
          <Button sx={{ textDecoration: 'underline', margin: '0 auto' }} onClick={handleOpen}>
            اضافة تفاصيل بنك جديد
          </Button>
          <AddBankModal open={open} handleClose={handleClose} />
        </Stack>
      </Grid>
      <Grid item xs={12} sx={{ mt: '10px' }}>
        {children}
      </Grid>
    </Grid>
  );
};

export default BankingInfoForm;
