import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  IconButtonProps,
  Typography,
  useTheme,
  styled,
  List,
  ListItem,
} from '@mui/material';
import NestedArrayLvlOne from 'components/hook-form/nested-track-budget/NestedArrayLvlOne';
import Space from 'components/space/space';
import useLocales from 'hooks/useLocales';
import { useFieldArray } from 'react-hook-form';
import uuidv4 from '../../../utils/uuidv4';
import RHFTextField from '../RHFTextField';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { dispatch, useSelector } from '../../../redux/store';
import RHFComboBox, { ComboBoxOption } from '../RHFComboBox';
import { getManySupervisor } from '../../../redux/slices/user';
import useAuth from '../../../hooks/useAuth';

export interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton color="inherit" {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RHFBaseRepeater({
  control,
  register,
  setValue,
  getValues,
  watch,
  isLoading,
  supervisors,
}: any) {
  const theme = useTheme();
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  // redux
  const { employee, isLoading: spvLoading } = useSelector((state) => state.user);

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'sections',
  });

  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleToggle = (itemId: string) => {
    setOpenItems((prevOpenItems) => {
      const isOpen = prevOpenItems.includes(itemId);
      return isOpen ? prevOpenItems.filter((item) => item !== itemId) : [...prevOpenItems, itemId];
    });
  };

  const objectEmpty = (obj: any, index: number) => {
    for (let key in obj) {
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
    // objectEmpty(watch(`sections[${index}]`), index);
  };

  const tmpWatch = watch(`sections`);
  return (
    <>
      <Grid container alignItems="center">
        {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length > 0 && (
          <Grid md={12} xs={12} sx={{ textAlign: 'end' }} item>
            {
              <Typography variant="h6">
                {translate('track_budgets.nested_field.section_one')}
              </Typography>
            }
          </Grid>
        )}
        <List sx={{ width: '100%', backgroundColor: 'transparent' }} disablePadding>
          {fields.map((item, index) => {
            const tmpItem = item;
            return (
              <React.Fragment key={tmpItem.id}>
                <ListItem>
                  <Grid container alignItems="center">
                    <Grid md={12} xs={12} sx={{ mb: 1.5 }} item>
                      <Divider>
                        <Chip
                          label={
                            <Typography>{`${translate('track_budgets.item')}-${
                              index + 1
                            }`}</Typography>
                          }
                        />
                      </Divider>
                      <Space direction="horizontal" size="small" />
                    </Grid>
                    <Grid item md={1} xs={12} sx={{ padding: '0 7px' }}>
                      <ExpandMore
                        expand={openItems.includes(item.id)}
                        onClick={() => handleToggle(item.id)}
                        aria-expanded={openItems.includes(item.id)}
                        aria-label="show more"
                        size="large"
                        disabled={isLoading}
                      >
                        <ExpandMoreIcon fontSize="large" />
                      </ExpandMore>
                    </Grid>
                    <Grid md={4} xs={12} sx={{ padding: '0 7px' }} item>
                      <RHFTextField
                        disabled={isLoading}
                        name={`sections.${index}.name`}
                        label={translate('funding_project_request_form4.item.label')}
                        placeholder={translate('funding_project_request_form4.item.label')}
                        size={'small'}
                      />
                    </Grid>
                    <Grid md={3} xs={12} sx={{ padding: '0 7px' }} item>
                      <RHFTextField
                        disabled={isLoading}
                        name={`sections.${index}.budget`}
                        label={translate('funding_project_request_form4.amount.label')}
                        placeholder={translate('funding_project_request_form4.amount.placeholder')}
                        size={'small'}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0 },
                          onWheel: (e: any) => {
                            e.target.blur();

                            e.stopPropagation();

                            setTimeout(() => {
                              e.target.focus();
                            }, 0);
                          },
                        }}
                      />
                    </Grid>
                    <Grid md={3} xs={12} sx={{ padding: '0 7px' }} item>
                      <RHFComboBox
                        isMultiple={true}
                        size={'small'}
                        disabled={isLoading}
                        name={`sections.${index}.supervisor_options`}
                        label={translate('track_budgets.fields.supervisor_id.label')}
                        placeholder={translate('track_budgets.fields.supervisor_id.placeholder')}
                        dataOption={supervisors}
                      />
                    </Grid>
                    <Grid item md={1} xs={12} sx={{ padding: '0 7px' }}>
                      <IconButton
                        disabled={isLoading}
                        size="large"
                        color="error"
                        // sx={{
                        //   width: '100%',
                        //   backgroundColor: theme.palette.error.main,
                        //   color: theme.palette.error.contrastText,
                        //   borderRadius: '10px',
                        //   '&:hover': {
                        //     backgroundColor: '#FF484229',
                        //     color: theme.palette.error.main,
                        //   },
                        // }}
                        onClick={() => {
                          // remove(index);
                          handleRemove(index);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                    <Grid md={12} xs={12} item>
                      <NestedArrayLvlOne
                        isLoading={isLoading}
                        nestIndex={index}
                        parentSectionId={tmpWatch[index]?.id}
                        expanded={openItems.includes(item.id)}
                        supervisors={supervisors}
                        {...{ control, register, watch, setValue }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
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
