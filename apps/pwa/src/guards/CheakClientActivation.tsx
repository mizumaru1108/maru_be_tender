import React from 'react';
import { useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import { checkClientStatus } from 'queries/client/checkClientStatus';
import UnActivatedAccount from 'sections/client/dashboard/UnActivatedAccount';
import { dispatch, useDispatch, useSelector } from 'redux/store';
import { getClientData } from 'redux/slices/clientData';

type CheakClientActivationProp = {
  children: React.ReactNode;
};

function CheakClientActivation({ children }: CheakClientActivationProp) {
  const { user, activeRole } = useAuth();
  const id = user?.id;
  // const dispatch = useDispatch();

  const { fillUpData } = useSelector((state) => state.clientData);

  React.useEffect(() => {
    if (id) {
      dispatch(getClientData(id));
    }
  }, [id]);

  const [result] = useQuery({
    query: checkClientStatus,
    variables: { id },
    pause: !id,
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no...{error.message}</p>;
  if (activeRole === 'tender_client' && (data?.user?.status !== 'ACTIVE_ACCOUNT' || !fillUpData))
    return <UnActivatedAccount />;
  if (activeRole !== 'tender_client' && data?.user?.status !== 'ACTIVE_ACCOUNT')
    return <UnActivatedAccount />;
  return <div>{children}</div>;
}

export default CheakClientActivation;
