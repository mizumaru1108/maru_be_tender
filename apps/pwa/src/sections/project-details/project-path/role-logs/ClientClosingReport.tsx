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
import { getOneClosingReport } from '../../../../queries/commons/getOneClosingReport';

interface Props {
  stepGransLog: any;
}

interface ClosingReport {
  execution_place: string;
  gender: string;
  id: string;
  number_of_beneficiaries: number;
  number_of_staff: number;
  number_of_volunteer: number;
  project_duration: string;
  project_repeated: string;
  target_beneficiaries: string;
  attachments: {
    size: number;
    type: string;
    url: string;
  }[];
  images: {
    size: number;
    type: string;
    url: string;
  }[];
}

function ClientClosingReport({ stepGransLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  const { id: proposal_id } = useParams();
  const [closingReport, setClosingReport] = React.useState<ClosingReport | null>(null);

  const [result] = useQuery({
    query: getOneClosingReport,
    variables: { id: proposal_id },
  });

  const { data, fetching, error } = result;

  useEffect(() => {
    if (!fetching) {
      setClosingReport(data.proposal_closing_report[0]);
    }
  }, [fetching, data]);

  if (fetching) return <>Loading...</>;
  if (error) return <>Error...</>;

  console.log(closingReport, 'proposal grant');

  return (
    <React.Fragment>
      {closingReport && stepGransLog.action === 'project_completed' && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">{translate('closing_project_by_client')} </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.execution_place`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{closingReport.execution_place}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.number_of_beneficiaries`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{closingReport.number_of_beneficiaries}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.number_of_staff`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{closingReport.number_of_staff}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.number_of_volunteer`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{closingReport.number_of_volunteer}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.project_duration`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{closingReport.project_duration}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.project_repeated`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>{closingReport.project_repeated}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.target_beneficiaries`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {/* {translate(`review.target_group_type_enum.${closingReport.target_beneficiaries}`)} */}
                  {target_type_map[
                    closingReport.target_beneficiaries.toUpperCase() as keyof BeneficiariesMap
                  ]
                    ? translate(
                        `review.target_group_type_enum.${closingReport.target_beneficiaries.toUpperCase()}`
                      )
                    : closingReport.target_beneficiaries}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.gender`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                <Typography>
                  {/* {translate(`review.gender.${closingReport.target_beneficiaries}`)} */}
                  {closingReport.gender}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{translate(`review.attachments`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {closingReport.attachments.length > 0 &&
                  closingReport.attachments.map((attachment, index) => (
                    <Link key={index} href={attachment.url} target="_blank" rel="noopener">
                      <Typography
                        variant={'subtitle1'}
                        sx={{
                          color: '#1E1E1E',
                          mb: '5px',
                          textDecoration: 'underline',
                        }}
                      >
                        {translate('review.attachment') + ' ' + (index + 1)}
                      </Typography>
                    </Link>
                  ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{translate(`review.images`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {closingReport.images.length > 0 &&
                  closingReport.images.map((image, index) => (
                    <Link key={index} href={image.url} target="_blank" rel="noopener">
                      <Typography
                        sx={{
                          color: '#1E1E1E',
                          mb: '5px',
                          textDecoration: 'underline',
                        }}
                      >
                        {translate('review.image') + ' ' + (index + 1)}
                      </Typography>
                    </Link>
                  ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default ClientClosingReport;
