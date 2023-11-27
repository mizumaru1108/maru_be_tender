// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Checkbox, Chip, TextField, Typography, useTheme } from '@mui/material';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
//
// ----------------------------------------------------------------------

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    padding: 14,
  };

  // console.log({ dataSet });
  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet.props} noWrap style={inlineStyle}>
      {`${dataSet.props.children[1]}`}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    // console.log({ children });
    const itemData: React.ReactChild[] = [];
    (children as React.ReactChild[]).forEach(
      (item: React.ReactChild & { children?: React.ReactChild[] }) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
      }
    );

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactChild) => {
      if (child.hasOwnProperty('group')) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);
    // console.log({ itemData, itemCount });
    // console.log('cek height:', getHeight() + 12);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            // height={300}
            height={getHeight() + 12}
            width="100%"
            style={{
              maxHeight: 300,
              overflow: 'auto',
              backgroundColor: '#fff',
            }}
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  }
);

//
export interface ComboBoxOption {
  label: string;
  value: string;
}

type IProps = {
  name: string;
  label: string;
  value?: ComboBoxOption[];
  placeholder?: string;
  disabled?: boolean;
  dataOption: ComboBoxOption[];
  limitTags?: number;
  isMultiple?: boolean;
  size?: 'small' | 'medium';
  onChange?: (option: ComboBoxOption[]) => void;
};

type Props = IProps;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function RHFComboBox({
  name,
  label,
  placeholder,
  value,
  disabled = false,
  isMultiple = true,
  dataOption,
  limitTags = 2,
  size = 'medium',
  onChange,
  ...other
}: Props) {
  const { control, setValue, getValues, watch } = useFormContext();
  const theme = useTheme();
  const tmpValues = watch(name);
  // const [searchName, setSearchName] = React.useState('');
  // const debouncedValue = useDebounce<string>(searchName || '', 500);
  const handleOnChange = (option: ComboBoxOption) => {
    const tmpFieldValue: ComboBoxOption[] = getValues(name) || [];
    if (tmpValues && isMultiple) {
      const findIndex = tmpValues.findIndex((item: ComboBoxOption) => item.value === option.value);
      if (findIndex > -1) {
        tmpFieldValue.splice(findIndex, 1);
      } else {
        tmpFieldValue.push(option);
      }
    }
    if (isMultiple) {
      setValue(name, tmpFieldValue);
      if (onChange) {
        onChange(tmpFieldValue);
      }
    } else {
      setValue(name, option);
      if (onChange) {
        onChange([option]);
      }
    }
  };

  React.useEffect(() => {
    if (value && Array.isArray(value) && value.length > 0 && isMultiple) {
      setValue(name, value);
    }
    if (!isMultiple) {
      setValue(name, {
        label: '',
        value: '',
      });
    }
  }, [value, name, setValue, isMultiple]);
  // const chungkedArray = chunkArray([...dataOption], 5);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...other}
          disabled={disabled}
          multiple={isMultiple}
          options={
            dataOption || [
              {
                label: placeholder || 'Select',
                value: '',
              },
            ]
          }
          limitTags={limitTags}
          disableCloseOnSelect
          ListboxComponent={dataOption && dataOption.length > 0 ? ListboxComponent : undefined}
          getOptionLabel={(option) => option.label}
          onChange={(data, option, reason, details) => {
            if (details && details.option) {
              handleOnChange(details.option as ComboBoxOption);
            }
          }}
          value={tmpValues || []}
          renderTags={() => {
            const tags: ComboBoxOption[] = [...tmpValues];
            return tags.map((option: ComboBoxOption, index: number) => (
              <Chip
                disabled={disabled}
                label={`${option.label}`}
                key={index}
                onDelete={() => handleOnChange(option)}
              />
            ));
          }}
          // ListboxComponent
          renderOption={(props, option, { selected }) => {
            let isSelected = false;
            const tmpOption = option as ComboBoxOption;
            if (tmpValues && tmpValues.length > 0) {
              const findIndex = tmpValues.findIndex(
                (item: ComboBoxOption) => item.value === tmpOption.value
              );
              if (findIndex > -1) {
                isSelected = true;
              } else {
                isSelected = false;
              }
            }
            return (
              <li {...props} key={option.value}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={isSelected}
                />
                {option.label}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!error}
              helperText={
                <Typography
                  component="span"
                  sx={{ backgroundColor: 'transparent', fontSize: '12px' }}
                >
                  {error?.message}
                </Typography>
              }
              label={label}
              size={size}
              placeholder={placeholder}
              disabled={disabled}
              sx={{
                '& > .MuiFormHelperText-root': {
                  backgroundColor: 'transparent',
                },
                ...(!disabled && {
                  '& label.Mui-focused': {
                    color: theme.palette.grey[800],
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.grey[800],
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'inherit',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }),
              }}
            />
          )}
        />
      )}
    />
  );
}
