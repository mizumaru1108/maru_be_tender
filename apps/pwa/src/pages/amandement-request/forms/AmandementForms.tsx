import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Checkbox, Grid, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import useLocales from 'hooks/useLocales';
import { ProjectInfoData } from '../../../sections/client/funding-project-request/Forms-Data';
import RHFTextArea from '../../../components/hook-form/RHFTextArea';
import { AmandementFields, AmandementProposal } from '../../../@types/proposal';
import ButtonDownloadFiles from '../../../components/button/ButtonDownloadFiles';
import { async } from '@firebase/util';
import { useParams } from 'react-router';
import { LeftField, RightField } from './FormFieldData';

type Props = {
  // onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: AmandementProposal | null;
  selectedLength: (length: number) => void;
  openConfirm: () => void;
  onSubmit: (data: AmandementFields) => void;
};
const AmandementForms = ({
  children,
  defaultValues,
  selectedLength,
  openConfirm,
  onSubmit,
}: Props) => {
  const { translate } = useLocales();
  const params = useParams();
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const CreatingProposalForm2 = Yup.object().shape({
    num_ofproject_binicficiaries: Yup.string().required(
      translate('errors.cre_proposal.num_ofproject_binicficiaries.required')
    ),
    project_goals: Yup.string().required(translate('errors.cre_proposal.project_goals.required')),
    project_outputs: Yup.string().required(
      translate('errors.cre_proposal.project_outputs.required')
    ),
    project_strengths: Yup.string().required(
      translate('errors.cre_proposal.project_strengths.required')
    ),
    project_risks: Yup.string().required(translate('errors.cre_proposal.project_risks.required')),
    amount_required_fsupport: Yup.string().required(
      translate('errors.cre_proposal.amount_required_fsupport.required')
    ),
    project_idea: Yup.string().required(translate('errors.cre_proposal.project_idea.required')),
    project_location: Yup.string().required(
      translate('errors.cre_proposal.project_location.required')
    ),
    project_implement_date: Yup.string().required(
      translate('errors.cre_proposal.project_implement_date.required')
    ),
    project_beneficiaries: Yup.string().required(
      translate('errors.cre_proposal.project_beneficiaries.required')
    ),
    letter_ofsupport_req: Yup.string().required(
      translate('errors.cre_proposal.letter_ofsupport_req.required')
    ),
    project_attachments: Yup.string().required(
      translate('errors.cre_proposal.project_attachments.required')
    ),
    notes: Yup.string().required(translate('errors.cre_proposal.notes.required')),
  });

  const methods = useForm<AmandementFields>({
    resolver: yupResolver(CreatingProposalForm2),
    // defaultValues: useMemo(() => defaultValues!, [defaultValues!]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  const resetForm = (field: any) => {
    const newValues = JSON.parse(JSON.stringify(defaultValues));
    if (field !== 'letter_ofsupport_req' && field !== 'project_attachments') {
      setValue(field, newValues[field]);
    } else {
      setValue(field, '-');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!!defaultValues) {
      const newValues = JSON.parse(JSON.stringify(defaultValues));

      reset({
        amount_required_fsupport: String(newValues.amount_required_fsupport),
        letter_ofsupport_req: '-',
        num_ofproject_binicficiaries: String(newValues.num_ofproject_binicficiaries),
        project_attachments: '-',
        project_beneficiaries: newValues.project_beneficiaries,
        project_goals: newValues.project_goals,
        project_idea: newValues.project_idea,
        project_implement_date: String(newValues.project_implement_date),
        project_location: newValues.project_location,
        project_outputs: newValues.project_outputs,
        project_risks: newValues.project_risks,
        project_strengths: newValues.project_strengths,
        notes: '',
      });
    }
  }, [defaultValues, reset]);
  const handleChange = (e: any) => {
    const newSelectedValues = [...selectedCheckbox];
    if (e.target.checked) {
      newSelectedValues.push(e.target.value);
      selectedLength(newSelectedValues.length);
      setSelectedCheckbox(newSelectedValues);
    } else {
      newSelectedValues.splice(newSelectedValues.indexOf(e.target.value), 1);
      resetForm(e.target.value as string);
      selectedLength(newSelectedValues.length);
      setSelectedCheckbox(newSelectedValues);
    }
  };
  const onSubmitForm = async (data: AmandementFields) => {
    let selectedData = Object.entries(data)
      .filter(([key]) => selectedCheckbox.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    selectedData = {
      ...selectedData,
      proposal_id: params.proposal_id,
    };
    if (data.notes) {
      selectedData = {
        ...selectedData,
        notes: data.notes,
      };
    }
    openConfirm();
    // setTmpValues(selectedData as AmandementFields);
    onSubmit(selectedData as AmandementFields);
    // console.log({ selectedData });
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {LeftField.map((item, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={3} sx={{ my: 3 }}>
              <Grid item xs={1} md={1}>
                <Checkbox
                  checked={
                    selectedCheckbox.length > 0 ? selectedCheckbox.includes(item.name) : false
                  }
                  onChange={(e) => handleChange(e)}
                  value={item.name}
                />
              </Grid>
              <Grid item xs={11} md={11}>
                <RHFTextField
                  name={item.name}
                  disabled={selectedCheckbox.includes(item.name) ? false : true}
                  label={translate(`${item.label}`)}
                  placeholder={translate(`${item.placeholder}`)}
                />
              </Grid>
            </Stack>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {RightField.map((item, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={3} sx={{ my: 3 }}>
              <Grid item xs={1} md={1}>
                <Checkbox
                  checked={
                    selectedCheckbox.length > 0 ? selectedCheckbox.includes(item.name) : false
                  }
                  onChange={(e) => handleChange(e)}
                  value={item.name}
                />
              </Grid>
              <Grid item xs={11} md={11}>
                <RHFTextField
                  // type="number"
                  name={item.name}
                  disabled={selectedCheckbox.includes(item.name) ? false : true}
                  label={translate(`${item.label}`)}
                  placeholder={translate(`${item.placeholder}`)}
                />
              </Grid>
            </Stack>
          ))}
        </Grid>
        {defaultValues?.project_attachments && defaultValues.letter_ofsupport_req && (
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: '0px !important',
              mt: 1,
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} gap={3} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={1} md={1}>
                  <Checkbox
                    checked={
                      selectedCheckbox.length > 0
                        ? selectedCheckbox.includes('project_attachments')
                        : false
                    }
                    onChange={(e) => handleChange(e)}
                    value={'project_attachments'}
                  />
                </Grid>
                <Grid item xs={11} md={11}>
                  {selectedCheckbox.includes('project_attachments') ? (
                    <RHFTextField
                      name={'project_attachments'}
                      label={translate('funding_project_request_form1.project_attachments.label')}
                      placeholder={translate(
                        'funding_project_request_form1.project_attachments.placeholder'
                      )}
                    />
                  ) : (
                    <ButtonDownloadFiles files={defaultValues?.project_attachments} />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} gap={3} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={1} md={1}>
                  <Checkbox
                    checked={
                      selectedCheckbox.length > 0
                        ? selectedCheckbox.includes('letter_ofsupport_req')
                        : false
                    }
                    onChange={(e) => handleChange(e)}
                    value={'letter_ofsupport_req'}
                  />
                </Grid>
                <Grid item xs={11} md={11}>
                  {selectedCheckbox.includes('letter_ofsupport_req') ? (
                    <RHFTextField
                      name={'letter_ofsupport_req'}
                      label={translate(
                        'funding_project_request_form1.letter_support_request.label'
                      )}
                      placeholder={translate(
                        'funding_project_request_form1.letter_support_request.placeholder'
                      )}
                    />
                  ) : (
                    <ButtonDownloadFiles files={defaultValues?.letter_ofsupport_req} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} md={12} sx={{ mb: 4, mt: 2 }}>
          <RHFTextArea
            name={'notes'}
            label={translate(`funding_project_request_form1.notes.label`)}
            placeholder={translate(`funding_project_request_form1.notes.placeholder`)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AmandementForms;
