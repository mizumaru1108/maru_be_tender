import { useQuery } from 'urql';
// react
import { useEffect, useState } from 'react';
// @mui
import { Button, Container, Typography, Stack } from '@mui/material';
// hooks
import useSettings from 'hooks/useSettings';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
// component
import FormModalBank, { FormInput } from './list/FormModalBank';
import BankNameTableContent from './list/BankNameTableContent';
//
import axiosInstance from 'utils/axios';
import { useSnackbar } from 'notistack';
import { AuthorityInterface } from './list/types';
import { useDispatch } from '../../../redux/store';
import { setBankList } from '../../../redux/slices/banks';

// --------------------------------------------------------------------------------------------------

export default function BankNameTable() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [bankValue, setBankValue] = useState<AuthorityInterface[] | []>([]);
  const dispatch = useDispatch();

  const [{ data, fetching, error }, reExecute] = useQuery({
    query: `
    query getBankList {
      banks {
        id
        bank_name
      }
    }    
    `,
  });

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAddBank = () => {
    setOpen(true);
  };

  const handleCloseAddBank = () => {
    setOpen(false);
  };

  const getBankList = async () => {
    setLoading(true);
    // console.log('test masuk');
    try {
      // const { status, data } = await axios.get(
      //   `${TMRA_RAISE_URL}/tender/proposal/payment/find-bank-list`
      // );
      const rest = await axiosInstance.get(`/tender/proposal/payment/find-bank-list?limit=0`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        const test = rest.data.data
          .filter((bank: any) => bank.is_deleted === false || bank.is_deleted === null)
          .map((bank: any) => bank);
        // console.log({ test });
        // console.log(rest.data.data);
        setBankValue(test);
        dispatch(setBankList(test));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  const handleSubmitAddBank = async (formValue: FormInput) => {
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.post(
        '/tender/proposal/payment/add-bank-list',
        { bank_name: formValue.bank_name },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 201) {
        enqueueSnackbar(translate('pages.admin.settings.label.modal.success_add_new_bank'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });

        setIsSubmitting(false);
        setOpen(false);
        reExecute();
        window.location.reload();
      }
    } catch (err) {
      if (typeof err.message === 'object') {
        err.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        // enqueueSnackbar(err.message, {
        //   variant: 'error',
        //   preventDuplicate: true,
        //   autoHideDuration: 3000,
        // });
        const statusCode = (err && err.statusCode) || 0;
        const message = (err && err.message) || null;
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

      setIsSubmitting(false);
      setOpen(false);
      reExecute();
      window.location.reload();
    }
  };

  useEffect(() => {
    getBankList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;
  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <FormModalBank
        type="add"
        loading={isSubmitting}
        open={open}
        handleClose={handleCloseAddBank}
        handleSubmitProps={handleSubmitAddBank}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 5, mt: 1 }}
      >
        <Typography variant="h4" sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
          {translate('pages.admin.settings.label.list_of_bank')}
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenAddBank}
          sx={{ px: '50px', fontSize: '16px' }}
        >
          {translate('pages.admin.settings.label.add_bank')}
        </Button>
      </Stack>
      <BankNameTableContent data={!loading && bankValue ? bankValue : []} />
    </Container>
  );
}
