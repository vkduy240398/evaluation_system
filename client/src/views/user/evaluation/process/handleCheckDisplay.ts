import { statusEvaluationType } from '../../../../common/status';

export const handleCheckDisplayUserOnScreen = (props: {
  statusEvaluation: statusEvaluationType;
  isEvaluationDate: boolean;
  evaluatorOrderList: number[];
  isEvaluatorUser: boolean;

  isEvaluatorException: boolean;
  evaluatorOrder: number;
  isNotEvaluator2: boolean;
  isF5: boolean;
  isReview?: boolean;
  typeReview?: number;
  newestOrder?: number;
}) => {
  const {
    statusEvaluation,
    isEvaluationDate,
    evaluatorOrderList,
    isEvaluatorUser,
    isEvaluatorException,
    evaluatorOrder,
    isNotEvaluator2,
    isF5,
    isReview,
    typeReview,
    newestOrder,
  } = props;

  // ** Display column user to self-evaluate
  const isDisplayUserEvaluator: boolean =
    [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(statusEvaluation) ||
    (statusEvaluation === 50 && isEvaluationDate);
  // ** Allow edit column user to self-evaluate
  const isEditUserEvaluation =
    [50, 51, 52].some((s) => s === statusEvaluation) &&
    isEvaluationDate &&
    isEvaluatorUser &&
    !isNotEvaluator2 &&
    !isEvaluatorException;
  // ** Display column evaluator 0.5 to evaluation
  const isDisplayEvaluator05: boolean =
    ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
      evaluatorOrderList.some((s) => Number(s) === 0.5) &&
      !isEvaluatorUser &&
      isF5) ||
    (statusEvaluation === 100 &&
      evaluatorOrderList.some((s) => Number(s) === 0.5) &&
      !(isReview && typeReview === 4)) ||
    ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
      !isEvaluatorUser &&
      !isF5 &&
      ((evaluatorOrder >= 0.5 && !isReview) || (Number(newestOrder) >= 0.5 && typeReview !== 4)) &&
      evaluatorOrderList.some((s) => Number(s) === 0.5));
  // ** Allow edit column evaluator 0.5 to evaluation
  const isEditEvaluation05: boolean =
    [54, 55].some((s) => s === statusEvaluation) &&
    Number(evaluatorOrder) === 0.5 &&
    isEvaluationDate &&
    !isNotEvaluator2 &&
    !isEvaluatorException;

  // ** Display column evaluator 1.0 to evaluation
  const isDisplayEvaluator1: boolean =
    ([57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
      evaluatorOrderList.some((s) => Number(s) === 1) &&
      [1, 2].includes(Number(evaluatorOrder)) &&
      !isEvaluatorUser &&
      isF5) ||
    (statusEvaluation === 100 && evaluatorOrderList.some((s) => Number(s) === 1) && !(isReview && typeReview === 4)) ||
    ([57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
      !isEvaluatorUser &&
      !isF5 &&
      ((evaluatorOrder >= 1 && !isReview) || (Number(newestOrder) >= 1 && typeReview !== 4)) &&
      evaluatorOrderList.some((s) => Number(s) === 1)) ||
    (evaluatorOrderList.some((s) => Number(s) === 1) &&
      [57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
      (isF5 || false));
  // ** Allow edit column evaluator 1.0 to evaluation
  const isEditEvaluation1: boolean =
    [57, 58].some((s) => s === statusEvaluation) &&
    Number(evaluatorOrder) === 1 &&
    isEvaluationDate &&
    !isNotEvaluator2 &&
    !isEvaluatorException;

  // ** Display column evaluator 2.0 to evaluation
  const isDisplayEvaluator2: boolean =
    ([60, 61, 98, 99].includes(statusEvaluation) &&
      evaluatorOrderList.some((s) => Number(s) === 2) &&
      Number(evaluatorOrder) === 2 &&
      !isEvaluatorUser &&
      isF5) ||
    (statusEvaluation === 100 && evaluatorOrderList.some((s) => Number(s) === 2) && !(isReview && typeReview === 4)) ||
    ([60, 61, 98, 99].includes(statusEvaluation) &&
      !isEvaluatorUser &&
      !isF5 &&
      ((evaluatorOrder >= 2 && !isReview) || (Number(newestOrder) >= 2 && typeReview !== 4)) &&
      evaluatorOrderList.some((s) => Number(s) === 2)) ||
    (evaluatorOrderList.some((s) => Number(s) === 2) && [60, 61, 98, 99].includes(statusEvaluation) && (isF5 || false));

  // ** Allow edit column evaluator 2.0 to evaluation
  const isEditEvaluation2: boolean =
    [60, 61].some((s) => s === statusEvaluation) &&
    Number(evaluatorOrder) === 2 &&
    isEvaluationDate &&
    !isNotEvaluator2 &&
    !isEvaluatorException;

  // // ** Display column user to self-evaluate
  // const isDisplayUserEvaluator: boolean =
  //   [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(statusEvaluation) ||
  //   (statusEvaluation === 50 && isEvaluationDate);

  // // ** Allow edit column user to self-evaluate
  // const isEditUserEvaluation =
  //   [50, 51, 52].some((s) => s === statusEvaluation) && isEvaluationDate && isEvaluatorUser && !isNotEvaluator2;

  // // ** Display column evaluator 0.5 to evaluation
  // const isDisplayEvaluator05: boolean =
  //   ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
  //     evaluatorOrderList.some((s) => Number(s) === 0.5) &&
  //     !isEvaluatorUser) ||
  //   (statusEvaluation === 100 && evaluatorOrderList.some((s) => Number(s) === 0.5)) ||
  //   ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) && isEvaluatorException && !isF5);

  // const isTestDisplayEvaluator = displayEvaluatorOnScreen(
  //   evaluatorOrderList,
  //   0.5,
  //   [54, 55, 56, 57, 58, 59, 60, 61, 98, 99],
  //   statusEvaluation,
  //   isEvaluatorUser,
  // );

  // // ** Allow edit column evaluator 0.5 to evaluation
  // const isEditEvaluation05: boolean =
  //   [54, 55].some((s) => s === statusEvaluation) &&
  //   Number(evaluatorOrder) === 0.5 &&
  //   isEvaluationDate &&
  //   !isNotEvaluator2;

  // // ** Display column evaluator 1.0 to evaluation
  // const isDisplayEvaluator1: boolean =
  //   ([57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
  //     evaluatorOrderList.some((s) => Number(s) === 1) &&
  //     [1, 2].includes(Number(evaluatorOrder)) &&
  //     !isEvaluatorUser) ||
  //   (statusEvaluation === 100 && evaluatorOrderList.some((s) => Number(s) === 1)) ||
  //   ([57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) && isEvaluatorException && !isF5) ||
  //   (evaluatorOrderList.some((s) => Number(s) === 1) &&
  //     [57, 58, 59, 60, 61, 98, 99].includes(statusEvaluation) &&
  //     (isF5 || false));

  // // ** Allow edit column evaluator 1.0 to evaluation
  // const isEditEvaluation1: boolean =
  //   [57, 58].some((s) => s === statusEvaluation) &&
  //   Number(evaluatorOrder) === 1 &&
  //   isEvaluationDate &&
  //   !isNotEvaluator2;

  // // ** Display column evaluator 2.0 to evaluation
  // const isDisplayEvaluator2: boolean =
  //   ([60, 61, 98, 99].includes(statusEvaluation) &&
  //     evaluatorOrderList.some((s) => Number(s) === 2) &&
  //     Number(evaluatorOrder) === 2 &&
  //     !isEvaluatorUser) ||
  //   (statusEvaluation === 100 && evaluatorOrderList.some((s) => Number(s) === 2)) ||
  //   ([60, 61, 98, 99].includes(statusEvaluation) && isEvaluatorException && !isF5) ||
  //   (evaluatorOrderList.some((s) => Number(s) === 2) && [60, 61, 98, 99].includes(statusEvaluation) && (isF5 || false));

  // // ** Allow edit column evaluator 2.0 to evaluation
  // const isEditEvaluation2: boolean =
  //   [60, 61].some((s) => s === statusEvaluation) &&
  //   Number(evaluatorOrder) === 2 &&
  //   isEvaluationDate &&
  //   !isNotEvaluator2;

  return {
    isDisplayUserEvaluator,
    isEditUserEvaluation,
    isDisplayEvaluator05,
    isEditEvaluation05,
    isDisplayEvaluator1,
    isEditEvaluation1,
    isDisplayEvaluator2,
    isEditEvaluation2,
  };
};
