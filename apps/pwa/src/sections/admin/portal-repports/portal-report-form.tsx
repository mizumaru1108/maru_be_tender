import { Button, Grid } from '@mui/material';
import { ComboBoxOption } from 'components/hook-form/RHFComboBox';
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
import { dispatch } from 'redux/store';
import PortalReportActionBox from 'sections/admin/portal-repports/action-box';
import PortarReportsTable from 'sections/admin/portal-repports/final-table';
import PortalReportsForm1, { FormValuesPortalReport1 } from 'sections/admin/portal-repports/form1';
import PortalReportsForm2, { FormValuesPortalReport2 } from 'sections/admin/portal-repports/form2';
import { joinStringFromArray } from 'utils/joinStringFromArray';

interface FormValue {
  form1?: FormValuesPortalReport1;
  from2?: FormValuesPortalReport2;
}

export default function PortalReportsForm() {
  const { activeRole } = useAuth();
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState<FormValue>();
  const [urlParams, setUrlParams] = React.useState<string | null>(null);
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
  const handleSubmitForm2 = async (data: FormValuesPortalReport2) => {
    handleNext();
    setValues((prev) => ({
      ...prev,
      form2: data,
    }));
    const tmpPayload: any = {
      ...data,
      ...values?.form1,
    };
    console.log('tmpPayload', tmpPayload);
    const fieldsToMap = [
      { key: 'partner_names', payloadKey: 'partner_name', value: '' },
      { key: 'beneficiaries', payloadKey: 'beneficiary_id', value: '' },
      { key: 'regions', payloadKey: 'region_id', value: '' },
      { key: 'governorates', payloadKey: 'governorate_id', value: '' },
      { key: 'tracks', payloadKey: 'track_id', value: '' },
      { key: 'columns', payloadKey: 'selected_column', value: '' },
      { key: 'outter_status', payloadKey: 'outter_status', value: '' },
    ];

    //
    const tmpMappedValues = fieldsToMap.map(({ key, payloadKey }) => {
      let tmpJoinedArray = '';
      if (key !== 'outter_status' && key !== 'columns') {
        tmpJoinedArray = tmpPayload[payloadKey]
          ? joinStringFromArray(
              tmpPayload[payloadKey]?.map((item: ComboBoxOption) => item.value),
              ','
            )
          : '';
      } else {
        tmpJoinedArray = tmpPayload[payloadKey]
          ? joinStringFromArray(
              tmpPayload[payloadKey]?.map((item: string) =>
                key === 'columns' ? item.toUpperCase() : item
              ),
              ','
            )
          : '';
      }
      // console.log('tmpJoinedArray', key, tmpJoinedArray);
      return {
        key,
        payloadKey,
        value: tmpJoinedArray,
      };
    });
    const queryString = tmpMappedValues
      .filter((item) => item.value !== '')
      .map((item) => `${item.payloadKey}=${item.value}`)
      .join('&');
    const urlWithParams = `?${queryString}`;
    if (urlWithParams) setUrlParams(urlWithParams);
    // console.log('urlWithParams', urlWithParams);
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
          <PortalReportsForm2 isLoading={false} onSubmitForm={handleSubmitForm2}>
            <PortalReportActionBox isLoad={false} lastStep={false} onReturn={handleBack} />
          </PortalReportsForm2>
        )}
        {step === 2 && urlParams && (
          <>
            <PortarReportsTable params={urlParams} />
            <PortalReportActionBox isLoad={false} lastStep={false} onReturn={handleBack} />
          </>
        )}
        {/* <PortalReportActionBox isLoad={false} lastStep={false} onReturn={handleBack} /> */}
      </Grid>
    </Grid>
  );
}
