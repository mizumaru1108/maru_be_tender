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

type SortingCardTableProps = {
  isLoading?: boolean;
  onChangeSorting: (event: string) => void;
  sx?: SxProps<Theme>;
};

export default function SortingCardTable({
  isLoading,
  onChangeSorting,
  ...other
}: SortingCardTableProps) {
  const { translate } = useLocales();

  const handleSortingFilter = (event: any) => {
    const value = event.target.value as number;
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
    // console.log({ tmpFilter });
    onChangeSorting(tmpFilter);
    // if (!!tmpFilter) {
    // }
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 120, paddingBottom: 2 }}>
      <InputLabel htmlFor="grouped-select">{translate('sorting.label.sorting')}</InputLabel>
      <Select
        defaultValue={0}
        id="grouped-select"
        label="Sorting"
        onChange={handleSortingFilter}
        disabled={isLoading}
        {...other}
      >
        <MenuItem value={0}>
          {/* <em>None</em> */}
          {/* No Sorting */}
          {translate('sorting.label.no_sorting')}
        </MenuItem>
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
