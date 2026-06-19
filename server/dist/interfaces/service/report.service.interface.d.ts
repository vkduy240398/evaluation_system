import { ReportResponseDto } from 'src/model/response/ReportResponseDto';
export interface ReportServiceI {
    exportEvaluationReportPdf(evaluationId: number): Promise<ReportResponseDto>;
    exportMultiEvaluationReportPdf(evaluationIds: string[]): Promise<ReportResponseDto>;
    exportEvaluation810ReportPdf(evaluationId: number, role: string, userId: number): Promise<any>;
    exportMultiEvaluation810ReportPdf(evaluationIds: any[], role: string, userId: number): Promise<any>;
}
