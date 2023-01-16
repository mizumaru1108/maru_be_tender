import { Box, Divider, Grid, Stack, Typography, Link, Button } from '@mui/material';
import React from 'react';
import { useSelector } from 'redux/store';
import BankImageComp from 'sections/shared/BankImageComp';
import useLocales from '../../../hooks/useLocales';

function MainPage() {
  const { translate } = useLocales();
  const { proposal } = useSelector((state) => state.proposal);

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
  } = proposal;

  React.useEffect(() => {}, [proposal]);

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      <Stack direction="row" gap={6}>
        <Stack direction="column">
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            {translate('number_of_beneficiaries_of_the_project')}
          </Typography>
          <Typography sx={{ mb: '20px' }}>{num_ofproject_binicficiaries}</Typography>
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
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
          <Typography>{translate(`project_beneficiaries.${project_beneficiaries}`)}</Typography>
        </Stack>
        <Stack direction="column">
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            {translate('project_implementation_date')}
          </Typography>
          <Typography>{new Date(project_implement_date).toISOString().substring(0, 10)}</Typography>
        </Stack>
      </Stack>
      <Divider />
      <Grid container columnSpacing={7}>
        <Grid item md={8} xs={12}>
          <Stack direction="column">
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>
              {translate('project_idea')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_idea}</Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>
              {translate('project_goals')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_goals}</Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>
              {translate('project_outputs')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_outputs}</Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>
              {translate('project_strengths')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_strengths}</Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>
              {translate('project_risks')}
            </Typography>
            <Typography sx={{ mb: '10px' }}>{project_risks}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" gap={3}>
            <Button
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
            </Button>
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
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('mobile_number')}
              </Typography>
              <Typography sx={{ mb: '15px' }}>{mobile_number}</Typography>
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
                  {translate('amount_required_for_support')}
                </Typography>
                <Typography>{amount_required_fsupport}</Typography>
              </Stack>
            </Box>
            <Stack>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('selected_bank')}
              </Typography>
              <BankImageComp
                enableButton={true}
                bankName={bank_informations[0]?.bank_name}
                accountNumber={bank_informations[0]?.bank_account_number}
                bankAccountName={bank_informations[0]?.bank_account_name}
                imageUrl={bank_informations[0].card_image.url}
                size={bank_informations[0].card_image.size}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainPage;
