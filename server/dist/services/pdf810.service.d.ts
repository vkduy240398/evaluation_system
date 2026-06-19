/// <reference types="node" />
import jsPDF from 'jspdf';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { PdfService810I } from 'src/interfaces/service/pdf.service.interface';
export declare class Pdf810Service implements PdfService810I {
    private xDefault;
    private maxCommentLength;
    private initDocument;
    private getPageHeight;
    private getPageWidth;
    exportEvaluationReportPdf(evaluation: Evaluation, listEvalutor: Evaluator[], orientation: 'p' | 'l', size: string, subList: any): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    private getTemplateThreeReportFrame;
    private getSummaryPeriodTable;
    private getFileName;
    getChildEvaluation810ReportPdf(evaluation: Evaluation, listEvalutor: Evaluator[], role: string, userId: number, subList: any, doc: jsPDF): Promise<jsPDF>;
    exportParentReportPdf(evaluations: Evaluation[], role: string, userId: number, orientation: 'l' | 'p', size: 'a4' | 'a3', subList: any): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    exportListPDFReport(evaluations: any, role: string, userId: number, orientation: 'l' | 'p', size: 'a4' | 'a3', subList: any): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
}
