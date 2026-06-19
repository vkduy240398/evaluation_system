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

export const onValidateSavePublicCommon = async (props: ValidateProps) => {
  // check validate và di chuyển các tabs theo validate

  await props.form
    .validateFields()
    .then(async () => {
      if (props.dataSource.settingProFormula!.length === 0) {
        props.onValidateTab('proSkill', t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace('{tab}', t('IDS_PRO_SKILL')));
      } else if (DetailCalculationHelper.isAnyNullSettingProFormulaSub(props.dataSource.settingProFormula!)) {
        props.onValidateTab('proSkill', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      } else if (!props.dataSource.reason || props.dataSource.reason === '') {
        props.onValidateTab('', `${t('IDS_PLACEHOLDER_HISTORY_EDIT')}：　${t('MESSAGE.COMMON.IDM_BLANK_ITEM')}`);
      } else {
        props.setIsOpenSavePublicConfirm(true);
      }
    })
    .catch((err: any) => {
      const { errorFields } = err;
      if (
        errorFields.filter((item: any) => item.name[0].includes('input_point_pro_formula')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_note_pro_formula')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_totalitem')).length > 0 ||
        errorFields.filter((item: any) => item.name[0].includes('input_coef')).length > 0
      ) {
        props.onValidateTab('proSkill', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      }
    });
};
