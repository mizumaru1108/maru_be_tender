import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Chip, Divider, Grid, Typography } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import RHFBaseRepeater from 'components/hook-form/nested-track-budget/RHFBaseRepeater';
import useLocales from 'hooks/useLocales';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { TrackSection } from '../../../../@types/commons';
import { Proposal } from '../../../../@types/proposal';
import Space from '../../../../components/space/space';
import { formatCapitalizeText } from '../../../../utils/formatCapitalizeText';
import { removeEmptyKey } from '../../../../utils/remove-empty-key';

const getArrayDifference = (arr1: TrackSection[], arr2: TrackSection[]) => {
  const tmpArr1 = arr1;
  return tmpArr1.filter((item1) => {
    const tmpArr2 = arr2;
    return !tmpArr2.some((item2) => item1.id === item2.id);
  });
};

export function flattenChildTrackSections(arr: TrackSection[], track_id: string): TrackSection[] {
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

function checkBudgetSum(data: TrackSection[], initBugdet: number): boolean {
  const parentMap = new Map<string, number>();

  for (const item of data) {
    if (item.parent_section_id) {
      const parentId = item.parent_section_id;
      // const childBudget = item.budget;
      const childBudget =
        data
          .filter((track_section) => track_section.parent_section_id === item.parent_section_id)
          .reduce((acc, k) => acc + (k.budget || 0), 0) || 0;
      // const parentBudget = parentMap.get(parentId) || 0;
      const parentBudget =
        data.find((track_section) => track_section.id === item.parent_section_id)?.budget || 0;

      if (childBudget && childBudget !== parentBudget) {
        throw new Error(
          // `Summary Budget exceeded for all budget in the same section with ${item.name}`
          'child_budget_error_message'
        );
      }
      if (childBudget) {
        parentMap.set(parentId, parentBudget - childBudget);
      }
    }
  }

  return true;
}

export interface FormTrackBudget {
  id?: string;
  name?: string;
  budget?: number;
  total_budget?: number;
  track_id?: string;
  proposal?: Proposal[];
  is_deleted?: boolean;
  with_consultation?: boolean;
  total_budget_used?: number;
  sections?: TrackSection[];
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
    track_id: defaultValuesTrackBudget?.id || '#',
    name: defaultValuesTrackBudget?.name
      ? formatCapitalizeText(defaultValuesTrackBudget?.name)
      : '-',
    total_budget: 0,
    sections: [],
  };

  const SubmitFormSchema = useMemo(() => {
    const tmpSchema = Yup.object().shape({
      total_budget: Yup.number()
        .nullable()
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
  const { control, register, handleSubmit, getValues, setValue, watch, setError } = methods;

  const onSubmit = (data: FormTrackBudget) => {
    const tmpPayload = data;
    const tmpTotalSummary =
      (tmpPayload?.sections &&
        tmpPayload?.sections
          .filter((track_section) => !track_section.parent_section_id)
          .reduce((acc, k) => acc + (k.budget || 0), 0)) ||
      0;
    const baseFlatArray = flattenChildTrackSections(
      defaultValuesTrackBudget?.sections || [],
      defaultValuesTrackBudget?.track_id || '-'
    );
    const payloadFlatArray = flattenChildTrackSections(
      tmpPayload?.sections || [],
      defaultValuesTrackBudget?.track_id || '-'
    ).map((item) => ({
      ...item,
      is_deleted: false,
    }));
    const differenceFlatArray = getArrayDifference(baseFlatArray, payloadFlatArray).map((item) => ({
      ...item,
      is_deleted: true,
    }));
    if (tmpTotalSummary > 0 && tmpPayload.total_budget !== tmpTotalSummary) {
      setBudgetError({
        open: true,
        message: `${translate('budget_error_message')} (${tmpTotalSummary} : ${
          tmpPayload.total_budget
        })`,
      });
    } else {
      if (payloadFlatArray.length === 0) {
        setBudgetError({
          open: true,
          message: `${translate('min_budget_error_message')}`,
        });
      } else {
        if (tmpPayload.total_budget) {
          try {
            checkBudgetSum(payloadFlatArray, tmpPayload.total_budget);
            setBudgetError({
              open: false,
              message: '',
            });
            onSubmitForm(payloadFlatArray.concat(differenceFlatArray));
          } catch (error) {
            setBudgetError({
              open: true,
              message: translate(error.message),
            });
          }
        }
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container sx={{ mt: 3 }}>
        <Grid item md={12} xs={12} sx={{ mb: 2.5 }}>
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

        {/* total amount track budget */}
        <Grid item md={12} xs={12} sx={{ padding: '0 7px' }}>
          <RHFTextField
            disabled={isLoading}
            name="total_budget"
            type="number"
            InputProps={{
              inputProps: { min: 0 },
              onWheel: (e: any) => {
                e.target.blur();

                e.stopPropagation();

                setTimeout(() => {
                  e.target.focus();
                }, 0);
              },
            }}
            size="medium"
            label={translate('pages.admin.tracks_budget.form.amount.label')}
            placeholder={translate('pages.admin.tracks_budget.form.amount.placeholder')}
          />
        </Grid>

        <Space direction="horizontal" size="small" />
        {/* fragment of total amount track budget */}
        <Grid item md={12}>
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
        <Grid item md={12}>
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
