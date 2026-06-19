import { AdminEvaluationServiceI } from 'src/interfaces/service/adminEvaluation.service.interface';
import { AddProSkillDto } from 'src/model/request/F6/AddProSkillDto';
import { EditProskillDto } from 'src/model/request/F6/EditProskillDto';
export declare class AdminEvaluationService implements AdminEvaluationServiceI {
    private userRepo;
    private adminEvaluationRepo;
    private mailService;
    goalConfirm(body: any, companyGroupCode: string): Promise<number>;
    listUserEvaluation(params: any, companyGroupCode: string, timeZone: string): Promise<any>;
    listUserEvaluationPeriod(params: any, companyGroupCode: string): Promise<{
        data: any;
        period: any;
    }>;
    exportCSV(params: any, companyGroupCode: string): Promise<import("exceljs").Buffer>;
    evaluationConfirm(body: any, companyGroupCode: string): Promise<any>;
    publicEvaluation(body: any, host: string, companyGroupCode: string): Promise<any>;
    evaluationFixed(query: any, companyGroupCode: string): Promise<any>;
    undoFixEvaluation(body: any): Promise<number>;
    getAllDepartmentsWithSubClass(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    addProSkill(payload: AddProSkillDto, companyGroupCode: string): Promise<import("../entity/Skill").Skill>;
    editProSkill(skillId: number, payload: EditProskillDto, companyGroupCode: string): Promise<import("../entity/Skill").Skill>;
    exportHistoryEvaluation(params: any, companyGroupCode?: string): Promise<any>;
    findStringStatus: (dataList: any) => string;
    getDataExcel(params: any, companyGroupCode: string, timeZone: string): Promise<any>;
}
