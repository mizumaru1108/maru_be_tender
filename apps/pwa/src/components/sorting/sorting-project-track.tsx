import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useSelector } from 'redux/store';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';

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
};

export default function SortingProjectTrackCardTable({
  isLoading,
  onChangeSorting,
  ...other
}: SortingCardTableProps & SelectProps) {
  const { translate } = useLocales();

  const { track_list } = useSelector((state) => state.proposal);

  const handleSortingFilter = (event: any) => {
    const value = event.target.value as string;
    let tmpFilter = '&track_id=';
    if (value !== '-') {
      tmpFilter = `&track_id=${value}`;
    } else {
      tmpFilter = '';
    }
    onChangeSorting(tmpFilter);
  };

  return (
    <FormControl fullWidth sx={{ minWidth: 120, paddingBottom: 2 }}>
      <InputLabel htmlFor="grouped-select">{translate('sorting.label.project_tracks')}</InputLabel>
      <Select
        defaultValue="-"
        id="grouped-select"
        label={translate('sorting.label.project_tracks')}
        onChange={handleSortingFilter}
        disabled={isLoading}
        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
        {...other}
      >
        <MenuItem value="-">
          {/* No Sorting */}
          {translate('sorting.label.no_value')}
        </MenuItem>
        {track_list &&
          track_list?.map((option, index) => (
            <MenuItem key={index} value={option.id}>
              {formatCapitalizeText(option.name)}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
