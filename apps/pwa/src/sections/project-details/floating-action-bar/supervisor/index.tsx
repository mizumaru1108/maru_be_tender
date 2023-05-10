import useAuth from 'hooks/useAuth';
import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import FloatingActionBarGeneralTracks from './supervisor-general-tracks';
import FloatinActionBarFaciltateTrack from './supervisor-facilitate-track';
import { TrackProps } from '../../../../@types/commons';

function SupervisorFloatingActionBar() {
  const { user } = useAuth();

  const [employeePath, setEmployeePath] = React.useState<TrackProps | null>(null);

  const id = user?.id;

  // later it will be gotten from the proposal in REDUX
  // we are querying the path of the supervisor because there is a difference in the functionality based on the path
  const [{ data: employee_path, fetching, error }] = useQuery({
    query: `query GetEmployeePath($id: String = "") {
      user: user_by_pk(id: $id) {
        path: employee_path
        track {
          id
          name
          with_consultation
        }
      }
    }
    
  `,
    variables: { id },
  });

  useEffect(() => {
    if (employee_path?.user?.track) {
      setEmployeePath(employee_path?.user?.track);
    }
  }, [employee_path]);

  if (fetching) return <>... Loading</>;

  if (error) return <>Opps, Something went wrong</>;

  console.log({ employeePath });

  return (
    <>
      {employeePath && employeePath.with_consultation ? (
        <FloatinActionBarFaciltateTrack />
      ) : (
        <FloatingActionBarGeneralTracks />
      )}
    </>
  );
}

export default SupervisorFloatingActionBar;
