import { Button, Grid } from '@mui/material';
import Space from 'components/space/space';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import {
  getBeneficiariesList,
  getClientList,
  getRegionList,
  getTrackList,
} from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import PortalReportActionBox from 'sections/admin/portal-repports/action-box';
import PortalReportsForm1, { FormValuesPortalReport1 } from 'sections/admin/portal-repports/form1';
import PortalReportsForm2 from 'sections/admin/portal-repports/form2';

interface FormValue {
  form1?: FormValuesPortalReport1;
  from2?: any;
}

export default function PortalReportsForm() {
  const { activeRole } = useAuth();
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState<FormValue>();
  // console.log({ values });

  const handleNext = () => {
    if (step < 2) {
      setStep((prevStep) => prevStep + 1);
    }
  };
  const handleBack = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmitForm1 = async (data: FormValuesPortalReport1) => {
    handleNext();
    setValues((prev) => ({
      ...prev,
      form1: data,
    }));
  };

  React.useEffect(() => {
    dispatch(getBeneficiariesList(activeRole!, false));
    dispatch(getTrackList(0, activeRole as string));
    dispatch(getRegionList());
    dispatch(getClientList(activeRole as string));
  }, [activeRole]);

  return (
    <Grid>
      <Grid item md={12} xs={12}>
        {step === 0 && (
          <PortalReportsForm1 defaultValuesForm={values?.form1} onSubmitForm={handleSubmitForm1}>
            <PortalReportActionBox isLoad={false} lastStep={false} onReturn={handleBack} />
          </PortalReportsForm1>
        )}
        {step === 1 && (
          <PortalReportsForm2 isLoading={false}>
            <PortalReportActionBox isLoad={false} lastStep={false} onReturn={handleBack} />
          </PortalReportsForm2>
        )}
      </Grid>
    </Grid>
  );
}
