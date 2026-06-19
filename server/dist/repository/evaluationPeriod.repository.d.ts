import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { SkillUser } from 'src/entity/SkillUser';
import { User } from 'src/entity/User';
import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
import { EvaluationByPeriodType } from 'src/interfaces/service/evaluationPeriod.interface';
export declare class EvaluationPeriodRepository {
    private evaluationPeriodEntity;
    private evaluationEntity;
    private evaluatorDefaultEntity;
    private userEntity;
    private skillGroupEntity;
    private evaluationAchievementPersonalEntity;
    private evaluationAchievementPersonalSubEntity;
    private evaluationBasicBehaviorEntity;
    private historyApproveEvaluation;
    private evaluationPro;
    private versionBasicBehavior;
    private skillUser;
    private summaryDepartment;
    private settingReviewEnity;
    private settingDefaultPeriodEnity;
    getEvaluationPeriod(timeZone: string): Promise<object[]>;
    getProgressingPeriod(companyGroupCode: string, timeZone: string): Promise<object[]>;
    getAll(condition: any): Promise<EvaluationPeriod[]>;
    getPeriodByCondition(condition: any): Promise<EvaluationPeriod>;
    listPeriodByYear(yearStart: number, yearEnd: number, companyGroupCode: string): Promise<EvaluationPeriod[]>;
    getEvaluationDatesByPeriodIds(periodIds: number[], companyGroupCode: string): Promise<any[]>;
    getPeriodListByCondition(condition: any): Promise<EvaluationPeriod[]>;
    savePeriod(condition: any, updateValues: any): Promise<[affectedCount: number, affectedRows: EvaluationPeriod[]]>;
    getEvaluationByPeriod(userId: number, evaluationPeriodId: number, companyGroupCode: string): Promise<Evaluation[]>;
    getSkillUserOfEvaluation(evaluationId: number): Promise<SkillUser[]>;
    updateEvaluationPeriodException(evaluations: EvaluationByPeriodType[], userId: number, creationUser: number, deleteIds: number[], year: number, periodIndex: number, levelSettings: {
        level: number;
        skillPercent: number | null;
        behaviorPercent: number | null;
        achievementPercent: number | null;
        type: number;
    }[], guideEvaluation: VersionGuideEvaluation[], companyGroupCode: string): Promise<{
        updateGoalPersonal810ByEvaluationIds: number[];
        updateGoalPersonal17ByEvaluationIds: number[];
        updateBehaviorByEvaluationIds: number[];
        resetEvaluationIds: number[];
        resetPersonalAchievement: number[];
        evaluationArrays: EvaluationByPeriodType[];
        evaluator05ErrorIds: number[];
        evaluator10ErrorIds: number[];
        evaluatorErrorNames: string[];
    }>;
    deleteEvaluation(deleteIds: number[], isEmpty: boolean, year: number, periodIndex: number, userId: number, companyGroupCode: string): Promise<void>;
    resetEvaluationData(ids: number[], resetPersonalAchievement: number[]): Promise<void>;
    updateBehaviorByEvaluationIds(ids: number[], companyGroupCode: string): Promise<void>;
    updateGoalPersonalByEvaluationIds(idsUpdateGoal17: number[], idsUpdateGoal810: number[]): Promise<void>;
    findOnePeriod(where: {
        [x: string]: any;
    }): Promise<EvaluationPeriod>;
    getPeriodListSendMailDepartment(condition: {
        [x: string]: any;
    }): Promise<EvaluationPeriod>;
    getUserPeriodException(year: number, periodIndex: number, listUserId: number[]): Promise<{
        dataList: User[];
    }>;
    getAllByCondition(where: {
        [x: string]: any;
    }): Promise<EvaluationPeriod[]>;
    getAllPeriodNotFixedGoalPeriod(day: number, companyGroupCode: string): Promise<any>;
    getAllPeriodNotFixedEvalPeriod(day: number, companyGroupCode: string): Promise<any>;
    getPeriodDetail(year: any, periodIndex: any, companyGroupCode: string): Promise<EvaluationPeriod>;
    goalsPastEvaluationRepo(type: number, year: number, periodIndex: number, userId: number, evaluationPeriodId: number): Promise<object[]>;
}
