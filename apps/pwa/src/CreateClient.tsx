import { useEffect } from 'react';
import { makeClient } from 'utils/urql';
import { Provider } from 'urql';
import useAuth from 'hooks/useAuth';
import { Box } from '@mui/material';

function CreateClient({ children }: any) {
  const { isAuthenticated, activeRole, user } = useAuth();
  const client = makeClient(activeRole as string);

  useEffect(() => {}, [isAuthenticated, activeRole]);

  return <>{!user ? <Box>{children}</Box> : <Provider value={client}>{children}</Provider>}</>;

  // return <Provider value={client}>{children}</Provider>;
}

export default CreateClient;
