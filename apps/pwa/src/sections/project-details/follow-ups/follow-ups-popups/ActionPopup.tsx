import { Button, Stack, Typography } from '@mui/material';
import { FusionAuthRoles } from '../../../../@types/commons';
import ModalDialog from 'components/modal-dialog';
import useAuth from 'hooks/useAuth';
import ActionPopupForm from './ActionPopupForm';
import { useMutation } from 'urql';
import { createNewFollowUp } from 'queries/commons/createNewFollowUp';
import { useParams } from 'react-router';
import { nanoid } from 'nanoid';

type Props = {
  open: boolean;
  handleClose: () => void;
  mutate: () => void;
};
function ActionPopup({ open, handleClose, mutate }: Props) {
  const { id: proposal_id } = useParams();
  const [, createFollow] = useMutation(createNewFollowUp);
  const { user, activeRole } = useAuth();
  const id = user?.id;
  const role = activeRole!;
  const handleSubmit = async (data: any) => {
    if (role === 'tender_client') {
      try {
        await createFollow({
          object: { action: data.action, user_id: id, proposal_id, id: nanoid() },
        });
        mutate();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await createFollow({
          object: { action: data.action, employee_id: id, proposal_id, id: nanoid() },
        });
        mutate();
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <ModalDialog
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            إضافة تعليق
          </Typography>
        </Stack>
      }
      content={
        <ActionPopupForm onSubmit={handleSubmit}>
          <Stack direction="row" justifyContent="space-around" gap={4}>
            <Button
              sx={{
                color: '#000',
                backgroundColor: 'transparent',
                ':hover': { backgroundColor: 'transparent' },
              }}
              onClick={handleClose}
            >
              رجوع
            </Button>
            <Button
              type="submit"
              sx={{
                color: '#fff',
                backgroundColor: '#0E8478',
                ':hover': { backgroundColor: '#13B2A2' },
              }}
            >
              اضافة
            </Button>
          </Stack>
        </ActionPopupForm>
      }
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ActionPopup;
