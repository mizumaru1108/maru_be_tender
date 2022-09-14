import { Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import RHFSelect from './RHFSelect';
import RHFDatePicker from './RHFDatePicker';
import RHFTextField from './RHFTextField';
import { RHFUploadSingleFile } from './RHFUpload';
import RHFRepeater from './RHFRepeater';
import { FormSingleProps } from 'components/FormGenerator';
import useLocales from 'hooks/useLocales';
import { RHFCheckbox } from './RHFCheckbox';
import RHFTextArea from './RHFTextArea';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(-11),
}));

function BaseField({ type, name, label, placeholder, children, repeaterFields }: FormSingleProps) {
  const { translate } = useLocales();
  return (
    <>
      {type === 'select' && (
        <RHFSelect
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder) ?? ''}
        >
          {children}
        </RHFSelect>
      )}
      {type === 'datePicker' && <RHFDatePicker name={name ?? ''} label={translate(label)} />}
      {type === 'textField' && (
        <RHFTextField
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder)}
        />
      )}
      {type === 'uploadLabel' && <LabelStyle>{translate(label)}</LabelStyle>}
      {type === 'checkbox' && <RHFCheckbox name={name ?? ''} label={translate(label)} />}
      {type === 'upload' && (
        <RHFUploadSingleFile name={name ?? ''} placeholder={translate(placeholder)} />
      )}
      {type === 'textArea' && (
        <RHFTextArea
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder)}
        />
      )}
      {type === 'repeater' && <RHFRepeater name={name} repeaterFields={repeaterFields} />}
    </>
  );
}

export default BaseField;