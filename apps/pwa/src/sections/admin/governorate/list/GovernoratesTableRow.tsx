import { useState } from 'react';
// @mui
import { Button, Checkbox, Stack, TableCell, TableRow } from '@mui/material';
import Iconify from 'components/Iconify';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { GovernorateFormInput, IGovernorate } from './types';
// component
//
import ConfirmationModal from 'components/modal-dialog/ConfirmationModal';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import FormModalGovernorates from './FormModalGovernorates';
import { IRegions } from 'sections/admin/region/list/types';

// ----------------------------------------------------------------------

type Props = {
  row: IGovernorate;
  selected: boolean;
  regionList: IRegions[];
  onSelectRow: () => void;
  onTrigger: () => void;
};

export default function GovernoratesTableRow({
  row,
  selected,
  regionList,
  onSelectRow,
  onTrigger,
}: Props) {
  const { governorate_id, name, region_detail, ...rest } = row;
  // console.log({ row });
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async (formValues: GovernorateFormInput) => {
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.patch(
        '/region-management/governorates/update',
        { ...formValues },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (status === 200) {
        onTrigger();
        enqueueSnackbar(
          translate('pages.admin.settings.label.governorate.modal.success_edit_governorate'),
          {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
          }
        );
        setIsSubmitting(false);
        // window.location.reload();
      }
    } catch (err) {
      onTrigger();
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
      // window.location.reload();
    }
  };
  const handleDelete = async () => {
    // console.log('test masuk sini', region_id);
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.patch(
        '/region-management/governorates/delete',
        { governorate_id },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );

      if (status === 200) {
        enqueueSnackbar(
          translate('pages.admin.settings.label.governorate.modal.success_delete_governorate'),
          {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
          }
        );

        // window.location.reload();
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
      setIsSubmitting(false);
      onTrigger();
    }
  };

  return (
    <TableRow key={governorate_id} hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">{region_detail?.name || 'no Data'}</TableCell>
      <TableCell align="left">
        <Stack direction="row" gap={2}>
          <Button
            data-cy={`pages.admin.settings.label.table.modify-${governorate_id}`}
            startIcon={<Iconify icon="eva:edit-outline" height={20} width={20} />}
            color="info"
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#0169DE',
              '&:hover': { backgroundColor: '#1482FE' },
            }}
            onClick={() => setOpenEditModal(true)}
            disabled={isSubmitting}
          >
            {translate('pages.admin.settings.label.table.modify')}
          </Button>
          <Button
            data-cy={`pages.admin.settings.label.table.delete-${governorate_id}`}
            startIcon={<Iconify icon="eva:trash-2-outline" height={20} width={20} />}
            color="error"
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#FF4842',
              '&:hover': { backgroundColor: '#FF170F' },
            }}
            onClick={() => {
              setOpenDeleteModal(true);
            }}
            disabled={isSubmitting}
          >
            {translate('pages.admin.settings.label.table.delete')}
          </Button>

          <FormModalGovernorates
            type="edit"
            loading={isSubmitting}
            open={openEditModal}
            handleClose={() => {
              setOpenEditModal(false);
              setIsSubmitting(false);
            }}
            formDefaultValue={row}
            handleSubmitProps={handleEdit}
            regionList={regionList}
          />
        </Stack>
      </TableCell>
      <ConfirmationModal
        open={openDeleteModal}
        message={translate('system_messages.dialog.delete_banner')}
        handleClose={() => {
          setOpenDeleteModal(false);
        }}
        onSumbit={handleDelete}
      />
    </TableRow>
  );
}
