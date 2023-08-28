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
import RegionsTableContent from './list/RegionsTableContent';
import { IRegions } from 'sections/admin/region/list/types';
import FormModalRegions from 'sections/admin/region/list/FormModalRegions';

// --------------------------------------------------------------------------------------------------

type ISubmit = {
  id?: string;
  name?: string;
  is_deleted?: boolean;
};

export default function RegionsTable() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [refetch, setRefetch] = useState<boolean>(false);
  // const [bankValue, setBankValue] = useState<AuthorityInterface[] | []>([]);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseAddBeneficiaries = () => {
    setOpen(false);
  };

  const [regions, setRegions] = useState<IRegions[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getRegions = async () => {
    setLoading(true);
    try {
      const rest = await axiosInstance.get(
        `/region-management/regions?include_relations=governorate&limit=0`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        const test = rest.data.data
          .filter((region: any) => region.is_deleted === false || region.is_deleted === null)
          .map((region: any) => region);
        setRegions(test);
      }
    } catch (error) {
      // console.error(error.message);
      setRegions([]);
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
        '/region-management/regions/create',
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
    getRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  if (loading) return <>{translate('pages.common.loading')}</>;
  // if (error) return <>{error.message}</>;
  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <FormModalRegions
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
          {translate('pages.admin.settings.label.regions.list_of_regions')}
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{ px: '50px', fontSize: '16px' }}
          data-cy="pages.admin.settings.label.regions.add_regions"
        >
          {translate('pages.admin.settings.label.regions.add_regions')}
        </Button>
      </Stack>
      <RegionsTableContent
        trigger={() => {
          setRefetch(!refetch);
        }}
        data={!loading && regions ? regions : []}
      />
    </Container>
  );
}
