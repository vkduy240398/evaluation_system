import { Evaluation } from 'src/entity/Evaluation';
export declare class ReportRepository {
    private evaluationEntity;
    private evaluationAchievementPersonal;
    getEvaluationByIdList(id: number[], userId: any, isEvaluatorUser: boolean): Promise<{
        evaluations: Evaluation[];
    }>;
    getDataPDF1_7(id: number[], userId: any, isEvaluatorUser: boolean, companyGroupCode: string): Promise<{
        evaluations: Evaluation[];
    }>;
    getEvaluationAchievement(id: number): Promise<{
        key: number;
        itemNo: number;
        title: string;
        achievementValue: string;
        method: string;
        weight: number;
        difficultyUser: number;
        difficultyEvaluator05: number;
        difficultyEvaluator1: number;
        difficultyEvaluator2: number;
        achievementStatus: string;
        reasonComment: string;
        actionPlan: string;
        pointUser: number;
        coefficientUser: number;
        pointEvaluator05: number;
        coefficientEvaluator05: number;
        pointEvaluator1: number;
        coefficientEvaluator1: number;
        pointEvaluator2: number;
        coefficientEvaluator2: number;
        childrens: {
            index: number;
            evaluationDecision: string;
            coefficient: string;
            key: string;
            degree: string;
        }[];
    }[]>;
    getEvaluationAchievementByType(id: number, type: any): Promise<any>;
}
