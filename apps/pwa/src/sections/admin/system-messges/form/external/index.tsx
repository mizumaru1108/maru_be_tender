import { Grid } from '@mui/material';
import Space from '../../../../../components/space/space';
import AdvertisingForm from '../../component/advertising-form';
import HeaderWithBackButton from '../../component/header-with-back-button';
import { TypeAdvertisingForm } from '../../system-message.model';

export default function AdvertisingExternalForm() {
  return (
    <div>
      <Grid>
        <HeaderWithBackButton title={'system_messages.add_new_advertising'} backButton />
        <Space direction="horizontal" size="large" />
        <AdvertisingForm advertisingType={TypeAdvertisingForm.external} />
      </Grid>
    </div>
  );
}
