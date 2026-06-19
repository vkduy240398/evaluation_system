import { Evaluation } from 'src/entity/Evaluation';
import { PdfServiceI } from 'src/interfaces/service/pdf.service.interface';
import { ReportResponseDto } from 'src/model/response/ReportResponseDto';
export declare class Pdf17Service implements PdfServiceI {
    private initDocument;
    private getPageHeight;
    private getPageWidth;
    exportEvaluationReportPdf(evaluation: Evaluation, type: number): Promise<ReportResponseDto>;
    private getTemplateOneReportFrame;
    private getTemplateTwoReportFrame;
    private getTemplateThreeReportFrame;
    private getSummaryPeriodTable;
    private getFileName;
    private getChildEvaluationReportPdf;
    exportParentReportPdf(evaluations: Evaluation[]): Promise<ReportResponseDto>;
}
