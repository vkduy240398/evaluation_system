import { statusEvaluationType } from '../../../common/status';

export type UserEvaluationType = {
  id: number | string;
  fiscalYear: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  employeeNumber: string;
  fullName: string;
  department: string;
  division: string;
  evaluationLevel: string | number;
  evaluators: string[];
  status: statusEvaluationType;
  statusName: string;
  guideVersionId: number;

  departmentCode: string;
  departmentName: string;
  divisionCode: string;
  divisionName: string;

  // ** Order Evaluator
  evaluatorOrder: number;
  evaluatorOrderList: number[];

  // ** Comment
  commentUser: string;

  // ** table point && setting level
  pointSettingLevel: PointAndSettingLevelType;

  // ** Total point - user
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

  // ** Point 2.0
  basicTotalPointEvaluator2: number;
  proTotalPointEvaluator2: number;
  behaviorTotalPointEvaluator2: number;
  achievementAdditionalTotalPointEvaluator2: number;
  achievementPersonalTotalPointEvaluator2: number;

  // ** EvaluationPro
  proSkillList: UserEvaluationToProSkillType[];
  keyPassProSkill: React.Key[];

  // ** Evaluation Achievements
  userEvaluationAchievements: UserEvaluationAchievementType[];

  // ** Evaluation Period
  dateCreationGoalStart: string | null;
  dateCreationGoalEnd: string | null;
  dateEvaluationStart: string | null;
  dateEvaluationEnd: string | null;
  evaluationPeriod: UserEvaluationPeriodType;

  // ** Evaluation Basic Skill
  evaluationBasicSkills: UserEvaluationBasicBehaviorType[];

  // ** Evaluation Behavior Skill
  evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[];

  // ** Evaluation Achievement Additional
  achievementAdditionals: AchievementAdditionalType[];

  settingProFormulas: SettingProFormulaType;

  // ** Comment Public/Private
  comment: CommentPublicPrivate;

  // ** Evaluator exception
  isEvaluatorException: boolean;

  isNotEvaluator2: boolean;

  // ** Update Time
  updateTime: Date;

  // ** Basic - Behavior - Pro Point Options
  basicSkillPointOptions: OptionType[];
  behaviorSkillPointOptions: OptionType[];
  proSkillPointOptions: OptionType[];

  basicProTotalPointUser: number;
  basicProTotalPointEvaluator05: number;
  basicProTotalPointEvaluator1: number;
  basicProTotalPointEvaluator2: number;

  // ** Max point basic pro skill
  maxPointBasicSkill: number;
  maxPointProSkill: number;

  // ** Total
  summaryPointUser: number;
  summaryPointEvaluator05: number;
  summaryPointEvaluator1: number;
  summaryPointEvaluator2: number;

  level: number;

  historyApproveEvaluation?: any;

  versionSetting: any;
  flagSkill: number;
  achievementAdditionalSetting?: any;
  achievementPersonalSetting?: any;
  rejectComment: {
    evaluationId: number;
    comment: string;
    receiverOrder: string;
    status: string;
    type: number;
  };
};

type OptionType = { value: number; label: any };

export type CommentPublicPrivate = {
  comment05Public: string;
  comment05Private: string;
  comment1Public: string;
  comment1Private: string;
  comment2Public: string;
  comment2Private: string;
};

export type AchievementAdditionalType = {
  key: string | number;
  itemNo: number;
  titleAdditional: string;
  achievementStatus: string;
  reasonComment: string | null;
  pointUser: string | number;
  pointEvaluator05: string | number | null;
  pointEvaluator1: string | number | null;
  pointEvaluator2: string | number | null;
  evaluationOrder: number;
  type?: number;
};

export type UserEvaluationBasicBehaviorType = {
  itemNo: any;
  key: string;
  title: string;
  content: string;
  difficulty: number;
  pointUser: number;
  pointEvaluator05: number;
  pointEvaluator1: number;
  pointEvaluator2: number;
  type?: number;
};

export type PointAndSettingLevelType = {
  key: number;
  skillPercent: number;
  behaviorPercent: number;
  achievementPercent: number;

  // **
  skillTotalPoint: number;
  behaviorTotalPoint: number;
  achievementPersonalTotalPoint: number;
  percentPoint: number;
};

export type UserEvaluationToProSkillType = {
  key: string;
  itemTitle?: string;
  jobType: string;
  content: string;
  itemNo?: number | string;
  difficulty: number;
  pointUser: string | number | null;
  pointEvaluator05: string | number | null;
  pointEvaluator1: string | number | null;
  pointEvaluator2: string | number | null;
  itemId: string | null;
  note: string | null;

  totalPointUser?: number;
  totalPointEvaluator05?: number;
  totalPointEvaluator1?: number;
  totalPointEvaluator2?: number;
  [x: string]: any;
  isDisable: boolean;

  isEvaluateDate: boolean;
};

export type ProSkillPublicType = {
  key: string;
  smallClass: string;
  mediumClass: string;
  content: string;
  itemId: string;
  difficulty: number;
  note: string;
  jobType: string;
};

export type BasicBehaviorSkillType = {
  itemNo: any;
  key: string;
  title: string;
  content: string;
  difficulty: number;
  pointUser: number;
  pointEvaluator05: number;
  pointEvaluator1: number;
  pointEvaluator2: number;
};

export type UserEvaluationAchievementType = {
  key: string | number;
  itemNo: number;
  title: string | null;
  achievementValue: string | null;
  method: string | null;
  weight: number | null;
  difficultyUser: number | null;
  difficultyEvaluator05: number | null;
  difficultyEvaluator1: number | null;
  difficultyEvaluator2: number | null;
  achievementStatus: string | null;
  reasonComment: string | null;
  actionPlan: string | null;
  pointUser: number | null;
  coefficientUser: number | null;
  pointEvaluator05: number | null;
  coefficientEvaluator05: number | null;
  pointEvaluator1: number | null;
  coefficientEvaluator1: number | null;
  pointEvaluator2: number | null;
  coefficientEvaluator2: number | null;
  childrens?: any[];
  evaluationAchievementPersonalSub?: any[];
};

export type UserEvaluationPeriodType = {
  dateCreationGoalStart: string;
  dateCreationGoalEnd: string;
  dateEvaluationStart: string;
  dateEvaluationEnd: string;
  id: number;
};

export type SettingProFormulaType = {
  coefficient: number;
  totalItem: number;
  settingProFormula: {
    point: number; // ** this is difficulty point
  };
};

export type PointListBehaviors = {
  label: string;
  value: number;
};
