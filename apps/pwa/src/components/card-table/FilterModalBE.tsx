import { Box, Button, Modal, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { whereFilterGenerator } from 'utils/whereFilterGenerator';
import { filterInterface, filterInterfaceBE } from './types';

type Props = {
  open: boolean;
  handleClose: () => void;
  filters?: filterInterfaceBE[];
  filtersStateObjectArray: any;
  setFiltersStateObjectArray: (data: any) => void;
  setParams: (data: any) => void;
};

function FilterModalBE({
  open,
  handleClose,
  filters,
  setFiltersStateObjectArray,
  filtersStateObjectArray,
  setParams,
}: Props) {
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

  const handleOnChange = (event: any, item: filterInterfaceBE) => {
    setFiltersStateObjectArray((prevValue: any) => ({
      ...prevValue,
      [`${item.name}`]: item.generate_filter(event.target.value),
    }));
  };

  const handleOnSubmit = () => {
    const values = Object.keys(filtersStateObjectArray).map(
      (item, index) => filtersStateObjectArray[item]
    );
    const where = whereFilterGenerator(values);
    setParams((prevValues: any) => ({ ...prevValues, where }));
    handleClose();
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
            <Typography>فلتر</Typography>
            {filters?.map((item: filterInterfaceBE, index: number) => (
              <TextField
                InputLabelProps={{ shrink: true }}
                select
                fullWidth
                SelectProps={{ native: true }}
                key={index}
                onChange={(event) => {
                  handleOnChange(event, item);
                }}
              >
                <>
                  <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                    {item.title}
                  </option>
                  {item.options.map((option, optionIndex) => (
                    <option
                      key={optionIndex}
                      value={option.value}
                      style={{ backgroundColor: '#fff' }}
                    >
                      {option.label}
                    </option>
                  ))}
                </>
              </TextField>
            ))}

            <Stack direction="row" justifyContent="center">
              <Button onClick={handleClose}>رجوع</Button>
              <Button onClick={handleOnSubmit}>تأكيد</Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default FilterModalBE;
