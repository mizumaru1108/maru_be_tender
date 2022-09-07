import React from 'react';
import { Grid } from '@mui/material';
import BaseField from './hook-form/BaseField';

// ----------------------------------------------------------------------

type FieldType =
  | 'select'
  | 'datePicker'
  | 'textField'
  | 'upload'
  | 'uploadLabel'
  | 'textArea'
  | 'repeater'
  | 'checkbox';

// ----------------------------------------------------------------------

export interface FormSingleProps {
  type?: FieldType;
  name?: string;
  label?: string;
  md?: number;
  xs?: number;
  placeholder?: string;
  children?: React.ReactNode;
  repeaterFields?: FormSingleProps[];
}

// ----------------------------------------------------------------------

export interface Props {
  data: FormSingleProps[];
}

const FormGenerator = ({ data }: Props) => (
  <>
    {data.map((element: FormSingleProps) => {
      if (!element.md) element.md = 0;
      if (!element.xs) element.xs = 0;
      return (
        <>
          {element.type !== 'repeater' && (
            <Grid item md={element.md} xs={element.xs}>
              <BaseField {...element} />
            </Grid>
          )}
          {element.type === 'repeater' && <BaseField {...element} />}
        </>
      );
    })}
  </>
);

export default FormGenerator;
