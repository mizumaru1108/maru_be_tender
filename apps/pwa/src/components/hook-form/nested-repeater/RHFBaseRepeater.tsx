import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import NestedArrayLvlOne from 'components/hook-form/nested-repeater/NestedArrayLvlOne';
import Space from 'components/space/space';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useFieldArray } from 'react-hook-form';

export default function RHFBaseRepeater({ control, register, setValue, getValues, watch }: any) {
  const theme = useTheme();
  const { translate } = useLocales();

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'detail_project_budgets',
  });

  const objectEmpty = (obj: any, index: number) => {
    for (let key in obj) {
      // console.log({ key });
      if (key === 'amount') {
        setValue(`detail_project_budgets[${index}].${key}`, 0);
      } else if (key === 'level_one') {
        setValue(`detail_project_budgets[${index}].${key}`, []);
      } else {
        setValue(`detail_project_budgets[${index}].${key}`, '');
      }
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
    objectEmpty(watch(`detail_project_budgets[${index}]`), index);
  };

  const tmpWatch = watch(`detail_project_budgets`);

  return (
    <>
      <Grid container>
        {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length > 0 && (
          <Grid md={12} xs={12} sx={{ textAlign: 'end' }}>
            {<Typography variant="h6">Section One</Typography>}
          </Grid>
        )}
        {fields.map((item, index) => {
          const tmpItem = item;
          return (
            <React.Fragment key={`${index}`}>
              <Grid md={4} xs={12} sx={{ padding: '5px 7px' }}>
                <TextField
                  label={translate('funding_project_request_form4.item.label')}
                  placeholder={translate('funding_project_request_form4.item.label')}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
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
                  }}
                  {...register(`detail_project_budgets.${index}.clause`)}
                />
              </Grid>
              <Grid md={4} xs={12} sx={{ padding: '5px 7px' }}>
                <TextField
                  label={translate('funding_project_request_form4.explanation.label')}
                  placeholder={translate('funding_project_request_form4.explanation.placeholder')}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
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
                  }}
                  {...register(`detail_project_budgets.${index}.explanation`)}
                />
              </Grid>
              <Grid md={3} xs={12} sx={{ padding: '5px 7px' }}>
                <TextField
                  label={translate('funding_project_request_form4.amount.label')}
                  placeholder={translate('funding_project_request_form4.amount.placeholder')}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  type={'number'}
                  sx={{
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
                  }}
                  {...register(`detail_project_budgets.${index}.amount`)}
                />
              </Grid>
              <Grid item md={1} xs={12} sx={{ padding: '5px 7px' }}>
                <IconButton
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'red',
                    color: '#fff',
                    borderRadius: '10px',
                  }}
                  onClick={() => {
                    // remove(index);
                    handleRemove(index);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid md={12} xs={12}>
                <NestedArrayLvlOne nestIndex={index} {...{ control, register, watch, setValue }} />
              </Grid>
              <Grid md={12} xs={12}>
                <Divider>
                  <Chip label={`Item-${index + 1}`} />
                </Divider>
                <Space direction="horizontal" size="small" />
              </Grid>
            </React.Fragment>
          );
        })}
        <Space direction="horizontal" size="small" />
        <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              append({
                clause: '',
                explanation: '',
                amount: '0',
                level_one: [],
              });
            }}
          >
            Add Section One
          </Button>
        </Grid>

        {/* <Button
        type="button"
        variant="contained"
        onClick={() => {
          setValue('test', [
            ...(getValues().test || []),
            {
              name: 'append',
              nestedArray: [{ field1: 'append', field2: 'append' }],
            },
          ]);
        }}
      >
        Append Nested
      </Button>

      <Button
        type="button"
        variant="contained"
        onClick={() => {
          prepend({ name: 'append' });
        }}
      >
        prepend
      </Button>

      <Button
        type="button"
        variant="contained"
        onClick={() => {
          setValue('test', [
            {
              name: 'append',
              nestedArray: [{ field1: 'Prepend', field2: 'Prepend' }],
            },
            ...(getValues().test || []),
          ]);
        }}
      >
        prepend Nested
      </Button> */}

        {/* <span className="counter">Render Count: {renderCount}</span> */}
      </Grid>
    </>
  );
}
