import { Grid, Link, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'redux/store';
import { useQuery } from 'urql';
import { PropsalLogGrants } from '../../../../@types/proposal';
import {
  BeneficiariesMap,
  target_age_map,
  target_type_map,
} from '../../../../@types/supervisor-accepting-form';
import ButtonDownloadFiles from '../../../../components/button/ButtonDownloadFiles';
import { getOneClosingReport } from '../../../../queries/commons/getOneClosingReport';
import { fCurrencyNumber } from '../../../../utils/formatNumber';
import BankImageComp from '../../../shared/BankImageComp';

function ClientProposalLog() {
  const { proposal, isLoading } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  const { id: proposal_id } = useParams();

  if (isLoading) return <>Loading...</>;

  return (
    <React.Fragment>
      <Stack direction="row" gap={6} sx={{ marginBottom: '10px' }}>
        <Stack direction="column">
          <Typography
            sx={{
              color: '#93A3B0',
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
            {(proposal.execution_time && proposal.execution_time) ?? '-No Data-'}
          </Typography>
        </Stack>
        <Stack direction="column">
          <Typography
            sx={{
              color: '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('where_to_implement_the_project')}
          </Typography>
          <Typography sx={{ mb: '20px' }}>
            {(proposal.project_location && proposal.project_location) ?? '-No Data-'}
          </Typography>
          <Typography
            sx={{
              color: '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('target_group_type')}
          </Typography>
          <Typography>
            {(proposal.project_beneficiaries &&
              translate(
                `section_portal_reports.heading.gender.${proposal.project_beneficiaries.toLowerCase()}`
              )) ??
              '- No Data -'}
          </Typography>
        </Stack>
        <Stack direction="column">
          <Typography
            sx={{
              color: '#93A3B0',
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
          <Typography
            sx={{
              color: '#93A3B0',
              fontSize: '12px',
              mb: '5px',
            }}
          >
            {translate('support_type')}
          </Typography>
          <Typography>
            {/* {support_type ? translate('full_support') : translate('partial_support')}&nbsp;
            <Typography component="span">{translate('with')}&nbsp;</Typography> */}
            {/* <Typography component="span" sx={{ fontWeight: 'bold' }}>
              {fCurrencyNumber(proposal_item_budgets_aggregate.aggregate.sum.amount)}&nbsp;
            </Typography> */}
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              {(proposal.amount_required_fsupport &&
                fCurrencyNumber(proposal.amount_required_fsupport)) ??
                '-No Data-'}
              &nbsp;
            </Typography>
            {/* <Typography component="span">{translate('amount')}&nbsp;</Typography> */}
          </Typography>
        </Stack>
      </Stack>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Stack direction="column">
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_idea')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>
              {(proposal.project_idea && proposal.project_idea) ?? '-No Data'}
            </Typography>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_goals')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>
              {(proposal.project_goals && proposal.project_goals) ?? '-No Data-'}
            </Typography>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_outputs')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>
              {(proposal.project_outputs && proposal.project_outputs) ?? '-No Data-'}
            </Typography>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_strengths')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>
              {(proposal.project_strengths && proposal.project_strengths) ?? '-No Data-'}
            </Typography>
            <Typography
              sx={{
                color: '#93A3B0',
                fontSize: '12px',
              }}
            >
              {translate('project_risks')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>
              {(proposal.project_risks && proposal.project_risks) ?? '-No Data-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={4} xs={12} sx={{ marginBottom: '10px' }}>
          <Stack direction="column">
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('pm_email')}
              </Typography>
              <Typography sx={{ mb: '15px' }}>
                {(proposal.pm_email && proposal.pm_email) ?? '-No Data-'}
              </Typography>
            </Stack>
            <Stack direction="column" alignItems="start">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('pm_mobile')}
              </Typography>
              <Typography
                sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
              >
                {(proposal.pm_mobile && proposal.pm_mobile) ?? '-No Data-'}
              </Typography>
            </Stack>
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('governorate')}
              </Typography>
              <Typography sx={{ mb: '15px' }}>
                {(proposal && proposal.governorate) ?? '-No Data-'}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="row" justifyContent="space-between" gap={3}>
            {(proposal.letter_ofsupport_req && (
              <ButtonDownloadFiles files={proposal.letter_ofsupport_req} border={undefined} />
            )) ??
              null}
            {(proposal.project_attachments && (
              <ButtonDownloadFiles files={proposal.project_attachments} border={undefined} />
            )) ??
              null}
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
              {translate('selected_bank')}
            </Typography>
            {(proposal.bank_information && (
              <Grid item md={4} xs={12}>
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
              </Grid>
            )) ?? (
              <Typography sx={{ mb: '15px' }}>
                {/* {(client_data && client_data.governorate && client_data.governorate) ?? '-No Data-'} */}
                -No Bank Information-
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ClientProposalLog;
