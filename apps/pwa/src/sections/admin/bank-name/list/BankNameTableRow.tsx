import { useState } from 'react';
// @mui
import { Checkbox, TableRow, TableCell, Stack, Button } from '@mui/material';
import Iconify from 'components/Iconify';
import { AuthorityInterface } from './types';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
// component
import FormModalBank from './FormModalBank';
//
import axiosInstance from 'utils/axios';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type Props = {
  row: AuthorityInterface;
  selected: boolean;
  onSelectRow: () => void;
};

export default function BankNameTableRow({ row, selected, onSelectRow }: Props) {
  const { id, bank_name } = row;
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditBank = async (formValues: any) => {
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.patch(
        '/tender/proposal/payment/update-bank',
        { id: formValues.id, bank_name: formValues.bank_name },
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

        setIsSubmitting(false);
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
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }

      setIsSubmitting(false);
      window.location.reload();
    }
  };
  const handleDeleteBank = async () => {
    setIsSubmitting(true);

    try {
      const { status } = await axiosInstance.patch(
        'tender/proposal/payment/bank/soft-delete',
        { id },
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

        setIsSubmitting(false);
        window.location.reload();
      }
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  return (
    <TableRow key={id} hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{bank_name}</TableCell>
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
            onClick={() => setOpenEditModal(true)}
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
            onClick={handleDeleteBank}
            disabled={isSubmitting}
            // disabled
          >
            {translate('pages.admin.settings.label.table.delete')}
          </Button>

          <FormModalBank
            type="edit"
            loading={isSubmitting}
            open={openEditModal}
            handleClose={() => {
              setOpenEditModal(false);
              setIsSubmitting(false);
            }}
            formDefaultValue={row}
            handleSubmitProps={handleEditBank}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
