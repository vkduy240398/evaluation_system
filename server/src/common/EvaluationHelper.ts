import { Evaluator } from 'src/entity/Evaluator';

const HALF_ORDER = '仮評価: ';
const FIRST_ORDER = '一次評価: ';
const SECOND_ORDER = '二次評価: ';

export class EvaluationHelper {
  public static getOrderEvaluators(evaluator: Evaluator[]) {
    let results = '';
    const tempList = [];
    evaluator.map((item: Evaluator) => {
      if (item.evaluationOrder.toString() === '0.5')
        tempList[0] = item.user.fullName;
      if (item.evaluationOrder.toString() === '1.0')
        tempList[1] = item.user.fullName;
      if (item.evaluationOrder.toString() === '2.0')
        tempList[2] = item.user.fullName;
    });
    if (tempList[0]) results += HALF_ORDER + tempList[0] + '、';
    if (tempList[1]) results += FIRST_ORDER + tempList[1] + '、';
    if (tempList[2]) results += SECOND_ORDER + tempList[2];
    // if (results) results = results.substring(0, results.length - 1);
    return results;
  }
}
