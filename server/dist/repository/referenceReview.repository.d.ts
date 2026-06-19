import { ReferenceReviewRepositoryI } from 'src/interfaces/repository/referenceReview.repository';
import { Request } from 'express';
export declare class ReferenceReview implements ReferenceReviewRepositoryI {
    private settingReviewRepository;
    private evaluationRepository;
    getListReferenceEvaluation(params: any, req: Request): Promise<any>;
}
