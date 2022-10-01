import { useLocation, useParams } from 'react-router';
import { SupervisorFloatingActionBar } from './supervisor';

function FloatinActonBar() {
  const { actionType } = useParams();
  const location = useLocation();

  const activeTap = location.pathname.split('/').at(-1);

  return (
    <>
      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType === 'show-details' && <SupervisorFloatingActionBar />}
    </>
  );
}

export default FloatinActonBar;
