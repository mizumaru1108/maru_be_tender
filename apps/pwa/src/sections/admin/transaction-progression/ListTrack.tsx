import { Grid, Stack, Typography, Button, TextField, IconButton, MenuItem } from '@mui/material';
import Iconify from 'components/Iconify';
import React from 'react';
import useLocales from 'hooks/useLocales';
import { FormProvider } from 'components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import uuidv4 from 'utils/uuidv4';
import { useNavigate } from 'react-router';
import RHFSelectNoGenerator from 'components/hook-form/RHFSelectNoGen';
import { LoadingButton } from '@mui/lab';

interface FormInput {
  id: string;
  employee: string;
  action: string;
}

interface FormProps {
  track_items: FormInput[];
}

const ListTrack = () => {
  const navigate = useNavigate();
  const { translate, currentLang } = useLocales();
  const [loading, setLoading] = React.useState(false);

  const validationSchema = Yup.object().shape({
    track_items: Yup.array().of(
      Yup.object().shape({
        employee: Yup.string().required(),
        action: Yup.string().required(),
      })
    ),
  });

  const defaultValues = {
    track_items: [],
  };

  const methods = useForm<FormProps>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    resetField,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const {
    fields: trackItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'track_items',
  });

  const onSubmitForm = async (data: any) => {
    console.log({ data });
  };

  console.log({ trackItems });

  return (
    <FormProvider methods={methods}>
      <Stack direction="row" alignItems="center" sx={{ mt: 6, mb: 3 }}>
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate('/admin/dashboard/transaction-progression')}
          sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
        >
          <Iconify
            icon={
              currentLang.value === 'en'
                ? 'eva:arrow-ios-back-outline'
                : 'eva:arrow-ios-forward-outline'
            }
            width={25}
            height={25}
          />
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
          New Track Name
        </Typography>
      </Stack>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ py: 8, px: 12 }}>
        {/* <FormGenerator data={FifthFormData} /> */}
        <Grid item xs={12}>
          {trackItems.map((v, i) => (
            <Grid container key={i} spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center" gap={4}>
                  <img src={`/icons/list-icon.svg`} alt="" />
                  <Typography>{i < 9 ? `0${i + 1}` : i + 1}</Typography>
                  <RHFSelectNoGenerator
                    name={`track_items.${i}.employee`}
                    size="small"
                    label="Employee*"
                    placeholder="Employee"
                    InputLabelProps={{ shrink: true }}
                  >
                    <option value="supervisor" style={{ backgroundColor: '#fff' }}>
                      Project Supervisor
                    </option>
                    <option value="moderator" style={{ backgroundColor: '#fff' }}>
                      Moderator
                    </option>
                    <option value="project_manager" style={{ backgroundColor: '#fff' }}>
                      Project Manager
                    </option>
                    <option value="ceo" style={{ backgroundColor: '#fff' }}>
                      CEO
                    </option>
                    <option value="consultant" style={{ backgroundColor: '#fff' }}>
                      Consultant
                    </option>
                    <option value="cashier" style={{ backgroundColor: '#fff' }}>
                      Cashier
                    </option>
                    <option value="finance" style={{ backgroundColor: '#fff' }}>
                      Finance
                    </option>
                  </RHFSelectNoGenerator>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <RHFSelectNoGenerator
                  name={`track_items.${i}.action`}
                  size="small"
                  label="Action*"
                  placeholder="Action"
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="supervisor" style={{ backgroundColor: '#fff' }}>
                    Partner
                  </option>
                  <option value="moderator" style={{ backgroundColor: '#fff' }}>
                    Screening
                  </option>
                  <option value="project_manager" style={{ backgroundColor: '#fff' }}>
                    Manager Director
                  </option>
                </RHFSelectNoGenerator>
              </Grid>
              <Grid item xs={2}>
                <Button
                  sx={{
                    backgroundColor: '#FF4842',
                    color: '#fff',
                    ':hover': { backgroundColor: '#FF170F' },
                  }}
                  startIcon={
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2224_42108)">
                        <path
                          d="M14.1667 2.66667H12.1C11.9453 1.91428 11.5359 1.23823 10.9408 0.752479C10.3458 0.266727 9.60147 0.000969683 8.83333 0L7.5 0C6.73186 0.000969683 5.98755 0.266727 5.3925 0.752479C4.79745 1.23823 4.38806 1.91428 4.23333 2.66667H2.16667C1.98986 2.66667 1.82029 2.7369 1.69526 2.86193C1.57024 2.98695 1.5 3.15652 1.5 3.33333C1.5 3.51014 1.57024 3.67971 1.69526 3.80474C1.82029 3.92976 1.98986 4 2.16667 4H2.83333V12.6667C2.83439 13.5504 3.18592 14.3976 3.81081 15.0225C4.43571 15.6474 5.28294 15.9989 6.16667 16H10.1667C11.0504 15.9989 11.8976 15.6474 12.5225 15.0225C13.1474 14.3976 13.4989 13.5504 13.5 12.6667V4H14.1667C14.3435 4 14.513 3.92976 14.6381 3.80474C14.7631 3.67971 14.8333 3.51014 14.8333 3.33333C14.8333 3.15652 14.7631 2.98695 14.6381 2.86193C14.513 2.7369 14.3435 2.66667 14.1667 2.66667ZM7.5 1.33333H8.83333C9.24685 1.33384 9.65008 1.46225 9.98774 1.70096C10.3254 1.93967 10.5809 2.27699 10.7193 2.66667H5.614C5.75239 2.27699 6.00793 1.93967 6.34559 1.70096C6.68325 1.46225 7.08648 1.33384 7.5 1.33333ZM12.1667 12.6667C12.1667 13.1971 11.956 13.7058 11.5809 14.0809C11.2058 14.456 10.6971 14.6667 10.1667 14.6667H6.16667C5.63623 14.6667 5.12753 14.456 4.75245 14.0809C4.37738 13.7058 4.16667 13.1971 4.16667 12.6667V4H12.1667V12.6667Z"
                          fill="white"
                        />
                        <path
                          d="M6.83317 11.9974C7.00998 11.9974 7.17955 11.9272 7.30457 11.8021C7.4296 11.6771 7.49984 11.5075 7.49984 11.3307V7.33073C7.49984 7.15392 7.4296 6.98435 7.30457 6.85932C7.17955 6.7343 7.00998 6.66406 6.83317 6.66406C6.65636 6.66406 6.48679 6.7343 6.36177 6.85932C6.23674 6.98435 6.1665 7.15392 6.1665 7.33073V11.3307C6.1665 11.5075 6.23674 11.6771 6.36177 11.8021C6.48679 11.9272 6.65636 11.9974 6.83317 11.9974Z"
                          fill="white"
                        />
                        <path
                          d="M9.49967 11.9974C9.67649 11.9974 9.84605 11.9272 9.97108 11.8021C10.0961 11.6771 10.1663 11.5075 10.1663 11.3307V7.33073C10.1663 7.15392 10.0961 6.98435 9.97108 6.85932C9.84605 6.7343 9.67649 6.66406 9.49967 6.66406C9.32286 6.66406 9.15329 6.7343 9.02827 6.85932C8.90325 6.98435 8.83301 7.15392 8.83301 7.33073V11.3307C8.83301 11.5075 8.90325 11.6771 9.02827 11.8021C9.15329 11.9272 9.32286 11.9974 9.49967 11.9974Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2224_42108">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0.166504)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  }
                  onClick={() => {
                    // const idGetValues = getValues(`proposal_item_budgets.${i}.id`);
                    // const deleteValues = basedBudget.filter((item) => item.id === idGetValues);

                    // const existingData = tempDeletedBudget.find((item) => item.id === idGetValues);

                    // if (!existingData) {
                    //   setTempDeletedBudget([...tempDeletedBudget, ...deleteValues]);
                    // }

                    remove(i);
                  }}
                >
                  حذف
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            type="button"
            variant="contained"
            color="inherit"
            size="medium"
            sx={{ width: '93%' }}
            onClick={async () => {
              append({
                employee: '',
                action: '',
                id: uuidv4(),
              });
            }}
          >
            {translate('add_new_line')}
          </Button>
        </Grid>
      </Grid>
      <Stack justifyContent="center" direction="row" gap={2} sx={{ mt: 10 }}>
        <LoadingButton
          loading={loading}
          onClick={handleSubmit(onSubmitForm)}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: 'background.paper',
            color: '#fff',
            width: { xs: '100%', sm: '170px' },
            height: { xs: '100%', sm: '40px' },
            '&:hover': { backgroundColor: '#13B2A2' },
          }}
        >
          Save Track
        </LoadingButton>
        <Button
          onClick={() => navigate('/admin/dashboard/transaction-progression')}
          sx={{
            color: '#000',
            size: 'large',
            width: { xs: '100%', sm: '170px' },
            hieght: { xs: '100%', sm: '40px' },
            ':hover': { backgroundColor: '#efefef' },
          }}
        >
          {/* إغلاق */}
          Back
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default ListTrack;
