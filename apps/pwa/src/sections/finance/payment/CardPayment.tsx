// react
import React from 'react';
import { useNavigate, useParams } from 'react-router';
// component
import { Grid, useTheme, Typography, Card } from '@mui/material';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
//
import { Proposal } from '../../../@types/proposal';

// -------------------------------------------------------------------------------------------------

interface IPropsData {
  proposalData: Proposal | null;
}

// -------------------------------------------------------------------------------------------------

export default function CardPayment({ proposalData }: IPropsData) {
  const { activeRole } = useAuth();
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
          {translate('pages.finance.payment_generate.heading.invoice_to')}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2.5, backgroundColor: theme.palette.common.white }}>
          <Grid container rowSpacing={1} columnSpacing={2}>
            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.client_name')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.ceo_name')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.cashier_name')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.supervisor_name')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.project_manager_name')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2.5, backgroundColor: theme.palette.common.white }}>
          <Grid container rowSpacing={1} columnSpacing={2}>
            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.payment_description')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.payment_total')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.transaction_number')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {translate('pages.finance.payment_generate.heading.date_of_payment')}&nbsp;:
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Value / -
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </React.Fragment>
  );
}
