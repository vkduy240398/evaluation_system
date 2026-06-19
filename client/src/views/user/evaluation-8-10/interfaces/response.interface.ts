import { statusEvaluationType } from '../../../../common/status';
import {
  BasicBehaviorSkillType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from '../../../../types/pages/user-evaluation/UserEvaluationType';

export interface UserInfo {
  department: string;
  division: string;
  employeeNumber: string;
  evaluationLevel: number;
  evaluators: string[];
  fiscalYear: string;
  fullName: string;
  id: number;
  periodEnd: string;
  periodStart: string;
  status: number;
  divisionId?: number;
  rejectComment: string;
}
export interface EvaluatorInfo {
  commentPrivate: string;
  commentPublic: string;
  evaluationOrder: string;
  evaluatorId: number;
  user?: {
    email: string;
    employeeNumber: string;
    fullName: string;
  };
  charPoint?: string;
  evaluator?: string;
}
export interface SettingAchievementAdditional {
  rating: string;
  point: number;
}
export interface SettingAchievementPersonal {
  type: number;
  point: number;
  key: number;
  note: string;
}
export interface SettingFormula810 {
  point: number;
  result: string;
}
export interface VersionSetting810 {
  id: number;
  settingAchievementAdditional: SettingAchievementAdditional[];
  settingAchievementPersonal: SettingAchievementPersonal[];
  settingFormula810: SettingFormula810[];
  subVersion: number;
  version: number;
  maxPoint: number;
  minPoint: number;
  settingAchievementPersonalType2?: any;
  settingAchievementPersonalType1?: any;
}
export interface VersionSetting7 {
  id: number;
  settingAchievementAdditional: SettingAchievementAdditional[];
  settingAchievementPersonal: SettingAchievementPersonal[];
  settingFormula810: SettingFormula810[];
  subVersion: number;
  version: number;
  maxPoint: number;
  minPoint: number;
  settingAchievementPersonalType2?: any;
  settingAchievementPersonalType1?: any;
  settingPointBasic?: any;
  settingPointPro?: any;
}
export interface SubList {
  key: number;
  achievementPersonalId?: number;
  coefficient: number;
  evaluationDecision: string;
  parentKey: number;
  type?: number;
  degree?: string;
}

export interface EvaluationInfo {
  achievementAdditionalTotalPointEvaluator1: any;
  achievementAdditionalTotalPointEvaluator2: any;
  achievementAdditionalTotalPointEvaluator05: any;
  achievementAdditionalTotalPointUser: any;
  achievementPersonalTotalPointEvaluator1: any;
  achievementPersonalTotalPointEvaluator2: any;
  achievementPersonalTotalPointEvaluator05: any;
  achievementPersonalTotalPointUser: any;
  proTotalPointEvaluator1: any;
  proTotalPointEvaluator2: any;
  proTotalPointEvaluator05: any;
  proTotalPointUser: any;
  basicTotalPointEvaluator1: any;
  basicTotalPointEvaluator2: any;
  basicTotalPointEvaluator05: any;
  basicTotalPointUser: any;
  behaviorTotalPointEvaluator1: any;
  behaviorTotalPointEvaluator2: any;
  behaviorTotalPointEvaluator05: any;
  behaviorTotalPointUser: any;
  basicProTotalPointEvaluator1: any;
  basicProTotalPointEvaluator2: any;
  basicProTotalPointEvaluator05: any;
  basicProTotalPointUser: any;
  commentUser: string;
  companyName: string;
  dateCreationGoalEnd: string;
  dateCreationGoalStart: string;
  departmentName: string;
  divisionName: string;
  evaluationAchievementAdditional: EvaluationAdditionalAchievement[];
  evaluationAchievementPersonals: EvaluationPersonalAchievement[];
  evaluationAchievementPersonalsOfUsers: EvaluationPersonalAchievementOfUser[];
  evaluationAchievementAdditionalOfUsers: EvaluationAdditionalAchievementNew[];
  evaluationBasicBehavior: BasicBehaviorSkillType[];
  listBehaviorNoSkill: BasicBehaviorSkillType[];
  evaluationPeriod: EvaluationPeriod;
  evaluator: EvaluatorInfo[];
  id: number;
  level: number;
  percentPoint: number;
  periodEnd: string;
  periodStart: string;
  status: statusEvaluationType;
  summaryCharPointEvaluator1: string;
  summaryCharPointEvaluator2: string;
  summaryCharPointEvaluator05: string;
  summaryCharPointUser: string;
  summaryPointEvaluator1: any;
  summaryPointEvaluator2: any;
  summaryPointEvaluator05: any;
  summaryPointUser: any;
  title: string;
  updatedTime: string;
  user: UserInfo;
  userId: number;
  dateEvaluationStart: string;
  dateEvaluationEnd: string;
  achievementPercent: number;
  behaviorPercent: number;
  evaluationPro: UserEvaluationToProSkillType[];
  summaryDepartment: {
    achievementAdditionalTotalPointEvaluator1: string | null;
    achievementAdditionalTotalPointEvaluator2: string | null;
    achievementAdditionalTotalPointEvaluator05: string | null;
    achievementAdditionalTotalPointUser: string | null;

    achievementPersonalTotalPointEvaluator1: string | null;
    achievementPersonalTotalPointEvaluator2: string | null;
    achievementPersonalTotalPointEvaluator05: string | null;
    achievementPersonalTotalPointUser: string | null;

    evaluationId: number;

    summaryCharPointEvaluator1: string | null;
    summaryCharPointEvaluator2: string | null;
    summaryCharPointEvaluator05: string | null;
    summaryCharPointUser: string | null;

    summaryPointEvaluator1: string | null;
    summaryPointEvaluator2: string | null;
    summaryPointEvaluator05: string | null;
    summaryPointUser: string | null;
  };
}
export interface EvaluationAdditionalAchievement {
  achievementStatus?: string;
  evaluationId?: number;
  itemNo: number;
  pointEvaluator1?: string;
  pointEvaluator2?: string;
  pointEvaluator05?: string;
  pointUser?: string;
  reasonComment: string;
  titleAdditional: string;
  key: number;
  evaluationOrder: number;
  type?: number;
}
export interface EvaluationPersonalAchievement {
  achievementStatus?: string;
  achievementValue?: string;
  actionPlan?: string;
  coefficientEvaluator1?: number;
  coefficientEvaluator2?: number;
  coefficientEvaluator05?: number;
  coefficientUser?: number;
  difficultyEvaluator1?: number;
  difficultyEvaluator2?: number;
  difficultyEvaluator05?: number;
  difficultyUser?: number;
  evaluationId?: number;
  id?: number;
  itemNo: number;
  method?: string;
  pointEvaluator1?: number | string;
  pointEvaluator2?: number | string;
  pointEvaluator05?: number | string;
  pointUser?: number | string;
  reasonComment?: string;
  title?: string;
  weight?: number | string;
  evaluationAchievementPersonalSub: SubList[];
  key: number;
  type?: number;
}
export interface EvaluationPeriod {
  dateCreationGoalDepartmentEnd: string;
  dateCreationGoalDepartmentStart: string;
  dateCreationGoalEnd: string;
  dateCreationGoalStart: string;
  dateEvaluationDepartmentEnd: string;
  dateEvaluationDepartmentStart: string;
  dateEvaluationEnd: string;
  dateEvaluationStart: string;
  id: number;
  periodEnd: string;
  periodIndex: number;
  periodStart: string;
  year: string;
}
export interface CommentContent {
  commentUser: string;
  privateCommentAdmin05?: string;
  publicCommentAdmin05?: string;
  publicCommentAdmin2?: string;
  privateCommentAdmin2?: string;
  publicCommentAdmin1?: string;
  privateCommentAdmin1?: string;
}
export interface EvaluationResponse {
  allowSeeList: EvaluatorInfo[];
  hasMode1: boolean;
  hasMode2: boolean;
  hasMode3: boolean;
  isDisable: boolean;
  maxOrder: string;
  results: {
    evaluationList: EvaluationInfo;
    subList: SubList[][];
    subListNews: SubList[][];
    versionSetting8: VersionSetting810;
    versionSetting7: VersionSetting7;
    dateCreationGoalEnd: string | null;
    dateCreationGoalStart: string | null;
    dateEvaluationEnd: string | null;
    dateEvaluationStart: string | null;
    settingProFormulas?: any;
    maxPointProSkill: any;
    maxPointBasicSkill: any;
    evaluationPeriod: {
      dateCreationGoalDepartmentEnd: string;
      dateCreationGoalDepartmentStart: string;
      dateCreationGoalEnd: string;
      dateCreationGoalStart: string;
      dateEvaluationDepartmentEnd: string;
      dateEvaluationDepartmentStart: string;
      dateEvaluationEnd: string;
      dateEvaluationStart: string;
      id: number;
      periodEnd: string;
      periodIndex: number;
      periodStart: string;
      year: string;
    };
    settingPointBasicBehaviorPros: {
      type: number;
      point: number;
    }[];
    settingAchievementPersonalType3: SettingAchievementPersonal[];
    settingAchievementPersonalType4: SettingAchievementPersonal[];
    settingAchievementAdditional2: SettingAchievementAdditional[];
  };
  evaluationBasicBehavior: UserEvaluationBasicBehaviorType[];
  userInfo: UserInfo;
  hasEvaluator2: boolean;
  listSumaryPercent: any[];
  evaluatorOrderList: number[];
  isEvaluatorException: boolean;
  flagSkill?: number;
}

export interface SubListNew {
  key: number;
  achievementPersonalId?: number;
  coefficient: number | string;
  evaluationDecision: string;
  parentKey: number;
  type?: number;
  evaluationId?: number;
  degree?: string;
}
export interface EvaluationPersonalAchievementOfUser {
  achievementStatus?: string;
  achievementValue?: string;
  actionPlan?: string;
  coefficientEvaluator1?: number;
  coefficientEvaluator2?: number;
  coefficientEvaluator05?: number;
  coefficientUser?: number;
  difficultyEvaluator1?: number;
  difficultyEvaluator2?: number;
  difficultyEvaluator05?: number;
  difficultyUser?: number;
  evaluationId?: number;
  id?: number;
  itemNo: number;
  method?: string;
  pointEvaluator2?: number | string;
  pointEvaluator1?: number | string;
  pointEvaluator05?: number | string;
  pointUser?: number | string;
  reasonComment?: string;
  title?: string;
  weight?: number | string | null | undefined;
  evaluationAchievementPersonalSub: SubListNew[];
  key: number;
  type?: number;
}

export interface EvaluationAdditionalAchievementNew {
  achievementStatus?: string;
  evaluationId?: number;
  itemNo: number;
  pointEvaluator1?: string;
  pointEvaluator2?: string;
  pointEvaluator05?: string;
  pointUser?: string;
  reasonComment: string;
  titleAdditional: string;
  key: number;
  evaluationOrder: number;
  type: number;
}
