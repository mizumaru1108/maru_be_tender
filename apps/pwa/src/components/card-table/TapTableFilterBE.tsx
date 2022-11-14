import { Tab, Tabs, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { whereFilterGenerator } from 'utils/whereFilterGenerator';

type Props = {
  setParams: (data: any) => void;
  taps: any;
  filtersStateObjectArray: any;
  setFiltersStateObjectArray: (data: any) => void;
};

function TapTableFilterBE({
  setParams,
  taps,
  setFiltersStateObjectArray,
  filtersStateObjectArray,
}: Props) {
  const [activeTap, setActiveTap] = useState(0);

  const theme = useTheme();

  const handleTapChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTap(newValue);
    setFiltersStateObjectArray((prevValue: any) => ({
      ...prevValue,
      [taps.key]: taps.options[newValue].value,
    }));
    let filterArray = Object.keys(filtersStateObjectArray).map((item: any, index) => {
      if (item !== taps.key) return (filtersStateObjectArray as any)[item];
      return taps.options[newValue].value;
    });
    (filtersStateObjectArray as any)[taps.key] === undefined &&
      filterArray.push(taps.options[newValue].value);
    let where = whereFilterGenerator(filterArray);
    setParams((prevParams: any) => ({
      ...prevParams,
      where,
    }));
  };

  return (
    <Tabs indicatorColor="primary" textColor="inherit" value={activeTap} onChange={handleTapChange}>
      {taps.options.map((item: any, index: any) => (
        <Tab
          key={index}
          label={item.label}
          sx={{
            borderRadius: 0,
            px: 3,
            '&.MuiTab-root:not(:last-of-type)': {
              marginRight: 0,
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        />
      ))}
    </Tabs>
  );
}

export default TapTableFilterBE;
