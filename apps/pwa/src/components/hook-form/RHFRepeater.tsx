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
  buttonRepeaterLabel,
  ...other
}: FormSingleProps) => {
  const { control, watch, setValue } = useFormContext();
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

  const isObjectEmpty = (obj: any) => {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
        return false;
      }
    }
    return true;
  };

  const objectEmpty = (obj: any, index: number) => {
    for (let key in obj) {
      setValue(`${name}[${index}].${key}`, '');
    }
  };

  const handleDelete = (index: number) => {
    remove(index);
    objectEmpty(watch(`${name}`)[index], index);
  };

  const watchAll = watch();
  const watchName = watch(`${name}`);
  const lastIndex = fields.length - 1;
  const allDataFill = isObjectEmpty(watchName[lastIndex]);
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
                      disabled={repeaterField.disabled ? true : false}
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
                  // make after remove array, clear it value of it delete witch match the index
                  // remove(index);
                  handleDelete(index);
                }}
                disabled={disabledValue}
                // disabled={other.disabled}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          )}
        </React.Fragment>
      ))}

      {allDataFill && enableAddButton && (
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
            // disabled={other.disabled}
          >
            {buttonRepeaterLabel ? buttonRepeaterLabel : translate('add_new_line')}
          </Button>
        </Grid>
      )}
    </>
  );
};

export default RHFRepeater;
