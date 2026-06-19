export declare class ExcelService {
    private adminEvaluationService;
    createJob(query: any, req: any): Promise<string>;
    getFilePath(jobId: string): string;
    isJobReady(jobId: string): boolean;
    percentJob(jobId: string): number;
    messsageJob(jobId: string): string;
}
