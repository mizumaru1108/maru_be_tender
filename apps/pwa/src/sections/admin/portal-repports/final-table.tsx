import {
  Box,
  Card,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import EmptyContent from 'components/EmptyContent';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import axiosInstance from 'utils/axios';

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

interface Props {
  params: string;
  children?: React.ReactNode;
  selectedColums: string[];
}

export default function PortarReportsTable({ params, selectedColums, children }: Props) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState<any[]>([]);
  console.log({ selectedColums, tableData });

  const fetchingTableData = React.useCallback(async () => {
    setIsLoading(true);
    let url = `/tender-proposal/report-list`;
    if (params) {
      url = `${url}${params}`;
    }
    try {
      const res = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (res) {
        console.log('res', res.data.data);
        // const newArray = [...res.data.data].map((item) => {
        //   return selectedColums.reduce((obj: any, key: string) => {
        //     obj[key] = item.user[key] || item[key];
        //     return obj;
        //   }, {});
        // });
        const newArray = [...res.data.data].map((item) => {
          const tmpItem = { ...item };
          return selectedColums.reduce((obj: any, key: string) => {
            // console.log({ obj, key, item });
            let value = '';
            if (
              key !== 'email' &&
              key !== 'region' &&
              key !== 'governorate' &&
              key !== 'project_beneficiaries' &&
              key !== 'mobile_number' &&
              key !== 'bank_account_name' &&
              key !== 'bank_account_number' &&
              key !== 'bank_name' &&
              key !== 'execution_time'
            ) {
              value = item[key];
            } else {
              if (key === 'email' || key === 'mobile_number') {
                value = tmpItem.user[key];
              }
              if (key === 'region') {
                value = tmpItem?.region_detail?.name || tmpItem[key];
              }
              if (key === 'governorate') {
                value = tmpItem?.governorate_detail?.name || tmpItem[key];
              }
              if (key === 'project_beneficiaries') {
                value = tmpItem?.beneficiary_details.name || tmpItem[key];
              }
              if (
                key === 'bank_name' ||
                key === 'bank_account_name' ||
                key === 'bank_account_number'
              ) {
                if (key === 'bank_name') {
                  value = tmpItem?.bank_information?.bank_name || '-';
                }
                if (key === 'bank_account_name') {
                  value = tmpItem?.bank_information?.account_name || '-';
                }
                if (key === 'bank_account_number') {
                  value = tmpItem?.bank_information?.account_number || '-';
                }
              }
              if (key === 'execution_time') {
                value = tmpItem[key] ? String(Math.round(Number(tmpItem[key]) / 60)) : '-';
              }
            }
            obj[key] = value;
            return obj;
          }, {});
        });
        if (newArray) {
          setTableData(newArray);
        }
        console.log('newArray', newArray);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, params, selectedColums]);

  React.useEffect(() => {
    if (params !== '') {
      fetchingTableData();
    }
  }, [fetchingTableData, params]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;

  return (
    <>
      <Box>
        <Card sx={{ bgcolor: '#fff' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell>{'Id Number'}</StyledTableCell> */}
                  {selectedColums.map((item, index) => (
                    <StyledTableCell
                      sx={{ minWidth: 150 }}
                      key={index}
                      // align={item.align}
                      align="center"
                      data-cy={`${item}-${index}`}
                    >
                      {translate(`review.${item}`)}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <StyledTableBody>
                {tableData.length > 0
                  ? tableData.map((row, index) => (
                      <StyledTableRow key={index}>
                        {/* <StyledTableCell component="th" scope="row">
                          <Typography
                            noWrap={false}
                            data-cy={`contact_us_id-${index}`}
                            sx={{ fontWeight: 550 }}
                          >
                            test
                          </Typography>
                        </StyledTableCell> */}
                        {Object.entries(row).map(([key, value]: any, index) => (
                          <StyledTableCell key={index} component="th" align="center" scope="row">
                            <Typography
                              noWrap={false}
                              data-cy={`${key}-${index}`}
                              sx={{ fontWeight: 550 }}
                            >
                              {row[key]}
                            </Typography>
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))
                  : null}
              </StyledTableBody>
            </Table>
            {/* {tableData.length === 0 ? (
              <Stack display={'flex'} sx={{ backgroundColor: '#fff' }}>
                <EmptyContent
                  title="لا يوجد بيانات"
                  sx={{
                    '& span.MuiBox-root': { height: 160 },
                  }}
                />
              </Stack>
            ) : null} */}
            <Box sx={{ position: 'relative', backgroundColor: '#fff', height: 50 }} />
            {/* <TablePagination
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
              /> */}
            {/* </Box> */}
          </TableContainer>
        </Card>
      </Box>
      {children}
    </>
  );
}
