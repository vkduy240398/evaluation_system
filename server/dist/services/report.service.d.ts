/// <reference types="node" />
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { EvaluationDetail17Type } from 'src/interfaces/service/pdfService.interface';
export declare class ReportService {
    private evaluationRepository;
    private reportRepo;
    private pdfService;
    private pdfReviewService;
    private userRepo;
    exportEvaluationReportPdf(evaluationId: number): Promise<any>;
    exportMultiEvaluationReportPdf(evaluationIds: string[]): Promise<import("../model/response/ReportResponseDto").ReportResponseDto>;
    exportEvaluation810ReportPdf(evaluationId: number, orientation: 'l' | 'p', size: string): Promise<any>;
    exportReportPdfReview810(evaluationId: number[], userId: number, isF5: boolean | undefined, isEvaluatorUser: boolean, isMultiple: boolean, companyGroupCode: string, timeZone: string): Promise<{
        dataReview: any[];
        fileName: string;
    }>;
    exportMultiEvaluation810ReportPdf(evaluationIds: number[], role: string, userId: number, orientation?: 'l' | 'p', size?: 'a4' | 'a3'): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    private getPdfService;
    exportReportPdfReview17(evaluationId: number[], userId: number, isF5: boolean | undefined, isEvaluatorUser: boolean, isMultiple: boolean, companyGroupCode: string, timeZone: string): Promise<{
        dataReview: any[];
        fileName: string;
    }>;
    handleSearchFormula(settingProFormulas: SettingProFormulaSub[], difficulty: number, maxLength: number): number;
    handleDataEvaluations17Review(evaluations: any[], userId: number, isEvaluatorUser: boolean, timeZone: string): Promise<EvaluationDetail17Type[]>;
    handleDataEvaluations810Review(evaluations: any[], userId: number, isEvaluatorUser: boolean, timeZone: string): Promise<any[]>;
    exportPDFMultiLevel(userId: number, idList17: number[], idList810: number[], role: string, isF5: boolean | undefined, companyGroupCode: string, timeZone: string): Promise<any>;
}
