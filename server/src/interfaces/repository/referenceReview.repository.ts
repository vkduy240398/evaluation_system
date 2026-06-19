import { Request } from 'express';

export interface ReferenceReviewRepositoryI {
  getListReferenceEvaluation(params: any, req: Request): Promise<any>;
}
