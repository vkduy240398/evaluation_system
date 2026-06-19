import { Inject, Injectable } from '@nestjs/common';
import { ReferenceReviewRepositoryI } from 'src/interfaces/repository/referenceReview.repository';
import { ReferenceReview } from 'src/repository/referenceReview.repository';
import { Request } from 'express';

@Injectable()
export class ReferenceReviewService {
  @Inject(ReferenceReview)
  private referenceReviewRepository: ReferenceReviewRepositoryI;

  async listReferenceReview(params: any, req: Request) {
    return await this.referenceReviewRepository.getListReferenceEvaluation(
      params,
      req,
    );
  }
}
