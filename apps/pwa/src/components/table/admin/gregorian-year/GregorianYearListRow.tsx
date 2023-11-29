import { Button, Grid, TableCell, TableRow, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import Space from 'components/space/space';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useNavigate } from 'react-router';
import { GregorianYearEntity } from '../../../../redux/slices/gregorian-year';
import ModalDialog from '../../../modal-dialog';
import ConfirmationModal from '../../../modal-dialog/ConfirmationModal';
import AddNewGregorianYear from './AddNewGregorianYear';

export type GregorianYearListRow = {
  row: GregorianYearEntity;
  selected?: boolean;
  onDelete?: (id: string) => void;
};

export default function GregorianYearRow({ row, selected, onDelete }: GregorianYearListRow) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const [openModalReject, setOpenModalReject] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [gregorianId, setGregorianId] = React.useState<string>('');

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row?.id ? row?.id : '-1');
    }
  };

  const handleOpenModal = (Id: string) => {
    setGregorianId(Id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  return (
    <>
      <ConfirmationModal
        open={openModalReject}
        handleClose={() => setOpenModalReject(!openModalReject)}
        onSumbit={handleDelete}
        message={translate('_gregorian_year.modal.delete_confirmation')}
      />
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        isOpen={open}
        maxWidth="md"
        content={<AddNewGregorianYear onClose={handleCloseModal} id={gregorianId} />}
        onClose={handleCloseModal}
      />
      <TableRow hover selected={selected}>
        <TableCell align="left" sx={{ maxWidth: 250 }}>
          <Typography variant="subtitle2" noWrap>
            {row.year ?? '-'}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Grid container display="flex" flexDirection="column">
            <Grid item md={5}>
              <Button
                data-cy="pages.admin.settings.label.table.modify"
                startIcon={<Iconify icon="eva:edit-outline" height={20} width={20} />}
                variant="contained"
                fullWidth
                onClick={() => {
                  if (row.id) handleOpenModal(row.id);
                }}
                sx={{
                  width: '100px',
                  backgroundColor: '#0169DE',
                  '&:hover': { backgroundColor: '#1482FE' },
                }}
              >
                {translate('pages.admin.settings.label.table.modify')}
              </Button>
            </Grid>
            <Space direction="horizontal" size="small" />
            <Grid item md={5}>
              <Button
                data-cy="pages.admin.settings.label.table.delete"
                startIcon={<Iconify icon="eva:trash-2-outline" height={20} width={20} />}
                variant="contained"
                onClick={() => {
                  setOpenModalReject(true);
                }}
                sx={{
                  width: '100px',
                  backgroundColor: '#FF4842',
                  '&:hover': { backgroundColor: '#FF170F' },
                }}
              >
                {translate('pages.admin.settings.label.table.delete')}
              </Button>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
    </>
  );
}
