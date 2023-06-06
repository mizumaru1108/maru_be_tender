// react
import { useEffect, useState } from 'react';
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useSettings from 'hooks/useSettings';
// component
//
import { useSnackbar } from 'notistack';
import FormModalBeneficiaries from 'sections/admin/beneficiaries/list/FormModalBeneficiaries';
import axiosInstance from 'utils/axios';
import { useDispatch } from '../../../redux/store';
import BeneficiariesTableContent from './list/BeneficiariesTableContent';
import { FormInput } from './list/types';

// --------------------------------------------------------------------------------------------------

type ISubmit = {
  id?: string;
  name?: string;
  is_deleted?: boolean;
};

export default function BeneficiariesTable() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  // const [bankValue, setBankValue] = useState<AuthorityInterface[] | []>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[] | []>([]);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseAddBeneficiaries = () => {
    setOpen(false);
  };

  const getBeneficiaries = async () => {
    setLoading(true);
    // console.log('test masuk');
    try {
      const rest = await axiosInstance.get(`/tender/proposal/beneficiaries/find-all?limit=0`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        // console.log('test data', rest.data.data);
        const test = rest.data.data
          .filter((bank: any) => bank.is_deleted === false || bank.is_deleted === null)
          .map((bank: any) => bank);
        // console.log({ test });
        // // console.log(rest.data.data);
        setBeneficiaries(test);
        // setBankValue(test);
        // dispatch(setBankList(test));
        // setLoading(false);
      }
    } catch (error) {
      // console.error(error.message);
      setBeneficiaries([]);
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formValue: ISubmit) => {
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.post(
        '/tender/proposal/beneficiaries/create',
        { ...formValue },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 201) {
        enqueueSnackbar(
          translate('pages.admin.settings.label.modal.success_add_new_beneficiaries'),
          {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
          }
        );

        setIsSubmitting(false);
        setOpen(false);
        // window.location.reload();
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
      // window.location.reload();
    } finally {
      setRefetch(!refetch);
    }
  };

  useEffect(() => {
    getBeneficiaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  if (loading) return <>{translate('pages.common.loading')}</>;
  // if (error) return <>{error.message}</>;
  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <FormModalBeneficiaries
        type="add"
        loading={isSubmitting}
        open={open}
        handleClose={handleCloseAddBeneficiaries}
        handleSubmitProps={handleSubmit}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 5, mt: 1 }}
      >
        <Typography variant="h4" sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
          {translate('pages.admin.settings.label.list_of_beneficiaries')}
        </Typography>
        <Button variant="contained" onClick={handleOpenModal} sx={{ px: '50px', fontSize: '16px' }}>
          {translate('pages.admin.settings.label.add_beneficiaries')}
        </Button>
      </Stack>
      <BeneficiariesTableContent
        trigger={() => {
          // console.log('test');
          setRefetch(!refetch);
        }}
        data={!loading && beneficiaries ? beneficiaries : []}
      />
    </Container>
  );
}
