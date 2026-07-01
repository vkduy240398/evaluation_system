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

const APPROVED_STATUS = '承認';
@Injectable()
export class EvaluatorApprovalService implements ApprovalServiceI {
  @Inject(ApprovalRepository)
  private approvalRepository: ApprovalRepositoryI;

  /**
   * Get list approval history F2
   *
   * @author tran.le.ha.nam
   *
   * @param evaluationId Id of evaluation
   * @param currentAccessId Id of evaluator
   */
  async getListApprovalHistory(
    evaluationId: number,
    currentAccessId: number,
    order?: number,
  ) {
    const approvalHistories =
      await this.approvalRepository.getListApprovalHistoryByEvaluationId(
        evaluationId,
      );

    const evaluation = await this.approvalRepository.getEvaluationById(
      evaluationId,
    );

    // const userDetail = await this.approvalRepository.getUserDetail(
    //   evaluation.userId,
    // );

    const listEvaluators =
      await this.approvalRepository.getListEvaluatorByEvaluationId(
        evaluationId,
      );

    const approvalHistoryResults: ApprovalHistoryDto[] = [];

    const evlauators: EvaluatorDto[] = [];
    let currentAccessOrder = null;

    from(listEvaluators).subscribe((el) => {
      evlauators.push({
        id: el.user.id,
        fullName: el.user.fullName,
        evaluationOrder: Number(el.evaluationOrder),
      });

      if (el.user.id === currentAccessId) {
        currentAccessOrder = el.evaluationOrder;
      }
    });

    if (order) {
      currentAccessOrder = order;
    }

    from(approvalHistories)
      .pipe(
        map((el) => {
          if (
            el.status !== APPROVED_STATUS &&
            currentAccessOrder &&
            Number(el.receiverOrder) > Number(currentAccessOrder)
          ) {
            el.comment = '';
          }

          return el;
        }),
      )
      .subscribe((el) => {
        const tmp = new ApprovalHistoryDto();
        tmp.evaluationId = el.evaluationId;
        tmp.comment = el.comment;
        tmp.receiverOrder = el.receiverOrder ? Number(el.receiverOrder) : null;
        tmp.status = el.status;
        tmp.type = el.type;
        tmp.createdTime = el.createdTime;
        tmp.approverUser = el.approverUser;
        tmp.receiverUser = el.receiverUser;
        approvalHistoryResults.push(tmp);
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

    const results = new ApprovalHistoryResponseDto();
    results.approvalHistories = approvalHistoryResults;
    results.evaluators = evlauators;
    results.evaluation = evaluationDto;
    results.userDetail = userDto;

    return results;
  }
}
