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
import { ProjectCardProps } from './types';

/**
 *
 * Todo: 1- starting with initializing the urql and having a query for the table.
 *       2- passing the paras as variables for the useQuesry.
 *       3- making the mutate.
 *       4- initializing the useQuery, useMutation.
 *       5- Finally, connecting everything with each other.
 */
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
const ProjectCard = ({
  title,
  content,
  footer,
  cardFooterButtonAction,
  destination, // it refers to the url that I came from and the url that I have to go to
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useLocales();

  console.log(cardFooterButtonAction);

  const onDeleteDraftClick = () => {
    console.log('onDeleteDraftClick');
    // navigate(-1)
  };

  const onContinuingDraftClick = () => {
    console.log('onContinuingDraftClick');
    // navigate(/client/dashboard/funding-project-request/step) with a specific step
  };

  const handleOnClick = () => {
    if (destination) {
      const x = location.pathname.split('/');
      console.log(
        `/${x[1] + '/' + x[2] + '/' + destination}/${title.id}/${cardFooterButtonAction}/main`
      );
      navigate(
        `/${x[1] + '/' + x[2] + '/' + destination}/${title.id}/${cardFooterButtonAction}/main`
      );
    } else navigate(`${location.pathname}/${title.id}/${cardFooterButtonAction}/main`);
  };
  return (
    <Card sx={{ backgroundColor: '#fff' }}>
      <CardContent>
        {/* The Title Section  */}
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="h6"
            color="text.tertiary"
            gutterBottom
            sx={{ fontSize: '15px !important' }}
          >
            {title.id}
          </Typography>
          {title.inquiryStatus && (
            <Box
              sx={{
                borderRadius: '10px',
                backgroundColor: inquiryStatusStyle[title.inquiryStatus].backgroundColor,
                p: '5px',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: inquiryStatusStyle[title.inquiryStatus].color,
                  fontSize: '15px !important',
                  mb: '0px',
                }}
              >
                {translate(title.inquiryStatus)}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* The Content Section  */}
        <Typography
          gutterBottom
          sx={{ fontSize: '18px !important', fontWeight: 700, lineHeight: 28 / 18 }}
        >
          {content.projectName}
        </Typography>
        <Typography
          gutterBottom
          sx={{
            fontSize: '15px !important',
            mt: '-4px',
            mb: '15px',
            fontWeight: 400,
            lineHeight: 28 / 18,
          }}
        >
          {content.organizationName}
        </Typography>
        <Stack direction="row" justifyContent="space-between" sx={{ marginBottom: '10px' }}>
          <Stack direction="column" gap={1}>
            {content.createdAt && (
              <>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  تاريخ الإنشاء
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {`${content.createdAt.getDay()}.${content.createdAt.getMonth()}.${content.createdAt.getFullYear()} في ${content.createdAt.getHours()}:${content.createdAt.getMinutes()}`}
                </Typography>
              </>
            )}
            {content.sentSection && (
              <>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  القسم المرسل
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {content.sentSection}
                </Typography>
              </>
            )}
          </Stack>
          <Stack direction="column" gap={1} style={{ marginLeft: '100px' }}>
            {content.projectStatus && (
              <>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  حالة المشروع
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {content.projectStatus}
                </Typography>
              </>
            )}
            {content.employee && (
              <>
                <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
                  الموظف
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '12px !important' }}>
                  {content.employee}
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
        {content.projectDetails && (
          <>
            <Typography variant="h6" color="#93A3B0" sx={{ fontSize: '10px !important' }}>
              تفاصيل المشروع
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="#1E1E1E">
              {content.projectDetails}
            </Typography>
          </>
        )}
        <Divider sx={{ marginTop: '30px' }} />
      </CardContent>

      {/* The Footer Section  */}
      <CardActions sx={{ justifyContent: 'space-between', px: '30px' }}>
        <Grid container spacing={2}>
          {footer.payments && (
            <Grid container item md={12} columnSpacing={1}>
              {footer.payments.map((payment, index) => (
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
                  {footer.createdAt
                    ? `${footer.createdAt.getDay()}.${footer.createdAt.getMonth()}.${footer.createdAt.getFullYear()} في ${footer.createdAt.getHours()}:${footer.createdAt.getMinutes()}`
                    : '5 ساعات'}
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
                  {translate(cardFooterButtonActionLocal[`${cardFooterButtonAction}`])}
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
