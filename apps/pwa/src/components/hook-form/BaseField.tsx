import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import RHFSelect from './RHFSelect';
import RHFDatePicker from './RHFDatePicker';
import RHFTextField from './RHFTextField';
import { RHFUploadMultiFile, RHFUploadSingleFile } from './RHFUpload';
import RHFRepeater from './RHFRepeater';
import { FormSingleProps } from 'components/FormGenerator';
import useLocales from 'hooks/useLocales';
import { RHFCheckbox, RHFMultiCheckbox } from './RHFCheckbox';
import RHFTextArea from './RHFTextArea';
import RHFRadioGroup from './RHFRadioGroup';
import RHFPassword from './RHFPassword';
import { RHFUploadSingleFileBe } from './RHFUploadBe';
import RHFSelectNoGenerator from './RHFSelectNoGen';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(-11),
}));

function BaseField({
  type,
  name,
  label,
  enableAddButton,
  enableRemoveButton,
  placeholder,
  children,
  repeaterFields,
  options,
  maxDate,
  minDate,
  buttonRepeaterLabel,
  ...other
}: FormSingleProps) {
  const { translate } = useLocales();
  return (
    <>
      {type === 'radioGroup' && (
        <RHFRadioGroup name={name ?? ''} options={options!} label={translate(label)} {...other} />
      )}
      {type === 'select' && (
        <RHFSelect
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder) ?? ''}
          {...other}
        >
          {children}
        </RHFSelect>
      )}
      {type === 'selectWithoutGenerator' && (
        <RHFSelectNoGenerator
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder) ?? ''}
          {...other}
        >
          {children}
        </RHFSelectNoGenerator>
      )}
      {type === 'datePicker' && (
        <RHFDatePicker
          name={name ?? ''}
          label={translate(label)}
          minDate={minDate}
          maxDate={maxDate}
          {...other}
        />
      )}
      {type === 'textField' && (
        <RHFTextField
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder)}
          {...other}
        />
      )}
      {type === 'numberField' && (
        <RHFTextField
          type="number"
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder)}
          {...other}
        />
      )}
      {type === 'uploadLabel' && <LabelStyle>{translate(label)}</LabelStyle>}
      {type === 'checkbox' && <RHFCheckbox name={name ?? ''} label={translate(label)} {...other} />}
      {type === 'upload' && (
        <RHFUploadSingleFile name={name ?? ''} placeholder={translate(placeholder)} {...other} />
      )}
      {type === 'uploadBe' && (
        <RHFUploadSingleFileBe
          name={name ?? ''}
          placeholder={translate(placeholder)}
          disabled={other.disabled}
          {...other}
        />
      )}
      {type === 'uploadMulti' && (
        <RHFUploadMultiFile
          name={name ?? ''}
          placeholder={translate(placeholder)}
          disabled={other.disabled}
          {...other}
        />
      )}
      {type === 'textArea' && (
        <RHFTextArea
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder)}
          {...other}
        />
      )}
      {type === 'repeater' && (
        <RHFRepeater
          name={name}
          repeaterFields={repeaterFields}
          enableAddButton={enableAddButton}
          enableRemoveButton={enableRemoveButton}
          buttonRepeaterLabel={buttonRepeaterLabel}
          {...other}
        />
      )}
      {type === 'repeaterLabel' && <Typography variant="h4">{label}</Typography>}
      {type === 'password' && (
        <RHFPassword
          name={name ?? ''}
          label={translate(label)}
          placeholder={translate(placeholder)}
          {...other}
        />
      )}
      {type === 'checkboxMulti' && (
        <RHFMultiCheckbox
          label={label ?? ''}
          name={name ?? ''}
          options={options!}
          gridCol={2}
          placeholder={translate(placeholder)}
        />
      )}
    </>
  );
}

export default BaseField;
