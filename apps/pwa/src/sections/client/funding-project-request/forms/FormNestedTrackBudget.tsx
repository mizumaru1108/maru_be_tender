import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Chip, Divider, Grid, Typography } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import RHFBaseRepeater from 'components/hook-form/nested-track-budget/RHFBaseRepeater';
import useLocales from 'hooks/useLocales';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Proposal } from '../../../../@types/proposal';
import Space from '../../../../components/space/space';
import { formatCapitalizeText } from '../../../../utils/formatCapitalizeText';
import { removeEmptyKey } from '../../../../utils/remove-empty-key';

function sumBudget(transactions: TrackSection[]): number {
  let totalBudget = 0;

  for (const transaction of transactions) {
    totalBudget += transaction?.budget || 0;

    if (transaction.child_track_section && transaction.child_track_section.length > 0) {
      totalBudget += sumBudget(transaction.child_track_section);
    }
  }

  return totalBudget;
}

function flattenChildTrackSections(arr: TrackSection[], track_id: string): TrackSection[] {
  let result: TrackSection[] = [];

  for (const item of arr) {
    result.push(
      removeEmptyKey({
        budget: item.budget,
        name: item.name,
        id: item.id,
        parent_section_id: item.parent_section_id,
        track_id: track_id,
      })
    );

    if (item.child_track_section && item.child_track_section.length > 0) {
      result = result.concat(flattenChildTrackSections(item.child_track_section, track_id));
    }
  }

  return result;
}

export interface FormTrackBudget {
  id?: string;
  name?: string;
  budget?: number;
  track_id?: string;
  proposal?: Proposal[];
  is_deleted?: boolean;
  with_consultation?: boolean;
  total_budget_used?: number;
  sections?: TrackSection[];
}

export interface TrackSection {
  id?: string;
  track_id?: string;
  name?: string;
  budget?: number;
  child_track_section?: TrackSection[];
  parent_section_id?: string;
  is_deleted?: boolean;
}

interface Props {
  defaultValuesTrackBudget?: FormTrackBudget;
  isLoading: boolean;
  onSubmitForm: (data: TrackSection[]) => void;
}

export default function FormNestedTrackBudget({
  defaultValuesTrackBudget,
  isLoading,
  onSubmitForm,
}: Props) {
  const { translate } = useLocales();
  const [budgetError, setBudgetError] = useState({
    open: false,
    message: '',
  });

  const defaultValues: FormTrackBudget = {
    track_id: defaultValuesTrackBudget?.track_id || '#',
    name: defaultValuesTrackBudget?.name
      ? formatCapitalizeText(defaultValuesTrackBudget?.name)
      : '-',
    budget: 0,
    sections: [],
  };

  const SubmitFormSchema = useMemo(() => {
    const tmpSchema = Yup.object().shape({
      budget: Yup.number()
        .positive()
        .integer()
        .min(1, translate(translate('track_budgets.errors.budgets.min')))
        .required(translate('errors.cre_proposal.detail_project_budgets.amount.required')),
      track_id: Yup.string().required(translate('portal_report.errors.track_id.required')),
      sections: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required(
            translate('errors.cre_proposal.detail_project_budgets.clause.required')
          ),
          budget: Yup.number()
            .typeError(translate('errors.cre_proposal.detail_project_budgets.amount.message'))
            .integer()
            .min(1, translate(translate('track_budgets.errors.budgets.min')))
            .required(translate('errors.cre_proposal.detail_project_budgets.amount.required')),
          child_track_section: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required(
                translate('errors.cre_proposal.detail_project_budgets.clause.required')
              ),
              budget: Yup.number()
                .typeError(translate('errors.cre_proposal.detail_project_budgets.amount.message'))
                .integer()
                .min(1, translate(translate('track_budgets.errors.budgets.min')))
                .required(translate('errors.cre_proposal.detail_project_budgets.amount.required')),
              child_track_section: Yup.array().of(
                Yup.object().shape({
                  name: Yup.string().required(
                    translate('errors.cre_proposal.detail_project_budgets.clause.required')
                  ),
                  budget: Yup.number()
                    .typeError(
                      translate('errors.cre_proposal.detail_project_budgets.amount.message')
                    )
                    .integer()
                    .min(1, translate(translate('track_budgets.errors.budgets.min')))
                    .required(
                      translate('errors.cre_proposal.detail_project_budgets.amount.required')
                    ),
                  child_track_section: Yup.array().of(
                    Yup.object().shape({
                      name: Yup.string().required(
                        translate('errors.cre_proposal.detail_project_budgets.clause.required')
                      ),
                      budget: Yup.number()
                        .typeError(
                          translate('errors.cre_proposal.detail_project_budgets.amount.message')
                        )
                        .integer()
                        .min(1, translate(translate('track_budgets.errors.budgets.min')))
                        .required(
                          translate('errors.cre_proposal.detail_project_budgets.amount.required')
                        ),
                    })
                  ),
                })
              ),
            })
          ),
        })
      ),
    });
    return tmpSchema;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm<FormTrackBudget>({
    resolver: yupResolver(SubmitFormSchema),
    defaultValues: !!defaultValuesTrackBudget ? defaultValuesTrackBudget : defaultValues,
    // defaultValues,
  });
  const { control, register, handleSubmit, getValues, reset, setValue, watch } = methods;
  const onSubmit = (data: FormTrackBudget) => {
    const tmpPayload = data;
    const tmpTotalSummary = sumBudget(tmpPayload?.sections || []);
    const tmpFlatArray = flattenChildTrackSections(
      tmpPayload?.sections || [],
      defaultValuesTrackBudget?.track_id || '-'
    );
    if (tmpPayload.budget !== tmpTotalSummary) {
      setBudgetError({
        open: true,
        message: `${translate('budget_error_message')} (${tmpTotalSummary} : ${tmpPayload.budget})`,
      });
    } else {
      setBudgetError({
        open: true,
        message: '',
      });
      onSubmitForm(tmpFlatArray);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container sx={{ mt: 3 }}>
        {/* total amount track budget */}
        <Grid item md={12} xs={12} sx={{ padding: '0 7px' }}>
          <RHFTextField
            disabled={isLoading}
            name="budget"
            type="number"
            size="medium"
            label={translate('pages.admin.tracks_budget.form.amount.label')}
            placeholder={translate('pages.admin.tracks_budget.form.amount.placeholder')}
          />
        </Grid>

        <Grid item md={12} xs={12} sx={{ mt: 2 }}>
          <Divider>
            <Chip
              label={
                <Typography>
                  {defaultValuesTrackBudget?.name
                    ? formatCapitalizeText(defaultValuesTrackBudget?.name)
                    : '-'}
                </Typography>
              }
            />
          </Divider>
        </Grid>

        <Space direction="horizontal" size="small" />
        {/* fragment of total amount track budget */}
        <Grid md={12}>
          <RHFBaseRepeater
            isLoading={isLoading}
            {...{ control, register, defaultValues, getValues, setValue, watch }}
          />
        </Grid>

        <Grid item md={12} xs={12} sx={{ my: 2 }}>
          <Divider />
        </Grid>
        {budgetError.open && (
          <Grid item md={12} sx={{ my: 2 }}>
            <Alert severity="error">{budgetError.message}</Alert>
          </Grid>
        )}
        <Grid md={12}>
          <Button disabled={isLoading} type="submit" variant="contained" size="large">
            {/* Submit */}
            {translate('button.save')}
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
    // </form>
  );
}
