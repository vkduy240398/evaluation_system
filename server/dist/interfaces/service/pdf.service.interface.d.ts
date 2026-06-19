/// <reference types="node" />
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { ReportResponseDto } from 'src/model/response/ReportResponseDto';
export interface PdfServiceI {
    exportEvaluationReportPdf(evaluation: Evaluation, type: number): Promise<ReportResponseDto>;
    exportParentReportPdf(evaluations: Evaluation[]): Promise<ReportResponseDto>;
}
export interface PdfService810I {
    exportEvaluationReportPdf(evaluation: Evaluation, listEvalutor: Evaluator[], orientation: 'p' | 'l', size: string, subList: any): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    exportParentReportPdf(evaluations: Evaluation[], role: string, userId: number, orientation: 'l' | 'p', size: 'a4' | 'a3', subList: any): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
}
