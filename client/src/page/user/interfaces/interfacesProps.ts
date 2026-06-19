export interface goalsPastEvaluation {
  title: string;
  id: number;
  period: string;
  achievementValue: string;
  method: string;
  weight: number;
  difficulty: number;
  evaluationAchievementPersonalSub: {
    evaluationDecision: string;
    degree: string;
    achievementId: number;
    point: string;
  }[];
}
