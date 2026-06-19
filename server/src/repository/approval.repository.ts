import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { HistoryApproveEvaluation } from 'src/entity/HistoryApproveEvaluation';
import { User } from 'src/entity/User';
import { ApprovalRepositoryI } from 'src/interfaces/repository/approval.repository.interface';

@Injectable()
export class ApprovalRepository implements ApprovalRepositoryI {
  @Inject(EntityConstant.HISTORY_APPROVE_EVALUATION)
  private historyApproveEvaluationEntity: typeof HistoryApproveEvaluation;

  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  @Inject(EntityConstant.EVALUATOR)
  private evaluatorEntity: typeof Evaluator;

  @Inject(EntityConstant.EVALUATION)
  private evaluationEntity: typeof Evaluation;

  async getListApprovalHistoryByEvaluationId(evaluationId: number) {
    return await this.historyApproveEvaluationEntity.findAll({
      where: { evaluationId: evaluationId },
      attributes: [
        'evaluationId',
        'comment',
        'receiverOrder',
        'status',
        'type',
        'createdTime',
      ],
      order: [
        ['id', 'DESC'],
        ['createdTime', 'DESC'],
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'fullName'],
          as: 'approverUser',
          required: false,
        },
        {
          model: User,
          attributes: ['id', 'fullName'],
          as: 'receiverUser',
          required: false,
        },
      ],
    });
  }

  async getListEvaluatorByEvaluationId(evaluationId: number) {
    return await this.evaluatorEntity.findAll({
      where: { evaluationId: evaluationId },
      attributes: ['evaluationId', 'evaluatorId', 'evaluationOrder'],
      include: [
        {
          model: User,
          attributes: ['id', 'fullName'],
          as: 'user',
        },
      ],
      limit: 3,
      order: [['evaluationOrder', 'ASC']],
    });
  }

  async getEvaluationById(evaluationId: number) {
    return await this.evaluationEntity.findOne({
      where: { id: evaluationId },
      attributes: [
        'id',
        'periodStart',
        'periodEnd',
        'departmentName',
        'divisionName',
        'status',
        'level',
        'title',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'employeeNumber', 'fullName'],
          include: [
            {
              model: Department,
              attributes: ['id', 'code', 'name'],
              as: 'department',
            },
          ],
        },
      ],
    });
  }
  async getEvaluationByListId(evaluationId: number[]) {
    return await this.evaluationEntity.findAll({
      where: { id: { [Op.in]: evaluationId } },
      attributes: ['id', 'status'],
    });
  }
  async getApprovalHistory(conditions: any) {
    return await this.historyApproveEvaluationEntity.findAll({
      where: conditions,
      attributes: [
        'evaluationId',
        'comment',
        'receiverOrder',
        'status',
        'type',
        'createdTime',
      ],
      order: [['id', 'DESC']],
    });
  }

  // async getUserDetail(userId: number) {
  //   return await this.userEntity.findOne({
  //     where: { id: userId },
  //     attributes: ['id', 'employeeNumber', 'fullName'],
  //     include: [
  //       {
  //         model: Department,
  //         attributes: ['id', 'code', 'name'],
  //         as: 'department',
  //       },
  //     ],
  //   });
  // }
}
