// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography, useTheme } from '@mui/material';
import useLocales from '../../hooks/useLocales';
import ReactQuill from 'react-quill';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  placeholder?: string;
};

type Props = IProps & TextFieldProps;
export default function RHFRichText({ name, placeholder, ...other }: Props) {
  const theme = useTheme();
  const { currentLang } = useLocales();

  const { control, watch } = useFormContext();
  // console.log({ text: watch(name) });
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <ReactQuill
            {...field}
            theme="snow"
            placeholder={placeholder ? placeholder : undefined}
            style={{
              borderRadius: '5px',
              border: !!error ? '0.1rem solid #FF4842' : `0.1rem solid ${theme.palette.grey[800]}`,
            }}
          />
          {!!error && (
            <Typography color="error" fontSize={'0.75rem'}>
              {error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
}
