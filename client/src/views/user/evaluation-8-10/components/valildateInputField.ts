import { t } from 'i18next';
import { EvaluationPersonalAchievement } from '../interfaces/response.interface';
export function validateTarget(value: string, maxLength: number) {
  if (!value || value === '') {
    return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM'));
  }
  if (value.length > maxLength) {
    return Promise.reject(t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', `${maxLength}`));
  }

  return Promise.resolve();
}
export function validateDifficulty(value: number) {
  if (value === 0) {
    return Promise.resolve();
  } else {
    
    if (!value) {
      return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM'));
    }
    
    if (value.toString().trim() === '') {
      return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM'));
    }
    
    if (Number(value) < 0) return Promise.reject(t('MESSAGE.COMMON.IDM_MIN_POINT').replace('{min value}', '-1'));

    if (value && value.toString().match(/^[0-9]*$/) === null) {
      return Promise.reject(t('MESSAGE.COMMON.IDM_INVALID_NUMBER'));
    }

    // if (Number(value) < 0 || value == 0)

    if (
      value &&
      Number(value)
        .toString()
        .match(/(^100$)|^[0-9]\d?$/) === null
    ) {
      
      return Promise.reject(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100'));
    }

    return Promise.resolve();
  }
}
export function get2WithoutRound(num: number) {
  let temp = '';
  if (num && num !== 0) {
    temp = num.toString(); //If it's not already a String
    temp = temp.slice(0, temp.indexOf('.') + 3); //With 3 exposing the hundredths place
  }

  return Number(temp);
}
export function validateTableSubColumn(value: string, maxLength: number) {
  let isNotValid = false;
  if (!value || value === '') {
    isNotValid = true;
  }
  if (value.length > maxLength) {
    isNotValid = true;
  }

  return isNotValid;
}
export function isNotNumber(value: string) {
  let isNotValid = false;
  if (!value || value === '') {
    isNotValid = true;
  }

  if (Number(value) < 0) isNotValid = false;
  else if (value && value.toString().match(/^[0-9]*$/) === null) {
    isNotValid = true;
  }

  // if (value && value.toString().match(/(^100$)|^[1-9]\d?$/) === null) {
  //   isNotValid = true;
  // }

  return isNotValid;
}
export function validatePrivateComment(value: string, maxLength: number) {
  if (!value || value === '') {
    return Promise.resolve();
  }
  if (value.length > maxLength) {
    return Promise.reject(t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', `${maxLength}`));
  }

  return Promise.resolve();
}

export function validateActionPlan(value: string, maxLength: number, form: any, record: EvaluationPersonalAchievement) {
  const selectedAchievementStatus = form.getFieldValue('achievementStatus_' + record.itemNo);

  if (selectedAchievementStatus && selectedAchievementStatus === '未達成' && (!value || value === '')) {
    return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM'));
  }
  if (value && value.length > maxLength) {
    return Promise.reject(t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', `${maxLength}`));
  }

  return Promise.resolve();
}
