import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import Scrollbar from 'components/Scrollbar';
import { TableHeadCustom } from 'components/table';
import { EmailToClient } from 'components/table/send-email/types';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import useTable from 'hooks/useTable';
import axiosInstance from 'utils/axios';
import TableSkeleton from '../TableSkeleton';
import SendEmailTableRow from './SendEmailTableRow';
import { useNavigate } from 'react-router';
import Iconify from 'components/Iconify';
import { role_url_map } from '../../../@types/commons';
import { useSnackbar } from 'notistack';

const TABLE_HEAD = [
  { id: 'employee_name', label: 'email_to_client.headercell.employee_name' },
  {
    id: 'email_content',
    label: 'email_to_client.headercell.email_content',
    align: 'left',
  },
  {
    id: 'created_at',
    label: 'email_to_client.headercell.created_at',
    align: 'left',
  },
  { id: 'events', label: 'client_list_headercell.events', align: 'left' },
];

// const sampleData: EmailToClient[] = [
//   {
//     id: '1',
//     employee_name: 'maru ichi',
//     email_content: 'testing content',
//   },
//   {
//     id: '2',
//     employee_name: 'maru ni',
//     email_content: 'testing content',
//   },
// ];

export default function SendEmailTable() {
  const { dense, page, rowsPerPage, total, setTotal, onChangePage, onChangeRowsPerPage } =
    useTable();

  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState<EmailToClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchingData = useCallback(async () => {
    try {
      setIsLoading(true);
      const tmpPage = page + 1;
      const url = `/tender/email-records`;
      const response = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
        params: {
          page: tmpPage,
          limit: rowsPerPage,
          include_relations: 'sender,receiver',
        },
      });
      if (response && response.data) {
        if (response.data.total) {
          setTotal(response.data.total);
        }
        if (response.data.data) {
          // console.log('test data:', response.data.data);
          setTableData(response.data.data);
        }
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
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, page, rowsPerPage]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  return (
    <Box>
      <Button
        color="inherit"
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{ p: 1, minWidth: 35, minHeight: 35, mr: 3, mb: 2 }}
      >
        <Iconify
          icon={
            currentLang.value === 'en'
              ? 'eva:arrow-ios-back-outline'
              : 'eva:arrow-ios-forward-outline'
          }
          width={35}
          height={35}
        />
      </Button>
      <Stack
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginBottom: 5,
        }}
      >
        <Typography variant="h4">{translate('email_to_client.page_title')}</Typography>
        <Button
          onClick={() => {
            navigate(`/${role_url_map[activeRole!]}/dashboard/send-email/new`);
          }}
          size="small"
          variant="contained"
        >
          {translate('email_to_client.button.add_new')}
        </Button>
      </Stack>
      <Card sx={{ backgroundColor: '#fff', mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {isLoading
                  ? [...Array(rowsPerPage)].map((item, index) => <TableSkeleton key={index} />)
                  : tableData.map((row) => (
                      <SendEmailTableRow key={row.email_record_id} row={row} />
                    ))}
              </TableBody>
            </Table>
            {!isLoading && tableData.length === 0 && (
              <EmptyContent
                title="لا يوجد بيانات"
                sx={{
                  '& span.MuiBox-root': { height: 160 },
                }}
              />
            )}
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
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
