import { SettingProFormulaDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';

export class DetailCalculationHelper {
  public static isAnyNullSettingProFormulaSub(settingProFormulaDto: SettingProFormulaDto[]) {
    let hasResult = false;

    settingProFormulaDto
      .map((parent) => parent.settingProFormulaSub)
      .forEach((subArr) => {
        subArr?.forEach((el) => {
          if (el.totalItem === null || !el.coefficient) {
            hasResult = true;
          }
        });
      });

    return hasResult;
  }
}
