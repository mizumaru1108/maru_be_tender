import useAuth from 'hooks/useAuth';
import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import { FloatinActionBar as FloatinActionBarFaciltateTrack } from './supervisor-facilitate-track';
import { FloatingActionBar as FloatingActionBarGeneralTracks } from './supervisor-general-tracks';

function SupervisorFloatingActionBar({ organizationId, data }: any) {
  const { user } = useAuth();

  const [employeePath, setEmployeePath] = React.useState('');
  const id = user?.id;

  const [result] = useQuery({
    query: `query GetEmployeePath($id: String = "") {
    user: user_by_pk(id: $id) {
      path: employee_path
    }
  }
  `,
    variables: { id },
  });
  const { data: employee_path, fetching, error } = result;

  useEffect(() => {
    if (employee_path?.user?.path) {
      setEmployeePath(employee_path?.user?.path);
    }
  }, [employee_path]);
  if (fetching) return <>... Loading</>;
  if (error) return <>Opps, Something went wrong</>;
  return (
    <>
      {employeePath === 'CONCESSIONAL_GRANTS' ? (
        <FloatinActionBarFaciltateTrack organizationId={organizationId} data={data} />
      ) : (
        <FloatingActionBarGeneralTracks organizationId={organizationId} data={data} />
      )}
    </>
  );
}

export default SupervisorFloatingActionBar;
