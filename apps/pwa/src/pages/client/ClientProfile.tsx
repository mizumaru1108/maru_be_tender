import { LoadingButton } from '@mui/lab';
import { Button, Divider, Grid, Stack, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import useResponsive from 'hooks/useResponsive';
import { getProfileData } from 'queries/client/getProfileData';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import BankImageComp from 'sections/shared/BankImageComp';
import { useQuery } from 'urql';
import ButtonDownloadFiles from '../../components/button/ButtonDownloadFiles';
import { FEATURE_EDIT_CLIENT_INFORMATION } from '../../config';
import useLocales from '../../hooks/useLocales';
import axiosInstance from '../../utils/axios';
import ReactJoyride, { Step } from 'react-joyride';
import CloseIcon from '@mui/icons-material/Close';
import { bank_information } from '../../@types/commons';
import { IEditedValues } from '../../@types/client_data';

const mockData = {
  project_name: 'اسم الشريك - جمعية الدعوة والإرشاد وتوعية الجاليات',
  minister_type: 'وزارة التجارة - تجاري',
  number_of_beni: '100',
  number_of_employees: '113',
  headquarters: 'Damascus',
  establishment_date: '10 / 11 / 2020',
  number_of_done_projects: '13',
  authority: 'وزارة الداخلية',
  license_number: '1023-0316-4648-8721',
  license_expiry_date: '10 / 08 / 2022',
  license_issue_date: '10 / 08 / 2022',
  license_file: 'image.',
};

interface ClientProfiles {
  bank_informations: bank_information[];
  client_data: IEditedValues;
  email: string;
  count: number;
}

function ClientProfile() {
  const { user, activeRole } = useAuth();
  const { currentLang, translate } = useLocales();

  const [newBoardOfDec, setNewBoardOfDec] = useState([]);
  const [clientProfiles, setClientProfiles] = useState<ClientProfiles>();
  const [runTour, setRunTour] = useState(false);

  // Step Joyride
  const steps: Step[] = [
    {
      target: '#information',
      hideFooter: true,
      disableBeacon: true,
      isFixed: true,
      content: (
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography>{translate('pages.client.tooltip_information')}</Typography>
          <IconButton sx={{ color: '#A4A4A4' }} onClick={() => setRunTour(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>
      ),
      placement: 'bottom',
      styles: {
        options: {
          width: 280,
          zIndex: 10000,
        },
        tooltip: {
          paddingRight: 2,
          paddingLeft: 2,
          paddingTop: 0,
          paddingBottom: 0,
          marginRight: currentLang.value === 'en' ? 100 : 0,
          marginLeft: currentLang.value === 'en' ? 0 : 85,
          borderRadius: '15px',
        },
      },
    },
  ];

  const [result, _] = useQuery({
    query: getProfileData,
    variables: { id: user?.id },
  });
  const { data, fetching, error } = result;

  // console.log({ data });

  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const ContentStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  const [disabelEdit, setDisabelEdit] = useState({
    user_edit: 0,
    association_edit: 0,
  });
  const [loadingEditButton, setLoadingEditButton] = useState(false);
  const fetchingEditRequest = async () => {
    setLoadingEditButton(true);
    try {
      const rest = await axiosInstance.get('/tender/client/edit-request/my-pending-count', {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log({ rest });
      // console.log('res: ', rest);
      if (!!rest) {
        setDisabelEdit((prev: any) => ({
          ...prev,
          association_edit: rest.data.data.dataCount,
        }));
        setLoadingEditButton(false);
      }
    } catch (err) {
      setLoadingEditButton(false);
      console.log(err);
    }
  };

  function ValidateDataClient(clientData: ClientProfiles) {
    if (
      clientData &&
      clientData.bank_informations &&
      clientData.client_data &&
      clientData.email
      //  && data.user_by_pk.bank_informations.length !== 0
    ) {
      const {
        authority,
        date_of_esthablistmen,
        headquarters,
        num_of_employed_facility,
        num_of_beneficiaries,
        entity_mobile,
        license_number,
        license_issue_date,
        license_expired,
        license_file,
        board_ofdec_file,
        ceo_name,
        chairman_mobile,
        ceo_mobile,
        chairman_name,
        data_entry_name,
        data_entry_mobile,
        data_entry_mail,
      } = clientData.client_data;
      if (
        !Object.values({
          authority,
          date_of_esthablistmen,
          headquarters,
          num_of_employed_facility,
          num_of_beneficiaries,
          entity_mobile,
          license_number,
          license_issue_date,
          license_expired,
          license_file,
          board_ofdec_file,
          ceo_name,
          chairman_mobile,
          ceo_mobile,
          chairman_name,
          data_entry_name,
          data_entry_mobile,
          data_entry_mail,
        }).some((val) => !val)
      ) {
        const checkDeletedBank = clientData.bank_informations.findIndex(
          (bank: any) => bank && bank.bank_list && bank.bank_list.is_deleted === true
        );
        console.log('clientData.bank_informations', clientData.bank_informations);
        if (checkDeletedBank > -1) {
          setRunTour(true);
        } else {
          console.log('all data complete');
          setRunTour(false);
        }
      } else {
        console.log('please complete your profile data');
        setRunTour(true);
      }
    } else {
      console.log('please complete your profile data');
      setRunTour(true);
    }
  }

  useEffect(() => {
    fetchingEditRequest();

    if (data && data.user_by_pk) {
      setClientProfiles({
        bank_informations: data.user_by_pk.bank_informations ?? [],
        client_data: data.user_by_pk.client_data,
        email: data.user_by_pk.email,
        count: data.proposal_aggregate.aggregate.count as number,
      });
      // ValidateDataClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (clientProfiles !== undefined && !loadingEditButton) {
      ValidateDataClient(clientProfiles);
    } else {
      console.log('please complete your profile data');
      setRunTour(true);
    }
  }, [clientProfiles, loadingEditButton]);

  if (fetching) return <>Loading ....</>;

  if (error) return <>{error.message}</>;

  return (
    // <Page title="My Profile">
    <Page title={translate('pages.common.my_profile')}>
      <Container>
        <ContentStyle>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" sx={{ mb: '5px' }}>
              <Typography variant="h5">{clientProfiles?.client_data?.entity}</Typography>
              <Typography variant="h6" sx={{ color: '#1E1E1E' }}>
                {clientProfiles?.client_data?.authority ?? '- No Data -'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button
                startIcon={
                  <div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_398_3192)">
                        <path
                          d="M15.2353 0.765303C14.7821 0.312767 14.1678 0.0585938 13.5273 0.0585938C12.8869 0.0585938 12.2726 0.312767 11.8193 0.765303L0.976677 11.608C0.666178 11.9167 0.419985 12.284 0.252342 12.6885C0.0846994 13.093 -0.00106532 13.5268 9.98748e-06 13.9646V15.3333C9.98748e-06 15.5101 0.0702479 15.6797 0.195272 15.8047C0.320296 15.9297 0.489866 16 0.666677 16H2.03534C2.47318 16.0012 2.90692 15.9156 3.31145 15.748C3.71597 15.5805 4.08325 15.3344 4.39201 15.024L15.2353 4.18064C15.6877 3.72743 15.9417 3.11328 15.9417 2.47297C15.9417 1.83266 15.6877 1.21851 15.2353 0.765303V0.765303ZM3.44934 14.0813C3.07335 14.4548 2.56532 14.6651 2.03534 14.6666H1.33334V13.9646C1.33267 13.7019 1.38411 13.4417 1.4847 13.1989C1.58529 12.9562 1.73302 12.7359 1.91934 12.5506L10.148 4.32197L11.6813 5.8553L3.44934 14.0813ZM14.292 3.23797L12.6213 4.9093L11.088 3.3793L12.7593 1.70797C12.86 1.60751 12.9795 1.52786 13.111 1.47358C13.2424 1.41929 13.3833 1.39143 13.5255 1.39158C13.6678 1.39174 13.8086 1.41991 13.9399 1.47448C14.0712 1.52905 14.1905 1.60896 14.291 1.70964C14.3915 1.81032 14.4711 1.9298 14.5254 2.06126C14.5797 2.19272 14.6076 2.33359 14.6074 2.47581C14.6072 2.61804 14.5791 2.75885 14.5245 2.89019C14.4699 3.02153 14.39 3.14084 14.2893 3.2413L14.292 3.23797Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_398_3192">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                }
                sx={{
                  backgroundColor: '#0169DE',
                  color: '#fff',
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: '#1482FE' },
                  px: '15px',
                  py: '0px',
                  height: '45px',
                  fontSize: isMobile ? '10px' : '15px',
                }}
                onClick={() => navigate('/client/my-profile/edit-user')}
                disabled={!FEATURE_EDIT_CLIENT_INFORMATION}
              >
                {/* تعديل معلومات الحساب */}
                {translate('pages.client.edit_user_information')}
              </Button>
              {!fetching && !loadingEditButton && (
                <ReactJoyride
                  steps={steps}
                  run={runTour}
                  // callback={handleJoyrideCallback}
                  hideCloseButton
                  disableCloseOnEsc
                  disableScrollParentFix
                  disableScrolling
                  scrollToFirstStep
                  disableOverlayClose
                  spotlightClicks
                />
              )}
              <LoadingButton
                id="information"
                loading={loadingEditButton}
                startIcon={
                  <div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_398_3192)">
                        <path
                          d="M15.2353 0.765303C14.7821 0.312767 14.1678 0.0585938 13.5273 0.0585938C12.8869 0.0585938 12.2726 0.312767 11.8193 0.765303L0.976677 11.608C0.666178 11.9167 0.419985 12.284 0.252342 12.6885C0.0846994 13.093 -0.00106532 13.5268 9.98748e-06 13.9646V15.3333C9.98748e-06 15.5101 0.0702479 15.6797 0.195272 15.8047C0.320296 15.9297 0.489866 16 0.666677 16H2.03534C2.47318 16.0012 2.90692 15.9156 3.31145 15.748C3.71597 15.5805 4.08325 15.3344 4.39201 15.024L15.2353 4.18064C15.6877 3.72743 15.9417 3.11328 15.9417 2.47297C15.9417 1.83266 15.6877 1.21851 15.2353 0.765303V0.765303ZM3.44934 14.0813C3.07335 14.4548 2.56532 14.6651 2.03534 14.6666H1.33334V13.9646C1.33267 13.7019 1.38411 13.4417 1.4847 13.1989C1.58529 12.9562 1.73302 12.7359 1.91934 12.5506L10.148 4.32197L11.6813 5.8553L3.44934 14.0813ZM14.292 3.23797L12.6213 4.9093L11.088 3.3793L12.7593 1.70797C12.86 1.60751 12.9795 1.52786 13.111 1.47358C13.2424 1.41929 13.3833 1.39143 13.5255 1.39158C13.6678 1.39174 13.8086 1.41991 13.9399 1.47448C14.0712 1.52905 14.1905 1.60896 14.291 1.70964C14.3915 1.81032 14.4711 1.9298 14.5254 2.06126C14.5797 2.19272 14.6076 2.33359 14.6074 2.47581C14.6072 2.61804 14.5791 2.75885 14.5245 2.89019C14.4699 3.02153 14.39 3.14084 14.2893 3.2413L14.292 3.23797Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_398_3192">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                }
                sx={{
                  backgroundColor: '#0169DE',
                  color: '#fff',
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: '#1482FE' },
                  px: '15px',
                  py: '0px',
                  height: '45px',
                  fontSize: isMobile ? '10px' : '15px',
                }}
                onClick={() => navigate('/client/my-profile/edit')}
                disabled={disabelEdit.association_edit > 0 || !FEATURE_EDIT_CLIENT_INFORMATION}
              >
                {/* تعديل معلومات الحساب */}
                {translate('pages.client.edit_association_information')}
              </LoadingButton>
            </Stack>
          </Stack>
          <Divider />
          <Grid container rowSpacing={3} columnSpacing={3}>
            <Grid item md={7}>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                المعلومات الرئيسية
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>عدد المستفيدين من خدمات الجهة:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.num_of_beneficiaries ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>المقر</Typography>
                  <Typography>
                    {clientProfiles?.client_data?.headquarters ?? '- No Data -'}
                  </Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>عدد موظفين بدوام كلي للمنشأة:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.num_of_employed_facility ?? '- No Data -'}
                  </Typography>
                  {/* <Typography>{mockData.number_of_beni ?? '- No Data -'}</Typography> */}
                  <Typography sx={{ fontSize: '12px' }}>تاريخ التأسيس:</Typography>
                  <Typography>
                    {clientProfiles?.client_data?.date_of_esthablistmen ?? '- No Data -'}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                معلومات الاتصال
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>المنطقة:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.region ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>الموقع الإلكتروني:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.website ?? '- No Data -'}
                  </Typography>
                  {/* <Typography sx={{ fontSize: '12px' }}>القرية (الهجرة):</Typography>
                  <Typography sx={{ mb: '15px' }}>القرية (الهجرة)</Typography> */}
                </Stack>

                <Stack direction="column" alignItems="start">
                  <Typography sx={{ fontSize: '12px' }}>المحافظة:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.governorate ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>حساب تويتر:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.twitter_acount ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>كيان المحمول</Typography>
                  <Typography
                    sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {clientProfiles?.client_data?.entity_mobile ?? '- No Data -'}
                  </Typography>
                </Stack>

                <Stack direction="column" alignItems="start">
                  <Typography sx={{ fontSize: '12px' }}>المركز (الإدارة):</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.center_administration ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>البريد الإلكتروني:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.email ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>الجوال</Typography>
                  <Typography
                    sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {clientProfiles?.client_data?.phone ?? '- No Data -'}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                بيانات الإدارية
              </Typography>
              <Stack direction="row" gap={3} justifyContent="space-between" sx={{ mb: '15px' }}>
                <Stack direction="column" alignItems="start">
                  <Typography sx={{ fontSize: '12px' }}>جوال المدير التنفيذي:</Typography>
                  <Typography
                    sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {clientProfiles?.client_data?.ceo_mobile ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>جوال رئيس مجلس الإدارة:</Typography>
                  <Typography
                    sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {clientProfiles?.client_data?.chairman_mobile ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>جوال مدخل البيانات:</Typography>
                  <Typography
                    sx={{ mb: '15px', direction: `${currentLang.value}` === 'ar' ? 'rtl' : 'ltr' }}
                  >
                    {clientProfiles?.client_data?.data_entry_mobile ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>بريد مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.data_entry_mail ?? '- No Data -'}
                  </Typography>
                </Stack>

                <Stack direction="column">
                  <Typography sx={{ fontSize: '12px' }}>اسم المدير التنفيذي:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.ceo_name ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>اسم رئيس مجلس الإدارة:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.chairman_name ?? '- No Data -'}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>اسم مدخل البيانات:</Typography>
                  <Typography sx={{ mb: '15px' }}>
                    {clientProfiles?.client_data?.data_entry_name ?? '- No Data -'}
                  </Typography>
                </Stack>
              </Stack>

              <Typography variant="h6" sx={{ color: '#1E1E1E', mb: '15px' }}>
                المعلومات البنكية
              </Typography>
              <Grid container spacing={5}>
                {clientProfiles &&
                clientProfiles?.bank_informations &&
                clientProfiles?.bank_informations.length > 0 ? (
                  clientProfiles?.bank_informations.map((item: any, index: any) => (
                    <Grid item key={index} md={6} xs={12}>
                      <BankImageComp
                        enableButton={true}
                        imageUrl={item.card_image.url ?? '#'}
                        bankName={item.bank_name}
                        accountNumber={item.bank_account_number}
                        bankAccountName={item.bank_account_name}
                        size={item?.card_image?.size ?? 0}
                        type={item?.card_image?.type ?? ''}
                        borderColor={item?.color ?? 'transparent'}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item md={6} xs={12}>
                    <Typography sx={{ mb: '15px' }}>{'- No Data -'}</Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item md={5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1,
                  m: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>المشاريع المنجزة</Typography>
                  <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.tertiary' }}>
                    {clientProfiles?.count ?? 0}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: '7px' }}>
                    معلومات الترخيص
                  </Typography>

                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>رقم الترخيص:</Typography>
                    <Typography>
                      {clientProfiles?.client_data?.license_number ?? '- No Data -'}
                    </Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>تاريخ انتهاء الترخيص:</Typography>
                    <Typography>
                      {clientProfiles?.client_data?.license_expired ?? '- No Data -'}
                    </Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>تاريخ اصدار الترخيص:</Typography>
                    <Typography>
                      {clientProfiles?.client_data?.license_issue_date ?? '- No Data -'}
                    </Typography>
                  </Stack>
                  <Stack direction="column" gap={1} justifyContent="start" sx={{ mb: '10px' }}>
                    <Typography sx={{ color: '#93A3B0' }}>ملف الترخيص:</Typography>
                    <Typography>
                      {clientProfiles &&
                      clientProfiles?.client_data &&
                      clientProfiles?.client_data?.license_file &&
                      clientProfiles?.client_data?.license_file.url ? (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={clientProfiles?.client_data?.license_file.url}
                        >
                          اضغط هنا لرؤية ملف الترخيص
                        </a>
                      ) : (
                        '- No Data -'
                      )}
                    </Typography>
                  </Stack>
                </Box>
                {/* Record 0fDec file */}
                <Stack direction="column" component="div" sx={{ mt: 4 }}>
                  <Typography variant="body1" component="p" sx={{ color: '#93A3B0', mb: 2 }}>
                    {translate('account_manager.partner_details.board_ofdec_file')}:
                  </Typography>
                  {/* <Grid container spacing={2}>
                    {newBoardOfDec && newBoardOfDec.length > 0 ? (
                      newBoardOfDec.map((item, index) => (
                        <Grid item xs={6} md={6} key={index}>
                          <ButtonDownloadFiles files={item} />
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={6} md={6}>
                        {'-'}
                      </Grid>
                    )}
                  </Grid> */}
                  <Grid container spacing={2}>
                    {clientProfiles?.client_data?.board_ofdec_file &&
                      typeof clientProfiles?.client_data?.board_ofdec_file !== 'string' &&
                      clientProfiles?.client_data?.board_ofdec_file.length > 0 &&
                      clientProfiles?.client_data?.board_ofdec_file.map((item: any, index: any) => (
                        <Grid item xs={6} md={6} key={index}>
                          <ButtonDownloadFiles files={item} />
                        </Grid>
                      ))}
                    {clientProfiles?.client_data?.board_ofdec_file &&
                      typeof clientProfiles?.client_data?.board_ofdec_file === 'string' && (
                        <Grid item xs={6} md={6}>
                          <ButtonDownloadFiles
                            files={clientProfiles?.client_data?.board_ofdec_file}
                          />
                        </Grid>
                      )}
                    {!clientProfiles?.client_data?.board_ofdec_file && (
                      <Grid item xs={6} md={6}>
                        {'- No Data -'}
                      </Grid>
                    )}
                  </Grid>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ClientProfile;
