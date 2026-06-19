import { EvaluatorResponseDto } from './EvaluatorResponseDto';

export class EvaluationResponseDto {
  id: number;
  periodStart: string;
  periodEnd: string;
  departmentName: string;
  level: number;
  evaluators: EvaluatorResponseDto[];
}
