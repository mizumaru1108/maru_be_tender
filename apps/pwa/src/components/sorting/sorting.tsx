import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useState } from 'react';

export type onChangeSorting = {
  sorting_field: string;
  sort: string;
};

type SortingCardTableProps = {
  isLoading?: boolean;
  onChangeSorting?: (event: string) => void;
  newOnChangeSorting?: (event: onChangeSorting) => void;
  sx?: SxProps<Theme>;
  value?: string;
};

export default function SortingCardTable({
  isLoading,
  onChangeSorting,
  ...other
}: SortingCardTableProps) {
  const { translate } = useLocales();
  const [value, setValue] = useState<string>(other?.value || '-');
  // console.log({ value: other.value });

  const handleSortingFilter = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
    let tmpFilter = '';
    if (event.target.value === '-') {
      // old onChange version
      if (onChangeSorting) onChangeSorting(tmpFilter);

      // new onChange version
      if (other.newOnChangeSorting) {
        other.newOnChangeSorting({
          sorting_field: '',
          sort: '',
        });
      }
    } else {
      const tmpSortFilters = event.target.value.split('_');
      tmpFilter = `&sorting_field=${tmpSortFilters[0]}_${tmpSortFilters[1]}&sort=${tmpSortFilters[2]}`;
      // old onChange version
      if (onChangeSorting) onChangeSorting(tmpFilter);

      // new onChange version
      if (other.newOnChangeSorting) {
        other.newOnChangeSorting({
          sorting_field: `${tmpSortFilters[0]}_${tmpSortFilters[1]}`,
          sort: tmpSortFilters[2],
        });
      }
    }
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
        <MenuItem value={'-'}>{translate('sorting.label.no_sorting')}</MenuItem>
        <ListSubheader
          sx={{
            backgroundColor: '#fff',
          }}
        >
          {/* Project Name */}
          {translate('sorting.label.project_name')}
        </ListSubheader>
        <MenuItem value={'project_name_asc'}>{translate('sorting.label.ascending')}</MenuItem>
        <MenuItem value={'project_name_desc'}>{translate('sorting.label.descending')}</MenuItem>
        <ListSubheader
          sx={{
            backgroundColor: '#fff',
          }}
        >
          {/* Created At */}
          {translate('sorting.label.created_at')}
        </ListSubheader>
        <MenuItem value={'created_at_asc'}>{translate('sorting.label.ascending')}</MenuItem>
        <MenuItem value={'created_at_desc'}>{translate('sorting.label.descending')}</MenuItem>

        <ListSubheader
          sx={{
            backgroundColor: '#fff',
          }}
        >
          {/* Updated At */}
          {translate('sorting.label.updated_at')}
        </ListSubheader>
        <MenuItem value={'updated_at_asc'}>{translate('sorting.label.ascending')}</MenuItem>
        <MenuItem value={'updated_at_desc'}>{translate('sorting.label.descending')}</MenuItem>
      </Select>
    </FormControl>
  );
}
