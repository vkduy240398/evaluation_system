import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { EvaluatorSearchInterfaces, ReceiverOrderType, TypeApprovedStatus } from 'src/interfaces/evaluator.interfaces';
import { EvaluatorRepositoryI } from 'src/interfaces/repository/evaluator.repository.interfaces';
import { Transaction } from 'sequelize';
import { User } from 'src/entity/User';
import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
export declare class EvaluatorRepository implements EvaluatorRepositoryI {
    private historyApproveEvaluationEntity;
    private evaluationEntity;
    private userRepository;
    private userEntity;
    private evaluatorEnity;
    private evaluationPeriodEntity;
    private evaluatorDefaultEnity;
    getStringOrderByLevelStatus: (orderLevel: boolean, orderLevelType: 'ASC' | 'DESC', orderStatus: boolean, orderStatusType: 'ASC' | 'DESC') => string;
    private escapeSortDirection;
    private versionGuideEvaluationEntity;
    listUserEvaluator(params: EvaluatorSearchInterfaces): Promise<Evaluation[]>;
    getNewTransaction(): Promise<Transaction>;
    getEvaluationById(id: number): Promise<any>;
    updateApprovedStatus(evaluationId: number, comment: string, approverId: number, receiverId: number, receiverOrder: ReceiverOrderType, type: TypeApprovedStatus, status: string, transaction: Transaction): Promise<any>;
    countListUserEvaluator(params: EvaluatorSearchInterfaces): Promise<number>;
    findEvaluatorByPeriod(userId: number[], params: EvaluatorSearchInterfaces): Promise<Evaluation[]>;
    getUserById(id: number): Promise<User>;
    getDivisionHighest(evaluationPeriodId: number, divisionName: string): Promise<Evaluation>;
    getGuideVersionPublic(): Promise<VersionGuideEvaluation>;
    createEvaluator(arrays: any[], transaction: any): Promise<Evaluator[]>;
    exportHistoryEvaluationEvaluator(department: string[] | null, fullName: string, yearStart: string, yearEnd: string, userId: number, companyGroupCode: string, yearEvaluate: string, periodEvaluate: string): Promise<[unknown[], unknown]>;
    getDivDepToExportHistoryEvaluation(userId: number, companyGroupCode: string, params: {
        yearEvaluate: string;
        periodEvaluate: string;
    }): Promise<[unknown[], unknown]>;
    listUserProSkillExpertise(department: number[] | null, fullName: string, yearStart: string, yearEnd: string, userId: number, companyGroupCode: string, offset: number, limit: number, sortColumns: any, sortDirections: any, yearEvaluate: any, periodEvaluate: any): Promise<{
        counts: number;
        data: any[];
    }>;
    getListDepartmentExpertise(userId: number, companyGroupCode: string, param: any): Promise<[unknown[], unknown]>;
    getListEvaluationToExportPDF(year: number, periodIndex: number, userId: number, companyGroupCode: string): Promise<unknown[]>;
    getLastestPeriodIdByEvaluator(evaluatorId: number, companyGroupCode: string): Promise<object[]>;
}
