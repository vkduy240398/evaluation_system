export interface DetailCriteriaEvaluation {
  id: number;
  versionId: number;
  createdTime: string;
  creationUser: number;
  publicDate: string;
  reason: string;
  status: number;
  subVersion: number;
  level: string;
  type: number
  updatedTime: string;
  statusName: string;
  updatedBy: string;
  version: number;
  timer: Date;
  contentEvaluationCriteria: string;
  contentNotes: string;
  lastUpdatedTime: string;
}
export interface DataValuesCriteriaEvaluation {
  data: DetailCriteriaEvaluation;
  subVersion: number;
  isShowEdit: any;
}
