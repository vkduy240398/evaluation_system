import { HttpStatus } from '@nestjs/common';
export declare class VersionDateValidation {
    code: HttpStatus;
    startGoal: string;
    endGoal: string;
    startEvaluation: string;
    endEvaluation: string;
    isGoalCreationTime?: boolean;
    isEvaluationTime?: boolean;
}
