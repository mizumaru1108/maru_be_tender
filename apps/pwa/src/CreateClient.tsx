import React, { useEffect } from 'react';
import { makeClient } from 'utils/urql';
import { Provider } from 'urql';
import useAuth from 'hooks/useAuth';

function CreateClient({ children }: any) {
  const { isAuthenticated, activeRole } = useAuth();
  const client = makeClient(activeRole);
  useEffect(() => {
    console.log('Hello My Friend');
  }, [isAuthenticated, activeRole]);
  return <Provider value={client}>{children}</Provider>;
}

export default CreateClient;
