import { Transaction } from 'sequelize';
import { Department } from 'src/entity/Department';
import { Evaluation } from 'src/entity/Evaluation';
import { Skill } from 'src/entity/Skill';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { AddProSkillDto } from 'src/model/request/F6/AddProSkillDto';
import { EditProskillDto } from 'src/model/request/F6/EditProskillDto';
import { Request } from 'express';

export interface AdminEvaluationRepositoryI {
  getAllEvaluation(condition: any): Promise<Evaluation[]>;
  getListEvaluationConfirm(body: any, companyGroupCode: string): Promise<any>;
  getuserInfo(userId: number): Promise<any>;
  goalConfirm(periodId: number, companyGroupCode: string): Promise<any>;
  listUserEvaluation(
    params: any,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<any>;
  exportCSV(params: any, companyGroupCode: string): Promise<any>;
  evaluationConfirm(body: any, companyGroupCode: string): Promise<any>;
  publicEvaluation(body: any, companyGroupCode: string): Promise<any>;
  getAchievementPersonal(versionId: number): Promise<any>;
  getAchievementDep(
    versionId: number,
    type: 1 | 2,
    typeEvaluation: TypeAchievement,
  ): Promise<any>;
  getAchievementAdditional(
    versionId: number,
    type: TypeAchievement,
  ): Promise<any>;
  getAchievementAdditionalDep(versionId: number): Promise<any>;
  getFormula(versionId: number): Promise<any>;
  getData810(versionId: number): Promise<any>;
  haveRecordEdit(req: Request): Promise<boolean>;
  haveRecordEditNS(req: Request): Promise<boolean>;
  listUserEvaluationPeriod(params: any, companyGroupCode: string): Promise<any>;
  getEvaluatinPeriod(type: string, timeZone: string): Promise<any>;
  evaluationFixed(yearStart: any, yearEnd: any): Promise<any>;
  countAllEvaluationFixed(query: any): Promise<any>;

  countEvaluationFixed(
    type: any,
    periodId: number,
    companyGroupCode: string,
  ): Promise<any>;
  totalEvaluation(
    id: number,
    type: string,
    companyGroupCode: string,
  ): Promise<any>;
  checkDatePeriod(id: number): Promise<any>;
  addHistoryFixEvaluation(
    periodId: number,
    jsonStr: string,
    type: number,
    checkFixed: number,
  ): Promise<any>;
  findHistoryFixEvaluation(periodId: number, type: number): Promise<any>;
  updateEvaluationPeriod(
    checkFixed: number,
    periodId: number,
    t: Transaction,
  ): Promise<any>;
  getAllSkillByCondition(userId: number): Promise<any>;
  getListUser(periodId: number, companyGroupCode: string): Promise<any>;
  transactionUndo(): Promise<any>;
  undoEvaluation(data: { [key: string]: string }, t: Transaction): Promise<any>;
  undoGoal(data: { [key: string]: string }, t: Transaction): Promise<any>;
  deleteHistoryEvaluationFixed(periodId: number, t: Transaction): Promise<any>;
  getAllDepartmentsWithSubClass(
    companyGroupCode: string,
  ): Promise<Department[]>;
  addProSkill(
    payload: AddProSkillDto,
    companyGroupCode: string,
  ): Promise<Skill>;
  editProSkill(
    skillId: number,
    payload: EditProskillDto,
    companyGroupCode: string,
  ): Promise<Skill>;
  exportHistoryEvaluation(
    division: string,
    department: string,
    userInfo: string,
    status: number,
    yearStart: string,
    yearEnd: string,
    companyGroupCode?: string,
  );

  getDataExcel(
    params: any,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<any>;
}
