import useAuth from 'hooks/useAuth';
import { checkClientStatus } from 'queries/client/checkClientStatus';
import React from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';

type CheakClientActivationProp = {
  children: React.ReactNode;
};

function CheakClientActivation({ children }: CheakClientActivationProp) {
  console.log('checking for the user activation status');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = user!;
  const [result, _] = useQuery({
    query: checkClientStatus,
    variables: { id },
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  if (data?.user_by_pk?.client_data[0]?.status === 'WAITING_FOR_ACTIVATION')
    navigate('/client/dashboard/app');
  return <div>{children}</div>;
}

export default CheakClientActivation;
