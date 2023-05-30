import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Stack, Box, Button } from '@mui/material';
import FormGenerator from 'components/FormGenerator';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'redux/store';
import * as Yup from 'yup';
import { PaymentsData } from './form-data';
import { useParams } from 'react-router';
import Iconify from 'components/Iconify';
import CheckIcon from '@mui/icons-material/Check';
import { LoadingButton } from '@mui/lab';
import { insertPaymentsBySupervisor } from 'redux/slices/proposal';
import { useSnackbar } from 'notistack';
//
import uuidv4 from 'utils/uuidv4';
import useAuth from 'hooks/useAuth';
import { useState, useEffect } from 'react';
import moment from 'moment';
import useLocales from 'hooks/useLocales';

type FormValuesProps = {
  payments: {
    payment_amount: number;
    payment_date: string;
  }[];
};

interface Props {
  fetching: boolean;
  refetch: () => void;
}

function PaymentsSetForm({ refetch, fetching }: Props) {
  const { id: proposal_id } = useParams();
  const { proposal } = useSelector((state) => state.proposal);
  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const PaymentsSchema = Yup.object().shape({
    payments: Yup.array().of(
      Yup.object().shape({
        payment_amount: Yup.number()
          .required('مبلغ الدعم مطلوب')
          .positive()
          .integer()
          .min(1, 'يجب أن تكون قيمة المبلغ أكبر من 0'),
        payment_date: Yup.string().required('تاريخ الدفعة مطلوب'),
      })
    ),
  });

  const defaultValues = {
    payments: [...Array(fetching ? 1 : Number(proposal.number_of_payments_by_supervisor))].map(
      () => ({
        payment_amount: 0,
        payment_date: '',
      })
    ),
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PaymentsSchema),
    defaultValues,
  });

  const { handleSubmit, setError, setValue, reset } = methods;

  const handleOnSubmit = async (data: any) => {
    setIsSubmitting(true);

    for (let i = 1; i < data?.payments.length; i++) {
      const previousDate = moment(data?.payments[i - 1].payment_date);
      const currentDate = moment(data?.payments[i].payment_date);

      if (currentDate.isBefore(previousDate)) {
        const errorObject = data?.payments[i];

        enqueueSnackbar(`Payment ${i + 1} date is less than payment ${i} date.`, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });

        setError(`payments.${i}.payment_date`, { type: 'focus' }, { shouldFocus: true });

        const newValuePayments = data?.payments.map(
          (obj: { payment_date: string; payment_amount: number }) =>
            obj.payment_date === errorObject.payment_date &&
            obj.payment_amount === errorObject.payment_amount
              ? { payment_date: '', payment_amount: obj.payment_amount }
              : obj
        );

        reset({ payments: newValuePayments });
        setIsSubmitting(false);

        return;
      }
    }

    try {
      await dispatch(
        insertPaymentsBySupervisor({
          payments: data?.payments.map((item: any, index: any) => ({
            payment_amount: item.payment_amount,
            payment_date: item.payment_date,
            proposal_id,
            order: index + 1,
          })),
          proposal_id,
          role: activeRole!,
        })
      ).then((res) => {
        if (res.statusCode === 201) {
          setIsSubmitting(false);
          enqueueSnackbar('تم إنشاء الدفعات بنجاح', { variant: 'success' });
          refetch();
          // window.location.reload();
        }
      });
    } catch (error) {
      setIsSubmitting(false);

      if (typeof error.message === 'object') {
        error.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        // enqueueSnackbar(error.message, {
        //   variant: 'error',
        //   preventDuplicate: true,
        //   autoHideDuration: 3000,
        // });
        const statusCode = (error && error.statusCode) || 0;
        const message = (error && error.message) || null;
        enqueueSnackbar(
          `${
            statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
          }`,
          {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          }
        );
      }
    }
  };

  useEffect(() => {}, [proposal]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={2} sx={{ mt: '10px' }}>
        <Grid container item md={8} rowSpacing={4} columnSpacing={2}>
          <FormGenerator data={PaymentsData} />
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: 'white',
              p: 3,
              mt: '25px',
              borderRadius: 1,
              width: '100%',
            }}
          >
            <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="space-between">
              <Stack flexDirection={{ sm: 'column', md: 'row' }} gap={3}>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:edit-2-outline" />}
                  sx={{ ':hover': { backgroundColor: '#1482FE' }, backgroundColor: '#0169DE' }}
                >
                  ارسال طلب تعديل
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    my: { xs: '1.3em', md: '0' },
                    mr: { md: '1em' },
                    color: '#000',
                    backgroundColor: '#fff',
                    border: `1px solid #000`,
                    ':hover': { backgroundColor: '#C4CDD5' },
                  }}
                  onClick={() => {
                    console.log('asdasd');
                  }}
                  startIcon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4762_26970)">
                        <path
                          d="M16 10.6671V14.0004C16 14.5309 15.7893 15.0396 15.4142 15.4146C15.0391 15.7897 14.5304 16.0004 14 16.0004H10.6667C9.7314 15.9995 8.81283 15.7526 8.0031 15.2845C7.19337 14.8165 6.52097 14.1437 6.05333 13.3338C6.55591 13.3302 7.05678 13.2748 7.548 13.1684C7.9221 13.6362 8.39666 14.0138 8.93653 14.2732C9.47639 14.5326 10.0677 14.6672 10.6667 14.6671H14C14.1768 14.6671 14.3464 14.5968 14.4714 14.4718C14.5964 14.3468 14.6667 14.1772 14.6667 14.0004V10.6671C14.6665 10.0679 14.5315 9.47645 14.2716 8.93657C14.0117 8.3967 13.6336 7.92225 13.1653 7.54842C13.2726 7.05729 13.3289 6.55642 13.3333 6.05375C14.1433 6.52138 14.8161 7.19379 15.2841 8.00352C15.7522 8.81324 15.999 9.73182 16 10.6671ZM11.9847 6.43442C12.047 5.57551 11.9237 4.71324 11.6232 3.90621C11.3227 3.09918 10.852 2.3663 10.2431 1.75736C9.63412 1.14842 8.90123 0.677703 8.0942 0.377186C7.28717 0.0766686 6.42491 -0.0466029 5.566 0.0157476C4.04394 0.189569 2.63795 0.913865 1.61278 2.05224C0.587618 3.19062 0.0140181 4.66453 0 6.19642L0 9.55642C0 11.2444 1.00467 12.0004 2 12.0004H5.8C7.33254 11.9872 8.80734 11.414 9.94653 10.3888C11.0857 9.36355 11.8106 7.95709 11.9847 6.43442ZM9.3 2.70108C9.77329 3.17542 10.1392 3.74588 10.3729 4.37387C10.6066 5.00187 10.7027 5.67273 10.6547 6.34108C10.5124 7.5302 9.94033 8.6263 9.04622 9.42304C8.1521 10.2198 6.99759 10.6622 5.8 10.6671H2C1.38133 10.6671 1.33333 9.81708 1.33333 9.55642V6.19642C1.33889 4.99933 1.78177 3.84555 2.57861 2.9522C3.37546 2.05885 4.47133 1.48753 5.66 1.34575C5.77067 1.33775 5.88133 1.33375 5.992 1.33375C6.60618 1.33318 7.21445 1.45364 7.78206 1.68825C8.34966 1.92287 8.86547 2.26703 9.3 2.70108Z"
                          fill="#1E1E1E"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4762_26970">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  }
                >
                  ارسال رسالة للشريك
                </Button>
              </Stack>
              <LoadingButton
                variant="contained"
                color="primary"
                sx={{ mr: { md: '1em' } }}
                type="submit"
                startIcon={<CheckIcon />}
                loading={isSubmitting}
              >
                تثبيت الدفعات
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default PaymentsSetForm;
