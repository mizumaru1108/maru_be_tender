import { useEffect, useState } from 'react';
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';
// routes
import useSettings from 'hooks/useSettings';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import AuthorityTableContent from './list/AuthorityTableContent';
import FormModalAuthority from './list/FormModalAuthority';
import { AuthorityInterface } from './list/types';

type ISubmit = {
  authority_id?: string | string[];
  client_field_id?: string;
  name?: string;
  is_deleted?: boolean;
};

export default function AuthorityTable() {
  // hooks
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  // State
  const [refetch, setRefetch] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorities, setAuthorities] = useState<any[] | []>([]);
  const [clientFields, setClientFields] = useState<any[] | []>([]);
  const [isFetchingAuthoritites, setIsFetchingAuthorities] = useState<boolean>(false);
  const [isFetchingClientFields, setIsFetchingClientFields] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseAddBeneficiaries = () => {
    setOpen(false);
  };

  const getAuthorities = async () => {
    setIsFetchingAuthorities(true);
    try {
      const response = await axiosInstance.get(
        `/authority-management/authorities?include_relations=client_field_details&limit=0&is_deleted=n`
      );
      if (response) {
        const mappedRes = response.data.data
          // .filter((bank: any) => bank.is_deleted === false || bank.is_deleted === null)
          .map((authority: any) => authority);
        setAuthorities(mappedRes);
      }
    } catch (error) {
      // console.error(error.message);
      setAuthorities([]);
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
      setIsFetchingAuthorities(false);
    }
  };

  const getClientFields = async () => {
    // console.log('masuk fetching client fields');
    setIsFetchingClientFields(true);
    try {
      const response = await axiosInstance.get(`/authority-management/client-fields?limit=0`);
      if (response) {
        const mappedRes = response.data.data
          .filter(
            (client_field: any) =>
              client_field.is_deleted === false || client_field.is_deleted === null
          )
          .map((client_field: any) => client_field);
        setClientFields(mappedRes);
        // console.log('masuk fetching client fields', mappedRes);
      }
    } catch (error) {
      // console.error(error.message);
      setAuthorities([]);
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
      setIsFetchingClientFields(false);
    }
  };

  const handleSubmit = async (formValue: ISubmit) => {
    setIsSubmitting(true);
    try {
      const { status } = await axiosInstance.post(
        'authority-management/authorities/create',
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
    getAuthorities();
    getClientFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  // console.log('authorities', authorities);
  // console.log('clientFields', clientFields);

  if (isFetchingAuthoritites || isFetchingClientFields)
    return <>{translate('pages.common.loading')}</>;

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <FormModalAuthority
        clientFieldList={clientFields}
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
          {translate('pages.admin.settings.label.list_of_authorities')}
        </Typography>
        <Button variant="contained" onClick={handleOpenModal} sx={{ px: '50px', fontSize: '16px' }}>
          {translate('pages.admin.settings.label.add_authorities')}
        </Button>
      </Stack>
      <AuthorityTableContent
        trigger={() => {
          setRefetch(!refetch);
        }}
        clientFieldList={clientFields}
        data={!isFetchingAuthoritites && !isFetchingClientFields && authorities ? authorities : []}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: AuthorityInterface[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.role === filterRole);
  }

  return tableData;
}
