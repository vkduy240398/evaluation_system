import { statusEvaluationType } from '../../../../common/status';
import { KeyCheckMaxLengths, hasMaxLengthArray, hasOwnPropertyObject } from '../../../../common/util';
import { UserEvaluationAchievementType } from '../../../../types/pages/user-evaluation/UserEvaluationType';

export const hasOwnPropertyArray = (
  objectList: any[] | undefined,
  keyNeedChecks: string[],
  statusEvaluation: statusEvaluationType,
  isHasMaxLength = false,
  keyCheckMaxLength?: KeyCheckMaxLengths[],
): boolean => {
  // console.log(objectList);
  let hasError = false;
  if (!objectList) return hasError;
  if (
    (statusEvaluation === 0 ||
      statusEvaluation === 1 ||
      statusEvaluation === 2 ||
      statusEvaluation === 50 ||
      statusEvaluation === 51 ||
      statusEvaluation === 52) &&
    objectList.length === 0
  )
    return (hasError = true);

  for (const item of objectList) {
    const isHasError = hasOwnPropertyObject(keyNeedChecks, item);
    if (!isHasError) {
      hasError = true;
      break;
    }
    if (isHasMaxLength && keyCheckMaxLength) {
      const isHasError = hasMaxLengthArray(keyCheckMaxLength, item);
      if (!isHasError) {
        hasError = true;
        break;
      }
    }
  }

  return hasError;
};

export const hasOwnPropertyArrayAchievement = (
  objectList: any[] | undefined,
  keyNeedChecks: string[],
  isHasMaxLength = false,
  statusEvaluation: statusEvaluationType,
  keyCheckMaxLength?: KeyCheckMaxLengths[],
): boolean => {
  let hasError = false;
  if (!objectList) return hasError;
  if (
    (statusEvaluation === 0 ||
      statusEvaluation === 1 ||
      statusEvaluation === 2 ||
      statusEvaluation === 50 ||
      statusEvaluation === 51 ||
      statusEvaluation === 52) &&
    objectList.length === 0
  )
    return (hasError = true);
  for (const item of objectList) {
    const isHasError = hasOwnPropertyObject(
      keyNeedChecks,
      item,
      item.achievementStatus === '未達成' ? undefined : 'reasonComment',
    );
    if (!isHasError) {
      hasError = true;
      break;
    }

    if (isHasMaxLength && keyCheckMaxLength) {
      const isHasError = hasMaxLengthArray(keyCheckMaxLength, item);
      if (!isHasError) {
        hasError = true;
        break;
      }
    }
  }

  return hasError;
};

export const calculatorAchievement = (achievementDatas: UserEvaluationAchievementType[] | undefined) => {
  return achievementDatas && achievementDatas.reduce((pre, cur) => pre + (Number(cur.weight) || 0), 0);
};
