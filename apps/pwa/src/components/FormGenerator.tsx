import React from 'react';
import { Grid, styled } from '@mui/material';
import BaseField from './hook-form/BaseField';

// ----------------------------------------------------------------------

type FieldType =
  | 'select'
  | 'selectWithoutGenerator'
  | 'datePicker'
  | 'textField'
  | 'upload'
  | 'uploadBe'
  | 'uploadLabel'
  | 'textArea'
  | 'repeater'
  | 'checkbox'
  | 'radioGroup'
  | 'repeaterLabel'
  | 'password'
  | 'checkboxMulti'
  | 'numberField';

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
  enableAddButton?: boolean;
  enableRemoveButton?: boolean;
  options?: {
    label: string;
    value: any;
  }[];
  maxDate?: string;
  minDate?: string;
  disabled?: boolean;
}

// ----------------------------------------------------------------------

export interface Props {
  data: FormSingleProps[];
}

const FormGenerator = ({ data }: Props) => (
  <>
    {data.map((element: FormSingleProps, i) => {
      if (!element.md) element.md = 0;
      if (!element.xs) element.xs = 0;
      return (
        <React.Fragment key={i}>
          {element.type !== 'repeater' && (
            <Grid item md={element.md} xs={element.xs}>
              <BaseField {...element} />
            </Grid>
          )}
          {element.type === 'repeater' && <BaseField {...element} />}
        </React.Fragment>
      );
    })}
  </>
);

export default FormGenerator;
