import { EvaluationInfo, SettingFormula810 } from './interfaces/response.interface';

export function checkDisplaySumPoint(
  type: string,
  store: any,
  record: { key: number; user: string; charPoint: string; summaryPoint: string | boolean },
  settingFormula810: SettingFormula810[],
  evaluationData: EvaluationInfo,
  maxPoint: number,
  minPoint: number,
) {
  const covertValueToChar = (num: string) => {
    const value = Number(num);
    const smallerList: string[] = [];
    settingFormula810.map((item: SettingFormula810) => {
      if (item.point <= value) {
        smallerList.push(item.result);
      }
    });
    let result = '';
    if (smallerList) {
      result = smallerList[0];
    }

    return result;
  };

  let result = '';
  const totalUser = Math.min(
    Math.max(
      store.calculateTotal.userSum
        ? store.calculateTotal.userSum + (store.calculateTotal.additionSum || 0)
        : parseFloat(evaluationData.summaryPointUser),
      minPoint,
    ),
    maxPoint,
  );

  const totalUser05 = Math.min(
    Math.max(
      store.calculateTotal.sumEvaluator05
        ? store.calculateTotal.sumEvaluator05 + (store.calculateTotal.additionSum05 || 0)
        : parseFloat(evaluationData.summaryPointEvaluator05),
      minPoint,
    ),
    maxPoint,
  );

  const totalUser1 = Math.min(
    Math.max(
      store.calculateTotal.sumEvaluator1
        ? store.calculateTotal.sumEvaluator1 + (store.calculateTotal.additionSum1 || 0)
        : parseFloat(evaluationData.summaryPointEvaluator1),
      minPoint,
    ),
    maxPoint,
  );

  const totalUser2 = Math.min(
    Math.max(
      store.calculateTotal.sumEvaluator2
        ? store.calculateTotal.sumEvaluator2 + (store.calculateTotal.additionSum2 || 0)
        : parseFloat(evaluationData.summaryPointEvaluator2),
      minPoint,
    ),
    maxPoint,
  );

  if (type == '本人' && (store.calculateTotal.userSum || parseFloat(evaluationData.summaryPointUser)))
    result = roundNumber(totalUser.toFixed(2)) + ' (' + covertValueToChar(roundNumber(totalUser.toFixed(2))) + ')';
  if (type == '仮評価' && store.calculateTotal.sumEvaluator05)
    result = roundNumber(totalUser05.toFixed(2)) + ' (' + covertValueToChar(roundNumber(totalUser05.toFixed(2))) + ')';
  if (type == '一次' && store.calculateTotal.sumEvaluator1)
    result = roundNumber(totalUser1.toFixed(2)) + ' (' + covertValueToChar(roundNumber(totalUser1.toFixed(2))) + ')';
  if (type == '二次' && store.calculateTotal.sumEvaluator2)
    result = roundNumber(totalUser2.toFixed(2)) + ' (' + covertValueToChar(roundNumber(totalUser2.toFixed(2))) + ')';

  return result;
}
export function sortObject(obj: any, order: string) {
  let tempList = [];
  if (obj && order) {
    if (order === 'DESC') {
      tempList = obj.sort(function (a: any, b: any) {
        return b.point - a.point;
      });
    } else {
      tempList = obj.sort(function (a: any, b: any) {
        return a.point - b.point;
      });
    }
  }

  return tempList;
}
export function roundNumber(num: string) {
  const result = Number(num);

  if (num[num.length - 1] >= '5') {
    return (result + 0.01).toFixed(1);
  } else {
    return result.toFixed(1);
  }

  // return (Math.floor(result * 10) / 10).toString();
}
