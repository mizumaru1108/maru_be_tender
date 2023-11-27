import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { FormProvider } from '../hook-form';
import RHFComboBox, { ComboBoxOption } from '../hook-form/RHFComboBox';

type SortingCardTableProps = {
  isLoading?: boolean;
  value?: string;
  type?: 'single' | 'multiple';
  onChangeSorting: (event: string) => void;
};

type FormMultipleFilter = {
  track_id: ComboBoxOption[];
};

export default function SortingProjectTrackCardTable({
  isLoading,
  onChangeSorting,
  type = 'single',
  ...other
}: SortingCardTableProps & SelectProps) {
  const { translate } = useLocales();

  const { track_list } = useSelector((state) => state.proposal);

  const defaultValue = useMemo(() => {
    let value: ComboBoxOption[] = [];
    const strings = other?.value?.split(',') || [];
    if (strings && !strings.includes('-')) {
      value = strings.map((item) => ({
        label: formatCapitalizeText(track_list.find((track) => track.id === item)?.name || '-'),
        value: item,
      }));
    }
    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [other.value]);

  console.log({ defaultValue });

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

  const handleMultipleSortingFilter = (event: ComboBoxOption[]) => {
    const value = event.map((item) => item.value).join(',');
    let tmpFilter = '';
    if (!!value) {
      tmpFilter = `&track_id=${value}`;
    } else {
      tmpFilter = '';
    }
    onChangeSorting(tmpFilter);
  };

  const methods = useForm<FormMultipleFilter>({
    defaultValues: {
      track_id: type === 'multiple' ? defaultValue : [],
    },
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: FormMultipleFilter) => {
    const tmpFilter = `&outter_status=${data.track_id.map((item) => item.value).join(',')}`;
    onChangeSorting(tmpFilter);
  };

  if (type === 'single')
    return (
      <FormControl fullWidth sx={{ minWidth: 120, paddingBottom: 2 }}>
        <InputLabel htmlFor="grouped-select">
          {translate('sorting.label.project_tracks')}
        </InputLabel>
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFComboBox
        isMultiple={true}
        size={'medium'}
        name={`track_id`}
        label={translate('sorting.label.project_tracks')}
        placeholder={translate('sorting.label.no_value')}
        dataOption={
          track_list?.map((option) => ({
            label: formatCapitalizeText(option?.name || ''),
            value: option?.id || '',
          })) || []
        }
        onChange={handleMultipleSortingFilter}
      />
    </FormProvider>
  );
}
