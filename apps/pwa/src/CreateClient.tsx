import React, { useEffect } from 'react';
import { makeClient } from 'utils/urql';
import { Provider } from 'urql';
import useAuth from 'hooks/useAuth';

function CreateClient({ children }: any) {
  const { isAuthenticated } = useAuth();
  const client = makeClient();
  useEffect(() => {
    console.log('Hello My Friend');
  }, [isAuthenticated]);
  return <Provider value={client}>{children}</Provider>;
}

export default CreateClient;
