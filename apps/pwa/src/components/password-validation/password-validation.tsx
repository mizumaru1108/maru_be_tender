import { Stack, Typography } from '@mui/material';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import useLocales from '../../hooks/useLocales';
import { useEffect, useState } from 'react';

type Option = {
  value: PasswordValidationType;
  label: string;
};

const baseOptionValidationType: Option[] = [
  {
    value: 'uppper_case',
    label: 'notification.error.password.validation.uppper_case',
  },
  {
    value: 'special_char',
    label: 'notification.error.password.validation.special_char',
  },
  {
    value: 'number',
    label: 'notification.error.password.validation.number',
  },
  {
    value: 'match',
    label: 'notification.error.password.validation.match',
  },
];

export type ValidationType = {
  uppper_case?: boolean;
  special_char?: boolean;
  number?: boolean;
  match?: boolean;
};

export type PasswordValidationType = 'uppper_case' | 'special_char' | 'number' | 'match';

type Props = {
  password: string;
  confirmPassword?: string;
  type: PasswordValidationType[];
  onReturn: (validation: ValidationType) => void;
};

function checkPassword(password: string, confirmPassword?: string): ValidationType {
  const regexUpperCase = /[A-Z]/;
  const regexSpecialChar = /.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-].*/;
  const regexNumber = /\d/;

  return {
    uppper_case: regexUpperCase.test(password),
    special_char: regexSpecialChar.test(password),
    number: regexNumber.test(password),
    match: confirmPassword && password === confirmPassword ? true : false,
  };
}
export default function PasswordValidation(props: Props) {
  const { translate } = useLocales();
  const [validation, setValidation] = useState<ValidationType>({
    uppper_case: false,
    special_char: false,
    number: false,
    match: false,
  });

  useEffect(() => {
    const validationResult = checkPassword(props?.password, props?.confirmPassword);
    if (!!validationResult) {
      setValidation(validationResult);
      props.onReturn(validationResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.password, props.confirmPassword]);

  return (
    <Stack>
      {baseOptionValidationType
        .filter((option) => props.type.includes(option.value))
        .map((option) => (
          <Stack direction="row" alignItems="center" gap={2} key={option.value}>
            {validation[option.value] ? (
              <DoneAllIcon color="success" />
            ) : (
              <RemoveDoneIcon color="error" />
            )}
            <Typography
              color={validation[option.value] ? 'text.primary' : 'error'}
              variant="body1"
              fontWeight={500}
            >
              {translate(option.label)}
            </Typography>
          </Stack>
        ))}
    </Stack>
  );
}
