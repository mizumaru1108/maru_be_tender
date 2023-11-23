import { Box, Button, Stack, Typography } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from 'urql';
import { IEditedValues } from '../../../@types/client_data';
import { gettingUserDataForEdit } from '../../../queries/client/gettingUserDataForEdit';
import AdministrativeAccording from './accordion/AdministrativeAccording';
import ContactAccordion from './accordion/ContactAccordion';
import LicenseAccording from './accordion/LicenseAccording';
import MainAccordion from './accordion/MainAccordion';

function DetailClientInfo() {
  const { currentLang, translate } = useLocales();
  const navigate = useNavigate();
  const params = useParams();
  const id = params.submiterId;
  const [userInfo, setUserInfo] = React.useState<IEditedValues>();
  const [result] = useQuery({ query: gettingUserDataForEdit, variables: { id } });

  const { fetching, data, error } = result;

  React.useEffect(() => {
    if (data) {
      const { user_by_pk } = data;
      const { bank_informations, email, client_data } = user_by_pk;
      let newValues: IEditedValues = {
        ...client_data,
        email,
        bank_informations,
      };
      let newval: any = [];
      if (newValues.board_ofdec_file instanceof Array && newValues.board_ofdec_file.length > 0) {
        newval = [...newValues.board_ofdec_file];
      } else if (typeof newValues.board_ofdec_file === 'object') {
        newval.push(newValues.board_ofdec_file);
      }
      newValues.board_ofdec_file = newval;
      setUserInfo(newValues);
    }
  }, [data]);

  if (fetching) return <>Loading ....</>;

  if (error) return <>{error.message}</>;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 1, minWidth: 35, minHeight: 25 }}
        >
          <Iconify
            icon={
              currentLang.value === 'en'
                ? 'eva:arrow-ios-back-outline'
                : 'eva:arrow-ios-forward-outline'
            }
            width={25}
            height={25}
          />
        </Button>
        <Typography
          variant="h4"
          sx={{
            maxWidth: '700px',
          }}
        >
          {translate('project_owner_details.client_detail_profiles_header')}
        </Typography>
      </Stack>
      <MainAccordion userInfo={userInfo} />
      <ContactAccordion userInfo={userInfo} />
      <LicenseAccording userInfo={userInfo} />
      <AdministrativeAccording userInfo={userInfo} />
    </Box>
  );
}

export default DetailClientInfo;
