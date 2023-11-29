import React, { useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import Scrollbar from 'components/Scrollbar';
import SearchField from 'components/sorting/searchField';
import { TableHeadCustom, TableNoData } from 'components/table';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useTable from 'hooks/useTable';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import { getGregorianYears, setStateLoading } from '../../../../redux/slices/gregorian-year';
import { dispatch, useSelector } from '../../../../redux/store';
import GregorianYearRow from './GregorianYearListRow';
import GregorianYearSkeleton from './GregorianYearSkeleton';
import ModalDialog from '../../../modal-dialog';
import AddNewGregorianYear from './AddNewGregorianYear';
import { ErrorSnackBar } from '../../../../utils/catchError';

const TABLE_HEAD = [
  { id: 'year', label: '_gregorian_year.headercell.year' },
  { id: 'action', label: '_gregorian_year.headercell.actions' },
];

export default function GregorianYearListTable() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    total,
    // setTotal,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { gregorian_years, loadingProps, error } = useSelector((state) => state.gregorianYear);

  const [sortValue, setSortValue] = useState<string>('');

  const [searchName, setSearchName] = useState('');
  const [open, setOpen] = useState(false);

  const handleDelete = React.useCallback(
    async (id: string) => {
      const url = `/banners`;
      try {
        dispatch(setStateLoading(true));
        const response = await axiosInstance.delete(`${url}/${id}`, {
          headers: { 'x-hasura-role': activeRole! },
        });
        if (response) {
          setPage(0);
        }
      } catch (err) {
        const statusCode = (err && err.statusCode) || 0;
        const message = (err && err.message) || null;
        if (message && statusCode !== 0) {
          enqueueSnackbar(err.message, {
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
        dispatch(setStateLoading(false));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRole, enqueueSnackbar]
  );

  const handleSortData = (event: any) => {
    setSortValue(event.target.value);
    setPage(0);
  };

  const handleChange = (name: string) => {
    setSearchName(name);
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (activeRole) {
      dispatch(
        getGregorianYears(activeRole!, {
          page,
          limit: rowsPerPage,
          year: searchName,
        })
      ).catch((error) => {
        ErrorSnackBar(error, enqueueSnackbar, translate);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, page, rowsPerPage, searchName]);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <ModalDialog
          styleContent={{ padding: '1em', backgroundColor: '#fff' }}
          isOpen={open}
          maxWidth="md"
          content={<AddNewGregorianYear onClose={handleCloseModal} />}
          onClose={handleCloseModal}
        />
        {/* <AddGregorianYearModal open={open} handleClose={handleCloseModal} /> */}
        <Grid item md={9} xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
            {translate('gregorian_year')}
          </Typography>
        </Grid>
        <Grid item md={3} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            variant="contained"
            sx={{ minWidth: 35, minHeight: 35 }}
            onClick={handleOpenModal}
          >
            {translate('_gregorian_year.button.add')}
          </Button>
        </Grid>
      </Grid>
      <Grid container display="flex" justifyContent={'space-between'} alignItems="center">
        <Grid item md={3} xs={12}>
          <Box display="flex" alignItems="flex-end">
            <SearchField
              data-cy="search_field"
              isLoading={loadingProps.isLoading}
              onReturnSearch={handleChange}
              reFetch={() => {
                handleChange('');
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Card sx={{ backgroundColor: '#fff', mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                data-cy="table-head-custom"
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={gregorian_years.length}
                numSelected={selected.length}
                onSort={onSort}
              />

              <TableBody>
                {loadingProps.isLoading
                  ? [...Array(rowsPerPage)].map((item, index) => (
                      <GregorianYearSkeleton key={index} sx={{ bgcolor: '#d9d9d9' }} />
                    ))
                  : [...gregorian_years].map((row) => (
                      <GregorianYearRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row?.id || '')}
                        onDelete={handleDelete}
                      />
                    ))}
                {!loadingProps.isLoading && gregorian_years.length === 0 && (
                  <TableNoData isNotFound={true} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            data-cy="table-pagination"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------
