import * as React from 'react';
import { Container, Typography, Box, Grid, Stack, Button, Tabs, Tab } from '@mui/material';
import { ProjectCard } from 'components/card-table';
import { useNavigate } from 'react-router';
import useLocales from 'hooks/useLocales';
import { generateHeader } from '../../../utils/generateProposalNumber';
import CardTableByBE from 'components/card-table/CardTableByBE';

function PreviousFundingInqueries() {
  const { translate } = useLocales();

  return (
    <>
      <Grid item md={12} xs={12}>
        <CardTableByBE
          title={translate('previous_support_requests')}
          endPoint="tender-proposal/previous"
          destination="previous-funding-requests"
          limitShowCard={4}
          cardFooterButtonAction="show-project"
          showPagination={false}
          navigateLink="/client/dashboard/previous-funding-requests"
        />
      </Grid>
    </>
  );
}

export default PreviousFundingInqueries;
