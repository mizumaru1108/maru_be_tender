import React from 'react';
import { useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import { checkClientStatus } from 'queries/client/checkClientStatus';
import UnActivatedAccount from 'sections/client/dashboard/UnActivatedAccount';

type CheakClientActivationProp = {
  children: React.ReactNode;
};

function CheakClientActivation({ children }: CheakClientActivationProp) {
  const { user } = useAuth();
  const id = user?.id;
  const [result] = useQuery({
    query: checkClientStatus,
    variables: { id },
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no...{error.message}</p>;
  if (data?.user?.status !== 'ACTIVE_ACCOUNT') return <UnActivatedAccount />;
  return <div>{children}</div>;
}

export default CheakClientActivation;
