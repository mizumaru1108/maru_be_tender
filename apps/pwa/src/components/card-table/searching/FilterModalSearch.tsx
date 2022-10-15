import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { IFilterMessage } from '../../message/type';
import { SearchingProposal } from '../types';
import ProposalAcceptingForm from './ProposalAcceptingForm';

type Props = {
  open: boolean;
  data?: SearchingProposal;
  handleClose: () => void;
  appliedFilter: (filter: any) => void;
};

export default function FilterModalSearch({ open, handleClose, data, appliedFilter }: Props) {
  const [selected, setSelected] = useState({
    supervisor: '',
    projectTrack: '',
  });
  // creata default values for selected
  // const [selected, setSelected] = useState<IFilterMessage>({
  //   name: '',
  //   options: {
  //     label: '',
  //     value: '',
  //   },
  // });
  const handleSubmit = () => {
    appliedFilter(selected);
    handleClose();
    setSelected({
      supervisor: '',
      projectTrack: '',
    });
  };
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '52%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: '#fff',
    border: '2px solid #000',
    p: 4,
    h: '1000px',
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" gap={4}>
            <ProposalAcceptingForm
              data={data}
              onSubmit={(data) => {
                console.log('data :', data);
                appliedFilter(data);
                handleClose();
              }}
            />
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
