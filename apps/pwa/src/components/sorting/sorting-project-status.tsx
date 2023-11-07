import { StyledProps } from '@material-ui/styles';
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SxProps,
  Theme,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import React from 'react';

const OPTIONS = [
  'COMPLETED',
  'PENDING',
  'CANCELED',
  'ONGOING',
  'ON_REVISION',
  'ASKED_FOR_AMENDMENT',
  'ASKED_FOR_AMENDMENT_PAYMENT',
];

type SortingCardTableProps = {
  isLoading?: boolean;
  onChangeSorting: (event: string) => void;
  value?: string;
  sx?: SxProps<Theme>;
};

export default function SortingProjectStatusCardTable({
  isLoading,
  onChangeSorting,
  ...other
}: SortingCardTableProps) {
  const { translate } = useLocales();

  const handleSortingFilter = (event: any) => {
    const value = event.target.value as string;
    let tmpFilter = '&outter_status=';
    if (value !== '-') {
      tmpFilter = `&outter_status=${value.toUpperCase()}`;
    } else {
      tmpFilter = '';
    }
    onChangeSorting(tmpFilter);
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 120, paddingBottom: 2 }}>
      <InputLabel htmlFor="grouped-select">{translate('sorting.label.outter_status')}</InputLabel>
      <Select
        defaultValue="-"
        id="grouped-select"
        label={translate('sorting.label.outter_status')}
        onChange={handleSortingFilter}
        disabled={isLoading}
        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
        {...other}
      >
        <MenuItem value="-">
          {/* No Sorting */}
          {translate('sorting.label.no_value')}
        </MenuItem>
        {OPTIONS.map((option, index) => (
          <MenuItem key={index} value={option}>
            {translate(`portal_report.outter_status.${option.toLowerCase()}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
