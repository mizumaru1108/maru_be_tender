import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { IFilterMessage } from '../type';
import useLocales from 'hooks/useLocales';

type Props = {
  open: boolean;
  handleClose: () => void;
  appliedFilter: (filter: any) => void;
  supervisors?: IFilterMessage;
  projectTracks?: IFilterMessage;
};

function FilterModalMessage({
  open,
  handleClose,
  appliedFilter,
  supervisors,
  projectTracks,
}: Props) {
  const { translate } = useLocales();
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
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack direction="column" gap={4}>
          <Typography>{translate('commons.filter_button_label')}</Typography>
          {supervisors && (
            <TextField
              label={
                supervisors.name === 'Supervising Authority  Name'
                  ? translate('commons.supervising_authority_name')
                  : supervisors.name
              }
              InputLabelProps={{ shrink: true }}
              SelectProps={{ native: true }}
              select
              fullWidth
              // value={selected}
              onChange={(event) => {
                setSelected({
                  ...selected,
                  supervisor: event.target.value,
                });
              }}
            >
              <option value="">اختر</option>
              {supervisors.options.map((option, index) => (
                <option key={index} value={option.value} style={{ backgroundColor: '#fff' }}>
                  {option.label} {option.Role !== undefined && `- ${option.Role}`}
                </option>
              ))}
            </TextField>
          )}

          {projectTracks && (
            <TextField
              label={
                projectTracks.name === 'Project Tracks'
                  ? translate('commons.project_tracks')
                  : projectTracks.name
              }
              InputLabelProps={{ shrink: true }}
              SelectProps={{ native: true }}
              select
              fullWidth
              // value={selected}
              onChange={(event) => {
                setSelected({
                  ...selected,
                  projectTrack: event.target.value,
                });
              }}
            >
              <option value="">اختر</option>
              {projectTracks.options.map((option, index) => (
                <option key={index} value={option.value} style={{ backgroundColor: '#fff' }}>
                  {option.label}
                </option>
              ))}
            </TextField>
          )}
          <Stack direction="row" justifyContent="center">
            <Button onClick={handleClose}>رجوع</Button>
            <Button onClick={handleSubmit}>تأكيد</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default FilterModalMessage;
