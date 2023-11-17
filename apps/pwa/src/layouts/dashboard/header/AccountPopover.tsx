import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import useResponsive from 'hooks/useResponsive';
import { useNavigate } from 'react-router';
import { stringTruncate } from 'utils/stringTruncate';
import { role_url_map } from '../../../@types/commons';

import useAuth from '../../../hooks/useAuth';
import { dispatch } from 'redux/store';
import { setFiltered } from 'redux/slices/searching';

import { useQuery } from 'urql';
import { getProfileData } from 'queries/client/getProfileData';
import { useEffect, useState } from 'react';
import { ClientProfiles } from 'pages/client/ClientProfile';

export default function AccountPopover() {
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const { user, activeRole } = useAuth();
  const role = activeRole!;
  const { translate } = useLocales();

  const [clientProfiles, setClientProfiles] = useState<ClientProfiles>();

  const [result, _] = useQuery({
    query: getProfileData,
    variables: { id: user?.id },
  });

  const { data, fetching, error } = result;

  useEffect(() => {
    if (data && data.user_by_pk) {
      setClientProfiles({
        bank_informations: data.user_by_pk.bank_informations ?? [],
        client_data: data.user_by_pk.client_data,
        email: data.user_by_pk.email,
        count: data.proposal_aggregate.aggregate.count as number,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      {isMobile ? (
        <Box
          sx={{
            borderRadius: '100%',
            backgroundColor: 'background.paper',
          }}
          component={IconButton}
          onClick={() => {
            navigate(`/${role_url_map[`${role}`]}/my-profile`);
          }}
        >
          <img src="/assets/icons/dashboard-header/account-bar.svg" alt="" />
        </Box>
      ) : (
        <Box
          component={Button}
          onClick={() => {
            dispatch(setFiltered(''));
            navigate(`/${role_url_map[`${role}`]}/my-profile`);
          }}
          sx={{
            alignItems: 'center',
            p: '10px',
            display: 'flex',
            direction: 'row',
            justifyContent: 'left',
            width: '290px',
            height: '50px',
            backgroundColor: 'rgba(147, 163, 176, 0.16)',
            borderRadius: '12px',
            ':hover': { backgroundColor: 'rgba(147, 220, 176, 0.16)' },
          }}
        >
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                borderRadius: '50%',
                backgroundColor: 'background.paper',
                padding: '8px',
              }}
            >
              <img src="/assets/icons/dashboard-header/account-bar.svg" alt="" />
            </Box>
            <Stack alignItems="start">
              <Typography
                sx={{
                  color: 'text.tertiary',
                  fontSize: '12px',
                }}
              >
                {role !== 'tender_client'
                  ? stringTruncate(user?.firstName || user?.fullName, 31)
                  : stringTruncate(clientProfiles?.client_data?.entity!, 31)}
              </Typography>
              <Typography sx={{ color: '#1E1E1E', fontSize: '14px' }}>{translate(role)}</Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}
