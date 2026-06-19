import { Evaluator } from 'src/entity/Evaluator';
import { EvaluatorSearchInterfaces, StatusRejectType, TypeApprovedStatus } from 'src/interfaces/evaluator.interfaces';
import { ExportHistoryEvaluationEvaluatorDto } from 'src/model/request/EvaluatorRequestDto';
export declare class EvaluatorServices {
    private evaluatorRepo;
    private userRepo;
    private mailService;
    private reportService;
    searchListUserEvaluator2(params: EvaluatorSearchInterfaces): Promise<{
        data: any[];
        counts: any;
    }>;
    findSendApproveNextPerson(evaluators: Evaluator[], evaluationOrder: number[]): 5 | 7 | 49;
    sendApproveStatus(evaluationId: number, comment: string, approverId: number, type: TypeApprovedStatus, updateTime: string, host: string, companyGroupCode: string, timeZone: string): Promise<{
        statusNumber: number;
        updateTime: string;
    }>;
    findSendRejectNextPerson(evaluators: Evaluator[], dataInput: {
        evaluationOrder: number;
        statusReject: string;
    }[], dataReturn: {
        statusReject: string;
        receiverId: number;
        evaluationOrder: number;
    }): {
        statusReject: string;
        receiverId: number;
        evaluationOrder: number;
    };
    sendRejectStatus(evaluationId: number, comment: string, approverId: number, type: TypeApprovedStatus, statusReject: StatusRejectType, updateTime: string, host: string, companyGroupCode: string, timeZone: string): Promise<{
        statusNumber: number;
        updateTime: string;
        comment: string;
    }>;
    exportHistoryEvaluationEvaluator(params: ExportHistoryEvaluationEvaluatorDto, userId: number, companyGroupCode: string): Promise<any>;
    getListDepartmentToExportHistoryEvaluation(userId: number, companyGroupCode: string, params: any): Promise<any>;
    listUserProSkillExpertise(params: any, userId: number, companyGroupCode: string): Promise<any>;
    getListDepartmentExpertise(userId: number, companyGroupCode: string, params: {
        yearEvaluate: string;
        periodEvaluate: string;
    }): Promise<any>;
    exportPDFProSkillExpertise(body: any, companyGroupCode: string, timeZone: string): Promise<{
        dataPdf: any;
        dataLenght: number;
    }>;
}
