// react
import React from 'react';
import { useParams } from 'react-router';
// component
import { Grid, useTheme, Typography, Card, Divider } from '@mui/material';
// hooks
// import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
import { generateHeader } from 'utils/generateProposalNumber';
import { fCurrencyNumber } from 'utils/formatNumber';
//
import { Proposal } from '../../../@types/proposal';
import { dispatch, useSelector } from 'redux/store';
// import { getOneNameCashier } from 'queries/Cashier/getOneNameCashier';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import {
  getCashierData,
  getFinanceData,
  // getFinanceName,
  getGeneratePaymentData,
} from 'queries/commons/getOneProposal';
import Space from 'components/space/space';
import { TrackSection } from '../../../@types/commons';
import { selectSectionProjectPath } from 'utils/generateParentChild';
import { getTracksById } from 'redux/slices/track';
import useAuth from 'hooks/useAuth';

// -------------------------------------------------------------------------------------------------

interface IPropsData {
  proposalData: Proposal | null;
  loading: boolean;
}

// -------------------------------------------------------------------------------------------------

export default function ProposalDetails({ proposalData, loading }: IPropsData) {
  const { activeRole } = useAuth();
  const { track_list, proposal } = useSelector((state) => state.proposal);
  const { track, isLoading: loadingTracks } = useSelector((state) => state.tracks);
  const { translate } = useLocales();
  // const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  const [valueLevelOne, setValueLevelOne] = React.useState<TrackSection | null>(null);
  const [valueLevelTwo, setValueLevelTwo] = React.useState<TrackSection | null>(null);
  const [valueLevelThree, setValueLevelThree] = React.useState<TrackSection | null>(null);
  const [valueLevelFour, setValueLevelFour] = React.useState<TrackSection | null>(null);

  // const [{ data, fetching, error }] = useQuery({
  //   query: getFinanceName,
  //   variables: {
  //     id: proposalData?.finance_id,
  //   },
  // });

  const [{ data, fetching, error }] = useQuery({
    query: getGeneratePaymentData,
    variables: {
      proposal_id: params?.id,
      submitter_user_id: proposalData?.submitter_user_id,
      supervisor_id: proposalData?.supervisor_id,
      project_manager_id: proposalData?.project_manager_id,
      payment_id: params?.paymentId,
    },
  });

  const [cahiserData] = useQuery({
    query: getCashierData,
    variables: {
      cashier_id: proposalData?.cashier_id,
    },
    pause: !proposalData?.cashier_id,
  });

  const [financeData] = useQuery({
    query: getFinanceData,
    variables: {
      finance_id: proposalData?.finance_id,
    },
    pause: !proposalData?.finance_id,
  });

  const Employee = React.useMemo(() => {
    let tmpEmployee = {
      ceo: '-',
      spv: '-',
      pm: '-',
      cashier: '-',
      finance: '-',
    };
    if (data) {
      if (cahiserData?.data?.cashier_name?.employee_name) {
        tmpEmployee.cashier = cahiserData?.data?.cashier_name?.employee_name;
      }
      if (data?.finance_name?.employee_name) {
        tmpEmployee.finance = data?.finance_name?.employee_name;
      }
      if (data?.project_manager_name?.employee_name) {
        tmpEmployee.pm = data?.project_manager_name?.employee_name;
      }
      if (data?.supervisor_name?.employee_name) {
        tmpEmployee.spv = data?.supervisor_name?.employee_name;
      }
      if (financeData?.data?.finance_name?.employee_name) {
        tmpEmployee.ceo = financeData?.data?.finance_name?.employee_name;
      }
      if (
        data?.ceo_name &&
        data?.ceo_name.length > 0 &&
        data?.ceo_name[0]?.reviewer &&
        data?.ceo_name[0]?.reviewer?.employee_name
      ) {
        tmpEmployee.ceo = data?.ceo_name[0]?.reviewer?.employee_name;
      }
    }
    return tmpEmployee;
  }, [data, cahiserData.data, financeData.data]);

  const trackName = track_list.find((track) => track.id === proposalData?.track_id)?.name ?? 'test';
  const paymentNumber =
    proposalData?.payments.find((payment) => payment.id === params.paymentId)?.order ?? -1; //it will return number of payments or -1 if it doesn't exist

  const paymentIsDone = proposalData?.payments.find(
    (payment) => payment.id === params.paymentId && payment.status === 'done'
  )
    ? true
    : false;
  const paymentAmount =
    proposalData?.payments.find((payment) => payment.id === params.paymentId)?.payment_amount ?? -1; //it will return number of payments or -1 if it doesn't exist

  const regions = proposalData?.proposal_regions?.length
    ? proposalData?.proposal_regions.map((el) => el.region?.name).toString()
    : '-';

  const governorates = proposalData?.proposal_governorates?.length
    ? proposalData?.proposal_governorates.map((el) => el.governorate?.name).toString()
    : '-';

  React.useEffect(() => {
    if (proposal?.track_id && proposal?.track_id !== 'test') {
      dispatch(getTracksById(activeRole!, proposal?.track_id || ''));
    }
  }, [proposal, activeRole]);

  React.useEffect(() => {
    if (!loadingTracks && track.sections && track.sections.length) {
      const generate = selectSectionProjectPath({
        parent: track.sections,
        section_id: proposal.section_id,
      });

      setValueLevelOne(generate.levelOne);
      setValueLevelTwo(generate.levelTwo);
      setValueLevelThree(generate.levelThree);
      setValueLevelFour(generate.levelFour);
    }
  }, [track, loadingTracks, proposal]);

  if (fetching || cahiserData.fetching || financeData.fetching) return <>Loading...</>;
  if (error || cahiserData.error || financeData.error) return <>Oops Something went wrong!</>;

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom sx={{ mt: 1, color: theme.palette.primary.main }}>
          {translate('pages.finance.payment_generate.heading.name_of_entity')}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ p: 2.5, backgroundColor: theme.palette.primary.main, borderRadius: 0 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_name')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.project_name ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_region')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {regions}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_goals')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.project_goals ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_track')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {formatCapitalizeText(trackName) ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.batch_number')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {(paymentNumber !== -1 && paymentNumber) ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_total_support_amount')}
                &nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {fCurrencyNumber(proposalData?.amount_required_fsupport ?? 0)}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.bank_name')}
                &nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.bank_information?.bank_name ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.bank_account_name')}
                &nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.bank_information?.bank_account_name ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.bank_account_number')}
                &nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.bank_information?.bank_account_number ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.support_outputs')}
                &nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.support_outputs || '-'}
                </Typography>
              </Typography>
            </Grid>

            {/* <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_deliverables')}
                &nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.project_outputs ?? '-'}
                </Typography>
              </Typography>
            </Grid> */}
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card
          sx={{
            p: 2.5,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 0,
            mb: theme.spacing(3),
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_number')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {(proposalData?.project_number && generateHeader(proposalData?.project_number)) ??
                    proposalData?.id}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('client_list_headercell.governorate')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {governorates}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.payment_amount')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {(paymentAmount !== -1 && fCurrencyNumber(paymentAmount)) ?? 0}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.does_an_agreement')}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {proposalData?.does_an_agreement
                    ? translate('pages.finance.payment_generate.heading.yes')
                    : translate('pages.finance.payment_generate.heading.no')}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 2.5, backgroundColor: theme.palette.primary.main, borderRadius: 0 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate(`review.section_level_one`)}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {valueLevelOne ? valueLevelOne.name : '-'}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate(`review.section_level_two`)}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {valueLevelTwo ? valueLevelTwo.name : '-'}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate(`review.section_level_three`)}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {valueLevelThree ? valueLevelThree.name : '-'}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ color: theme.palette.primary.contrastText }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate(`review.section_level_four`)}&nbsp;:&nbsp;
                <Typography variant="body2" component="span">
                  {valueLevelFour ? valueLevelFour.name : '-'}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Space direction="horizontal" size="large" />
        <Space direction="horizontal" size="large" />
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={6} md={3} sx={{ color: theme.palette.primary.main }}>
            <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {`${Employee.cashier}`}
              <br />{' '}
              <Typography variant="h6" component="span">{`(${translate(
                'project_card.cashier'
              )})`}</Typography>
            </Typography>
            <Divider color="primary.main" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
          </Grid>
          <Grid item xs={6} md={3} sx={{ color: theme.palette.primary.main }}>
            <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {`${Employee.ceo}`}
              <br />{' '}
              <Typography variant="h6" component="span">{`(${translate(
                'project_card.ceo'
              )})`}</Typography>
            </Typography>
            <Divider color="primary.main" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
          </Grid>
          <Grid item xs={6} md={3} sx={{ color: theme.palette.primary.main }}>
            <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {`${Employee.pm}`}
              <br />{' '}
              <Typography variant="h6" component="span">{`(${translate(
                'project_card.project_manager'
              )})`}</Typography>
            </Typography>
            <Divider color="primary.main" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
          </Grid>
          <Grid item xs={6} md={3} sx={{ color: theme.palette.primary.main }}>
            <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {`${Employee.spv}`}
              <br />{' '}
              <Typography variant="h6" component="span">{`(${translate(
                'project_card.project_supervisor'
              )})`}</Typography>
            </Typography>
            <Divider color="primary.main" variant="fullWidth" sx={{ margin: '8px 0 8px 0' }} />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
