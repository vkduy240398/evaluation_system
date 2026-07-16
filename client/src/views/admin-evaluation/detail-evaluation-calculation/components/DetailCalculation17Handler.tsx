import { t } from 'i18next';
import { DetailEvaluationCalculationDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { DetailCalculationHelper } from './DetailCalculationHelper';

interface ValidateProps {
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  onValidateTab: any;
  dispatch: any;
  setFocusLevelError: any;
  setIsOpenSavePublicConfirm: any;
}

export const onValidateSavePublic = async (props: ValidateProps) => {
  // check validate và di chuyển các tabs theo validate
  await props.form
    .validateFields()
    .then(async () => {
      if (props.dataSource.settingPointBasic!.length === 0) {
        props.onValidateTab('basic', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_BASIC_SKILL')));
      } else if (props.dataSource.settingPointPro!.length === 0) {
        props.onValidateTab('proSkill', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_PRO_SKILL')));

      // } else if (props.dataSource.settingProFormula!.length === 0) {
      //   props.onValidateTab('proSkill', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_PRO_SKILL')));
      // } else if (DetailCalculationHelper.isAnyNullSettingProFormulaSub(props.dataSource.settingProFormula!)) {
      //   props.onValidateTab('proSkill', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (props.dataSource.settingPointBehavior!.length === 0) {
        props.onValidateTab('behavior', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_BEHAVIOR')));
      } else if (props.dataSource.maxPoint === '' || props.dataSource.minPoint === '') {
        props.onValidateTab(
          'settingMaxPoint',
          t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_TOTAL_POINT_EVALUATION_1_7')),
        );
      } else if (props.dataSource.settingAchievementPersonalDiff!.length === 0) {
        props.onValidateTab(
          'goals',
          t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_ACHIEVEMENT_PERSONAL')),
        );
      } else if (props.dataSource.settingAchievementPersonalJudgeIndex!.length === 0) {
        props.onValidateTab(
          'goals',
          t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_ACHIEVEMENT_PERSONAL')),
        );
      } else if (props.dataSource.settingAchievementAdditional!.length === 0) {
        props.onValidateTab(
          'additional',
          t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_ACHIEVEMENT_ADDITIONAL_RESULT')),
        );
      } else if (!props.dataSource.reason || props.dataSource.reason === '') {
        props.onValidateTab('', `${t('IDS_PLACEHOLDER_HISTORY_EDIT')}：　${t('MESSAGE.COMMON.IDM_BLANK_ITEM')}`);
      } else {
        const listLevelErrors: any[] = [];
        props.dataSource?.settingLevel?.forEach((e: any) => {
          const total = (e.achievementPercent || 0) + (e.behaviorPercent || 0) + (e.skillPercent || 0);

          if (total !== 100) {
            listLevelErrors.push(e.level);
          }
        });
        if (listLevelErrors.length > 0) {
          props.dispatch(props.setFocusLevelError(listLevelErrors));
          props.onValidateTab(
            'pricing',
            t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_EVALUATION_CRITERIA')),
          );
        } else {
          props.setIsOpenSavePublicConfirm(true);
        }
      }
    })
    .catch((err: any) => {
      const { errorFields } = err;
      if (
        errorFields.filter((item: any) => item.name[0].includes('input_point_basic')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_note_basic')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('max_diff_basic')).length > 0
      ) {
        props.onValidateTab('basic', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (
        errorFields.filter((item: any) => item.name[0].includes('input_point_pro')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_note_pro')).length > 0
      ) {
        props.onValidateTab('proSkill', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (
        errorFields.filter((item: any) => item.name[0].includes('max_weight_behavior')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_point_behavior')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_note_behavior')).length > 0
      ) {
        props.onValidateTab('behavior', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (
        errorFields.filter((item: any) => item.name[0].includes('input_point_goal')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_note_goal')).length > 0
      ) {
        props.onValidateTab('goals', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (
        errorFields.filter((item: any) => item.name[0].includes('input_rating')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_point_additional')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_note_additional')).length > 0
      ) {
        props.onValidateTab('additional', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (
        errorFields.filter((item: any) => item.name[0].includes('input_skillpercent')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_behaviorpercent')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_achievementpercent')).length > 0
      ) {
        props.onValidateTab('pricing', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (
        errorFields.filter((item: any) => item.name[0].includes('maxPoint')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('minPoint')).length > 0
      ) {
        props.onValidateTab('settingMaxPoint', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      }
    });
};
