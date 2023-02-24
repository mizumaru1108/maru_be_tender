import { Box, Divider, Grid, Stack, Typography, Link, Button } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSelector } from 'redux/store';
import BankImageComp from 'sections/shared/BankImageComp';
import useLocales from '../../../hooks/useLocales';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import { FEATURE_PROJECT_DETAILS } from '../../../config';
import ButtonDownloadFiles from '../../../components/button/ButtonDownloadFiles';
import useAuth from '../../../hooks/useAuth';
import { AmandementFields, AmandmentRequestForm } from '../../../@types/proposal';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios';

type ITmpValues = {
  data: AmandmentRequestForm;
  revised: AmandementFields;
};

function MainPage() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const { proposal } = useSelector((state) => state.proposal);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();
  const [tmpValues, setTmpValues] = React.useState<ITmpValues | null>(null);

  const {
    project_location,
    project_implement_date,
    user: { client_data, bank_informations, email, mobile_number },
    num_ofproject_binicficiaries,
    project_beneficiaries,
    execution_time,
    project_idea,
    project_goals,
    project_outputs,
    project_strengths,
    project_risks,
    amount_required_fsupport,
    letter_ofsupport_req,
    project_attachments,
    bank_information,
    support_type,
    proposal_item_budgets_aggregate,
    outter_status,
  } = proposal;

  const fetchingData = React.useCallback(async () => {
    try {
      const rest = await axiosInstance.get(`/tender-proposal/amandement?id=${id as string}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      console.log('rest', rest);
      if (rest) {
        setTmpValues({
          data: rest.data.data.proposal,
          revised: rest.data.data.detail,
        });
      }
    } catch (err) {
      console.log("this proposal doesn't have any amandeme", err);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
    }
  }, [activeRole, id]);

  React.useEffect(() => {
    if (activeRole === 'tender_project_supervisor' && outter_status !== 'ON_REVISION') {
      fetchingData();
    }
  }, [activeRole, outter_status, fetchingData]);
  const handleOpenProjectOwnerDetails = () => {
    const submiterId = proposal.user.id;
    const url = location.pathname.split('/').slice(0, 3).join('/');
    // const destination = location.pathname.split('/').slice(3, 4).join('/');
    // const url = location.pathname;
    navigate(`${url}/current-project/${id}/owner/${submiterId}`);
    // console.log({ url, destination });
  };
  console.log('tmpValues', tmpValues);
  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      <Stack direction="row" gap={6}>
        <Stack direction="column">
          <Typography
            sx={{
              color:
                tmpValues?.revised?.num_ofproject_binicficiaries !== undefined
                  ? 'green'
                  : '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('number_of_beneficiaries_of_the_project')}
          </Typography>
          <Typography sx={{ mb: '20px' }}>{num_ofproject_binicficiaries}</Typography>
          <Typography
            sx={{
              color: '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('implementation_period')}
          </Typography>
          <Typography>{execution_time}</Typography>
        </Stack>
        <Stack direction="column">
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            {translate('where_to_implement_the_project')}
          </Typography>
          <Typography sx={{ mb: '20px' }}>{project_location}</Typography>
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            {translate('target_group_type')}
          </Typography>
          <Typography>
            {translate(
              `section_portal_reports.heading.gender.${project_beneficiaries.toLowerCase()}`
            )}
          </Typography>
        </Stack>
        <Stack direction="column">
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            {translate('project_implementation_date')}
          </Typography>
          <Typography sx={{ mb: '20px' }}>
            {new Date(project_implement_date).toISOString().substring(0, 10)}
          </Typography>
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            {translate('support_type')}
          </Typography>
          <Typography>
            {/* {support_type ? translate('full_support') : translate('partial_support')}&nbsp;
            <Typography component="span">{translate('with')}&nbsp;</Typography> */}
            {/* <Typography component="span" sx={{ fontWeight: 'bold' }}>
              {fCurrencyNumber(proposal_item_budgets_aggregate.aggregate.sum.amount)}&nbsp;
            </Typography> */}
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              {fCurrencyNumber(amount_required_fsupport)}&nbsp;
            </Typography>
            {/* <Typography component="span">{translate('amount')}&nbsp;</Typography> */}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Grid container columnSpacing={7}>
        <Grid item md={8} xs={12}>
          <Stack direction="column">
            <Typography
              sx={{
                color: tmpValues?.revised?.project_idea !== undefined ? 'green' : '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_idea')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_idea}</Typography>
            <Typography
              sx={{
                color: tmpValues?.revised?.project_goals !== undefined ? 'green' : '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_goals')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_goals}</Typography>
            <Typography
              sx={{
                color: tmpValues?.revised?.project_outputs !== undefined ? 'green' : '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_outputs')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_outputs}</Typography>
            <Typography
              sx={{
                color: tmpValues?.revised?.project_strengths !== undefined ? 'green' : '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_strengths')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_strengths}</Typography>
            <Typography
              sx={{
                color: tmpValues?.revised?.project_risks !== undefined ? 'green' : '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_risks')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_risks}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" gap={3}>
            <ButtonDownloadFiles
              files={letter_ofsupport_req}
              border={tmpValues?.revised.letter_ofsupport_req !== undefined ? 'green' : undefined}
            />
            <ButtonDownloadFiles
              files={project_attachments}
              border={tmpValues?.revised.project_attachments !== undefined ? 'green' : undefined}
            />
            {/* <Button
              component={Link}
              href={letter_ofsupport_req.url}
              download="ملف خطاب طلب الدعم"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                flex: 1,
                '&:hover': { backgroundColor: '#00000014' },
                backgroundColor: '#93A3B014',
                px: '5px',
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  borderRadius: '10px',
                }}
                flex={1}
              >
                <Stack direction="row" gap={2}>
                  <Stack direction="column" justifyContent="center">
                    <img src={`/icons/doc-icon.svg`} alt="" />
                  </Stack>
                  <Stack direction="column">
                    <Typography gutterBottom sx={{ fontSize: '13px' }}>
                      {translate('support_letter_file')}
                    </Typography>
                    <Typography gutterBottom sx={{ fontSize: '13px' }}>
                      {letter_ofsupport_req.size !== undefined
                        ? `${letter_ofsupport_req.size.toFixed(2)}KB`
                        : '126KB'}
                    </Typography>
                  </Stack>
                </Stack>
                <img
                  src={`/assets/icons/download-icon.svg`}
                  alt=""
                  style={{ width: 25, height: 25 }}
                />
              </Stack>
            </Button>
            <Button
              component={Link}
              href={project_attachments.url}
              download="ملف مرفقات المشروع"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                flex: 1,
                '&:hover': { backgroundColor: '#00000014' },
                backgroundColor: '#93A3B014',
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  padding: '8px',
                  borderRadius: '10px',
                }}
                flex={1}
              >
                <Stack direction="row" gap={2}>
                  <Stack direction="column" justifyContent="center">
                    <img src={`/icons/pdf-icon.svg`} alt="" />
                  </Stack>
                  <Stack direction="column">
                    <Typography gutterBottom sx={{ fontSize: '13px' }}>
                      {translate('project_attachment_file')}
                    </Typography>
                    <Typography gutterBottom sx={{ fontSize: '13px' }}>
                      {project_attachments.size !== undefined
                        ? `${project_attachments.size.toFixed(2)}KB`
                        : '126KB'}
                    </Typography>
                  </Stack>
                </Stack>
                <img
                  src={`/assets/icons/download-icon.svg`}
                  alt=""
                  style={{ width: 25, height: 25 }}
                />
              </Stack>
            </Button> */}
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column">
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('email')}
              </Typography>
              <Typography sx={{ mb: '15px' }}>{email}</Typography>
            </Stack>
            <Stack direction="column" alignItems="start">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('mobile_number')}
              </Typography>
              <Typography
                sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
              >
                {mobile_number}
              </Typography>
            </Stack>
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('governorate')}
              </Typography>
              <Typography sx={{ mb: '15px' }}>{client_data.governorate}</Typography>
            </Stack>
            <Box sx={{ backgroundColor: '#fff', py: '30px', pl: '10px', mb: '15px' }}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                  {translate('project_owner_details.card_title')}
                </Typography>
                <Typography sx={{ color: '#0E8478', fontSize: '12px', mb: '5px', fontWeight: 700 }}>
                  {/* {translate('project_owner_details.card_content')} */}
                  {proposal.user.employee_name}
                </Typography>
                <Typography
                  sx={{
                    color: '#1E1E1E',
                    fontSize: '12px',
                    mb: '5px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={FEATURE_PROJECT_DETAILS ? handleOpenProjectOwnerDetails : undefined}
                >
                  {translate('project_owner_details.card_href')}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                backgroundColor: '#fff',
                border: `1px solid ${
                  tmpValues?.revised?.amount_required_fsupport !== undefined ? 'green' : '#fff'
                }`,
                // borderColor:
                //   tmpValues?.revised?.amount_required_fsupport !== undefined ? 'green' : '#fff',
                py: '30px',
                pl: '10px',
                mb: '15px',
              }}
            >
              <Stack direction="column">
                <Typography
                  sx={{
                    color:
                      tmpValues?.revised?.amount_required_fsupport !== undefined
                        ? 'green'
                        : '#93A3B0',
                    fontSize: '12px',
                    mb: '5px',
                  }}
                >
                  {translate('amount_required_for_support')}
                </Typography>
                <Typography>{fCurrencyNumber(amount_required_fsupport)}</Typography>
              </Stack>
            </Box>
            <Stack>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('selected_bank')}
              </Typography>
              <BankImageComp
                enableButton={true}
                bankName={bank_information?.bank_name}
                accountNumber={bank_information?.bank_account_number}
                bankAccountName={bank_information?.bank_account_name}
                imageUrl={bank_information?.card_image.url}
                size={bank_information?.card_image.size}
                type={bank_information?.card_image.type}
                borderColor={bank_information?.card_image.border_color ?? 'transparent'}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainPage;
