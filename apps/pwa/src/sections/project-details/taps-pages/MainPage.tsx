import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSelector } from 'redux/store';
import BankImageComp from 'sections/shared/BankImageComp';
import useLocales from '../../../hooks/useLocales';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import { AmandementFields, AmandmentRequestForm } from '../../../@types/proposal';
import ButtonDownloadFiles from '../../../components/button/ButtonDownloadFiles';
import { FEATURE_PROJECT_DETAILS, REOPEN_TMRA_S480 } from '../../../config';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';

type ITmpValues = {
  data: AmandmentRequestForm;
  revised: AmandementFields;
};

function MainPage() {
  const { translate, currentLang } = useLocales();
  const { activeRole } = useAuth();
  const { proposal, isLoading } = useSelector((state) => state.proposal);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tmpValues, setTmpValues] = React.useState<ITmpValues | null>(null);
  const tmpGovernorates = Array.isArray(proposal?.proposal_governorates)
    ? proposal?.proposal_governorates
    : [];

  const fetchingData = React.useCallback(async () => {
    try {
      const rest = await axiosInstance.get(`/tender-proposal/amandement?id=${id as string}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        setTmpValues({
          data: rest.data.data.proposal,
          revised: rest.data.data.detail,
        });
      }
    } catch (err) {
      console.debug("currnetly, this proposal doesn't have any amandemen", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, id]);

  React.useEffect(() => {
    if (activeRole === 'tender_project_supervisor' && proposal.outter_status !== 'ON_REVISION') {
      fetchingData();
    }
  }, [activeRole, proposal.outter_status, fetchingData]);
  const handleOpenProjectOwnerDetails = () => {
    const submiterId = proposal.submitter_user_id;
    const urls = location.pathname.split('/');
    const url = location.pathname.split('/').slice(0, 3).join('/');
    navigate(`/${urls[1]}/dashboard/current-project/owner/${submiterId}`);
  };

  if (isLoading) return <>Loading</>;

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={2}>
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
          <Typography sx={{ mb: '20px' }}>
            {(proposal.num_ofproject_binicficiaries && proposal.num_ofproject_binicficiaries) ??
              '-No Data-'}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Typography
            sx={{
              color: '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('implementation_period')}
          </Typography>
          <Typography>
            {(REOPEN_TMRA_S480
              ? proposal.execution_time &&
                `${Math.floor(Number(proposal.execution_time) / 60)} ${translate(
                  'pages.common.close_report.text.option.months'
                )}`
              : proposal.execution_time && proposal.execution_time) ?? '-No Data-'}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Typography
            sx={{
              color: tmpValues?.revised?.project_location !== undefined ? 'green' : '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('where_to_implement_the_project')}
          </Typography>
          <Typography sx={{ mb: '20px' }}>
            {(proposal.project_location && proposal.project_location) ?? '-No Data-'}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Typography
            sx={{
              color: tmpValues?.revised?.project_beneficiaries !== undefined ? 'green' : '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('target_group_type')}
          </Typography>
          <Typography>
            {proposal.beneficiary_details?.name || proposal.project_beneficiaries}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Typography
            sx={{
              color: tmpValues?.revised?.project_implement_date !== undefined ? 'green' : '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('project_implementation_date')}
          </Typography>
          <Typography sx={{ mb: '20px' }}>
            {(proposal.project_implement_date &&
              new Date(proposal.project_implement_date).toISOString().substring(0, 10)) ??
              '-No Data-'}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Typography
            sx={{
              color:
                tmpValues?.revised?.amount_required_fsupport !== undefined ? 'green' : '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('support_type')}
          </Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            {(proposal.amount_required_fsupport &&
              fCurrencyNumber(proposal.amount_required_fsupport)) ??
              '-No Data-'}
            &nbsp;
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container columnSpacing={7}>
        <Grid item md={8} xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <Typography
                sx={{
                  color: tmpValues?.revised?.project_idea !== undefined ? 'green' : '#93A3B0',
                  fontSize: '12px',
                }}
              >
                {translate('project_idea')}
              </Typography>
              <Typography sx={{ mb: '10px' }}>
                {(proposal.project_idea && proposal.project_idea) ?? '-No Data'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography
                sx={{
                  color: tmpValues?.revised?.project_goals !== undefined ? 'green' : '#93A3B0',
                  fontSize: '12px',
                }}
              >
                {translate('project_goals')}
              </Typography>
              <Typography sx={{ mb: '10px' }}>
                {(proposal.project_goals && proposal.project_goals) ?? '-No Data-'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography
                sx={{
                  color: tmpValues?.revised?.project_outputs !== undefined ? 'green' : '#93A3B0',
                  fontSize: '12px',
                }}
              >
                {translate('project_outputs')}
              </Typography>
              <Typography sx={{ mb: '10px' }}>
                {(proposal.project_outputs && proposal.project_outputs) ?? '-No Data-'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography
                sx={{
                  color: tmpValues?.revised?.project_strengths !== undefined ? 'green' : '#93A3B0',
                  fontSize: '12px',
                }}
              >
                {translate('project_strengths')}
              </Typography>
              <Typography sx={{ mb: '10px' }}>
                {(proposal.project_strengths && proposal.project_strengths) ?? '-No Data-'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography
                sx={{
                  color: tmpValues?.revised?.project_risks !== undefined ? 'green' : '#93A3B0',
                  fontSize: '12px',
                }}
              >
                {translate('project_risks')}
              </Typography>
              <Typography sx={{ mb: '10px' }}>
                {(proposal.project_risks && proposal.project_risks) ?? '-No Data-'}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              {(proposal.letter_ofsupport_req && (
                <ButtonDownloadFiles
                  type="board_ofdec_file"
                  files={proposal.letter_ofsupport_req}
                  border={
                    tmpValues?.revised.letter_ofsupport_req !== undefined ? 'green' : undefined
                  }
                />
              )) ??
                null}
            </Grid>
            <Grid item xs={12} sm={6}>
              {(proposal.project_attachments && (
                <ButtonDownloadFiles
                  type="attachments"
                  files={proposal.project_attachments}
                  border={
                    tmpValues?.revised.project_attachments !== undefined ? 'green' : undefined
                  }
                />
              )) ??
                null}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4} sx={{ mt: { xs: 3, md: 0 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={6} sm={4} md={12}>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('funding_project_request_form3.project_manager_name.label')}
              </Typography>
              <Typography>{proposal?.pm_name || '-No Data-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={12}>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('pm_email')}
              </Typography>
              <Typography>{(proposal.pm_email && proposal.pm_email) ?? '-No Data-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={12}>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('pm_mobile')}
              </Typography>
              <Typography
                sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
              >
                {(proposal.pm_mobile && proposal.pm_mobile) ?? '-No Data-'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={12}>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('governorate')}
              </Typography>
              {tmpGovernorates.length > 0 ? (
                tmpGovernorates.map((item) => (
                  <Typography key={item.governorate_id}>
                    {item?.governorate?.name || '-No Data-'}
                  </Typography>
                ))
              ) : (
                <Typography>{(proposal && proposal.governorate) ?? '-No Data-'}</Typography>
              )}
            </Grid>
            {activeRole !== 'tender_client' ? (
              <Grid item xs={6} sm={4} md={12}>
                <Box sx={{ backgroundColor: '#fff', py: '30px', pl: '10px', mb: '15px' }}>
                  <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                    {translate('project_owner_details.card_title')}
                  </Typography>
                  <Typography
                    sx={{ color: '#0E8478', fontSize: '12px', mb: '5px', fontWeight: 700 }}
                  >
                    {(proposal.user && proposal.user.employee_name) ?? '-No Data-'}
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
                </Box>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  border: `1px solid ${
                    tmpValues?.revised?.amount_required_fsupport !== undefined ? 'green' : '#fff'
                  }`,
                  py: '30px',
                  pl: '10px',
                  mb: '15px',
                }}
              >
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
                <Typography>
                  {(proposal.amount_required_fsupport &&
                    fCurrencyNumber(proposal.amount_required_fsupport)) ??
                    '-No Data-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('selected_bank')}
              </Typography>
              {(proposal.bank_information && (
                <BankImageComp
                  enableButton={true}
                  bankName={proposal.bank_information?.bank_name}
                  accountNumber={proposal.bank_information?.bank_account_number}
                  bankAccountName={proposal.bank_information?.bank_account_name}
                  imageUrl={proposal.bank_information?.card_image.url}
                  size={proposal.bank_information?.card_image.size}
                  type={proposal.bank_information?.card_image.type}
                  borderColor={proposal.bank_information?.card_image.border_color ?? 'transparent'}
                />
              )) ?? <Typography>-No Bank Information-</Typography>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainPage;
