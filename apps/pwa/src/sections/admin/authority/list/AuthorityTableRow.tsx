import { useState } from 'react';
// @mui
import { Button, Checkbox, Stack, TableCell, TableRow, Chip } from '@mui/material';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { AuthorityInterface, ClientFieldInterface } from './types';
// component
//
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import FormModalAuthority from './FormModalAuthority';

// ----------------------------------------------------------------------

type Props = {
  clientFieldList: ClientFieldInterface[];
  row: AuthorityInterface;
  selected: boolean;
  onSelectRow: () => void;
  onTrigger: () => void;
};

type ISubmit = {
  id?: string;
  name?: string;
  is_deleted?: boolean;
};

export default function AuthoritiesTableRow({
  clientFieldList,
  row,
  selected,
  onSelectRow,
  onTrigger,
}: Props) {
  const { authority_id, name, is_deleted, client_field_details } = row;
  // console.log({ row });
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [type, setType] = useState<'add' | 'edit' | 'delete'>('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async (formValues: ISubmit) => {
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.patch(
        'authority-management/authorities/update',
        { ...formValues },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (status === 200) {
        onTrigger();
        enqueueSnackbar(translate('pages.admin.settings.label.modal.success_edit_beneficiaries'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
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
    } finally {
      onTrigger();
      setIsSubmitting(false);
      setOpenEditModal(false);
    }
  };

  const handleDelete = async (formValues: ISubmit) => {
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.patch(
        'authority-management/authorities/delete',
        { ...formValues },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        enqueueSnackbar(translate('pages.admin.settings.label.modal.success_edit_bank'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
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
    } finally {
      onTrigger();
      setIsSubmitting(false);
      setOpenEditModal(false);
    }
  };

  return (
    <TableRow key={authority_id} hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">
        {/* pages.admin.settings.label.table.client_field_name */}
        {translate(`pages.admin.settings.label.table.client_field.${client_field_details.name}`)}
      </TableCell>
      {/* <TableCell align="left">{is_deleted ? 'true' : 'false'}</TableCell> */}
      {/* <TableCell align="left">
        {is_deleted ? (
          <Chip
            label={translate('system_messages.status.inactive')}
            color="error"
            sx={{ fontWeight: 'bold' }}
          />
        ) : (
          <Chip
            label={translate('system_messages.status.active')}
            color="primary"
            sx={{ fontWeight: 'bold' }}
          />
        )}
      </TableCell> */}
      <TableCell align="left">
        <Stack direction="row" gap={2}>
          <Button
            startIcon={<Iconify icon="eva:edit-outline" height={20} width={20} />}
            color="info"
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#0169DE',
              '&:hover': { backgroundColor: '#1482FE' },
            }}
            onClick={() => {
              setOpenEditModal(true);
              setType('edit');
            }}
            disabled={isSubmitting}
          >
            {translate('pages.admin.settings.label.table.modify')}
          </Button>
          <Button
            startIcon={<Iconify icon="eva:trash-2-outline" height={20} width={20} />}
            color="error"
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#FF4842',
              '&:hover': { backgroundColor: '#FF170F' },
            }}
            onClick={() => {
              setOpenEditModal(true);
              setType('delete');
            }}
            disabled={isSubmitting}
          >
            {translate('pages.admin.settings.label.table.delete')}
          </Button>

          <FormModalAuthority
            clientFieldList={clientFieldList}
            type={type}
            loading={isSubmitting}
            open={openEditModal}
            handleClose={() => {
              setOpenEditModal(false);
              setIsSubmitting(false);
            }}
            formDefaultValue={row}
            handleSubmitProps={(callback) => {
              if (type === 'edit') handleEdit(callback);
              if (type === 'delete') handleDelete(callback);
            }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
