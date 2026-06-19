import { Transaction } from 'sequelize';
import { Department } from 'src/entity/Department';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationAchievementAdditional } from 'src/entity/EvaluationAchievementAdditional';
import { EvaluationAchievementPersonal } from 'src/entity/EvaluationAchievementPersonal';
import { HistoryApproveEvaluation } from 'src/entity/HistoryApproveEvaluation';
import { HistoryMail } from 'src/entity/HistoryMail';
import { VersionSetting } from 'src/entity/VersionSetting';
import { UserEvaluationBasicBehaviorType } from '../user.interfaces';

export interface EvaluationRepositoryI {
  getNewTransaction();
  updateHistoryMailTransaction();
  updateEvaluationWithoutTransaction(datas: any, condition: any);
  getversionSettingForPDF(): Promise<VersionSetting>;
  getUpdateTime(evaluationId: number): Promise<Evaluation>;
  getEvaluationById(
    id: Number,
    flagSkill: number,
    companyGroupCode: string,
  ): Promise<any>;
  updateEvaluationAchievementPersonal(
    dataSource: any,
    transaction: Transaction,
  ): Promise<EvaluationAchievementPersonal[]>;
  deleteEvaluationAchievementPersonal(
    evaluationId: number,
    transaction: Transaction,
  ): Promise<any>;
  deleteAdditionAchievement(
    evaluationId: number,
    transaction: Transaction,
  ): Promise<any>;
  deleteEvaluationPro(
    evaluationId: number,
    transaction: Transaction,
  ): Promise<any>;
  deleteBasicBehavior(evaluationId: number): Promise<any>;
  deleteProSkill(evaluationId: number): Promise<any>;
  updateEvaluationAdditionAchievement(
    values: any,
    transaction: Transaction,
  ): Promise<EvaluationAchievementAdditional[]>;
  updateEvaluationPro(values: any, transaction: Transaction): Promise<any[]>;
  updateEvaluation(
    values: any,
    id: any,
    transaction: Transaction,
  ): Promise<Number[]>;
  getEvaluationUserById(id: number): Promise<Evaluation>;
  getEvaluationUserByListId(ids: number[]): Promise<Evaluation[]>;
  getGuideEvaluationByEvaluationId(id: any): Promise<Evaluation>;
  updateEvaluatorComment(
    content: any,
    evaluationId: number,
    evaluationOrder: string,
    transaction: Transaction,
  ): Promise<Number[]>;
  createHistoryApproveReject(
    content: any,
    transaction: Transaction,
  ): Promise<HistoryApproveEvaluation>;
  getDepartmentName(id: number): Promise<Department>;

  updateHistoryMail(
    data: any,
    companyGroupCode: string,
    transaction?: Transaction,
  ): Promise<HistoryMail>;
  updateHistoryMailNotFixed(
    data: any,
    transaction: Transaction,
  ): Promise<HistoryMail>;
  updateGoalCreationTime(
    id: number,
    emailType: number,
    type: string,
    date: any,
    dateDepartment: any,
    transaction: Transaction,
    timeZone: string,
  ): Promise<[affectedCount: number]>;
  checkUserActiveBYPeriod(periodId: number, userId: number): Promise<any>;
  getInfoEvaluationMail(ids: number[], status: number[]): Promise<any>;
  getSubListByAchievementPersonalId(
    list: EvaluationAchievementPersonal[],
  ): Promise<any>;
  getAllEvalNotFixedGoalPeriodByPeriod(
    year: string,
    period_index: number,
    day: number,
    companyGroupCode: string,
  ): Promise<any>;
  getAllEvalNotFixedEvalPeriodByPeriod(
    year: string,
    period_index: number,
    day: number,
    companyGroupCode: string,
  ): Promise<any>;

  updateEvaluationBasicBehaviorSkill(
    evaluationId: number,
    transaction: Transaction,
    listBehaviors: any[],
  );
  getAllDepartmentEvaluation(
    query: any,
    companyGroupCode: string,
  ): Promise<any>;
  getAllDepartmentEvaluationDefault(
    query: any,
    companyGroupCode: string,
  ): Promise<any>;
  getListBasicBehavior(level: number): Promise<any>;
  listEvaluator(evaluationId: number): Promise<any>;

  getProfessionalExpertiseDetail(
    userId: number,
    yearStart: string,
    yearEnd: string,
    companyGroupCode: string,
    evaluationPeriodId: number,
  ): Promise<any>;
}
