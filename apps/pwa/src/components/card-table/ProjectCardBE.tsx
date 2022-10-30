import {
  Typography,
  Stack,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Box,
  Grid,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate } from 'react-router';
import { ProjectCardProps, ProjectCardPropsBE } from './types';
import 'moment/locale/es';
import 'moment/locale/ar';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { asignProposalToAUser } from 'queries/commons/asignProposalToAUser';
import { useMutation } from 'urql';
import { FusionAuthRoles } from '../../@types/commons';
import { deleteDraftProposal } from 'queries/client/deleteDraftProposal';

const inquiryStatusStyle = {
  canceled: { color: '#FF4842', backgroundColor: '#FF484229' },
  completed: { color: '#0E8478', backgroundColor: '#0E847829' },
  pending: { color: '#FFC107', backgroundColor: '#FFC10729' },
};

const cardFooterButtonActionLocal = {
  'show-project': 'show_project',
  'show-details': 'show_details',
  'completing-exchange-permission': 'completing_exchange_permission',
  draft: 'draft',
};

const RolesMap = {
  tender_finance: 'finance_id',
  tender_cashier: 'cashier_id',
  tender_project_manager: 'project_manager_id',
  tender_project_supervisor: 'supervisor_id',
  cluster_admin: '',
  tender_accounts_manager: '',
  tender_admin: '',
  tender_ceo: '',
  tender_client: '',
  tender_consultant: '',
  tender_moderator: '',
};
const ProjectCardBE = ({
  id,
  inquiryStatus,
  project_name,
  created_at,
  project_idea,
  payments,
  inner_status,
  cardFooterButtonAction,
  destination, // it refers to the url that I came from and the url that I have to go to
  mutate,
}: ProjectCardPropsBE) => {
  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as FusionAuthRoles;
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLocales();
  const [, updateAsigning] = useMutation(asignProposalToAUser);
  const [, deleteDrPro] = useMutation(deleteDraftProposal);

  const onDeleteDraftClick = async () => {
    const res = await deleteDrPro({ id });
    mutate();
  };

  const onContinuingDraftClick = () => {
    console.log('onContinuingDraftClick');
    navigate('/client/dashboard/funding-project-request', { state: { id } });
  };

  const handleOnClick = async () => {
    console.log(role);
    if (
      [
        'tender_finance',
        'tender_cashier',
        'tender_project_manager',
        'tender_project_supervisor',
      ].includes(role) &&
      destination !== 'requests-in-process'
    ) {
      await updateAsigning({
        _set: {
          [`${RolesMap[role]!}`]: user?.id,
        },
        where: {
          id: {
            _eq: id,
          },
        },
      });
    }
    if (destination) {
      const x = location.pathname.split('/');
      console.log(`/${x[1] + '/' + x[2] + '/' + destination}/${id}/${cardFooterButtonAction}/main`);
      navigate(`/${x[1] + '/' + x[2] + '/' + destination}/${id}/${cardFooterButtonAction}/main`);
    } else navigate(`${location.pathname}/${id}/${cardFooterButtonAction}/main`);
  };
  return (
    <Card sx={{ backgroundColor: '#fff' }}>
      <CardContent>
        {/* The Title Section  */}
        <Stack direction="row" justifyContent="space-between" gap={5}>
          <Typography
            variant="h6"
            color="text.tertiary"
            gutterBottom
            sx={{ fontSize: '15px !important' }}
          >
            {id}
          </Typography>
          {inquiryStatus && (
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: inquiryStatusStyle[inquiryStatus].backgroundColor,
                p: '5px',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: inquiryStatusStyle[inquiryStatus].color,
                  fontSize: '15px !important',
                  mb: '0px',
                }}
              >
                {translate(inquiryStatus)}
              </Typography>
            </Box>
          )}
        </Stack>

        <Typography
          gutterBottom
          sx={{ fontSize: '18px !important', fontWeight: 700, lineHeight: 28 / 18 }}
        >
          {project_name}
        </Typography>
        {project_idea && (
          <>
            <Typography
              variant="h6"
              color="#93A3B0"
              sx={{ fontSize: '10px !important', mt: '10px' }}
            >
              تفاصيل المشروع
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="#1E1E1E">
              {project_idea}
            </Typography>
          </>
        )}
        <Divider sx={{ marginTop: '30px' }} />
      </CardContent>

      {/* The Footer Section  */}
      <CardActions sx={{ justifyContent: 'space-between', px: '30px' }}>
        <Grid container spacing={2}>
          {payments && (
            <Grid container item md={12} columnSpacing={1}>
              {payments.map((payment: any, index: any) => (
                <Grid item key={index}>
                  <Typography
                    key={index}
                    color="#1E1E1E"
                    gutterBottom
                    sx={{
                      textDecorationLine: 'underline',
                      color: payment.status ? '#1E1E1E' : '#93A3B0',
                    }}
                  >
                    {payment.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
          <Grid item md={12}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="column">
                <Typography
                  variant="h6"
                  color="#93A3B0"
                  gutterBottom
                  sx={{ fontSize: '10px !important' }}
                >
                  تاريخ الإنشاء
                </Typography>
                <Typography
                  variant="h6"
                  color="#1E1E1E"
                  gutterBottom
                  sx={{ fontSize: '15px !important' }}
                >
                  {created_at
                    ? moment(created_at).format('LLLL')
                    : // ? `${footer.created_at.getDay()}.${footer.created_at.getMonth()}.${footer.created_at.getFullYear()} في ${footer.created_at.getHours()}:${footer.created_at.getMinutes()}`
                      '5 ساعات'}
                </Typography>
              </Stack>
              {cardFooterButtonAction === 'draft' ? (
                <Stack direction="row" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={onDeleteDraftClick}
                    startIcon={<img alt="" src="/icons/trash-icon.svg" />}
                    sx={{
                      color: 'Red',
                      borderColor: 'Red',
                    }}
                  >
                    حذف المسودة
                  </Button>
                  <Button
                    onClick={onContinuingDraftClick}
                    startIcon={<img alt="" src="/icons/edit-pencile-icon.svg" />}
                    sx={{ backgroundColor: 'text.tertiary', color: '#fff' }}
                  >
                    إكمال الطلب
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    background: cardFooterButtonAction === 'show-project' ? '#fff' : '#0E8478',
                    color: cardFooterButtonAction === 'show-project' ? '#1E1E1E' : '#fff',
                    borderColor: cardFooterButtonAction === 'show-project' ? '#000' : undefined,
                  }}
                  onClick={handleOnClick}
                >
                  {destination === 'requests-in-process'
                    ? translate('continue_studying_the_project')
                    : translate(cardFooterButtonActionLocal[`${cardFooterButtonAction}`])}
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ProjectCardBE;
