import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, IconButton, TextField, Typography, useTheme } from '@mui/material';
import BaseField from 'components/hook-form/BaseField';
import useLocales from 'hooks/useLocales';
import { useFieldArray } from 'react-hook-form';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

export default function NestedArrayLvlThree({
  nestIndex,
  nestedOneIndex,
  nestedTwoIndex,
  control,
  register,
  watch,
  setValue,
}: any) {
  const theme = useTheme();
  const { translate } = useLocales();

  const { fields, remove, append } = useFieldArray({
    control,
    name: `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${nestedTwoIndex}.level_three`,
  });

  const objectEmpty = (obj: any, index: number) => {
    for (let key in obj) {
      // console.log({ key });
      if (key === 'amount') {
        setValue(
          `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${nestedTwoIndex}.level_three[${index}].${key}`,
          0
        );
      } else if (key === 'level_one') {
        setValue(
          `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${nestedTwoIndex}.level_three[${index}].${key}`,
          []
        );
      } else {
        setValue(
          `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${nestedTwoIndex}.level_three[${index}].${key}`,
          ''
        );
      }
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
    objectEmpty(
      watch(
        `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${nestedTwoIndex}.level_three[${index}]`
      ),
      index
    );
  };
  const tmpWatch = watch(
    `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${nestedTwoIndex}.level_three`
  );

  return (
    <div>
      <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
        <Grid md={12} xs={12} sx={{ textAlign: 'end', mt: 1 }}>
          {<Typography variant="h6">Section Four</Typography>}
        </Grid>
        {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length === 0 && (
          <Grid item md={3} xs={12}>
            <IconButton
              sx={{
                width: '100%',
                height: '56px',
                backgroundColor: '#0E8478',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '42px',
                '&:hover': {
                  backgroundColor: '#0E8478',
                },
              }}
              onClick={() =>
                append({
                  clause: '',
                  explanation: '',
                  amount: '0',
                  level_two: [],
                })
              }
            >
              <ControlPointIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        )}
        {fields.map((item, k) => {
          const tmpItem = item;
          return (
            <Grid key={tmpItem.id} item md={12} xs={12} sx={{ margin: '0 0 10px 0' }}>
              <Grid
                container
                sx={{ display: 'flex', justifyContent: 'flex-end', margin: '0 0 10px 0' }}
              >
                {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length > 0 && k === 0 && (
                  <Grid item md={1} xs={12}>
                    <IconButton
                      sx={{
                        width: '100%',
                        height: '56px',
                        backgroundColor: '#0E8478',
                        color: '#fff',
                        borderRadius: '10px',
                        fontSize: '42px',
                        '&:hover': {
                          backgroundColor: '#0E8478',
                        },
                      }}
                      onClick={() =>
                        append({
                          clause: '',
                          explanation: '',
                          amount: '0',
                          level_two: [],
                        })
                      }
                    >
                      <ControlPointIcon fontSize="inherit" />
                    </IconButton>
                  </Grid>
                )}
                <Grid item md={4} xs={12}>
                  <TextField
                    label={translate('funding_project_request_form4.item.label')}
                    placeholder={translate('funding_project_request_form4.item.label')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{
                      padding: '0 8px',
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
                    // {...register(`detail_project_budgets.${nestIndex}.level_one.${k}.clause`)}
                    {...register(
                      `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${k}.clause`
                    )}
                  />
                </Grid>
                <Grid md={3} xs={12}>
                  <TextField
                    label={translate('funding_project_request_form4.explanation.label')}
                    placeholder={translate('funding_project_request_form4.explanation.placeholder')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{
                      padding: '0 8px',
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
                    {...register(
                      `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${k}.explanation`
                    )}
                  />
                </Grid>
                <Grid md={3} xs={12}>
                  <TextField
                    label={translate('funding_project_request_form4.amount.label')}
                    placeholder={translate('funding_project_request_form4.amount.placeholder')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    type={'number'}
                    sx={{
                      padding: '0 8px',
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
                    {...register(
                      `detail_project_budgets.${nestIndex}.level_one.${nestedOneIndex}.level_two.${k}.amount`
                    )}
                  />
                </Grid>
                <Grid item md={1} xs={12}>
                  <IconButton
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'red',
                      color: '#fff',
                      borderRadius: '10px',
                    }}
                    onClick={() => {
                      // remove(k);
                      handleRemove(k);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
        {/* <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="contained"
            onClick={() =>
              append({
                clause: '',
                explanation: '',
                amount: '0',
              })
            }
          >
            Add Section Four
          </Button>
        </Grid> */}
      </Grid>
    </div>
  );
}
