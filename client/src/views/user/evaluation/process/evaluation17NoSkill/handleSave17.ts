import { t } from 'i18next';
import { statusEvaluationType } from '../../../../../common/status';
import {
  AchievementAdditionalType,
  UserEvaluationAchievementType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from '../../../../../types/pages/user-evaluation/UserEvaluationType';

// ** Types
import { Dispatch } from 'redux';
import { FormInstance } from 'antd';
import { calculatorAchievement, hasOwnPropertyArray, hasOwnPropertyArrayAchievement } from '../handle.process';
import { setFocusAchievementPersonalError } from '../../../../../store/userEvaluation';

type TabId = '1' | '2' | '3' | '4' | '5' | '6';
type StoreType = {
  userEvaluationSave: {};
  achievementDatas: UserEvaluationAchievementType[] | undefined;
  evaluationProSkills: UserEvaluationToProSkillType[];
  achievementSubs: any;
  evaluationBasicSkills: UserEvaluationBasicBehaviorType[];
  evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[];
  achievementAdditionals: AchievementAdditionalType[];
};

// ** Handle Process Error Tab
export const handleOpenSavePopup17NoSkill = (props: {
  store: StoreType;
  statusEvaluation: statusEvaluationType;
  handleMoveToTab: (id: TabId, msg: string) => void;
  form: FormInstance;
  setOpen: (isBool: boolean) => void;
  isEvaluationDate: boolean;
  dispatch: Dispatch<any>;
}) => {
  // ** Props
  const { store, statusEvaluation, handleMoveToTab, form, setOpen, isEvaluationDate, dispatch } = props;

  // ** Apply for status 0, 1
  if ([0, 1, 2].some((v) => v === statusEvaluation)) {
    // ** Check achievement skill
    const isErrorAchievementData = hasOwnPropertyArray(
      store.achievementDatas,
      ['title', 'achievementValue', 'method', 'weight', 'difficultyUser'],
      statusEvaluation,
      true,
      [
        { key: 'title', maxLength: 1000 },
        { key: 'achievementValue', maxLength: 1000 },
        { key: 'method', maxLength: 5000 },
      ],
    );
    const isErrorPercentAchievement = calculatorAchievement(store.achievementDatas) !== 100;
    if (isErrorAchievementData)
      handleMoveToTab(
        statusEvaluation > 50 || (statusEvaluation >= 50 && isEvaluationDate) ? '2' : '4',
        t('MESSAGE.COMMON.IDM_TAB_ERROR'),
      );
    else if (isErrorPercentAchievement) {
      dispatch(setFocusAchievementPersonalError(true));
      handleMoveToTab(
        statusEvaluation > 50 || (statusEvaluation >= 50 && isEvaluationDate) ? '2' : '4',
        t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_WEIGHT')),
      );
    }
    if (!isErrorAchievementData && !isErrorPercentAchievement)
      form
        .validateFields()
        .then(() => setOpen(true))
        .catch(() => handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR')));
  }

  if (isEvaluationDate) {
    // ** Apply for status 50, 51, 52
    if ([50, 51, 52].some((v) => v === statusEvaluation)) {
      const hasOwnPropertyBehavior = hasOwnPropertyArray(
        store.evaluationBehaviorSkills,
        ['title', 'content', 'difficulty', 'pointUser'],
        statusEvaluation,
      );

      const hasOwnPropertyAchievement = hasOwnPropertyArrayAchievement(
        store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
        ['achievementStatus', 'reasonComment', 'actionPlan', 'pointUser'],
        true,
        statusEvaluation,
        [
          { key: 'reasonComment', maxLength: 1000 },
          { key: 'actionPlan', maxLength: 1000 },
        ],
      );
      const hasOwnPropertyAchievementAdd =
        store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) === 0).length > 0 &&
        hasOwnPropertyArray(
          store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) === 0),
          ['titleAdditional', 'achievementStatus', 'reasonComment', 'pointUser'],
          statusEvaluation,

          true,
          [
            { key: 'titleAdditional', maxLength: 1000 },
            { key: 'reasonComment', maxLength: 1000 },
          ],
        );
      const hasMaxLengthCommentUserError = form.getFieldValue('commentUser')?.length > 2000;
      const hasMinLengthCommentUserError =
        !form.getFieldValue('commentUser') || form.getFieldValue('commentUser').length === 0;

      if (hasOwnPropertyBehavior) handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievement) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasMaxLengthCommentUserError || hasMinLengthCommentUserError)
        handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      if (
        !hasOwnPropertyBehavior &&
        !hasOwnPropertyAchievement &&
        !hasOwnPropertyAchievementAdd &&
        !hasMaxLengthCommentUserError &&
        !hasMinLengthCommentUserError
      ) {
        form
          .validateFields()
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (['reasonComment', 'pointUser'].includes(error.errorFields[0].name[0].split('-')[0])) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }

    const fieldsToValidates = Object.keys(form.getFieldsValue()).filter(
      (field) => !['commentRejectEvaluator', 'commentReject'].includes(field),
    );

    // ** Apply for status 53, 54, 55
    if ([54, 55].some((v) => v === statusEvaluation)) {
      const hasOwnPropertyAchievement = hasOwnPropertyArray(
        store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
        ['pointEvaluator05', 'difficultyEvaluator05'],
        statusEvaluation,
      );
      const hasOwnPropertyBehavior = hasOwnPropertyArray(
        store.evaluationBehaviorSkills,
        ['pointEvaluator05'],
        statusEvaluation,
      );

      const hasOwnPropertyAchievementAdd =
        (store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) === 0).length > 0 &&
          hasOwnPropertyArray(
            store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) === 0),
            ['titleAdditional', 'achievementStatus', 'reasonComment', 'pointUser'],
            statusEvaluation,

            true,
            [
              { key: 'titleAdditional', maxLength: 1000 },
              { key: 'reasonComment', maxLength: 1000 },
            ],
          )) ||
        hasOwnPropertyArray(
          store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) === 0.5),
          ['titleAdditional', 'achievementStatus', 'reasonComment', 'pointEvaluator05'],
          statusEvaluation,

          true,
          [
            { key: 'titleAdditional', maxLength: 1000 },
            { key: 'reasonComment', maxLength: 1000 },
          ],
        );

      const hasMaxLengthCommentPublicError = form.getFieldValue('comment05Public')?.length > 2000;
      const hasMaxLengthCommentPrivateError = form.getFieldValue('comment05Private')?.length > 2000;
      const hasMinLengthCommentPublicError =
        !form.getFieldValue('comment05Public') || form.getFieldValue('comment05Public').length === 0;

      if (hasOwnPropertyBehavior) handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievement) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasMaxLengthCommentPublicError || hasMaxLengthCommentPrivateError || hasMinLengthCommentPublicError)
        handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      if (
        !hasOwnPropertyBehavior &&
        !hasOwnPropertyAchievement &&
        !hasOwnPropertyAchievementAdd &&
        !hasMaxLengthCommentPublicError &&
        !hasMaxLengthCommentPrivateError &&
        !hasMinLengthCommentPublicError
      ) {
        form
          .validateFields(fieldsToValidates)
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (['difficultyUser05'].includes(error.errorFields[0].name[0].split('-')[0])) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }

    // ** Apply for status 56, 57, 58
    if ([57, 58].some((v) => v === statusEvaluation)) {
      const hasOwnPropertyAchievement = hasOwnPropertyArray(
        store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
        ['pointEvaluator1', 'difficultyEvaluator1'],
        statusEvaluation,
      );
      const hasOwnPropertyBehavior = hasOwnPropertyArray(
        store.evaluationBehaviorSkills,
        ['pointEvaluator1'],
        statusEvaluation,
      );
      const hasOwnPropertyAchievementAdd =
        store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 1).length > 0 &&
        hasOwnPropertyArray(
          store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 1),
          ['titleAdditional', 'achievementStatus', 'reasonComment', 'pointEvaluator1'],
          statusEvaluation,
        );
      const hasMaxLengthCommentPublicError = form.getFieldValue('comment1Public')?.length > 2000;
      const hasMaxLengthCommentPrivateError = form.getFieldValue('comment1Private')?.length > 2000;

      const hasMinLengthCommentPublicError =
        !form.getFieldValue('comment1Public') || form.getFieldValue('comment1Public').length === 0;
      if (hasOwnPropertyBehavior) return handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievement) return handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) return handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasMaxLengthCommentPublicError || hasMaxLengthCommentPrivateError || hasMinLengthCommentPublicError)
        handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));

      if (
        !hasOwnPropertyBehavior &&
        !hasOwnPropertyAchievement &&
        !hasOwnPropertyAchievementAdd &&
        !hasMaxLengthCommentPublicError &&
        !hasMaxLengthCommentPrivateError &&
        !hasMinLengthCommentPublicError
      ) {
        form
          .validateFields(fieldsToValidates)
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (['difficultyUser1'].includes(error.errorFields[0].name[0].split('-')[0])) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }

    // ** Apply for status 59, 60, 61
    if ([60, 61].some((v) => v === statusEvaluation)) {
      const hasOwnPropertyAchievement = hasOwnPropertyArray(
        store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
        ['pointEvaluator2', 'difficultyEvaluator2'],
        statusEvaluation,
      );
      const hasOwnPropertyBehavior = hasOwnPropertyArray(
        store.evaluationBehaviorSkills,
        ['pointEvaluator2'],
        statusEvaluation,
      );
      const hasOwnPropertyAchievementAdd =
        store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 2).length > 0 &&
        hasOwnPropertyArray(
          store.achievementAdditionals,
          ['titleAdditional', 'achievementStatus', 'reasonComment', 'pointEvaluator2'],
          statusEvaluation,
        );
      const hasMaxLengthCommentPublicError = form.getFieldValue('comment2Public')?.length > 2000;
      const hasMaxLengthCommentPrivateError = form.getFieldValue('comment2Private')?.length > 2000;
      const hasMinLengthCommentPublicError =
        !form.getFieldValue('comment2Public') || form.getFieldValue('comment2Public').length === 0;

      if (hasOwnPropertyBehavior) handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievement) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasMaxLengthCommentPublicError || hasMaxLengthCommentPrivateError || hasMinLengthCommentPublicError)
        handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      if (
        !hasOwnPropertyBehavior &&
        !hasOwnPropertyAchievement &&
        !hasOwnPropertyAchievementAdd &&
        !hasMaxLengthCommentPublicError &&
        !hasMaxLengthCommentPrivateError &&
        !hasMinLengthCommentPublicError
      ) {
        form
          .validateFields(fieldsToValidates)
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (['difficultyUser3'].includes(error.errorFields[0].name[0].split('-')[0])) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }
  }
};
