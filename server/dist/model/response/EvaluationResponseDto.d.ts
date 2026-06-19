import { EvaluatorResponseDto } from './EvaluatorResponseDto';
export declare class EvaluationResponseDto {
    id: number;
    periodStart: string;
    periodEnd: string;
    departmentName: string;
    level: number;
    evaluators: EvaluatorResponseDto[];
}
