import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import BaseField from './BaseField';
import { FormSingleProps } from 'components/FormGenerator';
import { Button, Grid } from '@mui/material';
import useLocales from 'hooks/useLocales';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import React, { useState, useEffect } from 'react';

const RHFRepeater = ({
  name,
  repeaterFields,
  enableAddButton,
  enableRemoveButton,
  ...other
}: FormSingleProps) => {
  const { control } = useFormContext();
  const { translate } = useLocales();

  const [disabledValue, setDisabledValue] = useState<boolean>(false);

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

  useEffect(() => {
    const reducedDisabled = repeaterFields
      ?.map((el) => (el.disabled ? el.disabled : false))
      .reduce((a, b) => a || b, false);

    setDisabledValue(reducedDisabled!);
  }, [repeaterFields]);

  return (
    <>
      {fields.map((field, index) => (
        <React.Fragment key={index}>
          {repeaterFields?.map((repeaterField, i) => (
            <React.Fragment key={i}>
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
            </React.Fragment>
          ))}
          {fields.length > 1 && enableRemoveButton && (
            <Grid item md={1} xs={12}>
              <IconButton
                sx={{ width: '100%', backgroundColor: 'red', color: '#fff', borderRadius: '10px' }}
                onClick={() => {
                  remove(index);
                }}
                disabled={disabledValue}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          )}
        </React.Fragment>
      ))}

      {enableAddButton && (
        <Grid item md={12}>
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
            disabled={disabledValue}
          >
            {translate('add_new_line')}
          </Button>
        </Grid>
      )}
    </>
  );
};

export default RHFRepeater;
