import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
  Grid,
  IconButton,
  Typography,
  useTheme,
  Collapse,
  List,
  ListItem,
  Stack,
  Button,
} from '@mui/material';
import NestedArrayLvlTwo from 'components/hook-form/nested-track-budget/NestedArrayLvlTwo';
import useLocales from 'hooks/useLocales';
import { useFieldArray } from 'react-hook-form';
import uuidv4 from '../../../utils/uuidv4';
import RHFTextField from '../RHFTextField';
import { ExpandMore } from './RHFBaseRepeater';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function NestedArrayLvlOne({
  nestIndex,
  parentSectionId,
  control,
  register,
  watch,
  setValue,
  isLoading,
  expanded,
}: any) {
  const theme = useTheme();
  const { translate } = useLocales();

  const { fields, remove, append } = useFieldArray({
    control,
    name: `sections.${nestIndex}.child_track_section`,
  });

  const [openItemsLvlOne, setOpenItemsLvlOne] = useState<string[]>([]);

  const handleToggle = (itemId: string) => {
    setOpenItemsLvlOne((prevOpenItems) => {
      const isOpen = prevOpenItems.includes(itemId);
      return isOpen ? prevOpenItems.filter((item) => item !== itemId) : [...prevOpenItems, itemId];
    });
  };

  const objectEmpty = (obj: any, index: number) => {
    for (let key in obj) {
      // console.log({ key });
      if (key === 'amount') {
        setValue(`sections.${nestIndex}.child_track_section[${index}].${key}`, 0);
      } else if (key === 'child_track_section') {
        setValue(`sections.${nestIndex}.child_track_section[${index}].${key}`, []);
      } else {
        setValue(`sections.${nestIndex}.child_track_section[${index}].${key}`, '');
      }
    }
  };

  const handleRemove = (index: number) => {
    // console.log({ index });
    remove(index);
    // objectEmpty(watch(`sections.${nestIndex}.child_track_section[${index}]`), index);
  };
  const tmpWatch = watch(`sections.${nestIndex}.child_track_section`);

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <Grid container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length === 0 && (
          <Grid item md={12} xs={12} sx={{ textAlign: 'end', mt: 1 }}>
            {
              <Typography variant="h6">
                {translate('track_budgets.nested_field.section_two')}
              </Typography>
            }
          </Grid>
        )}
        <List sx={{ width: '100%', backgroundColor: 'transparent' }} disablePadding>
          {fields.map((item, k) => {
            const tmpItem = item;
            return (
              <ListItem key={tmpItem.id}>
                <Grid item md={12} xs={12}>
                  <Grid container justifyContent="flex-end" alignItems="center" spacing={1.5}>
                    {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length > 0 && (
                      <Grid item md={12} xs={12} sx={{ textAlign: 'end' }}>
                        {
                          <Typography variant="h6">
                            {translate('track_budgets.nested_field.section_two')}
                          </Typography>
                        }
                      </Grid>
                    )}
                    <Grid item md={1} xs={12}>
                      <Stack
                        direction="row"
                        component="div"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <ExpandMore
                          expand={openItemsLvlOne.includes(item.id)}
                          onClick={() => handleToggle(item.id)}
                          aria-expanded={openItemsLvlOne.includes(item.id)}
                          aria-label="show more"
                          size="medium"
                          disabled={isLoading}
                          sx={{ margin: 'auto' }}
                        >
                          <ExpandMoreIcon fontSize="large" />
                        </ExpandMore>
                      </Stack>
                    </Grid>
                    <Grid item md={6} xs={12} sx={{ padding: '0 7px' }}>
                      <RHFTextField
                        disabled={isLoading}
                        name={`sections.${nestIndex}.child_track_section.${k}.name`}
                        label={translate('funding_project_request_form4.item.label')}
                        placeholder={translate('funding_project_request_form4.item.label')}
                        size={'small'}
                      />
                    </Grid>
                    <Grid item md={4} xs={12} sx={{ padding: '0 7px' }}>
                      <RHFTextField
                        disabled={isLoading}
                        name={`sections.${nestIndex}.child_track_section.${k}.budget`}
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
                    <Grid item md={1} xs={12} sx={{ padding: '0 7px' }}>
                      <Stack direction="row" component="div">
                        {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length > 0 && k === 0 && (
                          <IconButton
                            disabled={isLoading}
                            size="medium"
                            color="primary"
                            // sx={{
                            //   width: '100%',
                            //   height: '40px',
                            //   backgroundColor: '#0E8478',
                            //   color: '#fff',
                            //   borderRadius: '10px',
                            //   fontSize: '33px',
                            //   '&:hover': {
                            //     backgroundColor: '#0E8478',
                            //   },
                            // }}
                            onClick={() =>
                              append({
                                id: String(uuidv4()),
                                name: '',
                                budget: 0,
                                parent_section_id: parentSectionId,
                                child_track_section: [],
                              })
                            }
                          >
                            <ControlPointIcon fontSize="inherit" />
                          </IconButton>
                        )}
                        <IconButton
                          disabled={isLoading}
                          size="medium"
                          color="error"
                          // sx={{
                          //   width: '100%',
                          //   // height: '100%',
                          //   backgroundColor: 'red',
                          //   color: '#fff',
                          //   borderRadius: '10px',
                          // }}
                          onClick={() => {
                            handleRemove(k);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <NestedArrayLvlTwo
                        isLoading={isLoading}
                        nestIndex={nestIndex}
                        nestedOneIndex={k}
                        parentSectionId={tmpWatch[k]?.id}
                        expanded={openItemsLvlOne.includes(item.id)}
                        {...{ control, register, watch, setValue }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
        {tmpWatch && Array.isArray(tmpWatch) && tmpWatch.length === 0 && (
          <Grid item md={2} xs={12} sx={{ mt: 1.5 }}>
            <Button
              disabled={isLoading}
              variant="contained"
              color="primary"
              fullWidth={true}
              // sx={{
              //   width: '100%',
              //   height: '40px',
              //   backgroundColor: '#0E8478',
              //   color: '#fff',
              //   borderRadius: '10px',
              //   fontSize: '33px',
              //   '&:hover': {
              //     backgroundColor: '#0E8478',
              //   },
              // }}
              onClick={() =>
                append({
                  id: String(uuidv4()),
                  name: '',
                  budget: 0,
                  parent_section_id: parentSectionId,
                  child_track_section: [],
                })
              }
            >
              <ControlPointIcon fontSize="medium" />
            </Button>
          </Grid>
        )}
      </Grid>
    </Collapse>
  );
}
