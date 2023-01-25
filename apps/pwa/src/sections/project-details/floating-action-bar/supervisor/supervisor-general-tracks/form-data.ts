import { FormSingleProps } from 'components/FormGenerator';

export const DetailsBudgetRequest = [
  {
    type: 'repeaterCustom',
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
        md: 4,
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
