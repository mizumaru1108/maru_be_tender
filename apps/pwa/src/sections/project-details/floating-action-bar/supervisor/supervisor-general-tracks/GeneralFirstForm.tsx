import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Grid, MenuItem, Button } from '@mui/material';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFTextField } from 'components/hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'redux/store';
import * as Yup from 'yup';
//
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { SupervisorStep1 } from '../../../../../@types/supervisor-accepting-form';
import { removeEmptyKey } from 'utils/remove-empty-key';
import BaseField from 'components/hook-form/BaseField';
import { _supportGoalsArr } from '_mock/_supportGoalsArr';
import { TrackSection } from '../../../../../@types/commons';
import selectDataById from 'utils/generateParentChild';

export default function GeneralFirstForm({
  children,
  onSubmit,
  setPaymentNumber,
  isSubmited,
  setIsSubmited,
}: any) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const isSupevisor = activeRole === 'tender_project_supervisor' ? true : false;
  const { proposal } = useSelector((state) => state.proposal);
  const { track } = useSelector((state) => state.tracks);
  const { step1, step4 } = useSelector((state) => state.supervisorAcceptingForm);

  const [sectionLevelOne, setSectionLevelOne] = useState<TrackSection[] | []>([]);
  const [sectionLevelTwo, setSectionLevelTwo] = useState<TrackSection[]>([]);
  const [sectionLevelThree, setSectionLevelThree] = useState<TrackSection[]>([]);
  const [sectionLevelFour, setSectionLevelFour] = useState<TrackSection[]>([]);

  const [budgetError, setBudgetError] = useState({
    open: false,
    message: '',
  });

  const requestedBudget: number = useMemo(() => {
    const reqBudget = proposal?.amount_required_fsupport || proposal?.fsupport_by_supervisor || 0;
    return Number(reqBudget);
  }, [proposal]);

  const remainBudget: number = useMemo(() => {
    const remainBudget = track
      ? (track?.total_budget || 0) - (track?.total_spending_budget || 0)
      : 0;
    return Number(remainBudget);
  }, [track]);
  const [isVat, setIsVat] = useState<boolean>(step1.vat ?? false);

  const [save, setSave] = useState<boolean>(isSupevisor ? false : true);

  const isStepBack =
    proposal.proposal_logs && proposal.proposal_logs.some((item) => item.action === 'step_back')
      ? true
      : false;

  const validationSchema = useMemo(() => {
    const tmpIsVat = isVat;
    return Yup.object().shape({
      support_type: Yup.boolean().required(translate('errors.cre_proposal.support_type.required')),
      closing_report: Yup.boolean().required(
        translate('errors.cre_proposal.closing_report.required')
      ),
      need_picture: Yup.boolean().required(translate('errors.cre_proposal.need_picture.required')),
      does_an_agreement: Yup.boolean().required(
        translate('errors.cre_proposal.does_an_agreement.required')
      ),
      fsupport_by_supervisor: Yup.string().required(
        translate('errors.cre_proposal.fsupport_by_supervisor.required')
      ),
      vat: Yup.boolean().required(translate('errors.cre_proposal.vat.required')),
      ...(tmpIsVat && {
        vat_percentage: Yup.string()
          .required(translate('errors.cre_proposal.vat_percentage.greater_than_0'))
          .test('len', translate('errors.cre_proposal.vat_percentage.greater_than_0'), (val) => {
            if (!val) return true;
            return Number(val) > 0;
          }),
      }),
      inclu_or_exclu: Yup.boolean(),
      // support_goal_id: Yup.string().required(
      //   translate('errors.cre_proposal.support_goal_id.required')
      // ),
      payment_number: Yup.string()
        .required(translate('errors.cre_proposal.payment_number.required'))
        .test('len', `${translate('errors.cre_proposal.payment_number.greater_than')} 1`, (val) => {
          const number_of_payment = Number(val) > 0;
          return number_of_payment;
        }),
      section_id: Yup.string().required(
        translate('errors.cre_proposal.section_level.section_id_level_one.required')
      ),
      section_id_level_one: Yup.string().required(
        translate('errors.cre_proposal.section_level.section_id_level_one.required')
      ),
      section_id_level_two: Yup.string(),
      section_id_level_three: Yup.string(),
      section_id_level_four: Yup.string(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVat]);

  const tmpStep1 = useMemo(() => step1, [step1]);
  const methods = useForm<SupervisorStep1>({
    resolver: yupResolver(validationSchema),
    defaultValues: (activeRole === 'tender_project_supervisor' && isSubmited && tmpStep1) ||
      ((isStepBack || activeRole !== 'tender_project_supervisor') && tmpStep1) || {
        support_type: false,
      },
  });

  const { handleSubmit, watch, setValue, resetField, reset } = methods;

  const support_type = watch('support_type');
  const paymentNumber = watch('payment_number');

  const onSubmitForm = async (data: SupervisorStep1) => {
    setIsSubmited(true);
    const { vat_percentage, ...rest } = data;
    const tmpValues = {
      vat_percentage: vat_percentage ? Number(vat_percentage) : undefined,
      ...rest,
    };

    // onSubmit(removeEmptyKey(tmpValues));
    if (Number(data.fsupport_by_supervisor) > remainBudget) {
      setBudgetError({
        open: true,
        message: 'notification.error_exceeds_amount',
      });
    } else {
      setBudgetError({
        open: false,
        message: '',
      });
      onSubmit(removeEmptyKey(tmpValues));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    level: 'one' | 'two' | 'three' | 'four'
  ) => {
    switch (level) {
      case 'one':
        setValue('section_id', e.target.value);
        setValue('section_id_level_one', e.target.value);
        setValue('section_id_level_two', '');
        setValue('section_id_level_three', '');
        setValue('section_id_level_four', '');

        const lvl1DataFound = sectionLevelOne.find((el) => el.id === e.target.value);

        setSectionLevelTwo(lvl1DataFound?.child_track_section ?? []);
        setSectionLevelThree([]);
        setSectionLevelFour([]);
        break;

      case 'two':
        setValue('section_id', e.target.value);
        setValue('section_id_level_two', e.target.value);
        setValue('section_id_level_three', '');
        setValue('section_id_level_four', '');

        const lvl2DataFound = sectionLevelTwo.find((el) => el.id === e.target.value);

        setSectionLevelThree(lvl2DataFound?.child_track_section ?? []);
        setSectionLevelFour([]);
        break;
      case 'three':
        setValue('section_id', e.target.value);
        setValue('section_id_level_three', e.target.value);
        setValue('section_id_level_four', '');

        const lvl3DataFound = sectionLevelThree.find((el) => el.id === e.target.value);

        setSectionLevelFour(lvl3DataFound?.child_track_section ?? []);
        break;
      case 'four':
        setValue('section_id', e.target.value);
        setValue('section_id_level_four', e.target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (paymentNumber) {
      setPaymentNumber(Number(paymentNumber));
    }
  }, [paymentNumber, setPaymentNumber]);

  useEffect(() => {
    if (proposal && !isSubmited) {
      setValue(
        'fsupport_by_supervisor',
        proposal?.fsupport_by_supervisor || proposal?.amount_required_fsupport
      );
    }
  }, [proposal, setValue, isSubmited]);

  useEffect(() => {
    if (proposal.section_id && proposal.section_id !== '') {
      if (track.sections && track.sections.length) {
        setSectionLevelOne(track.sections);
        const testGenerate = selectDataById({
          parent: track.sections,
          section_id: proposal.section_id,
        });

        if (testGenerate.tempLvlOne.length) {
          setValue('section_id_level_one', testGenerate.tempLvlOne[0].id);
          setSectionLevelTwo(testGenerate.tempLvlOne[0].child_track_section ?? []);

          if (testGenerate.tempLvlOne[0].child_track_section?.length) {
            const find = testGenerate.tempLvlOne[0].child_track_section?.find(
              (el) => el.id === proposal.section_id
            );

            if (find) {
              setValue('section_id_level_two', find.id);
            }
          }
        }

        if (testGenerate.tempLvlTwo.length) {
          setValue('section_id_level_two', testGenerate.tempLvlTwo[0].id);
          setSectionLevelThree(testGenerate.tempLvlTwo[0].child_track_section ?? []);

          if (testGenerate.tempLvlTwo[0].child_track_section?.length) {
            const find = testGenerate.tempLvlTwo[0].child_track_section?.find(
              (el) => el.id === proposal.section_id
            );

            if (find) {
              setValue('section_id_level_three', find.id);
            }
          }
        }

        if (testGenerate.tempLvlThree.length) {
          setValue('section_id_level_three', testGenerate.tempLvlThree[0].id);
          setSectionLevelFour(testGenerate.tempLvlThree[0].child_track_section ?? []);

          if (testGenerate.tempLvlThree[0].child_track_section?.length) {
            const find = testGenerate.tempLvlThree[0].child_track_section?.find(
              (el) => el.id === proposal.section_id
            );
            if (find) {
              setValue('section_id_level_four', find.id);
            }
          }
        }
      }
    } else {
      if (track.sections && track.sections.length) {
        setSectionLevelOne(track.sections);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal, setValue, track]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: 0.5 }}>
        <Grid item md={6} xs={12}>
          <RHFSelect
            data-cy="acc_form_non_consulation_section_id_level_one"
            type="select"
            size="small"
            name="section_id_level_one"
            label={translate('errors.cre_proposal.section_level.section_id_level_one.label')}
            placeholder={translate('errors.cre_proposal.section_level.section_id_level_one.label')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'one')}
            SelectProps={{
              MenuProps: {
                PaperProps: { style: { maxHeight: 500 } },
              },
            }}
            defaultValue=""
            disabled={save}
          >
            {!sectionLevelOne.length
              ? null
              : sectionLevelOne.map((v, i) => (
                  <MenuItem
                    data-cy={`acc_form_non_consulation_section_id_${v.id}`}
                    value={v.id}
                    selected={
                      proposal.section_id ? (proposal.section_id === v.id ? true : false) : false
                    }
                    key={i}
                  >
                    {v.name}
                  </MenuItem>
                ))}
          </RHFSelect>
        </Grid>

        <Grid item md={6} xs={12}>
          <RHFSelect
            data-cy="acc_form_non_consulation_section_id_level_two"
            type="select"
            size="small"
            name="section_id_level_two"
            label={translate('errors.cre_proposal.section_level.section_id_level_two.label')}
            placeholder={translate('errors.cre_proposal.section_level.section_id_level_two.label')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'two')}
            SelectProps={{
              MenuProps: {
                PaperProps: { style: { maxHeight: 500 } },
              },
            }}
            disabled={!sectionLevelTwo.length || save}
            defaultValue=""
          >
            {!sectionLevelTwo.length
              ? null
              : sectionLevelTwo.map((v, i) => (
                  <MenuItem
                    data-cy={`acc_form_non_consulation_section_id_${v.id}`}
                    value={v.id}
                    selected={
                      proposal.section_id ? (proposal.section_id === v.id ? true : false) : false
                    }
                    key={i}
                  >
                    {v.name}
                  </MenuItem>
                ))}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            data-cy="acc_form_non_consulation_section_id_level_three"
            type="select"
            size="small"
            name="section_id_level_three"
            label={translate('errors.cre_proposal.section_level.section_id_level_three.label')}
            placeholder={translate(
              'errors.cre_proposal.section_level.section_id_level_three.label'
            )}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'three')}
            SelectProps={{
              MenuProps: {
                PaperProps: { style: { maxHeight: 500 } },
              },
            }}
            disabled={!sectionLevelThree.length || save}
            defaultValue=""
          >
            {!sectionLevelThree.length
              ? null
              : sectionLevelThree.map((v, i) => (
                  <MenuItem
                    data-cy={`acc_form_non_consulation_section_id_${v.id}`}
                    value={v.id}
                    selected={
                      proposal.section_id ? (proposal.section_id === v.id ? true : false) : false
                    }
                    key={i}
                  >
                    {v.name}
                  </MenuItem>
                ))}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            data-cy="acc_form_non_consulation_section_id_level_four"
            type="select"
            size="small"
            name="section_id_level_four"
            label={translate('errors.cre_proposal.section_level.section_id_level_four.label')}
            placeholder={translate('errors.cre_proposal.section_level.section_id_level_four.label')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'four')}
            SelectProps={{
              MenuProps: {
                PaperProps: { style: { maxHeight: 500 } },
              },
            }}
            disabled={!sectionLevelFour.length || save}
            defaultValue=""
          >
            {!sectionLevelFour.length
              ? null
              : sectionLevelFour.map((v, i) => (
                  <MenuItem
                    data-cy={`acc_form_non_consulation_section_id_${v.id}`}
                    value={v.id}
                    selected={
                      proposal.section_id ? (proposal.section_id === v.id ? true : false) : false
                    }
                    key={i}
                  >
                    {v.name}
                  </MenuItem>
                ))}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={save || requestedBudget > remainBudget}
            data-cy="acc_form_non_consulation_support_type"
            type="radioGroup"
            name="support_type"
            label="نوع الدعم*"
            options={[
              { label: 'دعم جزئي', value: false },
              { label: 'دعم كلي', value: true },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            disabled={save}
            data-cy="acc_form_non_consulation_closing_report"
            type="radioGroup"
            name="closing_report"
            label="تقرير الإغلاق*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_non_consulation_need_picture"
            type="radioGroup"
            disabled={save}
            name="need_picture"
            label="هل يحتاج إلى صور*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_non_consulation_agreement"
            type="radioGroup"
            disabled={save}
            name="does_an_agreement"
            label="هل يحتاج اتفاقية*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFRadioGroup
            data-cy="acc_form_non_consulation_vat"
            name="vat"
            disabled={save}
            onClick={(e: any) => {
              if (e && e.target.value) {
                if (e.target.value === 'true') {
                  setIsVat(true);
                  setValue('vat_percentage', 0);
                } else {
                  setIsVat(false);
                  setValue('vat_percentage', undefined);
                }
              }
            }}
            label="هل مبلغ السداد شامل لضريبة القيمة المضافة*"
            options={[
              { label: 'نعم', value: true },
              { label: 'لا', value: false },
            ]}
          />
        </Grid>
        {/* <Grid item md={6} xs={12}>
          <RHFSelect
            data-cy="acc_form_non_consulation_support_goal_id"
            type="select"
            size="small"
            name="support_goal_id"
            placeholder="الرجاء اختيار أهداف الدعم"
            label="اهداف الدعم*"
            disabled={save}
          >
            {_supportGoalsArr.map((item, index) => (
              <MenuItem
                data-cy={`acc_form_non_consulation_support_goal_id_${index}`}
                value={item.value}
                key={item.value}
              >
                {item.title}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid> */}
        <Grid item md={6} xs={12}>
          <RHFTextField
            data-cy="acc_form_non_consulation_payment_number"
            type={'number'}
            size={'small'}
            disabled={save}
            name="payment_number"
            placeholder="عدد الدفعات"
            label="عدد الدفعات*"
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
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BaseField
            data-cy="acc_form_consulation_fsupport_by_supervisor"
            type="textField"
            name="fsupport_by_supervisor"
            label="مبلغ الدعم*"
            placeholder="مبلغ الدعم"
            disabled={
              save ||
              (support_type === 'false' || !support_type || support_type === undefined
                ? false
                : true)
            }
          />
        </Grid>
        {isVat && (
          <Grid item md={6} xs={12}>
            <RHFTextField
              data-cy="acc_form_non_consulation_vat_percentage"
              type="number"
              size="small"
              disabled={save}
              name="vat_percentage"
              label="النسبة المئوية من الضريبة*"
              placeholder="النسبة المئوية من الضريبة"
              InputProps={{
                inputProps: { min: 1 },
                onWheel: (e: any) => {
                  e.target.blur();

                  e.stopPropagation();

                  setTimeout(() => {
                    e.target.focus();
                  }, 0);
                },
              }}
            />
          </Grid>
        )}
        {isVat && (
          <Grid item md={6} xs={12}>
            <BaseField
              data-cy="acc_form_non_consulation_vat"
              type="radioGroup"
              disabled={save}
              name="inclu_or_exclu"
              label="هل مبلغ السداد شامل أو غير شامل لضريبة القيمة المضافة"
              options={[
                { label: 'نعم', value: true },
                { label: 'لا', value: false },
              ]}
            />
          </Grid>
        )}
        {isSupevisor ? null : (
          <Grid
            item
            md={12}
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Button
              variant={save ? 'outlined' : 'contained'}
              data-cy="acc_form_non_consulation_support_edit_button"
              onClick={() => {
                setSave(!save);
              }}
            >
              {save ? translate('button.re_edit') : translate('button.save_edit')}
            </Button>
          </Grid>
        )}
        {budgetError.open && (
          <Grid item md={12} sx={{ my: 2 }}>
            <Alert severity="error">{`${translate(budgetError.message)} (${remainBudget})`}</Alert>
          </Grid>
        )}
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}
