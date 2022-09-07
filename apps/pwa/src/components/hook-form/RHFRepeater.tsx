import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import BaseField from './BaseField';
import { FormSingleProps } from 'components/FormGenerator';
import { Button, Grid } from '@mui/material';
import useLocales from 'hooks/useLocales';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const RHFRepeater = ({ name, repeaterFields, ...other }: FormSingleProps) => {
  const { control } = useFormContext();
  const { translate } = useLocales();

  const { fields, append, remove } = useFieldArray({
    control,
    name: name ?? '',
  });

  const cleanField = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...restFields } = fields[0];
    const keys = Object.keys(restFields);
    const result = {} as any;
    for (let key of keys) {
      result[key] = '';
    }
    return result;
  };
  return (
    <>
      {fields.map((field, index) => (
        <>
          {repeaterFields?.map((repeaterField, i) => (
            <>
              <Controller
                key={index}
                name={`${name}[${index}].${repeaterField.name}`}
                control={control}
                render={({ field, fieldState: { error } }: any) => (
                  <Grid item md={repeaterField.md} xs={repeaterField.xs} key={i}>
                    <BaseField
                      {...repeaterField}
                      {...other}
                      name={`${name}[${index}].${repeaterField.name}`}
                    />
                  </Grid>
                )}
              />
            </>
          ))}
          {fields.length > 1 && (
            <Grid item md={1} xs={12}>
              <IconButton
                sx={{ width: '100%', backgroundColor: 'red', color: '#fff', borderRadius: '10px' }}
                onClick={() => {
                  remove(index);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          )}
        </>
      ))}

      <Grid item md={11} xs={12}>
        <Button
          type="button"
          sx={{
            width: '100%',
            color: '#93A3B0',
            borderRadius: '10px',
            border: `1.5px dashed`,
          }}
          onClick={() => {
            append(cleanField());
          }}
        >
          {translate('add_new_line')}
        </Button>
      </Grid>
    </>
  );
};

export default RHFRepeater;
