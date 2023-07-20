import { Grid } from '@mui/material';
import HeaderWithBackButton from 'sections/admin/system-messges/component/header-with-back-button';
import AdvertisingForm from 'sections/admin/system-messges/component/advertising-form';
import { TypeAdvertisingForm } from 'sections/admin/system-messges/system-message.model';
import Space from '../../../../../components/space/space';

export default function AdvertisingInternalForm() {
  return (
    <div>
      <Grid>
        <HeaderWithBackButton title={'system_messages.add_new_advertising'} backButton />
        <Space direction="horizontal" size="large" />
        <AdvertisingForm advertisingType={TypeAdvertisingForm.internal} />
      </Grid>
    </div>
  );
}
