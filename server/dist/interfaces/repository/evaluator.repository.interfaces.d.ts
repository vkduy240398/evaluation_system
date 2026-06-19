import { Transaction } from 'sequelize';
import { EvaluatorSearchInterfaces, ReceiverOrderType, TypeApprovedStatus } from '../evaluator.interfaces';
import { Evaluation } from 'src/entity/Evaluation';
import { User } from 'src/entity/User';
import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
export interface EvaluatorRepositoryI {
    listUserEvaluator(params: EvaluatorSearchInterfaces): any;
    getNewTransaction(): any;
    updateApprovedStatus(evaluationId: number, comment: string, approverId: number, receiverId: number, receiverOrder: ReceiverOrderType, type: TypeApprovedStatus, status: string, transaction: Transaction): Promise<any>;
    getEvaluationById(id: number): Promise<Evaluation>;
    countListUserEvaluator(params: EvaluatorSearchInterfaces): Promise<number>;
    findEvaluatorByPeriod(listUserId: number[], params: EvaluatorSearchInterfaces): Promise<Evaluation[]>;
    getUserById(id: number): Promise<User>;
    getDivisionHighest(evaluationPeriodId: number, divisionName: string): Promise<Evaluation>;
    getGuideVersionPublic(): Promise<VersionGuideEvaluation>;
    exportHistoryEvaluationEvaluator(department: string[] | null, fullName: string, yearStart: string, yearEnd: string, userId: number, companyGroupCode: string, yearEvaluate: string, periodEvaluate: string): any;
    getDivDepToExportHistoryEvaluation(userId: number, companyGroupCode: string, params: {
        yearEvaluate: string;
        periodEvaluate: string;
    }): any;
    listUserProSkillExpertise(department: number[] | null, fullName: string, yearStart: string, yearEnd: string, userId: number, companyGroupCode: string, offset: number, limit: number, sortColumns: any, sortDirections: any, yearEvaluate: any, periodEvaluate: any): any;
    getListDepartmentExpertise(userId: number, companyGroupCode: string, param: any): any;
    getListEvaluationToExportPDF(year: number, periodIndex: number, userId: number, companyGroupCode: string): any;
}
