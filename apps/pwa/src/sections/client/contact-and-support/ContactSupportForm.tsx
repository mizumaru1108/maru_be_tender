import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, MenuItem, TextField } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// import { ContactSupportProps } from './types';
import dayjs from 'dayjs';
import React from 'react';
import ActionButtonContactUs from './ActionButtonContactUs';
import GeneralForm from './GeneralForm';
import ProjectIncuiryForm from './ProjectIncuiryForm';
import { ContactUsGeneral, ContactUsInquiry, ContactUsVisit } from './types';
import VisitationForm from './VisitationForm';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios';
import { role_url_map } from '../../../@types/commons';
import { useNavigate } from 'react-router';
// import { MainValuesProps, Props, RegisterValues } from '../register-shared/register-types';

const InquryTypes = [
  { value: 'general_inquiry', label: 'contact_support_form.option.general_inquiry' },
  { value: 'project_inquiry', label: 'contact_support_form.option.project_inquiry' },
  { value: 'visit_inquiry', label: 'contact_support_form.option.visit_inquiry' },
];

// const EnumType: string = 'general_inquiry' | 'project_inquiry' | 'visit_inquiry';

const ContactSupportForm = () => {
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const [formType, setFormType] = React.useState<string>('general_inquiry');
  const urlCreate = `/contact-us/create`;
  const handleSubmitGeneralForm = async (data: ContactUsGeneral) => {
    setIsLoading(true);
    const tmpValue: ContactUsGeneral = {
      // inquiry_type: formType.toUpperCase(),
      inquiry_type: 'GENERAL',
      message: data.message,
      title: data.title,
    };
    // console.log('testData', tmpValue);
    try {
      const res = await axiosInstance.post(
        urlCreate,
        {
          ...tmpValue,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      enqueueSnackbar(translate('snackbar.client.sent_success_contact_support'), {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      navigate(`/${role_url_map[`${activeRole!}`]}/dashboard/app`);
    } catch (error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProjectInquiryForm = async (data: ContactUsInquiry) => {
    setIsLoading(true);
    const tmpValue: ContactUsInquiry = {
      // inquiry_type: formType.toUpperCase(),
      inquiry_type: 'PROJECT_INQUIRIES',
      message: data.message,
      title: data.title,
      proposal_id: data.proposal_id,
    };
    // console.log('testData', tmpValue);
    try {
      const res = await axiosInstance.post(
        urlCreate,
        {
          ...tmpValue,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      enqueueSnackbar(translate('snackbar.client.sent_success_contact_support'), {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      navigate(`/${role_url_map[`${activeRole!}`]}/dashboard/app`);
    } catch (error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitVisitationForm = async (data: ContactUsVisit) => {
    setIsLoading(true);
    const tmpValue: ContactUsVisit = {
      // inquiry_type: formType.toUpperCase(),
      inquiry_type: 'VISITATION',
      date_of_visit: dayjs(data.date_of_visit).format('YYYY-MM-DD'),
      visit_reason: data.visit_reason,
    };
    // console.log('testData', tmpValue);
    try {
      const res = await axiosInstance.post(
        urlCreate,
        {
          ...tmpValue,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      enqueueSnackbar(translate('snackbar.client.sent_success_contact_support'), {
        variant: 'success',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
      navigate(`/${role_url_map[`${activeRole!}`]}/dashboard/app`);
    } catch (error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // console.log('formType', formType);
  return (
    <>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <TextField
            value={formType}
            select
            fullWidth
            label={translate('contact_support_form.inquiry_type.label')}
            placeholder={translate('contact_support_form.inquiry_type.placeholder')}
            onChange={(e) => setFormType(e.target.value)}
            sx={{ fontSize: '14px' }}
          >
            {InquryTypes.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#0E8478' } }}
              >
                {translate(`${option.label}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {formType === 'general_inquiry' && (
          <Grid item md={12} xs={12}>
            <GeneralForm onSubmitForm={handleSubmitGeneralForm} isLoading={isLoading}>
              <ActionButtonContactUs isLoading={isLoading} />
            </GeneralForm>
          </Grid>
        )}
        {formType === 'project_inquiry' && (
          <Grid item md={12} xs={12}>
            <ProjectIncuiryForm onSubmitForm={handleSubmitProjectInquiryForm} loading={isLoading}>
              <ActionButtonContactUs isLoading={isLoading} />
            </ProjectIncuiryForm>
          </Grid>
        )}
        {formType === 'visit_inquiry' && (
          <Grid item md={12} xs={12}>
            <VisitationForm onSubmitForm={handleSubmitVisitationForm} isLoading={isLoading}>
              <ActionButtonContactUs isLoading={isLoading} />
            </VisitationForm>
          </Grid>
        )}
        {/* <Grid item md={12} xs={12}>
            <Stack justifyContent="center" direction="row" gap={2}>
              <Button
                onClick={() => {
                  console.log('');
                }}
                sx={{
                  color: '#000',
                  size: 'large',
                  width: { xs: '100%', sm: '200px' },
                  hieght: { xs: '100%', sm: '50px' },
                }}
              >
                رجوع
              </Button>
              <Button
                type="submit"
                sx={{
                  backgroundColor: 'background.paper',
                  color: '#fff',
                  width: { xs: '100%', sm: '200px' },
                  hieght: { xs: '100%', sm: '50px' },
                }}
              >
                ارسال
              </Button>
            </Stack>
          </Grid> */}
      </Grid>
    </>
  );
};

export default ContactSupportForm;
