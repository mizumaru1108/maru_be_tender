import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { Provider } from 'urql';
import { makeClient } from 'utils/urql';

function CreateClient({ children }: any) {
  const { isAuthenticated, activeRole, user } = useAuth();

  const client = makeClient(activeRole);

  useEffect(() => {}, [isAuthenticated, activeRole, user]);

  return <Provider value={client}>{children}</Provider>;
}

export default CreateClient;
