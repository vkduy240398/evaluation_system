export declare class EvaluationDescriptionDto {
    contentEvaluationCriteria: string;
    contentNotes: string;
}
export declare class EvaluationDescriptionQuery {
    userLevel: number;
}
export declare class EvaluationDescriptionByIdDto {
    title: string;
    level: number;
    versionGuideEvaluation: EvaluationDescriptionDto[];
}
