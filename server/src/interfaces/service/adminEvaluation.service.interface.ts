import { Department } from 'src/entity/Department';
import { Skill } from 'src/entity/Skill';
import { AddProSkillDto } from 'src/model/request/F6/AddProSkillDto';
import { EditProskillDto } from 'src/model/request/F6/EditProskillDto';

export interface AdminEvaluationServiceI {
  goalConfirm(body: any, companyGroupCode: string): Promise<any>;
  listUserEvaluation(
    params: any,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<any>;

  evaluationConfirm(body: any, companyGroupCode: string): Promise<any>;
  publicEvaluation(
    body: any,
    host: string,
    companyGroupCode: string,
  ): Promise<any>;
  exportCSV(params: any, companyGroupCode: string): Promise<any>;
  listUserEvaluationPeriod(params: any, companyGroupCode: string): Promise<any>;
  evaluationFixed(query: any, companyGroupCode: string): Promise<any>;
  undoFixEvaluation(body: any): Promise<any>;
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
  exportHistoryEvaluation(params: any, companyGroupCode?: string): Promise<any>;
  getDataExcel(
    params: any,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<any>;
}
