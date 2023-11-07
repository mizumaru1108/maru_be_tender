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
import React, { useState } from 'react';

type SortingCardTableProps = {
  isLoading?: boolean;
  onChangeSorting: (event: string) => void;
  sx?: SxProps<Theme>;
  value?: number;
};

export default function SortingCardTable({
  isLoading,
  onChangeSorting,
  ...other
}: SortingCardTableProps) {
  const { translate } = useLocales();
  const [value, setValue] = useState<number>((other.value as number) || 0);

  const handleSortingFilter = (event: any) => {
    const value = event.target.value as number;
    setValue(value);
    let tmpFilter = '';
    if (value < 3) {
      tmpFilter = '&sorting_field=project_name';
      if (value === 1) {
        tmpFilter = '&sorting_field=project_name&sort=asc';
      } else {
        if (event.target.value === '') {
          tmpFilter = '';
        } else {
          tmpFilter = '&sorting_field=project_name&sort=desc';
        }
      }
    } else {
      if (value === 3) {
        tmpFilter = '&sort=asc';
      } else {
        tmpFilter = '&sort=desc';
      }
    }
    onChangeSorting(tmpFilter);
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 120, paddingBottom: 2 }}>
      <InputLabel htmlFor="grouped-select">{translate('sorting.label.sorting')}</InputLabel>
      <Select
        id="grouped-select"
        label="Sorting"
        onChange={handleSortingFilter}
        disabled={isLoading}
        {...other}
        value={value}
      >
        <MenuItem value={0}>{translate('sorting.label.no_sorting')}</MenuItem>
        <ListSubheader
          sx={{
            backgroundColor: '#fff',
          }}
        >
          {/* Project Name */}
          {translate('sorting.label.project_name')}
        </ListSubheader>
        <MenuItem value={1}>{translate('sorting.label.ascending')}</MenuItem>
        <MenuItem value={2}>{translate('sorting.label.descending')}</MenuItem>
        <ListSubheader
          sx={{
            backgroundColor: '#fff',
          }}
        >
          {/* Created At */}
          {translate('sorting.label.created_at')}
        </ListSubheader>
        <MenuItem value={3}>{translate('sorting.label.ascending')}</MenuItem>
        <MenuItem value={4}>{translate('sorting.label.descending')}</MenuItem>
      </Select>
    </FormControl>
  );
}
