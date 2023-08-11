import { Grid, Link, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'redux/store';
import { ClosingReportData } from 'sections/client/project-report/types';
import { useQuery } from 'urql';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
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

// interface ClosingReport {
//   execution_place: string;
//   gender: string;
//   id: string;
//   number_of_beneficiaries: number;
//   number_of_staff: number;
//   number_of_volunteer: number;
//   project_duration: string;
//   project_repeated: string;
//   target_beneficiaries: string;
//   attachments: {
//     size: number;
//     type: string;
//     url: string;
//   }[];
//   images: {
//     size: number;
//     type: string;
//     url: string;
//   }[];
// }

function ClientClosingReport({ stepGransLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  const { id: proposal_id } = useParams();
  const [closingReport, setClosingReport] = React.useState<ClosingReportData | null>(null);

  // const [result] = useQuery({
  //   query: getOneClosingReport,
  //   variables: { id: proposal_id },
  // });

  // const { data, fetching, error } = result;

  useEffect(() => {
    if (proposal && proposal.proposal_closing_report) {
      setClosingReport(proposal.proposal_closing_report[0]);
    }
  }, [proposal]);

  // if (fetching) return <>Loading...</>;
  // if (error) return <>Error...</>;

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
                {/* <Typography>{closingReport.execution_place}</Typography> */}
                {/* <Typography>
                  {translate(
                    `pages.common.close_report.text.option.${closingReport.execution_place}`
                  )}
                </Typography> */}
                {closingReport?.execution_places && closingReport?.execution_places?.length > 0
                  ? closingReport?.execution_places?.map((item, index) => (
                      <>
                        <Typography variant="body1">
                          {`${translate(
                            `pages.common.close_report.text.option.execution_places.${item.selected_values}`
                          )} ( ${item.selected_numbers > 0 ? Number(item.selected_numbers) : 0} )`}
                        </Typography>
                      </>
                    ))
                  : null}
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
                {/* <Typography>{closingReport.project_duration}</Typography> */}
                <Typography>
                  {/* {translate(
                    `pages.common.close_report.text.option${closingReport.project_duration}`
                  )} */}
                  {`${translate(
                    `pages.common.close_report.text.option.${closingReport?.project_duration}`
                  )} ( ${
                    closingReport?.number_project_duration &&
                    closingReport?.number_project_duration > 0
                      ? Number(closingReport?.number_project_duration)
                      : 0
                  } ) `}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.project_repeated`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {/* <Typography>{closingReport.project_repeated}</Typography> */}
                <Typography>
                  {/* {translate(
                    `pages.common.close_report.text.option.${closingReport.project_repeated}`
                  )} */}
                  {`${translate(
                    `pages.common.close_report.text.option.${closingReport?.project_repeated}`
                  )} ( ${
                    closingReport?.number_project_repeated &&
                    closingReport?.number_project_repeated > 0
                      ? Number(closingReport?.number_project_repeated)
                      : 0
                  } ) `}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.target_beneficiaries`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {/* <Typography>
                  {translate(
                    `pages.common.close_report.text.option.${closingReport.target_beneficiaries}`
                  )}
                </Typography> */}
                {closingReport?.beneficiaries && closingReport?.beneficiaries?.length > 0
                  ? closingReport?.beneficiaries?.map((item, index) => (
                      <>
                        <Typography variant="body1">
                          {`${translate(
                            `pages.common.close_report.text.option.beneficiaries.${item.selected_values}`
                          )} ( ${item.selected_numbers > 0 ? Number(item.selected_numbers) : 0} )`}
                        </Typography>
                      </>
                    ))
                  : null}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">{translate(`review.gender`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {/* <Typography>
                  {closingReport.gender}
                </Typography> */}
                {/* <Typography>
                  {translate(`section_portal_reports.heading.gender.${closingReport.gender}`)}
                </Typography> */}
                {closingReport?.genders && closingReport?.genders?.length > 0
                  ? closingReport?.genders?.map((item, index) => (
                      <>
                        <Typography variant="body1">
                          {`${formatCapitalizeText(
                            translate(`project_beneficiaries.${item.selected_values}`)
                          )} ( ${item.selected_numbers > 0 ? Number(item.selected_numbers) : 0} )`}
                        </Typography>
                      </>
                    ))
                  : null}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{translate(`review.attachments`)}</Typography>
            <Stack direction="column" gap={2} sx={{ pb: 2 }}>
              <Stack direction="column" gap={2} sx={{ pb: 2 }}>
                {closingReport.attachments.length > 0 &&
                  closingReport.attachments.map((attachment, index) => (
                    <Link key={index} href={attachment.url!} target="_blank" rel="noopener">
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
                    <Link key={index} href={image.url!} target="_blank" rel="noopener">
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
