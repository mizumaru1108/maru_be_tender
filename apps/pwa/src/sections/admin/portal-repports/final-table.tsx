import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
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
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React, { useRef } from 'react';
import axiosInstance from 'utils/axios';
import { utils, writeFile } from 'xlsx';

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
  selectedColums: string[];
  onReturn: () => void;
}

export default function PortarReportsTable({ params, selectedColums, onReturn }: Props) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState<any[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);
  // console.log({ selectedColums });

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
        // console.log('res', res.data.data);
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
                value = tmpItem?.region_detail?.name || tmpItem[key] || '-';
              }
              if (key === 'governorate') {
                value = tmpItem?.governorate_detail?.name || tmpItem[key] || '-';
              }
              if (key === 'project_beneficiaries') {
                value = tmpItem?.beneficiary_details?.name || tmpItem[key] || '-';
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
                  value = tmpItem?.bank_information?.bank_account_name || '-';
                }
                if (key === 'bank_account_number') {
                  value = tmpItem?.bank_information?.bank_account_number || '-';
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
        // console.log('newArray', newArray);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, params, selectedColums]);

  const handleExportXLSX = async () => {
    // console.log('export', tableData);
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(tableData);

    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    /* export to XLSX */
    writeFile(wb, `proposal_report_${dayjs(new Date()).format('YYMMDDHHmmss')}.xlsx`);
  };

  React.useEffect(() => {
    if (params !== '') {
      fetchingTableData();
    }
  }, [fetchingTableData, params]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;

  return (
    <>
      <Box>
        {/* <Stack>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary" size="medium">
                {translate('pages.finance.payment_generate.heading.print_out_data')}
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Stack> */}
        <Card
          sx={{
            bgcolor: '#fff',
            // '@media print': {
            //   // transform: 'scale(0.8)',
            //   // transformOrigin: 'top left',

            //   // width: '100vw',
            //   // translate: '0 0',
            //   // height: '100vh',
            //   // display: 'block !important',
            //   // breakInside: 'avoid',
            //   // overflow: 'visible !important',
            //   // padding: 9,
            // },
          }}
        >
          <TableContainer
            component={Paper}
            ref={componentRef}
            sx={{
              '@media print': {
                overflow: 'visible !important',
                // transform: 'scale(0.9)',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                // translate: '0 0',
              },
            }}
          >
            <Table aria-label="customized table">
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
          </TableContainer>
        </Card>
      </Box>
      {/* {children} */}
      <Stack direction="row" justifyContent="center" sx={{ marginTop: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 2,
            backgroundColor: '#fff',
            padding: '24px',
          }}
        >
          <LoadingButton
            onClick={onReturn}
            sx={{
              color: 'text.primary',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            {translate('going_back_one_step')}
          </LoadingButton>
          <Box sx={{ width: '10px' }} />
          <LoadingButton
            onClick={handleExportXLSX}
            type="submit"
            variant="outlined"
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
              '&:hover': { backgroundColor: '#0E8478' },
            }}
          >
            {translate('export')}
          </LoadingButton>
        </Box>
      </Stack>
    </>
  );
}
