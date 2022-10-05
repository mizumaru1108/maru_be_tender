import { Button, Box, Stack, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useMutation } from 'urql';
import ModalDialog from '../../../../components/modal-dialog';
import Page from '../../../../components/Page';
import { paymentReq } from '../../../../queries/Cashier/supportRequest';
import FormActionBox from './PopUpActionBar';
import UploadingForm from './UploadingForm';

function PaymentsTable() {
  const [modalState, setModalState] = useState(false);
  const [chequeInsert, cheque] = useMutation(paymentReq);
  const location = useLocation();
  const paymentId = location.pathname.split('/').at(4);

  console.log('split :', paymentId);
  // create handleSubmit function with async await for use mutation cheque
  const handleSubmit = async (data: any) => {
    await cheque({
      objects: {
        id: nanoid(),
        payment_id: paymentId,
        transfer_receipt: data.transactionReceipt,
        deposit_date: data.depositDate,
        number: data.checkTransferNumber,
      },
    });
  };

  const handleCloseModal = () => {
    setModalState(false);
  };
  return (
    <Page title="PaymentsTable">
      <Box>
        <Button variant="contained" onClick={() => setModalState(true)}>
          Test
        </Button>
      </Box>
      <ModalDialog
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {'Upload Receipt Form'}
            </Typography>
          </Stack>
        }
        content={
          <UploadingForm
            onSubmit={(data: any) => {
              console.log('form callback', data);
              console.log('just a dummy not create log yet');
              // handleSubmit(data);
              setModalState(false);
            }}
          >
            <FormActionBox
              isLoading={false}
              onReturn={() => {
                setModalState(false);
              }}
            />
          </UploadingForm>
        }
        isOpen={modalState}
        onClose={handleCloseModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
    </Page>
  );
}

export default PaymentsTable;
