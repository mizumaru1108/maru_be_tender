import CloseIcon from '@mui/icons-material/Close';
import { Button, Chip, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material';
import NestedArrayLvlOne from 'components/hook-form/nested-track-budget/NestedArrayLvlOne';
import Space from 'components/space/space';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useFieldArray } from 'react-hook-form';
import uuidv4 from '../../../utils/uuidv4';
import RHFTextField from '../RHFTextField';

export default function RHFBaseRepeater({
  control,
  register,
  setValue,
  getValues,
  watch,
  isLoading,
}: any) {
  const theme = useTheme();
  const { translate } = useLocales();

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'sections',
  });

  const objectEmpty = (obj: any, index: number) => {
    for (let key in obj) {
      // console.log({ key });
      if (key === 'amount') {
        setValue(`sections[${index}].${key}`, 0);
      } else if (key === 'level_one') {
        setValue(`sections[${index}].${key}`, []);
      } else {
        setValue(`sections[${index}].${key}`, '');
      }
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
    objectEmpty(watch(`sections[${index}]`), index);
  };

  const tmpWatch = watch(`sections`);

  return (
    <>
      <Grid container>
        {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length > 0 && (
          <Grid md={12} xs={12} sx={{ textAlign: 'end' }}>
            {
              <Typography variant="h6">
                {translate('track_budgets.nested_field.section_one')}
              </Typography>
            }
          </Grid>
        )}
        {fields.map((item, index) => {
          const tmpItem = item;
          return (
            <React.Fragment key={`${index}`}>
              <Grid md={6} xs={12} sx={{ padding: '0 7px' }}>
                <RHFTextField
                  disabled={isLoading}
                  name={`sections.${index}.name`}
                  label={translate('funding_project_request_form4.item.label')}
                  placeholder={translate('funding_project_request_form4.item.label')}
                  size={'small'}
                />
              </Grid>
              <Grid md={5} xs={12} sx={{ padding: '0 7px' }}>
                <RHFTextField
                  disabled={isLoading}
                  name={`sections.${index}.budget`}
                  label={translate('funding_project_request_form4.amount.label')}
                  placeholder={translate('funding_project_request_form4.amount.placeholder')}
                  size={'small'}
                  type="number"
                />
              </Grid>
              <Grid item md={1} xs={12} sx={{ padding: '0 7px' }}>
                <IconButton
                  disabled={isLoading}
                  sx={{
                    width: '100%',
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
                <NestedArrayLvlOne
                  isLoading={isLoading}
                  nestIndex={index}
                  parentSectionId={tmpWatch[index].id}
                  {...{ control, register, watch, setValue }}
                />
              </Grid>
              <Grid md={12} xs={12} sx={{ mt: 2 }}>
                <Divider>
                  <Chip
                    label={
                      <Typography>{`${translate('track_budgets.item')}-${index + 1}`}</Typography>
                    }
                  />
                </Divider>
                <Space direction="horizontal" size="small" />
              </Grid>
            </React.Fragment>
          );
        })}
        <Space direction="horizontal" size="small" />
        <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={isLoading}
            type="button"
            variant="outlined"
            onClick={() => {
              append({
                id: String(uuidv4()),
                name: '',
                budget: 0,
                child_track_section: [],
              });
            }}
          >
            {translate('button.add_one_section')}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
