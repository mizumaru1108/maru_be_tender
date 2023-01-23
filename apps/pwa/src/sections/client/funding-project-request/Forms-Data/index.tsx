import { FormSingleProps } from 'components/FormGenerator';
import { REGION } from '../../../../_mock/region';

export const MainFormData = [
  {
    type: 'textField',
    name: 'project_name',
    label: 'funding_project_request_form1.project_name.label',
    placeholder: 'funding_project_request_form1.project_name.placeholder',
    xs: 12,
  },
  {
    type: 'textField',
    name: 'project_idea',
    label: 'funding_project_request_form1.project_idea.label',
    placeholder: 'funding_project_request_form1.project_idea.placeholder',
    xs: 12,
  },
  {
    type: 'select',
    name: 'project_location',
    label: 'funding_project_request_form1.project_applying_place.label',
    placeholder: 'funding_project_request_form1.project_applying_place.placeholder',
    md: 6,
    xs: 12,
    children: (
      <>
        {Object.keys(REGION).map((item, index) => (
          <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
            {item}
          </option>
        ))}
      </>
    ),
  },
  {
    type: 'datePicker',
    name: 'project_implement_date',
    label: 'funding_project_request_form1.project_applying_date.label',
    placeholder: 'funding_project_request_form1.project_applying_date.placeholder',
    md: 6,
    xs: 12,
    minDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  },
  {
    type: 'numberField',
    name: 'execution_time',
    label: 'funding_project_request_form1.applying_duration.label',
    placeholder: 'funding_project_request_form1.applying_duration.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'select',
    name: 'project_beneficiaries',
    label: 'funding_project_request_form1.target_group_type.label',
    placeholder: 'funding_project_request_form1.target_group_type.placeholder',
    md: 6,
    xs: 12,
    children: (
      <>
        <option value="GENERAL" style={{ backgroundColor: '#fff' }}>
          أخرى
        </option>
        <option value="MIDDLE_AGED" style={{ backgroundColor: '#fff' }}>
          شباب
        </option>
        <option value="KIDS" style={{ backgroundColor: '#fff' }}>
          أشبال
        </option>
        <option value="MEN" style={{ backgroundColor: '#fff' }}>
          رجال
        </option>
        <option value="WOMEN" style={{ backgroundColor: '#fff' }}>
          فتيات
        </option>
        <option value="ELDERLY" style={{ backgroundColor: '#fff' }}>
          كبار السن
        </option>
      </>
    ),
  },
  {
    type: 'textField',
    name: 'project_beneficiaries_specific_type',
    label: 'نوع الفئة المستهدفة الخارجية',
    placeholder: 'الرجاء كتابة نوع الفئة المستهدفة',
    xs: 12,
  },
  {
    type: 'uploadLabel',
    label: 'funding_project_request_form1.letter_support_request.label',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadBe',
    name: 'letter_ofsupport_req',
    placeholder: 'funding_project_request_form1.letter_support_request.placeholder',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadLabel',
    label: 'funding_project_request_form1.project_attachments.label',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadBe',
    name: 'project_attachments',
    placeholder: 'funding_project_request_form1.project_attachments.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;

export const ProjectInfoData = [
  {
    type: 'numberField',
    name: 'num_ofproject_binicficiaries',
    label: 'funding_project_request_form2.number_of_project_beneficiaries.label',
    placeholder: 'funding_project_request_form2.number_of_project_beneficiaries.placeholder',
    xs: 12,
  },
  {
    type: 'textArea',
    name: 'project_goals',
    label: 'funding_project_request_form2.project_goals.label',
    placeholder: 'funding_project_request_form2.project_goals.placeholder',
    xs: 12,
    md: 12,
  },
  {
    type: 'textArea',
    name: 'project_outputs',
    label: 'funding_project_request_form2.project_outputs.label',
    placeholder: 'funding_project_request_form2.project_outputs.placeholder',
    xs: 12,
  },
  {
    type: 'textArea',
    name: 'project_strengths',
    label: 'funding_project_request_form2.project_strengths.label',
    placeholder: 'funding_project_request_form2.project_strengths.placeholder',
    xs: 12,
  },
  {
    type: 'textArea',
    name: 'project_risks',
    label: 'funding_project_request_form2.project_risk.label',
    placeholder: 'funding_project_request_form2.project_risk.placeholder',
    xs: 12,
  },
] as Array<FormSingleProps>;

export const ProjectBudgetData = [
  {
    type: 'numberField',
    name: 'amount_required_fsupport',
    label: 'funding_project_request_form4.amount_required_fsupport.label',
    placeholder: 'funding_project_request_form4.amount_required_fsupport.placeholder',
    md: 12,
    xs: 12,
  },
  {
    type: 'repeater',
    name: 'detail_project_budgets',
    repeaterFields: [
      {
        type: 'textField',
        name: 'clause',
        label: 'funding_project_request_form4.item.label',
        placeholder: 'funding_project_request_form4.item.placeholder',
        md: 3,
        xs: 12,
      },
      {
        type: 'textField',
        name: 'explanation',
        label: 'funding_project_request_form4.explanation.label',
        placeholder: 'funding_project_request_form4.explanation.placeholder',
        md: 5,
        xs: 12,
      },
      {
        type: 'numberField',
        name: 'amount',
        label: 'funding_project_request_form4.amount.label',
        placeholder: 'funding_project_request_form4.amount.placeholder',
        md: 3,
        xs: 12,
      },
    ],
    enableAddButton: true,
    enableRemoveButton: true,
  },
] as Array<FormSingleProps>;

export const AddBankData = [
  {
    type: 'textField',
    name: 'bank_account_number',
    label: 'funding_project_request_form6.bank_account_number.label',
    placeholder: 'funding_project_request_form6.bank_account_number.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'bank_account_name',
    label: 'funding_project_request_form6.bank_account_name.label',
    placeholder: 'funding_project_request_form6.bank_account_name.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'bank_name',
    label: 'funding_project_request_form6.bank_name.label',
    placeholder: 'funding_project_request_form6.bank_name.placeholder',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadLabel',
    name: '',
    label: 'funding_project_request_form6.bank_account_card_image.label',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadBe',
    name: 'card_image',
    label: 'funding_project_request_form6.bank_account_card_image.label',
    placeholder: 'funding_project_request_form6.bank_account_card_image.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;

// <RHFTextField
// name="license_number"
// label={translate('register_form3.license_number.label')}
// placeholder={translate('register_form3.license_number.placeholder')}
// />
// </Grid>
// <Grid item md={6} xs={12}>
// <RHFDatePicker
// name="license_issue_date"
// label={translate('register_form3.license_issue_date.label')}
// placeholder={translate('register_form3.license_issue_date.placeholder')}
// InputProps={{
//   inputProps: {
//     max: new Date(new Date().setDate(new Date().getDate() + 1))
//       .toISOString()
//       .split('T')[0],
//   },
// }}
// />
// </Grid>
// <Grid item md={6} xs={12}>
// <RHFDatePicker
// name="license_expired"
// label={translate('register_form3.license_expiry_date.label')}
// placeholder={translate('register_form3.license_expiry_date.placeholder')}
// InputProps={{
//   inputProps: {
//     min: new Date(new Date().setDate(new Date().getDate() + 2))
//       .toISOString()
//       .split('T')[0],
//   },
// }}
// />
// </Grid>
// <Grid item md={12} xs={12}>
// <BaseField type="uploadLabel" label="register_form3.license_file.label" />
// </Grid>
// <Grid item md={12} xs={12}>
// <BaseField
// type="uploadBe"
// name="license_file"
// label="register_form3.license_file.label"
// />
// </Grid>
// <Grid item md={12} xs={12}>
// <BaseField type="uploadLabel" label="register_form3.resolution_file.label" />
// </Grid>
// <Grid item md={12} xs={12}>
// <BaseField
// type="uploadBe"
// name="board_ofdec_file"
// label="register_form3.resolution_file.label"
// />
// </Grid>
export const LicenseInfoData = [
  {
    type: 'textField',
    name: 'license_number',
    label: 'register_form3.license_number.label',
    placeholder: 'register_form3.license_number.placeholder',
    md: 12,
    xs: 12,
  },
  {
    type: 'datePicker',
    name: 'license_issue_date',
    label: 'register_form3.license_issue_date.label',
    placeholder: 'register_form3.license_issue_date.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'datePicker',
    name: 'license_expired',
    label: 'register_form3.license_expiry_date.label',
    placeholder: 'register_form3.license_expiry_date.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'uploadLabel',
    label: 'register_form3.license_file.label',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadBe',
    name: 'license_file',
    label: 'register_form3.license_file.label',
    placeholder: 'register_form3.license_file.placeholder',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadLabel',
    label: 'register_form3.resolution_file.label',
    md: 12,
    xs: 12,
  },
  {
    type: 'uploadBe',
    name: 'board_ofdec_file',
    label: 'register_form3.resolution_file.label',
    placeholder: 'register_form3.resolution_file.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;
