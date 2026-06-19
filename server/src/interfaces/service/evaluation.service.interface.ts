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
}
export interface Total {
  achievementAdditionalTotalPointEvaluator1: string;
  achievementAdditionalTotalPointEvaluator2: string;
  achievementAdditionalTotalPointEvaluator05: string;
  achievementAdditionalTotalPointUser: string;
  achievementPersonalTotalPointEvaluator1: string;
  achievementPersonalTotalPointEvaluator2: string;
  achievementPersonalTotalPointEvaluator05: string;
  achievementPersonalTotalPointUser: string;
  summaryPointEvaluator1: string;
  summaryPointEvaluator2: string;
  summaryPointEvaluator05: string;
  summaryPointUser: string;
  summaryCharPointUser: string;

  behaviorTotalPointEvaluator2: string;
  behaviorTotalPointEvaluator1: string;
  behaviorTotalPointEvaluator05: string;
  behaviorTotalPointUser: string;

  summaryAchievementPersonalTotalPointEvaluator2: string;
  summaryAchievementPersonalTotalPointEvaluator1: string;
  summaryAchievementPersonalTotalPointEvaluator05: string;
  summaryAchievementPersonalTotalPointUser: string;

  summaryAchievementAdditionalTotalPointUser: string;
  summaryAchievementAdditionalTotalPointEvaluator05: string;
  summaryAchievementAdditionalTotalPointEvaluator1: string;
  summaryAchievementAdditionalTotalPointEvaluator2: string;

  summaryPointUsers: string;
  summaryPointEvaluator05s: string;
  summaryPointEvaluator1s: string;
  summaryPointEvaluator2s: string;
  basicProTotalPointUser: number | null;
  basicProTotalPointEvaluator1?: number | null;
  basicProTotalPointEvaluator2?: number | null;
  basicProTotalPointEvaluator05?: number | null;
  basicTotalPointEvaluator1: number | null;
  basicTotalPointEvaluator2: number | null;
  basicTotalPointEvaluator05: number | null;
  basicTotalPointUser: number | null;
  proTotalPointUser: number | null;
  proTotalPointEvaluator05: number | null;
  proTotalPointEvaluator1: number | null;
  proTotalPointEvaluator2: number | null;
}
export interface AdditionData {
  achievementStatus: string;
  evaluationId: number;
  itemNo: number;
  key: number;
  pointEvaluator1: string;
  pointEvaluator2: string;
  pointEvaluator05: string;
  pointUser: string;
  reasonComment: string;
  titleAdditional: string;
}

export interface PersonalAchievementSub {
  achievementPersonalId: number;
  coefficient: string;
  evaluationDecision: string;
  parentKey: number;
}
export interface RequestDataSave {
  achievementStatus: string;
  achievementValue: string;
  actionPlan: string;
  coefficientEvaluator1: string;
  coefficientEvaluator2: string;
  coefficientEvaluator05: string;
  coefficientUser: string;
  difficultyEvaluator1: string;
  difficultyEvaluator2: string;
  difficultyEvaluator05: string;
  difficultyUser: string;
  evaluationAchievementPersonalSub: PersonalAchievementSub;
  evaluationId: number;
  id: number;
  itemNo: number;
  key: number;
  method: string;
  pointEvaluator1: number;
  pointEvaluator2: number;
  pointEvaluator05: number;
  pointUser: number;
  reasonComment: string;
  title: string;
  weight: number;
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
