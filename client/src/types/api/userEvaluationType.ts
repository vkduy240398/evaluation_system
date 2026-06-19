import { statusEvaluationType } from '../../common/status';
import {
  AchievementAdditionalType,
  BasicBehaviorSkillType,
  UserEvaluationAchievementType,
  UserEvaluationToProSkillType,
} from '../pages/user-evaluation/UserEvaluationType';

type ErrCallbackType = (err?: { [key: string]: string }) => void;

export interface EvaluationSkillCheckProps {
  evaluationId: string | undefined;
  isEvaluatorUser: boolean;
  isF5?: boolean;
  errorCallback?: ErrCallbackType;
}

export interface UserEvaluationProps {
  evaluationId: string | undefined;
  isEvaluatorUser: boolean;
  isF5?: boolean;
  callback: (dataSource: any) => void;
  errorCallback?: ErrCallbackType;
}

export interface UserEvaluationGetListProSkill {
  callback?: (dataSource: any) => void;
  isEvaluatorUser?: boolean;
  isF5?: boolean;
  evaluationId?: number;
  errorCallback?: ErrCallbackType;
}

export interface UpdateEvaluationByIdType {
  evaluationId?: string;
  isSubmit?: boolean;
  listProSkillData: UserEvaluationToProSkillType[];
  achievementDatas: UserEvaluationAchievementType[] | undefined;
  evaluationBasicSkills: BasicBehaviorSkillType[];
  evaluationBehaviorSkills: BasicBehaviorSkillType[];
  achievementAdditionals: AchievementAdditionalType[];
  proTotalPointUser: number | undefined | null;
  basicTotalPointUser: number | undefined | null;
  achievementAdditionalTotalPointUser: number | undefined;
  behaviorTotalPointUser: number | undefined | null;
  achievementPersonalTotalPointUser: number | undefined;

  // ** Total - evaluator 0.5
  basicTotalPointEvaluator05: number | undefined | null;
  proTotalPointEvaluator05: number | undefined | null;
  behaviorTotalPointEvaluator05: number | undefined | null;
  achievementAdditionalTotalPointEvaluator05: number | undefined;
  achievementPersonalTotalPointEvaluator05: number | undefined;

  // ** Total - evaluator 1.0
  basicTotalPointEvaluator1: number | undefined | null;
  proTotalPointEvaluator1: number | undefined | null;
  behaviorTotalPointEvaluator1: number | undefined | null;
  achievementAdditionalTotalPointEvaluator1: number | undefined;
  achievementPersonalTotalPointEvaluator1: number | undefined;

  // ** Total - evaluator 2.0
  basicTotalPointEvaluator2: number | undefined | null;
  proTotalPointEvaluator2: number | undefined | null;
  behaviorTotalPointEvaluator2: number | undefined | null;
  achievementAdditionalTotalPointEvaluator2: number | undefined;
  achievementPersonalTotalPointEvaluator2: number | undefined;

  // ** Comment
  commentUser: string;
  comment05Public: string;
  comment05Private: string;
  comment1Public: string;
  comment1Private: string;
  comment2Public: string;
  comment2Private: string;
  isEvaluatorUser: boolean;
  updateTime: any;
  totalData: any;

  achievementSubs: any;
  callback?: (dataRes: { status?: statusEvaluationType; updateTime: string }, isSubmit?: boolean) => void;
  errorCallback?: ErrCallbackType;
}

type AchievementType = 1 | 2 | '1' | '2' | 3 | '3' | 4 | 5 | 6 | '4' | '5' | '6';
export interface GetAchievementPublicType {
  achievementType: AchievementType;
  callback?: (data: any) => void;
  errorCallback?: ErrCallbackType;
  isEvaluatorUser?: boolean;
  isF5?: boolean;
  type: number;
}

export interface GetBasicBehaviorSkillPublicType {
  isEvaluatorUser: boolean;
  basicBehaviorType: AchievementType;
  level?: number;
  isF5?: boolean;
  callback?: (data: any) => void;
  errorCallback?: ErrCallbackType;
  isReview?: boolean;
}

export interface SettingProFormulaPublicType {
  callback?: (data: any) => void;
  errorCallback?: ErrCallbackType;
}
