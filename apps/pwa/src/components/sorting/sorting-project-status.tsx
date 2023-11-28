import { FormControl, InputLabel, MenuItem, Select, SxProps, Theme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider } from '../hook-form';
import RHFComboBox, { ComboBoxOption } from '../hook-form/RHFComboBox';

const OPTIONS = [
  'COMPLETED',
  'PENDING',
  'CANCELED',
  'ONGOING',
  'ON_REVISION',
  // 'ASKED_FOR_AMANDEMENT',
  'ASKED_FOR_AMANDEMENT_PAYMENT',
];

type SortingCardTableProps = {
  isLoading?: boolean;
  value?: string;
  sx?: SxProps<Theme>;
  type?: 'single' | 'multiple';
  onChangeSorting: (event: string) => void;
};

type FormMultipleFilter = {
  outter_status: ComboBoxOption[];
};

export default function SortingProjectStatusCardTable({
  isLoading,
  onChangeSorting,
  type = 'single',
  ...other
}: SortingCardTableProps) {
  const { translate } = useLocales();

  const defaultValue = useMemo(() => {
    let value: ComboBoxOption[] = [];
    const strings = other?.value?.split(',') || [];
    if (strings && !strings.includes('-')) {
      value = strings.map((item) => ({
        label: translate(`portal_report.outter_status.${item.toLowerCase()}`),
        value: item,
      }));
    }
    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [other.value]);

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

  const handleMultipleSortingFilter = (event: ComboBoxOption[]) => {
    const value = event.map((item) => item.value).join(',');
    let tmpFilter = '';
    if (!!value) {
      tmpFilter = `&outter_status=${value}`;
    } else {
      tmpFilter = '';
    }
    onChangeSorting(tmpFilter);
  };

  const methods = useForm<FormMultipleFilter>({
    defaultValues: {
      outter_status: type === 'multiple' ? defaultValue : [],
    },
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: FormMultipleFilter) => {
    const tmpFilter = `&outter_status=${data.outter_status.map((item) => item.value).join(',')}`;
    onChangeSorting(tmpFilter);
  };

  if (type === 'single')
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFComboBox
        isMultiple={true}
        size={'medium'}
        name={`outter_status`}
        label={translate('sorting.label.outter_status')}
        placeholder={translate('sorting.label.no_value')}
        dataOption={OPTIONS.map((option) => ({
          label: translate(`portal_report.outter_status.${option.toLowerCase()}`),
          value: option,
        }))}
        onChange={handleMultipleSortingFilter}
      />
    </FormProvider>
  );
}
