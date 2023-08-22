import { Grid, Stack, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'redux/store';
import { bank_information } from '../../../../@types/commons';
import { BankInformation, Log } from '../../../../@types/proposal';
import { FEATURE_PROJECT_PATH_NEW } from '../../../../config';
import BankImageComp from '../../../shared/BankImageComp';

interface Props {
  // stepGeneralLog: Log;
  stepGeneralLog: any;
  // isConsultation: boolean;
}

function RevisionLog({ stepGeneralLog }: Props) {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate, currentLang } = useLocales();
  const [dataGrants, setDataGrants] = React.useState<any>();
  // let batch: number = 0;
  // if (stepGeneralLog && stepGeneralLog.message) {
  //   batch = Number(stepGeneralLog.message.split('_')[1]);
  // }
  // console.log('stepGeneralLog ', stepGeneralLog);
  React.useEffect(() => {
    if (proposal || stepGeneralLog) {
      setDataGrants((currentProposal: any) => {
        // console.log('test ');
        const tmpValues = { ...currentProposal };
        return {
          ...currentProposal,
          action: stepGeneralLog?.action || '',
          message: stepGeneralLog?.message || '',
          notes: stepGeneralLog?.notes || '',
          updated_at: stepGeneralLog?.updated_at || '',
          user_role: stepGeneralLog?.user_role || '',
          proposal: {
            bank_informations: stepGeneralLog?.new_values?.bank_informations
              ? stepGeneralLog?.new_values?.bank_informations
              : {},
          },
        };
      });
    }
  }, [stepGeneralLog, proposal]);

  const bankInfromation = React.useMemo(() => {
    let tmpBankInformation: BankInformation | undefined = undefined;
    if (dataGrants?.proposal && dataGrants?.proposal?.bank_informations) {
      tmpBankInformation = dataGrants?.proposal?.bank_informations as BankInformation;
    }
    return tmpBankInformation;
  }, [dataGrants]);

  // console.log('dataGrants', dataGrants);
  // console.log('dataGrants: ', dataGrants);

  return (
    <React.Fragment>
      {(stepGeneralLog.action === 'send_revision_for_finance_amandement' ||
        stepGeneralLog.action === 'send_revision_for_supervisor_amandement') &&
      bankInfromation?.card_image?.url ? (
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6">
              {/* {translate(`review.review_by_supervisor`)} */}
              {translate('review.revised_by_client')}
            </Typography>
            <Typography>
              {translate('project_already_revised_by_client')}{' '}
              {moment(stepGeneralLog.updated_at).locale(`${currentLang.value}`).fromNow()}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            {/* {'test'} */}
            {bankInfromation ? (
              <BankImageComp
                enableButton={true}
                bankName={bankInfromation?.bank_name || ''}
                accountNumber={bankInfromation?.bank_account_number || ''}
                bankAccountName={bankInfromation?.bank_account_name || ''}
                imageUrl={bankInfromation?.card_image?.url || '#'}
                size={bankInfromation?.card_image.size || undefined}
                type={bankInfromation?.card_image.type || ''}
                borderColor={bankInfromation?.card_image.border_color ?? 'transparent'}
              />
            ) : null}
          </Grid>
        </Grid>
      ) : null}
    </React.Fragment>
  );
}

export default RevisionLog;
