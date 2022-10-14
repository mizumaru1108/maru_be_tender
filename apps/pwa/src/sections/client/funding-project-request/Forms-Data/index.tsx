import { FormSingleProps } from 'components/FormGenerator';
import { GOVERNORATES, REGIONS } from 'sections/auth/register/RegisterFormData';

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
        {REGIONS.map((item, index) => (
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
  },
  {
    type: 'textField',
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
    type: 'uploadLabel',
    label: 'funding_project_request_form1.letter_support_request.label',
    md: 12,
    xs: 12,
  },
  {
    type: 'upload',
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
    type: 'upload',
    name: 'project_attachments',
    placeholder: 'funding_project_request_form1.project_attachments.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;

export const ProjectInfoData = [
  {
    type: 'textField',
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

export const ConnectingInfoData = [
  {
    type: 'textField',
    name: 'pm_name',
    label: 'funding_project_request_form3.project_manager_name.label',
    placeholder: 'funding_project_request_form3.project_manager_name.placeholder',
    xs: 12,
  },
  {
    type: 'textField',
    name: 'pm_mobile',
    label: 'funding_project_request_form3.mobile_number.label',
    placeholder: 'funding_project_request_form3.mobile_number.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'textField',
    name: 'pm_email',
    label: 'funding_project_request_form3.email.label',
    placeholder: 'funding_project_request_form3.email.placeholder',
    md: 6,
    xs: 12,
  },
  {
    type: 'select',
    name: 'region',
    label: 'funding_project_request_form3.region.label',
    placeholder: 'funding_project_request_form3.region.placeholder',
    md: 6,
    xs: 12,
    children: (
      <>
        {REGIONS.map((item, index) => (
          <option key={index} value="item" style={{ backgroundColor: '#fff' }}>
            {item}
          </option>
        ))}
      </>
    ),
  },
  {
    type: 'select',
    name: 'governorate',
    label: 'funding_project_request_form3.city.label',
    placeholder: 'funding_project_request_form3.city.placeholder',
    md: 6,
    xs: 12,
    children: (
      <>
        {GOVERNORATES.map((item, index) => (
          <option key={index} value="item" style={{ backgroundColor: '#fff' }}>
            {item}
          </option>
        ))}
      </>
    ),
  },
] as Array<FormSingleProps>;

export const ProjectBudgetData = [
  {
    type: 'textField',
    name: 'amount_required_fsupport',
    label: 'المبلغ المطلوب للدعم*',
    placeholder: 'الرجاء كتابة المبلغ المطلوب للدعم',
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
        type: 'textField',
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
    type: 'upload',
    name: 'bank_account_card_image',
    label: 'funding_project_request_form6.bank_account_card_image.label',
    placeholder: 'funding_project_request_form6.bank_account_card_image.placeholder',
    md: 12,
    xs: 12,
  },
] as Array<FormSingleProps>;
