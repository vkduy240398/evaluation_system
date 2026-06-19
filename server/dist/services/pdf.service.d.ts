/// <reference types="node" />
import { jsPDF } from 'jspdf';
import { ColumnInput, RowInput, ShowHeadType, Styles } from 'jspdf-autotable';
import { EvaluationDetail17Type, HeaderPdfType } from 'src/interfaces/service/pdfService.interface';
export declare class PdfService {
    constructor();
    private pageWidth;
    private fontName;
    private pageHeight;
    private xDefault;
    private pdfConfig;
    headerPdf(doc: jsPDF, titleHeader: string, userInfo: HeaderPdfType): void;
    shortHeaderPdf(doc: jsPDF, titleHeader: string, userInfo: HeaderPdfType): void;
    loadTable(doc: jsPDF, startY: number, columns: ColumnInput[], body: RowInput[], columnStyles?: any, showHead?: ShowHeadType, styles?: Partial<Styles>, fillColor?: string): void;
    templatePdfReport(doc: jsPDF, evaluation: EvaluationDetail17Type): jsPDF;
    exportEvaluationForPdf(evaluation: EvaluationDetail17Type, orientation?: 'l' | 'p', format?: 'a4' | 'a3'): {
        buffer: Buffer;
        fileName: string;
    };
    private getSummaryPeriodTable;
    exportListEvaluationPdf(evaluations: EvaluationDetail17Type[], orientation?: 'l' | 'p', format?: 'a4' | 'a3'): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
}
