import { t } from 'i18next';

// ** Types
import { Dispatch } from 'redux';
import { FormInstance } from 'antd';
import {
  AchievementAdditionalType,
  UserEvaluationAchievementType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { statusEvaluationType } from '../../../../common/status';
import { hasOwnPropertyArray } from '../../../../views/user/evaluation/process/handle.process';
import { setFocusAchievementPersonalError } from '../../../../store/userEvaluation';
import { EvaluationPersonalAchievement } from '../../../../views/user/evaluation-8-10/interfaces/response.interface';

const calculatorAchievement = (achievementDatas: EvaluationPersonalAchievement[] | undefined) => {
  return achievementDatas && achievementDatas.reduce((pre, cur) => pre + (Number(cur.weight) || 0), 0);
};

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
export const handleCheckValidatePersonal810 = (props: {
  store: StoreType;
  statusEvaluation: statusEvaluationType;
  handleMoveToTab: (idParents: string, idChildren: TabId, msg: string) => void;
  form: FormInstance;
  setOpen: (isBool: boolean) => void;
  isEvaluationDate: boolean;
  dispatch: Dispatch<any>;
  stores: { evaluationPersonalGoals: EvaluationPersonalAchievement[] };
}) => {
  // ** Props
  const { store, statusEvaluation, handleMoveToTab, form, setOpen, isEvaluationDate, dispatch, stores } = props;

  // ** Apply for status 0, 1
  if ([0, 1, 2].some((v) => v === statusEvaluation)) {
    // ** Check achievement skill
    const evaluationPersonalGoals = store.achievementDatas;

    const isErrorAchievementData = hasOwnPropertyArray(
      evaluationPersonalGoals,
      ['title', 'achievementValue', 'method', 'weight', 'difficultyUser'],
      statusEvaluation,
      true,
      [
        { key: 'title', maxLength: 1000 },
        { key: 'achievementValue', maxLength: 1000 },
        { key: 'method', maxLength: 5000 },
      ],
    );

    const isErrorPercentAchievement =
      calculatorAchievement(evaluationPersonalGoals as EvaluationPersonalAchievement[] | undefined) !== 100;
    const hasOwnPropertyProSkill = hasOwnPropertyArray(store.evaluationProSkills, ['content'], statusEvaluation);

    if (hasOwnPropertyProSkill)
      handleMoveToTab('2', '1', t('MESSAGE.SCREEN.EVALUATION_DETAIL.IDM_REQUIRED_SELECT_PRO_SKILL'));
    else if (isErrorAchievementData) handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    else if (isErrorPercentAchievement) {
      dispatch(setFocusAchievementPersonalError(true));
      handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_WEIGHT')));
    }
    if (!isErrorAchievementData && !isErrorPercentAchievement && !hasOwnPropertyProSkill)
      form
        .validateFields()
        .then(() => setOpen(true))
        .catch(() => handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR')));
  }

  // ** Check time start->end of the evaluation time
  if (isEvaluationDate) {
    // ** Apply for status 50, 51, 52
    if ([50, 51, 52].some((v) => v === statusEvaluation)) {
      // **
      const hasOwnPropertyBasic = hasOwnPropertyArray(
        store.evaluationBasicSkills,
        ['title', 'content', 'difficulty', 'pointUser'],
        statusEvaluation,
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
      const proSkillLists = store.evaluationProSkills.filter((v) => v.isDisable === false);
      const hasOwnPropertyProSkill =
        proSkillLists.length > 0 && hasOwnPropertyArray(proSkillLists, ['pointUser'], statusEvaluation);
      if (hasOwnPropertyBasic) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyProSkill) handleMoveToTab('2', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      if (!hasOwnPropertyProSkill && !hasOwnPropertyBasic && !hasOwnPropertyAchievementAdd) {
        form
          .validateFields()
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }

    // ** Apply for status 53, 54, 55
    if ([54, 55].some((v) => v === statusEvaluation)) {
      const proSkillLists = store.evaluationProSkills.filter((v) => v.isDisable === false);
      const hasOwnPropertyProSkill =
        proSkillLists.length > 0 && hasOwnPropertyArray(proSkillLists, ['pointEvaluator05'], statusEvaluation);
      const hasOwnPropertyBasic = hasOwnPropertyArray(
        store.evaluationBasicSkills,
        ['pointEvaluator05'],
        statusEvaluation,
      );

      const hasOwnPropertyAchievementAdd =
        store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 0.5).length > 0 &&
        hasOwnPropertyArray(
          store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 0.5),
          ['pointEvaluator05', 'reasonComment', 'titleAdditional', 'achievementStatus'],
          statusEvaluation,
        );
      //

      if (hasOwnPropertyBasic) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyProSkill) handleMoveToTab('2', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));

      if (!hasOwnPropertyProSkill && !hasOwnPropertyBasic && !hasOwnPropertyAchievementAdd) {
        form
          .validateFields()
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }

    // ** Apply for status 56, 57, 58
    if ([57, 58].some((v) => v === statusEvaluation)) {
      const proSkillLists = store.evaluationProSkills.filter((v) => v.isDisable === false);
      const hasOwnPropertyProSkill =
        proSkillLists.length > 0 && hasOwnPropertyArray(proSkillLists, ['pointEvaluator1'], statusEvaluation);

      const hasOwnPropertyBasic = hasOwnPropertyArray(
        store.evaluationBasicSkills,
        ['pointEvaluator1'],
        statusEvaluation,
      );

      const hasOwnPropertyAchievementAdd =
        store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 1).length > 0 &&
        hasOwnPropertyArray(
          store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 1),
          ['pointEvaluator1', 'reasonComment', 'titleAdditional', 'achievementStatus'],
          statusEvaluation,
        );

      if (hasOwnPropertyBasic) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyProSkill) handleMoveToTab('2', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));

      if (
        !hasOwnPropertyProSkill &&
        !hasOwnPropertyBasic &&
        // !hasOwnPropertyAchievement &&
        !hasOwnPropertyAchievementAdd
      ) {
        form
          .validateFields()
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }

    // ** Apply for status 59, 60, 61
    if ([60, 61].some((v) => v === statusEvaluation)) {
      const proSkillLists = store.evaluationProSkills.filter((v) => v.isDisable === false);
      const hasOwnPropertyProSkill =
        proSkillLists.length > 0 && hasOwnPropertyArray(proSkillLists, ['pointEvaluator2'], statusEvaluation);
      const hasOwnPropertyBasic = hasOwnPropertyArray(
        store.evaluationBasicSkills,
        ['pointEvaluator2'],
        statusEvaluation,
      );

      const hasOwnPropertyAchievementAdd =
        store.achievementAdditionals.filter((e) => Number(e.evaluationOrder) <= 2).length > 0 &&
        hasOwnPropertyArray(
          store.achievementAdditionals,
          ['pointEvaluator2', 'reasonComment', 'titleAdditional', 'achievementStatus'],
          statusEvaluation,
        );

      if (hasOwnPropertyBasic) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyProSkill) handleMoveToTab('2', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      else if (hasOwnPropertyAchievementAdd) handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
      if (!hasOwnPropertyProSkill && !hasOwnPropertyBasic && !hasOwnPropertyAchievementAdd) {
        form
          .validateFields()
          .then(() => setOpen(true))
          .catch((error) => {
            if (error.errorFields[0].name[0].includes('additional')) {
              handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (error.errorFields[0].name[0].includes('achievement')) {
              handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            }
          });
      }
    }
  }
};
