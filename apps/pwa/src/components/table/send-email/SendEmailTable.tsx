import { useEffect, useState } from 'react';
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

const TABLE_HEAD = [
  { id: 'employee_name', label: 'email_to_client.headercell.employee_name' },
  {
    id: 'email_content',
    label: 'email_to_client.headercell.email_content',
    align: 'left',
  },
  { id: 'events', label: 'client_list_headercell.events', align: 'left' },
];

const sampleData: EmailToClient[] = [
  {
    id: '1',
    employee_name: 'maru ichi',
    email_content: 'testing content',
  },
  {
    id: '2',
    employee_name: 'maru ni',
    email_content: 'testing content',
  },
];

export default function SendEmailTable() {
  const { dense, page, rowsPerPage, total, setTotal, onChangePage, onChangeRowsPerPage } =
    useTable();

  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState<EmailToClient[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const getDataClient = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`tender-proposal/old/list`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (response.data.statusCode === 200) {
        const tmpTableData: EmailToClient[] = response.data.data.map((item: EmailToClient) => {
          const tmpItem = item;
          return {
            id: tmpItem.id,
            employee_name: tmpItem.employee_name,
            email_content: tmpItem.email_content,
          };
        });
        setTableData(tmpTableData);
        setTotal(response.data.total as number);
        setIsLoading(false);
      }
      return response.data;
    } catch (error) {
      setIsLoading(false);
      return <>...Opss, something went wrong</>;
    }
  };

  // useEffect(() => {
  //   getDataClient();
  // }, [page, rowsPerPage]);

  useEffect(() => {
    // getDataClient();
    setTableData(sampleData);
    setTotal(2);
  }, [setTotal]);

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
        <Typography variant="h3">{translate('email_to_client.page_title')}</Typography>
        <Button
          sx={{
            py: '10px',
            flex: 0.2,
            backgroundColor: '#0E8478',
            maxWidth: 175,
            color: '#fff',
            ':hover': { backgroundColor: '#13B2A2' },
          }}
          onClick={() => {
            navigate(`/${role_url_map[activeRole!]}/dashboard/send-email/new`);
          }}
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
                  : tableData.map((row) => <SendEmailTableRow key={row.id} row={row} />)}
                {!isLoading && tableData.length === 0 && (
                  <EmptyContent
                    title="لا يوجد بيانات"
                    sx={{
                      '& span.MuiBox-root': { height: 160 },
                    }}
                  />
                )}
              </TableBody>
            </Table>
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
