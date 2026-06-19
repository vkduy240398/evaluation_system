import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import {
  AchievementAdditionalType,
  CommentPublicPrivate,
  UserEvaluationAchievementType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationPeriodType,
} from '../user.interfaces';

export interface HeaderPdfType {
  fiscalYear: string;
  periodStart: string;
  periodEnd: string;
  fullName: string;
  department: string;
  level: string | number;
  evaluators: string[];
  statusName: string;
  employeeNumber: string;
  companyName?: string;
  // header: string;
  status: StatusEvaluationType;
  isEvaluationDate?: boolean;
}

type StatusEvaluationType =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 98
  | 99
  | 100;

export interface DataSourceTotalTableType {
  pointSettingLevel: PointAndSettingLevelType;
  status: number;
  isEvaluationDate: boolean;
  evaluatorOrderList: number[];
  evaluatorOrder: number;
  // ** Point user

  basicTotalPointUser: number;
  proTotalPointUser: number;
  behaviorTotalPointUser: number;
  achievementPersonalTotalPointUser: number;
  achievementAdditionalTotalPointUser: number;

  // ** Point 0.5

  basicTotalPointEvaluator05: number;
  proTotalPointEvaluator05: number;
  behaviorTotalPointEvaluator05: number;
  achievementAdditionalTotalPointEvaluator05: number;
  achievementPersonalTotalPointEvaluator05: number;

  // ** Point 1.0
  basicTotalPointEvaluator1: number;
  proTotalPointEvaluator1: number;
  behaviorTotalPointEvaluator1: number;
  achievementAdditionalTotalPointEvaluator1: number;
  achievementPersonalTotalPointEvaluator1: number;

  // ** Point 2.0
  basicTotalPointEvaluator2: number;
  proTotalPointEvaluator2: number;
  behaviorTotalPointEvaluator2: number;
  achievementAdditionalTotalPointEvaluator2: number;
  achievementPersonalTotalPointEvaluator2: number;

  proSkillList: UserEvaluationToProSkillType[];
}

export interface EvaluationDetail17Type {
  id: number;
  fiscalYear: any;
  periodStart: any;
  periodEnd: any;
  level: any;
  evaluators: any[];
  statusName: any;
  status: any;
  department: any;
  companyName?: string;
  employeeNumber: string;
  fullName: string;
  guideVersionId: number;
  percentPoint: number;

  // ** Order
  evaluatorOrder: number;
  evaluatorOrderList: number[];

  // ** Comment
  commentUser: string;

  // ** Total point
  basicTotalPointUser: number;
  proTotalPointUser: number;
  behaviorTotalPointUser: number;
  achievementPersonalTotalPointUser: number;
  achievementAdditionalTotalPointUser: number;

  // ** Total - evaluator 0.5
  basicTotalPointEvaluator05: number;
  proTotalPointEvaluator05: number;
  behaviorTotalPointEvaluator05: number;
  achievementAdditionalTotalPointEvaluator05: number;
  achievementPersonalTotalPointEvaluator05: number;

  // ** Total - evaluator 1.0
  basicTotalPointEvaluator1: number;
  proTotalPointEvaluator1: number;
  behaviorTotalPointEvaluator1: number;
  achievementAdditionalTotalPointEvaluator1: number;
  achievementPersonalTotalPointEvaluator1: number;

  // ** Total - evaluator 2.0
  basicTotalPointEvaluator2: number;
  proTotalPointEvaluator2: number;
  behaviorTotalPointEvaluator2: number;
  achievementAdditionalTotalPointEvaluator2: number;
  achievementPersonalTotalPointEvaluator2: number;

  pointSettingLevel: PointAndSettingLevelType;
  proSkillList: UserEvaluationToProSkillType[];
  userEvaluationAchievements: UserEvaluationAchievementType[];
  dateCreationGoalStart: string | null;
  dateCreationGoalEnd: string | null;
  evaluationPeriod: UserEvaluationPeriodType;
  evaluationBasicSkills: UserEvaluationBasicBehaviorType[];
  evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[];
  achievementAdditionals: AchievementAdditionalType[];
  settingProFormulas: SettingProFormulaSub[];

  // ** Comment Public/Private
  comment: CommentPublicPrivate;

  // ** Evaluator exception
  isEvaluatorException: boolean;

  isNotEvaluator2?: boolean;

  // ** Update Time
  updateTime: string;

  // ** Basic-behavior-pro skill
  isEvaluationDate: boolean;
  isEvaluatorUser: boolean;

  basicProTotalPointUser: number;
  basicProTotalPointEvaluator05: number;
  basicProTotalPointEvaluator1: number;
  basicProTotalPointEvaluator2: number;

  summaryPointUser: number;
  summaryPointEvaluator05: number;
  summaryPointEvaluator1: number;
  summaryPointEvaluator2: number;
  flagSkill: number;
}

type PointAndSettingLevelType = {
  key: string;
  skillPercent: number;
  behaviorPercent: number;
  achievementPercent: number;
  percentPoint: number;
};

type UserEvaluationToProSkillType = {
  key: string;
  itemTitle: string;
  content: string;
  difficulty: number;
  totalPointUser: number;
  totalPointEvaluator05: number;
  totalPointEvaluator1: number;
  totalPointEvaluator2: number;
  totalPointProSkillUser?: number;
};
