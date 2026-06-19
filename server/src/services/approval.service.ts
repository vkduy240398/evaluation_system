import { Inject, Injectable } from '@nestjs/common';
import { from, map } from 'rxjs';
import { ApprovalRepositoryI } from 'src/interfaces/repository/approval.repository.interface';
import { ApprovalServiceI } from 'src/interfaces/service/approval.service.interface';
import {
  ApprovalHistoryDto,
  ApprovalHistoryResponseDto,
  EvaluatorDto,
} from 'src/model/response/ApprovalHistoryResponseDto';
import { EvaluationDto } from 'src/model/response/EvaluationDto';
import { UserDto } from 'src/model/generic/UserDto';
import { ApprovalRepository } from 'src/repository/approval.repository';

@Injectable()
export class ApprovalService implements ApprovalServiceI {
  @Inject(ApprovalRepository)
  private approvalRepository: ApprovalRepositoryI;

  /**
   * Get list approval history F1
   *
   * @author tran.le.ha.nam
   *
   * @param evaluationId Id of evaluation
   * @param currentAccessId Id of user being evaluated
   */
  async getListApprovalHistory(evaluationId: number, currentAccessId: number) {
    const evaluation = await this.approvalRepository.getEvaluationById(
      evaluationId,
    );

    const results = new ApprovalHistoryResponseDto();

    if (currentAccessId !== evaluation.user.id) {
      const SECONDARY_FORBIDEN_CODE = 1403;
      results.statusCode = SECONDARY_FORBIDEN_CODE;
      results.message = 'Not allowed to this screen';

      return results;
    }

    const approvalHistories =
      await this.approvalRepository.getListApprovalHistoryByEvaluationId(
        evaluationId,
      );

    const evaluators =
      await this.approvalRepository.getListEvaluatorByEvaluationId(
        evaluationId,
      );

    const approvalHistoryResults: ApprovalHistoryDto[] = [];

    from(approvalHistories)
      .pipe(
        map((history) => {
          const APPROVED_STATUS = '承認';
          const ORDER_ZERO = 0;
          if (
            history.status !== APPROVED_STATUS &&
            Number(history.receiverOrder) !== ORDER_ZERO
          ) {
            const EMPTY = '';
            history.comment = EMPTY;
          }

          return history;
        }),
      )
      .subscribe((history) => {
        const tmp = new ApprovalHistoryDto();
        tmp.evaluationId = history.evaluationId;
        tmp.comment = history.comment;
        tmp.receiverOrder = history.receiverOrder
          ? Number(history.receiverOrder)
          : null;
        tmp.status = history.status;
        tmp.type = history.type;
        tmp.createdTime = history.createdTime;
        tmp.approverUser = history.approverUser;
        tmp.receiverUser = history.receiverUser;
        approvalHistoryResults.push(tmp);
      });

    const evlauatorResults: EvaluatorDto[] = [];

    from(evaluators).subscribe((evaluator) => {
      evlauatorResults.push({
        id: evaluator.user.id,
        fullName: evaluator.user.fullName,
        evaluationOrder: Number(evaluator.evaluationOrder),
      });
    });

    const evaluationDto = new EvaluationDto();
    evaluationDto.id = evaluation.id;
    evaluationDto.level = evaluation.level;
    evaluationDto.status = evaluation.status;
    evaluationDto.periodStart = evaluation.periodStart;
    evaluationDto.periodEnd = evaluation.periodEnd;
    evaluationDto.departmentName =
      evaluation.level >= 8
        ? evaluation.divisionName
        : evaluation.departmentName;
    evaluationDto.userId = evaluation.user.id;
    evaluationDto.title = evaluation.title;

    const userDto = new UserDto();
    userDto.id = evaluation.user.id;
    userDto.employeeNumber = evaluation.user.employeeNumber;
    userDto.fullName = evaluation.user.fullName;
    userDto.department = evaluation.user.department;

    const SECONDARY_SUCCESS_CODE = 1200;
    results.statusCode = SECONDARY_SUCCESS_CODE;
    results.approvalHistories = approvalHistoryResults;
    results.evaluators = evlauatorResults;
    results.evaluation = evaluationDto;
    results.userDetail = userDto;

    return results;
  }
}
