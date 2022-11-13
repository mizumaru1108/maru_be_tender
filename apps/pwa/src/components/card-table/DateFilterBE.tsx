import { Box, Stack, TextField } from '@mui/material';
import React from 'react';
import { whereFilterGenerator } from 'utils/whereFilterGenerator';

type Props = {
  setFiltersStateObjectArray: (data: any) => void;
  filtersStateObjectArray: {};
  setParams: (data: any) => void;
};
function DateFilterBE({ setFiltersStateObjectArray, filtersStateObjectArray, setParams }: Props) {
  const onStartDateChanege = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredDate = event.target.value;
    setFiltersStateObjectArray((prevValue: any) => ({
      ...prevValue,
      start_time: { created_at: { _gte: enteredDate } },
    }));
    let filterArray = Object.keys(filtersStateObjectArray).map((item: any, index) => {
      if (item !== 'start_time') return (filtersStateObjectArray as any)[item];
      return { created_at: { _gte: enteredDate } };
    });
    (filtersStateObjectArray as any).start_time === undefined &&
      filterArray.push({ created_at: { _gte: enteredDate } });
    let where = whereFilterGenerator(filterArray);
    setParams((prevParams: any) => ({
      ...prevParams,
      where,
    }));
  };

  const onEndDateChanege = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredDate = event.target.value;
    setFiltersStateObjectArray((prevValue: any) => ({
      ...prevValue,
      end_time: { created_at: { _lte: enteredDate } },
    }));
    let filterArray = Object.keys(filtersStateObjectArray).map((item: any, index) => {
      if (item !== 'end_time') return (filtersStateObjectArray as any)[item];
      return { created_at: { _lte: enteredDate } };
    });
    filterArray.push({ created_at: { _lte: enteredDate } });
    let where = whereFilterGenerator(filterArray);
    setParams((prevParams: any) => ({
      ...prevParams,
      where,
    }));
  };

  return (
    <Stack direction="row" flex={0.5}>
      <TextField type="date" onChange={onStartDateChanege} />
      <Box sx={{ padding: '15px' }}>-</Box>
      <TextField type="date" onChange={onEndDateChanege} />
    </Stack>
  );
}

export default DateFilterBE;
