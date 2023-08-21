import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Card, Stack, TablePagination, Typography } from '@mui/material';
import useLocales from '../../../../hooks/useLocales';
import useAuth from '../../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../../utils/axios';
import EmptyContent from '../../../EmptyContent';
import { generateHeader } from '../../../../utils/generateProposalNumber';
import dayjs from 'dayjs';
import { formatCapitalizeText } from '../../../../utils/formatCapitalizeText';
import { ICustomHeaderCell } from './contact-us';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0E8478',
    color: theme.palette.common.white,
    boxShadow: 'none',
    borderRadius: 0,
    fontWeight: 700,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    lineHeight: '24px',
    fontWeight: 500,
    fontSize: 14,
  },
}));

const StyledTableBody = styled(TableBody)(({ theme }) => ({
  backgroundColor: '#fff',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// function createData(name: string, calories: number, fat: number, carbs: number) {
//   return { name, calories, fat, carbs };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24),
//   createData('Ice cream sandwich', 237, 9.0, 37),
//   createData('Eclair', 262, 16.0, 24),
//   createData('Cupcake', 305, 3.7, 67),
//   createData('Gingerbread', 356, 16.0, 49),
// ];

const CustomHeaderCell: ICustomHeaderCell[] = [
  {
    value: 'contact_support.table.headerCell.number',
    label: 'contact_support.table.headerCell.number',
    align: 'left',
  },
  // {
  //   value: 'contact_support.table.headerCell.id_number',
  //   label: 'contact_support.table.headerCell.id_number',
  //   align: 'left',
  // },
  {
    value: 'contact_support.table.headerCell.inquiry_type',
    label: 'contact_support.table.headerCell.inquiry_type',
    align: 'left',
  },
  {
    value: 'contact_support.table.headerCell.date_of_visit',
    label: 'contact_support.table.headerCell.date_of_visit',
    align: 'left',
  },
  {
    value: 'contact_support.table.headerCell.reason_of_visit',
    label: 'contact_support.table.headerCell.reason_of_visit',
    align: 'left',
  },
];

interface ContactUsTableData {
  created_at?: Date;
  udpated_at?: Date;
  contact_us_id?: string;
  inquiry_type?: string;
  title?: string;
  message?: string;
  date_of_visit?: null;
  visit_reason?: null;
  submitter_user_id?: string;
  proposal_id?: string;
  updated_at?: Date;
}

export default function BaseContactSupportTable() {
  const [total, setTotal] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState<ContactUsTableData[]>([]);
  // console.log({ page });
  const fetchingData = React.useCallback(async () => {
    setIsLoading(true);
    const tmpPage = page + 1;
    // const url = `/contact-us?inquiry_type=GENERAL,VISITATION&page=${tmpPage}&limit=${rowsPerPage}`;
    const url = `/contact-us?page=${tmpPage}&limit=${rowsPerPage}`;
    try {
      const response = await axiosInstance.get(`${url}`, {
        headers: { 'x-hasura-role': activeRole! },
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
      setError(true);
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

  React.useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ marginBottom: '50px' }}>
        {translate('contact_us')}
      </Typography>
      <Card sx={{ bgcolor: '#fff' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>{'Id Number'}</StyledTableCell> */}
                {CustomHeaderCell.map((item, index) => (
                  <StyledTableCell
                    sx={{ minWidth: 150 }}
                    key={index}
                    align={item.align}
                    data-cy={`${item.label}-${index}`}
                  >
                    {translate(item.label)}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <StyledTableBody>
              {tableData.length > 0
                ? tableData.map((row, index) => (
                    <StyledTableRow key={row.title}>
                      <StyledTableCell component="th" scope="row">
                        <Typography noWrap={false} data-cy={`contact_us_id-${index}`}>
                          {/* {row.contact_us_id ? generateHeader(row.contact_us_id) : '-'} */}
                          {row.contact_us_id ? generateHeader(rowsPerPage * page + index + 1) : '-'}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography noWrap={false} data-cy={`inquiry_type-${index}`}>
                          {/* {row?.inquiry_type ? formatCapitalizeText(row?.inquiry_type) : '-'} */}
                          {row?.inquiry_type
                            ? translate(
                                `contact_support.table.tableRow.inquiry_type.${row?.inquiry_type.toUpperCase()}`
                              )
                            : '-'}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography noWrap={false} data-cy={`date_of_visit-${index}`}>
                          {row?.date_of_visit
                            ? dayjs(row?.date_of_visit).format('YYYY-MM-DD')
                            : '-'}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography noWrap={false} data-cy={`visit_reason-${index}`}>
                          {row?.visit_reason ? formatCapitalizeText(row?.visit_reason) : '-'}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                : null}
            </StyledTableBody>
          </Table>
          {tableData.length === 0 ? (
            <Stack display={'flex'} sx={{ backgroundColor: '#fff' }}>
              <EmptyContent
                title="لا يوجد بيانات"
                sx={{
                  '& span.MuiBox-root': { height: 160 },
                }}
              />
            </Stack>
          ) : null}
          <Box sx={{ position: 'relative', backgroundColor: '#fff' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => {
                // console.log({ newPage });
                if (!!newPage) {
                  setPage(Number(newPage));
                } else {
                  setPage(0);
                }
              }}
              onRowsPerPageChange={(e) => {
                // console.log(e);
                if (e.target.value) {
                  setRowsPerPage(Number(e.target.value));
                }
              }}
            />
          </Box>
        </TableContainer>
      </Card>
    </Box>
  );
}
