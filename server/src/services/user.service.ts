/* eslint-disable complexity */
import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { compareDatePeriod, encrypt, isFormatDate } from 'src/common/util';
import { statusEvaluation } from 'src/constant/statusEvaluation';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import {
  AchievementAdditionalType,
  AchievementType,
  BasicBehaviorType,
  EvaluationQuery,
  UpdateEvaluationType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationDetailType,
  UserType,
} from 'src/interfaces/user.interfaces';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { PointRepository } from 'src/repository/point.repository';
import { UserRepository } from 'src/repository/user.repository';
import { MailService } from './mail.service';
import { Evaluation17Service } from './evaluation17.service';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { Workbook } from 'exceljs';
import { EmailType, EmailTypeFixed, TemplateMailId } from 'src/enum/TemplateMailId';
import { ApprovalRepository } from 'src/repository/approval.repository';
import { EvaluatorRepositoryI } from 'src/interfaces/repository/evaluator.repository.interfaces';
import { EvaluatorRepository } from 'src/repository/evaluator.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { EvaluationRepositoryI } from 'src/interfaces/repository/evaluation.repository.interface';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { EvaluationPeriodDepartmentSettingRepository } from 'src/repository/evaluationPeriodDepartmentSetting.repository';
@Injectable()
export class UserService {
  @Inject(UserRepository)
  private userRepo: UserRepositoryI;

  @Inject(PointRepository)
  private pointRepo: PointRepository;

  @Inject(MailService)
  private mailService: MailService;

  @Inject(Evaluation17Service)
  private evaluation17Service: Evaluation17Service;

  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;

  @Inject(VersionSettingRepository)
  private versionSettingRepository: VersionSettingRepository;

  @Inject(ApprovalRepository)
  private approvalRepository: ApprovalRepository;

  @Inject(EvaluatorRepository)
  private evaluatorRepo: EvaluatorRepositoryI;

  @Inject(ProSkillRepository)
  private proSkillRepository: ProSkillRepository;

  @Inject(EvaluationRepository)
  private evaluationRepo: EvaluationRepositoryI;

  @Inject(EvaluationPeriodDepartmentSettingRepository)
  private periodDeptSettingRepo: EvaluationPeriodDepartmentSettingRepository;

  async listEvaluation(
    query: EvaluationQuery,
    userId: number,
    companyGroupCode: string,
  ) {
    const periodEvaluationsIncludeNoActives =
      await this.userRepo.getEvaluationPeriod(query, userId, companyGroupCode);
    const periodEvaluations = periodEvaluationsIncludeNoActives.filter(
      (e) => e.evaluatorDefault,
    );
    console.log(periodEvaluationsIncludeNoActives);

    const arrays = [];
    const periods = ['', '上期', '下期'];
    const arrayPeriodIndexs = [];
    for (let index = 0; index < periodEvaluations.length; index++) {
      arrayPeriodIndexs.push(
        periodEvaluations[index].evaluatorDefault
          ? periodEvaluations[index].evaluatorDefault.evaluationPeriodId
          : 0,
      );
      let stringSummary = '';
      // get name evaluator
      const evaluator05s = [''];
      const evaluator1s = [''];
      const evaluator2s = [''];
      const currentCheck = new Date();
      // ==== department evaluation - level salary 8 - 10
      if (periodEvaluations[index].evaluations.length === 1) {
        const status = [''];
        periodEvaluations[index].evaluations[0].evaluator.forEach((v) => {
          if (parseFloat(v.evaluationOrder) === 2.0) {
            evaluator2s[0] = v.user?.fullName;
          }
          if (parseFloat(v.evaluationOrder) === 1.0) {
            evaluator1s[0] = v.user?.fullName;
          }
          if (parseFloat(v.evaluationOrder) === 0.5) {
            evaluator05s[0] = v.user?.fullName;
          }
        });
        if (periodEvaluations[index].evaluations[0].creationUser === null) {
          if (
            // if salary rank 1 - 7
            [1, 2, 3, 4, 5, 6, 7].includes(
              periodEvaluations[index].evaluations[0].level,
            )
          ) {
            if (
              isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                isFormatDate(
                  periodEvaluations[index].dateEvaluationStart,
                  'YYYY/MM/DD',
                ) &&
              isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                isFormatDate(
                  periodEvaluations[index].dateEvaluationEnd,
                  'YYYY/MM/DD',
                )
            ) {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[1];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            } else {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[0];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            }
          } else {
            // salary rank 8 - 10
            if (
              isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                isFormatDate(
                  periodEvaluations[index].dateEvaluationDepartmentStart,
                  'YYYY/MM/DD',
                ) &&
              isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                isFormatDate(
                  periodEvaluations[index].dateEvaluationDepartmentEnd,
                  'YYYY/MM/DD',
                )
            ) {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[1];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            } else {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[0];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            }
          }
        } else {
          if (
            // if salary rank 1 - 7
            [1, 2, 3, 4, 5, 6, 7].includes(
              periodEvaluations[index].evaluations[0].level,
            )
          ) {
            if (
              isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                isFormatDate(
                  periodEvaluations[index].evaluations[0].dateEvaluationStart ||
                    periodEvaluations[index].dateEvaluationStart,
                  'YYYY/MM/DD',
                ) &&
              isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                isFormatDate(
                  periodEvaluations[index].evaluations[0].dateEvaluationEnd ||
                    periodEvaluations[index].dateEvaluationEnd,
                  'YYYY/MM/DD',
                )
            ) {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[1];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            } else {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[0];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            }
          } else {
            // salary rank 8 - 10
            if (
              isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                isFormatDate(
                  periodEvaluations[index].evaluations[0].dateEvaluationStart ||
                    periodEvaluations[index].dateEvaluationDepartmentStart,
                  'YYYY/MM/DD',
                ) &&
              isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                isFormatDate(
                  periodEvaluations[index].evaluations[0].dateEvaluationEnd ||
                    periodEvaluations[index].dateEvaluationDepartmentEnd,
                  'YYYY/MM/DD',
                )
            ) {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[1];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            } else {
              if (periodEvaluations[index].evaluations[0].status === 50) {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ].split('/')[0];
              } else {
                status[0] =
                  statusEvaluation[
                    periodEvaluations[index].evaluations[0].status
                  ];
              }
            }
          }
        }
        // Main arrays
        arrays.push({
          id: periodEvaluations[index].id,
          year: `${periodEvaluations[index].year}年${
            periods[periodEvaluations[index].periodIndex]
          }`,
          periodStart: periodEvaluations[index].periodStart,
          periodEnd: periodEvaluations[index].periodEnd,
          summaryPointEvaluator2:
            // periodEvaluations[index].evaluations[0].summaryPointEvaluator2 &&
            periodEvaluations[index].evaluations[0].status === 100 &&
            periodEvaluations[index].evaluations[0].level > 7 &&
            periodEvaluations[index].evaluations[0].summaryDepartment
              ? parseFloat(
                  Number(
                    periodEvaluations[index].evaluations[0].summaryDepartment
                      ?.summaryPointEvaluator2,
                  ).toFixed(1),
                )
              : periodEvaluations[index].evaluations[0].status === 100 &&
                periodEvaluations[index].evaluations[0].level < 8 &&
                periodEvaluations[index].evaluations[0].summaryPointEvaluator2
              ? Math.round(
                  Number(
                    periodEvaluations[index].evaluations[0]
                      .summaryPointEvaluator2,
                  ),
                )
              : null,
          totalPoint:
            periodEvaluations[index].evaluations[0].status === 100
              ? periodEvaluations[index].evaluations[0].level > 7
                ? Math.round(
                    Number(
                      periodEvaluations[index].evaluations[0].summaryDepartment
                        ?.summaryPointEvaluator2,
                    ) * 10,
                  ) / 10
                : Math.round(
                    periodEvaluations[index].evaluations[0]
                      .summaryPointEvaluator2,
                  )
              : null,
          stringSummary: stringSummary,
          status: status[0],
          evaluationId: periodEvaluations[index].evaluations[0].id,
          evaluator05: evaluator05s[0],
          evaluator1: evaluator1s[0],
          evaluator2: evaluator2s[0],
          level: periodEvaluations[index].evaluations[0].level,
          userInfo: periodEvaluations[index].evaluations[0].user,
          statusNo: periodEvaluations[index].evaluations[0].status,
          dateEvaluationStart: periodEvaluations[index].dateEvaluationStart,
          dateEvaluationEnd: periodEvaluations[index].dateEvaluationEnd,
          isActive: arrayPeriodIndexs.includes(periodEvaluations[index].id),
        });
        evaluator05s[0] = '';
        evaluator1s[0] = '';
        evaluator2s[0] = '';
      } else {
        // get name evaluator
        const evaluator05s = [''];
        const evaluator1s = [''];
        const evaluator2s = [''];
        // calculators total point
        let summaryPointsParents: number | null = null;
        const childrens = []; // Create array children
        // get status
        const status = [''];
        const minStatus = [];
        const levelsArrs = [];
        const levels810s = [8, 9, 10];
        const levels17s = [1, 2, 3, 4, 5, 6, 7];
        const levels = [[], []];
        let parentStringStatus: string = statusEvaluation[100];
        let parentStatus = 100;
        periodEvaluations[index].evaluations.forEach((v) => {
          if (levels17s.includes(v.level)) {
            levels[0].push(v.level);
          } else {
            levels[1].push(v.level);
          }
          if (v.status === 100) {
            if (
              v.summaryPointEvaluator2 ||
              v.summaryDepartment?.summaryPointEvaluator2
            )
              summaryPointsParents +=
                (v.level <= 7
                  ? v.summaryPointEvaluator2
                  : v.summaryDepartment?.summaryPointEvaluator2) *
                (Math.round(v.percentPoint === null ? 100 : v.percentPoint) /
                  100);
          }

          // get status

          if (v.creationUser !== null) {
            if (
              // if salary rank 1 - 7
              [1, 2, 3, 4, 5, 6, 7].includes(v.level)
            ) {
              if (
                isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                  isFormatDate(
                    v.dateEvaluationStart ||
                      periodEvaluations[index].dateEvaluationStart,
                    'YYYY/MM/DD',
                  ) &&
                isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                  isFormatDate(
                    v.dateEvaluationEnd ||
                      periodEvaluations[index].dateEvaluationEnd,
                    'YYYY/MM/DD',
                  )
              ) {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[1];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              } else {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[0];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              }
            } else {
              if (
                isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                  isFormatDate(
                    v.dateEvaluationStart ||
                      periodEvaluations[index].dateEvaluationDepartmentStart,
                    'YYYY/MM/DD',
                  ) &&
                isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                  isFormatDate(
                    v.dateEvaluationEnd ||
                      periodEvaluations[index].dateEvaluationDepartmentEnd,
                    'YYYY/MM/DD',
                  )
              ) {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[1];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              } else {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[0];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              }
            }
          } else {
            if (
              // if salary rank 1 - 7
              [1, 2, 3, 4, 5, 6, 7].includes(v.level)
            ) {
              if (
                isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                  isFormatDate(
                    periodEvaluations[index].dateEvaluationStart,
                    'YYYY/MM/DD',
                  ) &&
                isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                  isFormatDate(
                    periodEvaluations[index].dateEvaluationEnd,
                    'YYYY/MM/DD',
                  )
              ) {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[1];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              } else {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[0];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              }
            } else {
              if (
                isFormatDate(currentCheck, 'YYYY/MM/DD') >=
                  isFormatDate(
                    periodEvaluations[index].dateEvaluationDepartmentStart,
                    'YYYY/MM/DD',
                  ) &&
                isFormatDate(currentCheck, 'YYYY/MM/DD') <=
                  isFormatDate(
                    periodEvaluations[index].dateEvaluationDepartmentEnd,
                    'YYYY/MM/DD',
                  )
              ) {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[1];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              } else {
                if (v.status === 50) {
                  status[0] = statusEvaluation[v.status].split('/')[0];
                } else {
                  status[0] = statusEvaluation[v.status];
                }
              }
            }
          }

          minStatus.push(v.status);
          levelsArrs.push(v.level);
          v.evaluator.forEach((v) => {
            if (parseFloat(v.evaluationOrder) === 2.0) {
              evaluator2s[0] = v.user?.fullName;
            }
            if (parseFloat(v.evaluationOrder) === 1.0) {
              evaluator1s[0] = v.user?.fullName;
            }
            if (parseFloat(v.evaluationOrder) === 0.5) {
              evaluator05s[0] = v.user?.fullName;
            }
          });

          childrens.push({
            evaluationId: v.id,
            year: `${v.periodStart} ～ ${v.periodEnd}`,
            periodStart: v.periodStart,
            periodEnd: v.periodEnd,
            summaryPoint:
              v.level <= 7
                ? v.summaryPointEvaluator2
                : v.summaryDepartment?.summaryPointEvaluator2,
            stringSummary: stringSummary,
            totalPoint:
              v.status === 100
                ? levels17s.includes(v.level)
                  ? v.summaryPointEvaluator2
                    ? Math.round(v.summaryPointEvaluator2)
                    : null
                  : v.summaryDepartment?.summaryPointEvaluator2
                  ? Math.round(
                      Number(v.summaryDepartment?.summaryPointEvaluator2) * 10,
                    ) / 10
                  : null
                : null,
            status: status[0],
            evaluator05: evaluator05s[0],
            evaluator1: evaluator1s[0],
            evaluator2: evaluator2s[0],
            level: v.level,
            userInfo: v.user,
            statusNo: v.status,
            isActive: arrayPeriodIndexs.includes(periodEvaluations[index].id),
            financialYear: `${periodEvaluations[index].year}年${
              periods[periodEvaluations[index].periodIndex]
            }`,
          });
          if (parentStatus >= v.status) {
            if (v.status === 50 && parentStatus === 50) {
              if (status[0] !== parentStringStatus)
                parentStringStatus = statusEvaluation[50].split('/')[0];
            } else parentStringStatus = status[0];
            parentStatus = v.status;
          }
          status[0] = '';
          evaluator05s[0] = '';
          evaluator1s[0] = '';
          evaluator2s[0] = '';
        });
        const Index810s = levels810s.findIndex((v) => levels[1].includes(v));
        const Index17s = levels17s.findIndex((v) => levels[0].includes(v));

        if (Index810s !== -1 && Index17s >= 0) {
          summaryPointsParents = 0;
          stringSummary = '-';
        } else {
          if (Index17s >= 0) {
            summaryPointsParents = Math.round(summaryPointsParents);
          }
          if (Index810s >= 0 && summaryPointsParents !== 0) {
            summaryPointsParents =
              Math.round(Number(summaryPointsParents) * 10) / 10;
          }
        }

        arrays.push({
          id: periodEvaluations[index].id,
          year: `${periodEvaluations[index].year}年${
            periods[periodEvaluations[index].periodIndex]
          }`,
          totalPoint:
            childrens.filter((v) => v.summaryPoint !== null).length > 0 &&
            parentStringStatus === '【評価】公開済み'
              ? summaryPointsParents
              : null,
          stringSummary:
            summaryPointsParents === 0 &&
            childrens.filter((v) => v.summaryPoint !== null).length > 0 &&
            parentStringStatus === '【評価】公開済み'
              ? stringSummary
              : '',
          status: parentStringStatus,
          statusNo: minStatus[0],
          dateEvaluationStart: periodEvaluations[index].dateEvaluationStart,
          dateEvaluationEnd: periodEvaluations[index].dateEvaluationEnd,
          isActive: arrayPeriodIndexs.includes(periodEvaluations[index].id),
          childrens: childrens.sort((a, b) => {
            const dateA = new Date(a.periodStart);
            const dateB = new Date(b.periodStart);

            if (dateA < dateB) {
              return 1;
            }
            if (dateA > dateB) {
              return -1;
            }

            return 0;
          }),
          userInfo: periodEvaluations[index].evaluations[0].user,
        });
      }
    }

    const length = await this.userRepo.getLengthEvaluationPeriod(
      query,
      userId,
      companyGroupCode,
    );
    return {
      data: arrays,
      counts: length,
    };
    // return arrays;
  }

  async evaluationSkillCheck(evaluationId: number) {
    const data = await this.userRepo.evaluationSkillCheck(evaluationId);
    if (!data) throw new RuntimeException('id not found', HttpStatus.AMBIGUOUS);

    return data;
  }

  async getEvaluationData(
    evaluationId: number,
    user: UserType,
    isEvaluatorUser: string,
    companyGroupCode: string | null,
    timeZone: string,
  ): Promise<any | null> {
    const isUser = isEvaluatorUser === 'true';

    const dataFlagSkill = await this.userRepo.evaluationSkillCheck(
      evaluationId,
    );
    if (!dataFlagSkill)
      throw new RuntimeException('id not found', HttpStatus.AMBIGUOUS);

    const flagSkill = dataFlagSkill.flagSkill;

    if (flagSkill !== 1) {
      return await this.getEvaluationV2(
        evaluationId,
        user,
        isEvaluatorUser,
        companyGroupCode,
        timeZone,
      );
    }
    const { evaluationDetail, evaluationAchievementPersonals } =
      await this.userRepo.getEvaluationById2(
        evaluationId,
        user.id,
        isUser,
        companyGroupCode,
      );

    const evaluatorOrder = evaluationDetail?.evaluatorOrder;
    // let isEvaluatorException = false;
    const evaluatorOrderList = [];
    // if (!isUser) {
    //   const evaluators = evaluationDetail.evaluator;
    //   const findEvaluator = evaluators.find((f) => f.evaluatorId === user.id);
    //   if (!findEvaluator) isEvaluatorException = true;
    //   evaluatorOrder = findEvaluator?.evaluationOrder;
    // }

    const comment: {
      comment05Public: string;
      comment05Private: string;
      comment1Public: string;
      comment1Private: string;
      comment2Public: string;
      comment2Private: string;
    } = {
      comment05Public: '',
      comment05Private: '',
      comment1Public: '',
      comment1Private: '',
      comment2Public: '',
      comment2Private: '',
    };

    if (evaluationDetail) {
      const evaluators = [];

      // const evaluatorDefault = await this.userRepo.getEvaluatorDefault(
      //   evaluationDetail.user.id,
      //   evaluationDetail.evaluationPeriodId,
      // );

      // if (evaluationDetail.user.active !== 1 || !evaluatorDefault) {
      //   isEvaluatorException = true;
      // }

      if (evaluationDetail.evaluator && evaluationDetail.evaluator.length > 0) {
        const arrays = evaluationDetail.evaluator;
        for (const item of arrays) {
          if (Number(item.evaluationOrder) === 0.5) {
            comment.comment05Public = item.commentPublic;
            comment.comment05Private = item.commentPrivate;
            evaluators.push(`仮評価: ${item.user.fullName}`);
          } else if (Number(item.evaluationOrder) === 1) {
            comment.comment1Public = item.commentPublic;
            comment.comment1Private = item.commentPrivate;
            evaluators.push(`一次評価: ${item.user.fullName}`);
          } else if (Number(item.evaluationOrder) === 2) {
            comment.comment2Public = item.commentPublic;
            comment.comment2Private = item.commentPrivate;
            evaluators.push(`二次評価: ${item.user.fullName}`);
          }
          evaluatorOrderList.push(Number(item.evaluationOrder));
        }
      }
      // ** Check time to evaluation
      const isEvaluationDate = compareDatePeriod(
        evaluationDetail.dateEvaluationStart ||
          evaluationDetail.evaluationPeriod?.dateEvaluationStart,
        evaluationDetail.dateEvaluationEnd ||
          evaluationDetail.evaluationPeriod?.dateEvaluationEnd,
        timeZone,
      );

      const isEvaluation: boolean =
        [
          51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
        ].includes(evaluationDetail.status) ||
        (evaluationDetail.status === 50 && isEvaluationDate);
      // ** End

      // ** Pro skill
      const userEvaluationToProSkills = {
        proSkillList: evaluationDetail.evaluationPro,
        keyPassProSkill: [],
      };
      let totalPointProSkillUser = 0;
      if (evaluationDetail.evaluationPro) {
        evaluationDetail.evaluationPro.map((v) => {
          totalPointProSkillUser = totalPointProSkillUser + v.pointUser || 0;
          userEvaluationToProSkills.keyPassProSkill.push(v.itemId);
        });
      }
      // ** Achievement
      const userEvaluationAchievements = evaluationAchievementPersonals;

      const evaluationBasicSkills: UserEvaluationBasicBehaviorType[] =
        evaluationDetail.evaluationBasic;
      const evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[] =
        evaluationDetail.evaluationBehavior;
      let pointUserBasicSkill = 0;
      let pointUserBehavior = 0;

      // ** Set array object basic/behavior skill

      // ** Get/set array object basic skill

      evaluationBasicSkills.map((v, i) => {
        pointUserBasicSkill = pointUserBasicSkill + v.pointUser || 0;
      }),
        // ** Get/set array object behavior skill
        evaluationBehaviorSkills.map((v, i) => {
          pointUserBehavior = pointUserBehavior + v.pointUser || 0;
        });

      // ** Achievement Additional
      const achievementAdditionals: AchievementAdditionalType[] = [];
      if (evaluationDetail.evaluationAchievementAdditional.length > 0) {
        achievementAdditionals.push(
          ...evaluationDetail.evaluationAchievementAdditional.map((v, i) => ({
            key: `achievement-additional-key-${i}`,
            itemNo: v.itemNo,
            titleAdditional: v.titleAdditional,
            achievementStatus: v.achievementStatus,
            reasonComment: v.reasonComment,
            pointUser: v.pointUser,
            pointEvaluator05: v.pointEvaluator05,
            pointEvaluator1: v.pointEvaluator1,
            pointEvaluator2: v.pointEvaluator2,
            evaluationOrder: v.evaluationOrder,
          })),
        );
      }
      // ** Period time to evaluation
      // delete last row summary column -> set format giong 8~10 set props summary thay vi dung row summary khong co data
      if (isEvaluation && evaluatorOrderList.includes(2)) {
        // ** Add last row total Pro skill
        userEvaluationToProSkills.proSkillList.push({
          itemId: null,
          itemTitle: '小計',
          itemNo: -1,
          content: null,
          difficulty: null,
          pointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
          pointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
          pointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
          pointUser: evaluationDetail.proTotalPointUser,
          totalPointProSkillUser,
          key: `evaluation-pro-skill-totalPointProSkillUser`,
        });
        // ** Add last row total Basic skill
        evaluationBasicSkills.push({
          title: '小計',
          content: null,
          difficulty: null,
          key: `basic-1-key-pointUserBasicSkill`,
          itemNo: -1,
          pointUser: evaluationDetail.basicTotalPointUser,
          pointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
          pointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
          pointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
        });
        // ** Add last row total Behavior skill
        evaluationBehaviorSkills.push({
          title: '小計',
          content: null,
          difficulty: null,
          key: `basic-1-key-pointUserBehavior`,
          itemNo: -1,
          pointUser: evaluationDetail.behaviorTotalPointUser,
          pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
          pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
          pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
        });
        // ** Add last row achievement
        userEvaluationAchievements.push({
          key: 0,
          itemNo: null,
          title: null,
          achievementValue: null,
          method: null,
          weight: null,
          difficultyUser: null,
          difficultyEvaluator05: null,
          difficultyEvaluator1: null,
          difficultyEvaluator2: null,
          achievementStatus: '小計',
          reasonComment: null,
          actionPlan: null,
          pointUser: evaluationDetail.achievementPersonalTotalPointUser,
          pointEvaluator05:
            evaluationDetail.achievementPersonalTotalPointEvaluator05,
          pointEvaluator1:
            evaluationDetail.achievementPersonalTotalPointEvaluator1,
          pointEvaluator2:
            evaluationDetail.achievementPersonalTotalPointEvaluator2,
          coefficientUser: null,
          coefficientEvaluator05: null,
          coefficientEvaluator1: null,
          coefficientEvaluator2: null,
          childrens: [],
        });
      }

      // eslint-disable-next-line @typescript-eslint/naming-convention

      // eslint-disable-next-line @typescript-eslint/naming-convention
      let achievementAdditionalSetting = [];
      if (evaluationDetail.status >= 50)
        achievementAdditionalSetting =
          await this.userRepo.getAchievementAddPublicByType(
            '1',
            1,
            user.companyGroupCode,
          );

      const data: UserEvaluationDetailType = {
        // id: evaluationDetail.id,
        fiscalYear: evaluationDetail.title,
        periodStart: evaluationDetail.periodStart,
        periodEnd: evaluationDetail.periodEnd,
        flagSkill: evaluationDetail.flagSkill,
        evaluationLevel: evaluationDetail.level || user.level,
        evaluators,
        statusName: statusEvaluation[evaluationDetail.status],
        status: evaluationDetail.status,
        department:
          evaluationDetail.departmentName ||
          `${user.departmentCode}: ${user.departmentName}`,
        employeeNumber: evaluationDetail.user.employeeNumber,
        fullName: evaluationDetail.user.fullName || user.fullName,
        guideVersionId: evaluationDetail.guideVersionId,

        // ** Order
        evaluatorOrder,
        evaluatorOrderList,

        // ** Comment
        commentUser: evaluationDetail.commentUser,

        // ** Total - user
        basicTotalPointUser: evaluationDetail.basicTotalPointUser,
        proTotalPointUser: evaluationDetail.proTotalPointUser,
        behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser,
        achievementPersonalTotalPointUser:
          evaluationDetail.achievementPersonalTotalPointUser,
        achievementAdditionalTotalPointUser:
          evaluationDetail.achievementAdditionalTotalPointUser,

        // ** Total - evaluator 0.5
        basicTotalPointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
        proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
        behaviorTotalPointEvaluator05:
          evaluationDetail.behaviorTotalPointEvaluator05,
        achievementAdditionalTotalPointEvaluator05:
          evaluationDetail.achievementAdditionalTotalPointEvaluator05,
        achievementPersonalTotalPointEvaluator05:
          evaluationDetail.achievementPersonalTotalPointEvaluator05,

        // ** Total - evaluator 1.0
        basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
        proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
        behaviorTotalPointEvaluator1:
          evaluationDetail.behaviorTotalPointEvaluator1,
        achievementAdditionalTotalPointEvaluator1:
          evaluationDetail.achievementAdditionalTotalPointEvaluator1,
        achievementPersonalTotalPointEvaluator1:
          evaluationDetail.achievementPersonalTotalPointEvaluator1,

        // ** Total - evaluator 2.0
        basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
        proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
        behaviorTotalPointEvaluator2:
          evaluationDetail.behaviorTotalPointEvaluator2,
        achievementAdditionalTotalPointEvaluator2:
          evaluationDetail.achievementAdditionalTotalPointEvaluator2,
        achievementPersonalTotalPointEvaluator2:
          evaluationDetail.achievementPersonalTotalPointEvaluator2,

        // ** point && setting table level
        pointSettingLevel: {
          key: 'point-setting-level-key-1',
          skillPercent: evaluationDetail.skillPercent,
          behaviorPercent: evaluationDetail.behaviorPercent,
          achievementPercent: evaluationDetail.achievementPercent,
          percentPoint: evaluationDetail.percentPoint,
        },

        // ** Evaluation ProSkill
        ...userEvaluationToProSkills,

        // ** Evaluation Achievements
        userEvaluationAchievements,

        // ** Evaluation Period
        dateCreationGoalStart: evaluationDetail.dateCreationGoalStart,
        dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd,
        dateEvaluationStart: evaluationDetail.dateEvaluationStart,
        dateEvaluationEnd: evaluationDetail.dateEvaluationEnd,
        evaluationPeriod: evaluationDetail.evaluationPeriod,

        // ** Evaluation Basic Skill
        evaluationBasicSkills,

        // ** Evaluation Behavior Skill
        evaluationBehaviorSkills,

        // ** Evaluation Achievement Additional
        achievementAdditionals,

        // ** Comment Public/Private
        comment,

        // ** Evaluator exception
        // isEvaluatorException,

        // ** Update Time
        updateTime: evaluationDetail.updatedTime.toISOString(),

        basicProTotalPointUser: evaluationDetail.basicProTotalPointUser,
        basicProTotalPointEvaluator05:
          evaluationDetail.basicProTotalPointEvaluator05,
        basicProTotalPointEvaluator1:
          evaluationDetail.basicProTotalPointEvaluator1,
        basicProTotalPointEvaluator2:
          evaluationDetail.basicProTotalPointEvaluator2,

        // ** Total
        summaryPointUser: evaluationDetail.summaryPointUser || 0,
        summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05 || 0,
        summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1 || 0,
        summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2 || 0,
        achievementAdditionalSetting: achievementAdditionalSetting,
      };

      const historyApproveEvaluation =
        evaluationDetail.historyApproveEvaluations;

      if (
        historyApproveEvaluation &&
        [2, 4, 6, 8, 52, 55, 58, 61].includes(evaluationDetail.status)
      ) {
        const comment = historyApproveEvaluation.comment;

        if (Number(historyApproveEvaluation.receiverOrder) === 0) {
          data.historyApproveEvaluation = comment;
        } else if (
          Number(historyApproveEvaluation.receiverOrder) === 0.5 &&
          evaluatorOrder >= 0.5
        ) {
          data.historyApproveEvaluation = comment;
        } else if (
          Number(historyApproveEvaluation.receiverOrder) === 1 &&
          evaluatorOrder >= 1
        ) {
          data.historyApproveEvaluation = comment;
        } else if (
          Number(historyApproveEvaluation.receiverOrder) === 2 &&
          evaluatorOrder >= 2
        ) {
          data.historyApproveEvaluation = comment;
        } else if (evaluatorOrder === undefined || evaluatorOrder === null)
          data.historyApproveEvaluation = comment;
      }

      // ** Status get formulas and point
      if (
        [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(
          evaluationDetail.status,
        ) ||
        (evaluationDetail.status === 50 && isEvaluationDate)
      ) {
        // ** Point pro/basic/behavior skill
        const pointBasicSkills = await this.pointRepo.getPointSkill(
          1,
          user.companyGroupCode,
        );
        const pointBehaviorSkills = await this.pointRepo.getPointSkill(
          2,
          user.companyGroupCode,
        );
        const pointProSkills = await this.pointRepo.getPointSkill(
          3,
          user.companyGroupCode,
        );

        const settingProFormulas =
          await this.userRepo.getSettingProFormulaPublic(user.companyGroupCode);

        const getBasicBehaviorProPointOption =
          await this.evaluation17Service.getBasicBehaviorProOptionPublic(
            user.companyGroupCode,
          );

        const { maxPointBasicSkill, maxPointProSkill } =
          await this.evaluation17Service.getMaxPointProBasicSkillPublic(
            user.companyGroupCode,
          );

        // ** New

        // ** Setting Pro Formula
        data.settingProFormulas = settingProFormulas;

        // ** Basic - Behavior - Pro Point Options
        data.basicSkillPointOptions =
          getBasicBehaviorProPointOption.basicSkillPointOptions;
        data.behaviorSkillPointOptions =
          getBasicBehaviorProPointOption.behaviorSkillPointOptions;
        data.proSkillPointOptions =
          getBasicBehaviorProPointOption.proSkillPointOptions;

        // ** Basic-behavior-pro skill
        data.pointProSkills = pointProSkills;
        data.pointBehaviorSkills = pointBehaviorSkills;
        data.pointBasicSkills = pointBasicSkills;

        // ** Max point basic pro skill
        data.maxPointBasicSkill = maxPointBasicSkill;
        data.maxPointProSkill = maxPointProSkill;
      }

      if (evaluationDetail.status >= 50) {
        // Get Max min total ppoint
        const versionSetting =
          await this.versionSettingRepository.getVersionSrtting17(
            evaluationDetail?.flagSkill,
            user.companyGroupCode,
          );

        data.versionSetting = versionSetting;
      }

      if (!evaluatorOrderList.includes(2)) {
        // data.status = 101;
        data.isNotEvaluator2 = true;
      }

      const stringData = JSON.stringify(data);
      const encode = encrypt(stringData, true);
      return encode;
    }
    return null;
  }

  async getEvaluationV2(
    evaluationId: number,
    user: UserType,
    isEvaluatorUser: string,
    companyGroupCode: string | null,
    timeZone: string,
  ) {
    const isUser = isEvaluatorUser === 'true';
    const { evaluationDetail, evaluationAchievementPersonals } =
      await this.userRepo.getEvaluationByIdV2(
        evaluationId,
        user.id,
        isUser,
        companyGroupCode,
      );

    if (evaluationDetail?.flagSkill !== 0) {
      return await this.getEvaluationData(
        evaluationId,
        user,
        isEvaluatorUser,
        companyGroupCode,
        timeZone,
      );
    }

    let evaluatorOrder = 0;
    let isEvaluatorException = false;
    const evaluatorOrderList = [];
    if (!isUser) {
      const evaluators = evaluationDetail.evaluator;
      const findEvaluator = evaluators.find((f) => f.evaluatorId === user.id);
      if (!findEvaluator) isEvaluatorException = true;
      evaluatorOrder = findEvaluator?.evaluationOrder;
    }

    const comment: {
      comment05Public: string;
      comment05Private: string;
      comment1Public: string;
      comment1Private: string;
      comment2Public: string;
      comment2Private: string;
    } = {
      comment05Public: '',
      comment05Private: '',
      comment1Public: '',
      comment1Private: '',
      comment2Public: '',
      comment2Private: '',
    };

    if (evaluationDetail) {
      const evaluators = [];

      const evaluatorDefault = await this.userRepo.getEvaluatorDefault(
        evaluationDetail.user.id,
        evaluationDetail.evaluationPeriodId,
      );
      if (evaluationDetail.user.active !== 1 || !evaluatorDefault) {
        isEvaluatorException = true;
      }
      if (evaluationDetail.evaluator && evaluationDetail.evaluator.length > 0) {
        const arrays = evaluationDetail.evaluator.sort(
          (a, b) => a.evaluationOrder - b.evaluationOrder,
        );
        for (const item of arrays) {
          if (Number(item.evaluationOrder) === 0.5) {
            comment.comment05Public = item.commentPublic;
            comment.comment05Private = item.commentPrivate;
            evaluators.push(`仮評価: ${item.user.fullName}`);
          } else if (Number(item.evaluationOrder) === 1) {
            comment.comment1Public = item.commentPublic;
            comment.comment1Private = item.commentPrivate;
            evaluators.push(`一次評価: ${item.user.fullName}`);
          } else if (Number(item.evaluationOrder) === 2) {
            comment.comment2Public = item.commentPublic;
            comment.comment2Private = item.commentPrivate;
            evaluators.push(`二次評価: ${item.user.fullName}`);
          }
          evaluatorOrderList.push(Number(item.evaluationOrder));
        }
      }
      // ** Check time to evaluation
      const isEvaluationDate = compareDatePeriod(
        evaluationDetail.dateEvaluationStart ||
          evaluationDetail.evaluationPeriod?.dateEvaluationStart,
        evaluationDetail.dateEvaluationEnd ||
          evaluationDetail.evaluationPeriod?.dateEvaluationEnd,
        timeZone,
      );

      const isEvaluation: boolean =
        [
          51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
        ].includes(evaluationDetail.status) ||
        (evaluationDetail.status === 50 && isEvaluationDate);
      // ** End

      // ** Achievement

      const userEvaluationAchievements = evaluationAchievementPersonals.map(
        (v) => ({ ...v }),
      );

      const evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[] = [];
      let pointUserBehavior = 0;

      // ** Set array object basic/behavior skill
      if (evaluationDetail.evaluationBasicBehavior.length > 0) {
        const arrays = evaluationDetail.evaluationBasicBehavior;

        // ** Get/set array object basic skill

        // ** Get/set array object behavior skill
        evaluationBehaviorSkills.push(
          ...arrays
            .filter((f) => f.type === 3)
            .map((v, i) => {
              pointUserBehavior = pointUserBehavior + v.pointUser || 0;
              return {
                itemNo: v.itemNo,
                pointUser: v.pointUser,
                title: v.itemTitle,
                content: v.content,
                difficulty: v.difficulty,
                key: `behavior-2-key-${i}`,
                pointEvaluator05: v.pointEvaluator05,
                pointEvaluator1: v.pointEvaluator1,
                pointEvaluator2: v.pointEvaluator2,
              };
            }),
        );
      }
      // ** Achievement Additional
      const achievementAdditionals: AchievementAdditionalType[] = [];
      if (evaluationDetail.evaluationAchievementAdditional.length > 0) {
        achievementAdditionals.push(
          ...evaluationDetail.evaluationAchievementAdditional.map((v, i) => ({
            key: `achievement-additional-key-${i}`,
            itemNo: v.itemNo,
            titleAdditional: v.titleAdditional,
            achievementStatus: v.achievementStatus,
            reasonComment: v.reasonComment,
            pointUser: v.pointUser,
            pointEvaluator05: v.pointEvaluator05,
            pointEvaluator1: v.pointEvaluator1,
            pointEvaluator2: v.pointEvaluator2,
            evaluationOrder: v.evaluationOrder,
          })),
        );
      }

      // ** Period time to evaluation
      if (isEvaluation && evaluatorOrderList.includes(2)) {
        // ** Add last row total Behavior skill
        evaluationBehaviorSkills.push({
          title: '小計',
          content: null,
          difficulty: null,
          key: `basic-1-key-pointUserBehavior`,
          itemNo: -1,
          pointUser: evaluationDetail.behaviorTotalPointUser,
          pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
          pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
          pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
        });
        // ** Add last row achievement
        userEvaluationAchievements.push({
          key: 0,
          itemNo: null,
          title: null,
          achievementValue: null,
          method: null,
          weight: null,
          difficultyUser: null,
          difficultyEvaluator05: null,
          difficultyEvaluator1: null,
          difficultyEvaluator2: null,
          achievementStatus: '小計',
          reasonComment: null,
          actionPlan: null,
          pointUser: evaluationDetail.achievementPersonalTotalPointUser,
          pointEvaluator05:
            evaluationDetail.achievementPersonalTotalPointEvaluator05,
          pointEvaluator1:
            evaluationDetail.achievementPersonalTotalPointEvaluator1,
          pointEvaluator2:
            evaluationDetail.achievementPersonalTotalPointEvaluator2,
          coefficientUser: null,
          coefficientEvaluator05: null,
          coefficientEvaluator1: null,
          coefficientEvaluator2: null,
          childrens: [],
        });
      }
      const findRejectCondition = {
        evaluationId: evaluationId,
        type: 0,
        receiverOrder: '',
        status: '',
      };
      switch (evaluationDetail.status) {
        case 2:
          findRejectCondition.type = 0;
          findRejectCondition.receiverOrder = '0.0';
          findRejectCondition.status = '被評価者へ差戻';
          break;
        case 4:
          findRejectCondition.type = 0;
          findRejectCondition.receiverOrder = '0.5';
          findRejectCondition.status = '仮評価者へ差戻';
          break;
        case 6:
          findRejectCondition.type = 0;
          findRejectCondition.receiverOrder = '1.0';
          findRejectCondition.status = '一次評価者へ差戻';
          break;
        case 8:
          findRejectCondition.type = 0;
          findRejectCondition.receiverOrder = '2.0';
          findRejectCondition.status = '二次評価者へ差戻';
          break;
        //
        case 52:
          findRejectCondition.type = 1;
          findRejectCondition.receiverOrder = '0.0';
          findRejectCondition.status = '被評価者へ差戻';
          break;
        case 55:
          findRejectCondition.type = 1;
          findRejectCondition.receiverOrder = '0.5';
          findRejectCondition.status = '仮評価者へ差戻';
          break;
        case 58:
          findRejectCondition.type = 1;
          findRejectCondition.receiverOrder = '1.0';
          findRejectCondition.status = '一次評価者へ差戻';
          break;
        case 61:
          findRejectCondition.type = 1;
          findRejectCondition.receiverOrder = '2.0';
          findRejectCondition.status = '二次評価者へ差戻';
          break;
        default:
          findRejectCondition.receiverOrder = '3.0';
          break;
      }

      let rejectComment = null;
      if (findRejectCondition.receiverOrder !== '3.0') {
        const approvalList = await this.approvalRepository.getApprovalHistory(
          findRejectCondition,
        );
        rejectComment = approvalList[0];
      }

      const data: any = {
        // id: evaluationDetail.id,
        fiscalYear: evaluationDetail.title,
        periodStart: evaluationDetail.periodStart,
        periodEnd: evaluationDetail.periodEnd,
        flagSkill: evaluationDetail.flagSkill,
        evaluationLevel: evaluationDetail.level || user.level,
        evaluators,
        statusName: statusEvaluation[evaluationDetail.status],
        status: evaluationDetail.status,
        department:
          evaluationDetail.departmentName ||
          `${user.departmentCode}: ${user.departmentName}`,
        employeeNumber: evaluationDetail.user.employeeNumber,
        fullName: evaluationDetail.user.fullName || user.fullName,
        guideVersionId: evaluationDetail.guideVersionId,

        // ** Order
        evaluatorOrder,
        evaluatorOrderList,

        // ** Comment
        commentUser: evaluationDetail.commentUser,

        // ** Total - user
        basicTotalPointUser: evaluationDetail.basicTotalPointUser,
        proTotalPointUser: evaluationDetail.proTotalPointUser,
        behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser,
        achievementPersonalTotalPointUser:
          evaluationDetail.achievementPersonalTotalPointUser,
        achievementAdditionalTotalPointUser:
          evaluationDetail.achievementAdditionalTotalPointUser,

        // ** Total - evaluator 0.5
        basicTotalPointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
        proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
        behaviorTotalPointEvaluator05:
          evaluationDetail.behaviorTotalPointEvaluator05,
        achievementAdditionalTotalPointEvaluator05:
          evaluationDetail.achievementAdditionalTotalPointEvaluator05,
        achievementPersonalTotalPointEvaluator05:
          evaluationDetail.achievementPersonalTotalPointEvaluator05,

        // ** Total - evaluator 1.0
        basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
        proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
        behaviorTotalPointEvaluator1:
          evaluationDetail.behaviorTotalPointEvaluator1,
        achievementAdditionalTotalPointEvaluator1:
          evaluationDetail.achievementAdditionalTotalPointEvaluator1,
        achievementPersonalTotalPointEvaluator1:
          evaluationDetail.achievementPersonalTotalPointEvaluator1,

        // ** Total - evaluator 2.0
        basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
        proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
        behaviorTotalPointEvaluator2:
          evaluationDetail.behaviorTotalPointEvaluator2,
        achievementAdditionalTotalPointEvaluator2:
          evaluationDetail.achievementAdditionalTotalPointEvaluator2,
        achievementPersonalTotalPointEvaluator2:
          evaluationDetail.achievementPersonalTotalPointEvaluator2,

        // ** point && setting table level
        pointSettingLevel: {
          key: 'point-setting-level-key-1',
          behaviorPercent: evaluationDetail.behaviorPercent,
          achievementPercent: evaluationDetail.achievementPercent,
          percentPoint: evaluationDetail.percentPoint,
        },

        // ** Evaluation Achievements
        userEvaluationAchievements,

        // ** Evaluation Period
        dateCreationGoalStart: evaluationDetail.dateCreationGoalStart,
        dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd,
        dateEvaluationStart: evaluationDetail.dateEvaluationStart,
        dateEvaluationEnd: evaluationDetail.dateEvaluationEnd,
        evaluationPeriod: evaluationDetail.evaluationPeriod,

        // ** Evaluation Behavior Skill
        evaluationBehaviorSkills,

        // ** Evaluation Achievement Additional
        achievementAdditionals,

        // ** Comment Public/Private
        comment,

        // ** Evaluator exception
        isEvaluatorException,

        // ** Update Time
        updateTime: evaluationDetail.updatedTime.toISOString(),

        basicProTotalPointUser: evaluationDetail.basicProTotalPointUser,
        basicProTotalPointEvaluator05:
          evaluationDetail.basicProTotalPointEvaluator05,
        basicProTotalPointEvaluator1:
          evaluationDetail.basicProTotalPointEvaluator1,
        basicProTotalPointEvaluator2:
          evaluationDetail.basicProTotalPointEvaluator2,

        // ** Total
        summaryPointUser: evaluationDetail.summaryPointUser || 0,
        summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05 || 0,
        summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1 || 0,
        summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2 || 0,
        rejectComment,
      };

      const historyApproveEvaluation = null;

      if (
        historyApproveEvaluation &&
        [2, 4, 6, 8, 52, 55, 58, 61].includes(evaluationDetail.status)
      ) {
        const comment = historyApproveEvaluation.comment;
        if (Number(historyApproveEvaluation.receiverOrder) === 0) {
          data.historyApproveEvaluation = comment;
        } else if (
          Number(historyApproveEvaluation.receiverOrder) === 0.5 &&
          evaluatorOrder >= 0.5
        ) {
          data.historyApproveEvaluation = comment;
        } else if (
          Number(historyApproveEvaluation.receiverOrder) === 1 &&
          evaluatorOrder >= 1
        ) {
          data.historyApproveEvaluation = comment;
        } else if (
          Number(historyApproveEvaluation.receiverOrder) === 2 &&
          evaluatorOrder >= 2
        ) {
          data.historyApproveEvaluation = comment;
        } else if (evaluatorOrder === undefined)
          data.historyApproveEvaluation = comment;
      }
      // ** Status get formulas and point
      if (
        [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61].includes(
          evaluationDetail.status,
        ) ||
        (evaluationDetail.status === 50 && isEvaluationDate)
      ) {
        // ** Point pro/basic/behavior skill
        const pointBehaviorSkills = await this.pointRepo.getPointSkill(
          3,
          user.companyGroupCode,
        );
        const settingProFormulas =
          await this.userRepo.getSettingProFormulaPublic(user.companyGroupCode);

        const getBasicBehaviorProPointOption =
          await this.evaluation17Service.getBasicBehaviorProOptionPublic(
            user.companyGroupCode,
            true,
          );

        // ** New
        // ** Setting Pro Formula
        data.settingProFormulas = settingProFormulas;

        // ** Basic - Behavior - Pro Point Options
        data.basicSkillPointOptions =
          getBasicBehaviorProPointOption.basicSkillPointOptions;
        data.behaviorSkillPointOptions =
          getBasicBehaviorProPointOption.behaviorSkillPointOptions;
        data.proSkillPointOptions =
          getBasicBehaviorProPointOption.proSkillPointOptions;

        // ** Basic-behavior-pro skill
        data.pointBehaviorSkills = pointBehaviorSkills;
      }
      if (evaluationDetail.status >= 50) {
        // Get Max min total ppoint
        const versionSetting =
          await this.versionSettingRepository.getVersionSrtting17(
            evaluationDetail?.flagSkill,
            user.companyGroupCode,
          );

        data.versionSetting = versionSetting;
        data.achievementAdditionalSetting =
          versionSetting.settingAchievementAdditional;
      }
      if (!evaluatorOrderList.includes(2)) {
        // data.status = 101;
        data.isNotEvaluator2 = true;
      }
      const stringData = JSON.stringify(data);
      const encode = encrypt(stringData, true);
      return encode;
    }
  }

  async getListProSkillPublic(user: UserType, evaluationId?: number) {
    const results = [];

    const versionProSkills = await this.userRepo.getProSkillPublicList(
      user.departmentId,
      user.divisionId,
      user.companyGroupCode,
      evaluationId,
    );

    versionProSkills.map((v, versionIndex) => {
      results.push(
        ...v.listProSkills.map((pro, i) => ({
          itemId: `${pro.itemId}_${versionIndex}_${i}`,
          smallClass: pro.smallClass,
          mediumClass: pro.mediumClass,
          content: pro.content,
          difficulty: pro.difficulty,
          note: pro.note,
          jobType: pro.jobType,
          key: `${pro.itemId}_${versionIndex}_${i}`,
        })),
      );
    });

    return results;
  }

  async getListProSkillPublicInMenu(user: any) {
    const versionProSkills = await this.userRepo.getProSkillPublicListInMenu(
      user.id,
      user.companyGroupCode,
      user.timeZone,
    );

    return {
      departmentName: versionProSkills.depDivName,
      listProSkills: versionProSkills.results,
    };
  }

  // eslint-disable-next-line complexity
  async updateEvaluation(
    evaluationId: number,
    user: UserType,
    data: UpdateEvaluationType,
    host: string,
    timeZone: string,
  ): Promise<{ statusNumber: number; updateTime: string }> {
    const {
      isSubmit,
      proTotalPointUser,
      basicTotalPointUser,
      behaviorTotalPointUser,
      achievementPersonalTotalPointUser,
      achievementAdditionalTotalPointUser,

      basicTotalPointEvaluator05,
      proTotalPointEvaluator05,
      behaviorTotalPointEvaluator05,
      achievementAdditionalTotalPointEvaluator05,
      achievementPersonalTotalPointEvaluator05,

      basicTotalPointEvaluator1,
      proTotalPointEvaluator1,
      behaviorTotalPointEvaluator1,
      achievementAdditionalTotalPointEvaluator1,
      achievementPersonalTotalPointEvaluator1,

      basicTotalPointEvaluator2,
      proTotalPointEvaluator2,
      behaviorTotalPointEvaluator2,
      achievementAdditionalTotalPointEvaluator2,
      achievementPersonalTotalPointEvaluator2,

      commentUser,
      isEvaluatorUser,
      comment05Public,
      comment05Private,
      comment1Public,
      comment1Private,
      comment2Public,
      comment2Private,
      updateTime,
      basicProTotalPointUser,
      basicProTotalPointEvaluator05,
      basicProTotalPointEvaluator1,
      basicProTotalPointEvaluator2,
      achievementSubs,
    } = data;

    let selectedOrder = '';
    const evaluation = await this.userRepo.getIdEvaluation(
      user.id,
      evaluationId,
      isEvaluatorUser, // if it is true then creator else evaluator 0.5 | 1 | 2 | user have f6 role
    );
    const versionSetting =
      await this.versionSettingRepository.getVersionSrtting17(
        evaluation?.flagSkill,
        user.companyGroupCode,
      );

    const minPoint = versionSetting?.minPoint || 0;
    const maxPoint = versionSetting?.maxPoint || 100;
    // ===========================
    const compareProSkills = data.listProSkillData.filter(
      (v) => v.isDisable === true,
    );
    // 1. [User] Nếu trong thời gian thực hiện đặt mục tiêu. Khi submit sẽ lưu type: 0, comment: null
    // 2. [User] Nếu trong thời gian thực hiện đánh giá: Khi submit sẽ lưu type: 1,
    // 2.1 comment: Nếu có PRO SKILL chọn không tính điểm [disable] sẽ lưu  compareProSkills dưới dạng json
    // 2.2 comment: Nếu không có PRO SKILL nào [disable] sẽ lưu text: 専門的なスキルはすべて評価されます。
    // 3. [Evaluator] Submit trong thời gian đánh giá sẽ lưu lại lịch sử submit
    const dates = new Date(
      isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
    );
    const updateValue = {
      evaluationId: evaluationId,
      comment:
        evaluation.flagSkill === 1 // Nếu evaluation có skill
          ? evaluation.status < 50 // Nếu evaluation status < 50 khi submit comment = ''
            ? ''
            : compareProSkills.length > 0 // Nếu có PRO SKILL sẽ lưu dưới dạng json vào comment
            ? JSON.stringify(compareProSkills)
            : 'MESSAGE.COMMON.IDS_PRO_SKILL_ALL_EVALUATE' // Nếu không có PRO SKILL nào bị disable
          : '', // Lưu rỗng khi là record NO SKILL
      approverId: user.id,
      receiverId: null,
      receiverOrder: 0,
      type: evaluation.status < 50 ? 0 : 1,
      status: 'IDS_BUTTON_SUBMIT',
      // createdTime: dates,
    };

    if (!isEvaluatorUser) {
      const evaluators = evaluation.evaluator;
      const findEvaluator = evaluators.find((f) => f.evaluatorId === user.id);
      if (!findEvaluator)
        throw new RuntimeException('Not found evaluation id', 500);
      if (Number(findEvaluator.evaluationOrder) === 0.5) {
        findEvaluator.commentPublic = comment05Public;
        findEvaluator.commentPrivate = comment05Private;
        findEvaluator.save();
      }
      if (Number(findEvaluator.evaluationOrder) === 1) {
        findEvaluator.commentPublic = comment1Public;
        findEvaluator.commentPrivate = comment1Private;
        findEvaluator.save();
      }
      if (Number(findEvaluator.evaluationOrder) === 2) {
        findEvaluator.commentPublic = comment2Public;
        findEvaluator.commentPrivate = comment2Private;
        findEvaluator.save();
      }
      updateValue.comment = '';
      updateValue.status = 'IDS_EVALUATOR_EVALUATE';
    }

    if (!evaluation || !evaluation.id)
      throw new RuntimeException('Not found evaluation id', 500);

    if (evaluation.user.active !== 1)
      throw new RuntimeException('User is deleted', 500);

    if (updateTime !== evaluation.updatedTime.toISOString())
      throw new RuntimeException('Evaluation is duplicate', 409);

    const evaluatorDefault = await this.userRepo.getEvaluatorDefault(
      evaluation.user.id,
      evaluation.evaluationPeriodId,
    );
    if (evaluation.user.active !== 1 || !evaluatorDefault) {
      throw new RuntimeException('Evaluation is duplicate', 409);
    }

    let isEdit = false;
    const transaction = await this.userRepo.getNewTransaction();
    try {
      // ** Save List pro skill data
      if (data.listProSkillData) {
        await this.userRepo
          .updateEvaluationProSkill(
            evaluationId,
            data.listProSkillData,
            transaction,
          )
          .then(() => (isEdit = true));
      }
      // ** Save Achievement data
      if (data.achievementDatas)
        data.achievementDatas.map((v) => {
          v.type = 1;

          return v;
        });

      await this.userRepo
        .updateEvaluationAchievement(
          evaluationId,
          data.achievementDatas,
          achievementSubs,
          evaluation.status,
          transaction,
        )
        .then(() => (isEdit = true));

      // ** Save Achievement additionals data
      if (data.achievementAdditionals) {
        //
        await this.userRepo.updateEvaluationAchievementAdditional(
          evaluationId,
          data.achievementAdditionals,
          transaction,
        );
      }

      // ** Save Basic skill data
      if (data.evaluationBasicSkills.length > 0)
        await this.userRepo.updateEvaluationBasicOrBehaviorSkill(
          evaluationId,
          data.evaluationBasicSkills,
          '1',
          transaction,
        );
      // ** Save Behavior skill data
      if (data.evaluationBehaviorSkills.length > 0)
        await this.userRepo.updateEvaluationBasicOrBehaviorSkill(
          evaluationId,
          data.evaluationBehaviorSkills,
          evaluation.flagSkill === 1 ? '2' : '3',
          transaction,
        );
      // ** Total - User
      if (
        evaluation.achievementAdditionalTotalPointUser !=
          achievementAdditionalTotalPointUser ||
        [50, 51, 52].includes(evaluation.status)
      ) {
        const summaryPointUser = Math.round(
          (Number(
            basicProTotalPointUser !== null &&
              basicProTotalPointUser !== undefined
              ? basicProTotalPointUser
              : 0,
          ) *
            (evaluation.skillPercent || 0) +
            Number(
              behaviorTotalPointUser !== null &&
                behaviorTotalPointUser !== undefined
                ? behaviorTotalPointUser
                : 0,
            ) *
              (evaluation.behaviorPercent || 0) +
            Math.round(
              Number(
                achievementPersonalTotalPointUser !== null &&
                  achievementPersonalTotalPointUser !== undefined
                  ? achievementPersonalTotalPointUser
                  : 0,
              ),
            ) *
              (evaluation.achievementPercent || 0)) /
            100 +
            Number(
              achievementAdditionalTotalPointUser !== null &&
                achievementAdditionalTotalPointUser !== undefined
                ? achievementAdditionalTotalPointUser
                : 0,
            ),
        );
        evaluation.summaryPointUser =
          (basicProTotalPointUser !== null &&
            basicProTotalPointUser !== undefined) ||
          (behaviorTotalPointUser !== null &&
            behaviorTotalPointUser !== undefined) ||
          (achievementPersonalTotalPointUser !== null &&
            achievementPersonalTotalPointUser !== undefined) ||
          (achievementAdditionalTotalPointUser !== null &&
            achievementAdditionalTotalPointUser !== undefined)
            ? Math.min(
                Math.max(Math.floor(summaryPointUser), minPoint),
                maxPoint,
              )
            : null;
      }

      if ([50, 51, 52].includes(evaluation.status)) {
        // status là từ lúc đánh giá trở đi mới update điểm
        evaluation.behaviorTotalPointUser = behaviorTotalPointUser;
        evaluation.achievementPersonalTotalPointUser =
          achievementPersonalTotalPointUser &&
          Math.round(achievementPersonalTotalPointUser);
        evaluation.proTotalPointUser =
          proTotalPointUser && Math.round(proTotalPointUser);
        evaluation.basicTotalPointUser = basicTotalPointUser;
        evaluation.achievementAdditionalTotalPointUser =
          achievementAdditionalTotalPointUser;
        evaluation.basicProTotalPointUser = basicProTotalPointUser;
        evaluation.commentUser = commentUser;
      }
      // ** Total - 0.5
      if (
        evaluation.achievementAdditionalTotalPointEvaluator05 !=
          achievementAdditionalTotalPointEvaluator05 ||
        [53, 54, 55].includes(evaluation.status)
      ) {
        const summaryPointEvaluator05 = Math.round(
          (Number(
            basicProTotalPointEvaluator05 !== null &&
              basicProTotalPointEvaluator05 !== undefined
              ? basicProTotalPointEvaluator05
              : 0,
          ) *
            (evaluation.skillPercent || 0) +
            Number(
              behaviorTotalPointEvaluator05 !== null &&
                behaviorTotalPointEvaluator05 !== undefined
                ? behaviorTotalPointEvaluator05
                : 0,
            ) *
              (evaluation.behaviorPercent || 0) +
            Math.round(
              Number(
                achievementPersonalTotalPointEvaluator05 !== null &&
                  achievementPersonalTotalPointEvaluator05 !== undefined
                  ? achievementPersonalTotalPointEvaluator05
                  : 0,
              ),
            ) *
              (evaluation.achievementPercent || 0)) /
            100 +
            Number(
              achievementAdditionalTotalPointEvaluator05 !== null &&
                achievementAdditionalTotalPointEvaluator05 !== undefined
                ? achievementAdditionalTotalPointEvaluator05
                : 0,
            ),
        );

        evaluation.summaryPointEvaluator05 =
          (basicProTotalPointEvaluator05 !== null &&
            basicProTotalPointEvaluator05 !== undefined) ||
          (behaviorTotalPointEvaluator05 !== null &&
            behaviorTotalPointEvaluator05 !== undefined) ||
          (achievementPersonalTotalPointEvaluator05 !== null &&
            achievementPersonalTotalPointEvaluator05 !== undefined) ||
          (achievementAdditionalTotalPointEvaluator05 !== null &&
            achievementAdditionalTotalPointEvaluator05 !== undefined)
            ? Math.min(
                Math.max(Math.floor(summaryPointEvaluator05), minPoint),
                maxPoint,
              )
            : null;
      }
      if ([53, 54, 55].includes(evaluation.status)) {
        // status là từ lúc đánh giá trở đi mới update điểm
        evaluation.basicTotalPointEvaluator05 = basicTotalPointEvaluator05;
        evaluation.proTotalPointEvaluator05 =
          proTotalPointEvaluator05 && Math.round(proTotalPointEvaluator05);
        // Ghi điểm lại cho user
        evaluation.proTotalPointUser =
          proTotalPointUser && Math.round(proTotalPointUser);
        // =============================
        evaluation.behaviorTotalPointEvaluator05 =
          behaviorTotalPointEvaluator05;
        evaluation.achievementAdditionalTotalPointEvaluator05 =
          achievementAdditionalTotalPointEvaluator05;
        evaluation.achievementPersonalTotalPointEvaluator05 =
          achievementPersonalTotalPointEvaluator05 &&
          Math.round(achievementPersonalTotalPointEvaluator05);
        evaluation.basicProTotalPointEvaluator05 =
          basicProTotalPointEvaluator05;
      }
      // ** Total - 1.0
      if (
        evaluation.achievementAdditionalTotalPointEvaluator1 !=
          achievementAdditionalTotalPointEvaluator1 ||
        [56, 57, 58].includes(evaluation.status)
      ) {
        const summaryPointEvaluator1 = Math.round(
          (Number(
            basicProTotalPointEvaluator1 !== null &&
              basicProTotalPointEvaluator1 !== undefined
              ? basicProTotalPointEvaluator1
              : 0,
          ) *
            (evaluation.skillPercent || 0) +
            Number(
              behaviorTotalPointEvaluator1 !== null &&
                behaviorTotalPointEvaluator1 !== undefined
                ? behaviorTotalPointEvaluator1
                : 0,
            ) *
              (evaluation.behaviorPercent || 0) +
            Math.round(
              Number(
                achievementPersonalTotalPointEvaluator1 !== null &&
                  achievementPersonalTotalPointEvaluator1 !== undefined
                  ? achievementPersonalTotalPointEvaluator1
                  : 0,
              ),
            ) *
              (evaluation.achievementPercent || 0)) /
            100 +
            Number(
              achievementAdditionalTotalPointEvaluator1 !== null &&
                achievementAdditionalTotalPointEvaluator1 !== undefined
                ? achievementAdditionalTotalPointEvaluator1
                : 0,
            ),
        );

        evaluation.summaryPointEvaluator1 =
          (basicProTotalPointEvaluator1 !== null &&
            basicProTotalPointEvaluator1 !== undefined) ||
          (behaviorTotalPointEvaluator1 !== null &&
            behaviorTotalPointEvaluator1 !== undefined) ||
          (achievementPersonalTotalPointEvaluator1 !== null &&
            achievementPersonalTotalPointEvaluator1 !== undefined) ||
          (achievementAdditionalTotalPointEvaluator1 !== null &&
            achievementAdditionalTotalPointEvaluator1 !== undefined)
            ? Math.min(
                Math.max(Math.floor(summaryPointEvaluator1), minPoint),
                maxPoint,
              )
            : null;
      }
      if ([56, 57, 58].includes(evaluation.status)) {
        // status là từ lúc đánh giá trở đi mới update điểm
        evaluation.basicTotalPointEvaluator1 = basicTotalPointEvaluator1;
        evaluation.proTotalPointEvaluator1 =
          proTotalPointEvaluator1 && Math.round(proTotalPointEvaluator1);
        //  Ghi điểm lại cho evaluator 0.5
        evaluation.proTotalPointEvaluator05 =
          proTotalPointEvaluator05 && Math.round(proTotalPointEvaluator05);
        // Ghi điểm lại cho user
        evaluation.proTotalPointUser =
          proTotalPointUser && Math.round(proTotalPointUser);
        evaluation.behaviorTotalPointEvaluator1 = behaviorTotalPointEvaluator1;
        evaluation.achievementAdditionalTotalPointEvaluator1 =
          achievementAdditionalTotalPointEvaluator1;
        evaluation.achievementPersonalTotalPointEvaluator1 =
          achievementPersonalTotalPointEvaluator1 &&
          Math.round(achievementPersonalTotalPointEvaluator1);
        evaluation.basicProTotalPointEvaluator1 = basicProTotalPointEvaluator1;
      }
      // ** Total - 2.0
      if (
        evaluation.achievementAdditionalTotalPointEvaluator2 !=
          achievementAdditionalTotalPointEvaluator2 ||
        [59, 60, 61].includes(evaluation.status)
      ) {
        const summaryPointEvaluator2 = Math.round(
          (Number(
            basicProTotalPointEvaluator2 !== null &&
              basicProTotalPointEvaluator2 !== undefined
              ? basicProTotalPointEvaluator2
              : 0,
          ) *
            (evaluation.skillPercent || 0) +
            Number(
              behaviorTotalPointEvaluator2 !== null &&
                behaviorTotalPointEvaluator2 !== undefined
                ? behaviorTotalPointEvaluator2
                : 0,
            ) *
              (evaluation.behaviorPercent || 0) +
            Math.round(
              Number(
                achievementPersonalTotalPointEvaluator2 !== null &&
                  achievementPersonalTotalPointEvaluator2 !== undefined
                  ? achievementPersonalTotalPointEvaluator2
                  : 0,
              ),
            ) *
              (evaluation.achievementPercent || 0)) /
            100 +
            Number(
              achievementAdditionalTotalPointEvaluator2 !== null &&
                achievementAdditionalTotalPointEvaluator2 !== undefined
                ? achievementAdditionalTotalPointEvaluator2
                : 0,
            ),
        );

        evaluation.summaryPointEvaluator2 =
          (basicProTotalPointEvaluator2 !== null &&
            basicProTotalPointEvaluator2 !== undefined) ||
          (behaviorTotalPointEvaluator2 !== null &&
            behaviorTotalPointEvaluator2 !== undefined) ||
          (achievementPersonalTotalPointEvaluator2 !== null &&
            achievementPersonalTotalPointEvaluator2 !== undefined) ||
          (achievementAdditionalTotalPointEvaluator2 !== null &&
            achievementAdditionalTotalPointEvaluator2 !== undefined)
            ? Math.min(
                Math.max(Math.floor(summaryPointEvaluator2), minPoint),
                maxPoint,
              )
            : null;
      }
      if ([59, 60, 61].includes(evaluation.status)) {
        // status là từ lúc đánh giá trở đi mới update điểm
        evaluation.basicTotalPointEvaluator2 = basicTotalPointEvaluator2;
        evaluation.proTotalPointEvaluator2 =
          proTotalPointEvaluator2 && Math.round(proTotalPointEvaluator2);

        evaluation.proTotalPointEvaluator1 =
          proTotalPointEvaluator1 && Math.round(proTotalPointEvaluator1);
        //  Ghi điểm lại cho evaluator 0.5
        evaluation.proTotalPointEvaluator05 =
          proTotalPointEvaluator05 && Math.round(proTotalPointEvaluator05);
        // Ghi điểm lại cho user
        evaluation.proTotalPointUser =
          proTotalPointUser && Math.round(proTotalPointUser);
        evaluation.behaviorTotalPointEvaluator2 = behaviorTotalPointEvaluator2;
        evaluation.achievementAdditionalTotalPointEvaluator2 =
          achievementAdditionalTotalPointEvaluator2;
        evaluation.achievementPersonalTotalPointEvaluator2 =
          achievementPersonalTotalPointEvaluator2 &&
          Math.round(achievementPersonalTotalPointEvaluator2);
        evaluation.basicProTotalPointEvaluator2 = basicProTotalPointEvaluator2;
      }

      evaluation.achievementAdditionalTotalPointUser =
        achievementAdditionalTotalPointUser;
      evaluation.achievementAdditionalTotalPointEvaluator05 =
        achievementAdditionalTotalPointEvaluator05;
      evaluation.achievementAdditionalTotalPointEvaluator1 =
        achievementAdditionalTotalPointEvaluator1;
      evaluation.achievementAdditionalTotalPointEvaluator2 =
        achievementAdditionalTotalPointEvaluator2;
      // ** Check && save status -> Save draft
      if (!isSubmit && isEdit) {
        if (evaluation.status === 0) evaluation.status = 1;
        if (evaluation.status === 50) evaluation.status = 51;
        await evaluation.save({ transaction });
      }
      // ** Check && save status -> Submit
      if (isSubmit) {
        if ([50, 51, 52].includes(evaluation.status)) {
          updateValue.status = 'IDS_BUTTON_SUBMIT';
        }

        await this.evaluationRepo.createHistoryApproveReject(
          updateValue,
          transaction,
        );

        const evaluators = evaluation.evaluator;
        if ([0, 1, 2].some((s) => s === evaluation.status)) {
          // ** has reviewer 0.5
          if (evaluators.some((s) => Number(s.evaluationOrder) === 0.5)) {
            evaluation.status = 3;
            selectedOrder = '0.5';
          }
          // ** has reviewer 1
          else if (evaluators.some((s) => Number(s.evaluationOrder) === 1)) {
            evaluation.status = 5;
            selectedOrder = '1.0';
          }
          // ** has reviewer 2
          else {
            evaluation.status = 7;
            selectedOrder = '2.0';
          }

          await this.userRepo.updateEvaluationBasicBehaviorSkill(
            evaluationId,
            evaluation.level,
            evaluation.flagSkill,
            user.companyGroupCode,
            transaction,
          );
        }

        if ([59, 60, 61].some((s) => s === evaluation.status)) {
          evaluation.status = 98;
        }
        // ** Reviewer 1 submit to reviewer 2
        if ([56, 57, 58].some((s) => s === evaluation.status)) {
          // ** has reviewer 2
          if (evaluators.some((s) => Number(s.evaluationOrder) === 2)) {
            evaluation.status = 59;
            selectedOrder = '2.0';
          }
        }

        // ** Reviewer 0.5 submit to reviewer 1 || 2
        if ([53, 54, 55].some((s) => s === evaluation.status)) {
          // ** has reviewer 1
          if (evaluators.some((s) => Number(s.evaluationOrder) === 1)) {
            evaluation.status = 56;
            selectedOrder = '1.0';
          }
          // ** has reviewer 2
          else if (evaluators.some((s) => Number(s.evaluationOrder) === 2)) {
            evaluation.status = 59;
            selectedOrder = '2.0';
          }
        }

        // ** User created submit to reviewer 0.5 || 1 || 2
        if ([50, 51, 52].some((s) => s === evaluation.status)) {
          // ** has reviewer 0.5
          if (evaluators.some((s) => Number(s.evaluationOrder) === 0.5)) {
            evaluation.status = 53;
            selectedOrder = '0.5';
          }
          // ** has reviewer 1
          else if (evaluators.some((s) => Number(s.evaluationOrder) === 1)) {
            evaluation.status = 56;
            selectedOrder = '1.0';
          }
          // ** has reviewer 2
          else if (evaluators.some((s) => Number(s.evaluationOrder) === 2)) {
            evaluation.status = 59;
            selectedOrder = '2.0';
          }
        }

        await evaluation.save({ transaction });
        const tempApprovers = evaluators.filter((item: any) => {
          if (item.evaluationOrder === selectedOrder) return item;
        });
        if (selectedOrder)
          await this.mailService.submitGoalAndEvaluation(
            tempApprovers[0].evaluatorId,
            evaluation.userId,
            evaluation,
            host,
          );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error.toString());
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      statusNumber: evaluation.status,
      updateTime: evaluation.updatedTime.toISOString(),
    };
  }

  async getSettingProFormulaPublic(companyGroupCode: string) {
    return await this.userRepo.getSettingProFormulaPublic(companyGroupCode);
  }

  //

  async listBasicBehavior(
    type: number,
    level: any,
    flagSkill: number,
    companyGroupCode: string,
  ) {
    const basicBehaviors = [];

    if (type.toString().match(/[1-2]/)) {
      const results = await this.userRepo.getBasicBehavior(
        type,
        level,
        flagSkill,
        companyGroupCode,
      );
      basicBehaviors.push(
        ...results.map((v, i) => ({
          ...v,
          key: `basic-behavior-key-${type.toString().match(/[1-2]/)}-${i}`,
        })),
      );
    }
    return basicBehaviors;
  }

  async getDepartmentGoal(
    idEvaluation: number,
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    let evaluationDepartmentId: number;

    if (idEvaluation) {
      const evaluation = await this.userRepo.getEvaluationDepartmentId(
        idEvaluation,
      );
      evaluationDepartmentId = evaluation.evaluationDepartmentId;
    } else {
      evaluationDepartmentId = undefined;
    }
    if (
      evaluationDepartmentId !== undefined &&
      evaluationDepartmentId !== 0 &&
      evaluationDepartmentId !== null
    ) {
      const data =
        await this.userRepo.getDepartmentGoalbyEvaluationDepartmentId(
          evaluationDepartmentId,
        );

      const personalIds: number[] = [];

      if (data) {
        data.evaluationAchievementPersonals.forEach((e: any) => {
          personalIds.push(e.itemNo);
        });
      }

      const listPeronalSub = await this.userRepo.findPersonalSub(personalIds);
      return data
        ? { evaluationAchievementPersonalSubs: listPeronalSub, data }
        : {
            data: {
              ...data,
              evaluationAchievementPersonals: [],
            },

            evaluationAchievementPersonalSubs: [],
          };
    } else if (evaluationDepartmentId === 0) {
      const evaluation = await this.userRepo.getEvaluationDepartmentId(
        idEvaluation,
      );
      const { divisionName, title } = evaluation;
      return {
        data: {
          title: title,
          divisionName: divisionName,
          evaluationAchievementPersonals: [],
        },
        evaluationAchievementPersonalSubs: [],
      };
    } else {
      let division: any;
      let divisionInfor: any;
      if (idEvaluation) {
        const evaluation = await this.userRepo.getEvaluationDepartmentId(
          idEvaluation,
        );
        division = evaluation.divisionName;
        divisionInfor = evaluation.divisionId;
      } else {
        const divisionUser = await this.userRepo.getDivisionByUserId(userId);
        division = divisionUser.division;
        divisionInfor = divisionUser.division;
      }
      let evaluationPeriod;
      if (idEvaluation) {
        evaluationPeriod =
          await this.userRepo.getEvaluationPeriodByEvaluationId(idEvaluation);
      } else
        evaluationPeriod = await this.userRepo.getEvaluationPeriodId(
          companyGroupCode,
          timeZone,
        );

      if (!evaluationPeriod)
        throw new RuntimeException(`can't found evaluation period`, 501);
      const { year, periodIndex } = evaluationPeriod;
      let title: string;
      switch (periodIndex) {
        case 1:
          title = year + '年上期';
          break;
        case 2:
          title = year + '年下期';
          break;
        default:
          title = null;
      }
      let divisionName: string;
      let divisionId: number;
      if (idEvaluation) {
        divisionName = division;
        divisionId = divisionInfor;
      } else {
        divisionName = division ? division.name : null;
        divisionId = divisionInfor ? divisionInfor.id : null;
      }
      if (evaluationPeriod) {
        const evaluationPeriodId = evaluationPeriod.id;
        const data = await this.userRepo.getDepartmentGoal(
          divisionId,
          evaluationPeriodId,
          companyGroupCode,
        );
        const personalIds: number[] = [];

        if (data) {
          data.evaluationAchievementPersonals.forEach((e: any) => {
            personalIds.push(e.id);
          });
        }

        const listPeronalSub = await this.userRepo.findPersonalSub(personalIds);

        return data
          ? { evaluationAchievementPersonalSubs: listPeronalSub, data }
          : {
              data: {
                title: title,
                divisionName: divisionName,
                evaluationAchievementPersonals: [],
              },

              evaluationAchievementPersonalSubs: [],
            };
      } else return [];
    }
  }

  async getListUser(query: any) {
    const results = await this.userRepo.getListUser(query);
    return results;
  }
  async getUserIdByEvaluationId(evaluationId: number) {
    const results = await this.userRepo.getUserIdByEvaluationId(evaluationId);
    return results.userId;
  }

  async deleteListUser(query: any, companyGroupCode: string, timeZone: string) {
    const results = await this.userRepo.deleteListUser(
      query,
      companyGroupCode,
      timeZone,
    );
    return results;
  }

  async getAchievementPublic(type: AchievementType, companyGroupCode: string) {
    const results = await this.userRepo.getAchievementPublicByType(
      type,
      companyGroupCode,
    );
    if (results && results.length > 0) return results;
    return [];
  }

  async getAchievementAddPublic(
    type: AchievementType,
    typeNew: number,
    companyGroupCode: string,
  ) {
    const results = await this.userRepo.getAchievementAddPublicByType(
      type,
      typeNew,
      companyGroupCode,
    );

    if (results && results.length > 0) return results;
    return [];
  }

  // ** Get Basic skill or behavior skill or all from version basic/behavior
  async getBasicBehaviorSkillPublic(
    type: BasicBehaviorType,
    companyGroupCode: string,
    level?: number,
  ) {
    const basicBehaviors = await this.userRepo.getBasicBehaviorSkillPublic(
      type,
      companyGroupCode,
      level,
    );
    if (basicBehaviors && basicBehaviors.length > 0) {
      const results = basicBehaviors.map((v, i) => ({
        ...v,
        key: `basic-behavior-skill-${type}-${i}`,
      }));
      return results;
    }
    return [];
  }

  async getUserDetailById(id: any) {
    return await this.userRepo.getUserDetailById(id);
  }

  async getEvaluationByUserId(id: any, companyGroupCode: string) {
    return await this.userRepo.getEvaluationByUserId(id, companyGroupCode);
  }

  async searchListUserSettingEvaluator(query: any) {
    const results = await this.userRepo.searchListUserSettingEvaluator(query);

    return results;
  }

  async getListEvaluator(
    evaluationCreatorId: number | undefined,
    companyGroupCode: string,
  ) {
    const results = await this.userRepo.getListEvaluator(
      evaluationCreatorId,
      companyGroupCode,
    );
    return results;
  }

  async updateSettingEvaluatorOfOneUser(query: any, companyGroupCode: string) {
    const results = await this.userRepo.updateSettingEvaluatorOfOneUser(
      query,
      companyGroupCode,
    );
    return results;
  }

  async updateSettingEvaluatorListUser(query: any, companyGroupCode: string) {
    const results = await this.userRepo.updateSettingEvaluatorListUser(
      query,
      companyGroupCode,
    );
    return results;
  }

  async getToEmailList(
    type: EmailType,
    year: string,
    periodIndex: string,
    companyGroupCode: string,
    departmentId?: number,
  ) {
    /**
     * toEmailList của user có ngoại lệ cần phải sửa lại do đang lấy từ bảng evaluator_default là sai thông tin
     */
    const EMAIL_TYPE_TO_TEMPLATE_ID: Partial<Record<string, TemplateMailId>> = {
      [EmailType.USER_GOAL_SETTING_PERIOD]:     TemplateMailId.COMMON_GOAL_SETTING,
      [EmailType.USER_EVALUATION_PERIOD]:        TemplateMailId.COMMON_EVALUATION_SETTING,
      [EmailType.EXCEPTION_GOAL_SETTING_PERIOD]: TemplateMailId.EXCEPTION_GOAL_SETTING,
      [EmailType.EXCEPTION_EVALUATION_PERIOD]:   TemplateMailId.EXCEPTION_EVALUATION_SETTING,
      [String(TemplateMailId.DEPT_GOAL_NOTIFICATION)]:   TemplateMailId.DEPT_GOAL_NOTIFICATION,
      [String(TemplateMailId.DEPT_EVAL_NOTIFICATION)]:   TemplateMailId.DEPT_EVAL_NOTIFICATION,
      [String(TemplateMailId.TARGET_GOAL_NOTIFICATION)]: TemplateMailId.TARGET_GOAL_NOTIFICATION,
      [String(TemplateMailId.TARGET_EVAL_NOTIFICATION)]: TemplateMailId.TARGET_EVAL_NOTIFICATION,
    };
    const typeStr = String(type);

    const [toEmailList, mailResult, template] = await Promise.all([
      this.userRepo.listToEmail(type, year, periodIndex, companyGroupCode, departmentId),
      (async () => {
        if (type === EmailType.USER_GOAL_SETTING_PERIOD) {
          return this.mailService.getMailNotificateGoalSetting(year, periodIndex, companyGroupCode);
        } else if (type === EmailType.USER_EVALUATION_PERIOD) {
          return this.mailService.getMailNotificateEvaluation(year, periodIndex, companyGroupCode);
        } else if (type === EmailType.EXCEPTION_GOAL_SETTING_PERIOD) {
          return this.mailService.getMailNotificateGoalSettingException(year, periodIndex, companyGroupCode);
        } else if (type === EmailType.EXCEPTION_EVALUATION_PERIOD) {
          return this.mailService.getMailNotificateEvaluationException(year, periodIndex, companyGroupCode);
        } else if (typeStr === String(TemplateMailId.DEPT_GOAL_NOTIFICATION)) {
          const tpl = await this.mailService.getRawMailTemplate(TemplateMailId.DEPT_GOAL_NOTIFICATION, companyGroupCode);
          return { content: tpl?.content ?? '', title: tpl?.subject ?? '' };
        } else if (typeStr === String(TemplateMailId.DEPT_EVAL_NOTIFICATION)) {
          const tpl = await this.mailService.getRawMailTemplate(TemplateMailId.DEPT_EVAL_NOTIFICATION, companyGroupCode);
          return { content: tpl?.content ?? '', title: tpl?.subject ?? '' };
        } else if (typeStr === String(TemplateMailId.TARGET_GOAL_NOTIFICATION)) {
          const tpl = await this.mailService.getRawMailTemplate(TemplateMailId.TARGET_GOAL_NOTIFICATION, companyGroupCode);
          return { content: tpl?.content ?? '', title: tpl?.subject ?? '' };
        } else if (typeStr === String(TemplateMailId.TARGET_EVAL_NOTIFICATION)) {
          const tpl = await this.mailService.getRawMailTemplate(TemplateMailId.TARGET_EVAL_NOTIFICATION, companyGroupCode);
          return { content: tpl?.content ?? '', title: tpl?.subject ?? '' };
        }
        return { content: ``, title: `` };
      })(),
      (async () => {
        const templateId = EMAIL_TYPE_TO_TEMPLATE_ID[typeStr];
        if (!templateId) return null;
        return this.mailService.getRawMailTemplate(templateId, companyGroupCode);
      })(),
    ]);

    return {
      toEmailList,
      content: mailResult.content,
      title: mailResult.title,
      template,
    };
  }

  async getToEmailListFixed(
    type: EmailTypeFixed,
    periodId: string,
    companyGroupCode: string,
    evaluationId?: number,
  ) {
    let mailResult = { content: ``, title: `` };
    const period = await this.evaluationPeriodRepo.findOnePeriod({
      id: periodId,
    });
    switch (type) {
      case EmailTypeFixed.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME:
        mailResult =
          await this.mailService.getMailNotiGoalFixedUserAndEvaluatorWOTime(
            period,
            companyGroupCode,
          );
        break;
      case EmailTypeFixed.GOAL_EVALUATOR_WITHOUT_TIME:
        mailResult = await this.mailService.getMailNotiGoalFixedEvaluatorWOTime(
          period,
          companyGroupCode,
          evaluationId,
        );
        break;
      case EmailTypeFixed.GOAL_USER_AND_EVALUATOR:
        mailResult =
          await this.mailService.getMailNotiGoalFixedUserAndEvaluator(
            period,
            companyGroupCode,
          );
        break;
      case EmailTypeFixed.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME:
        mailResult =
          await this.mailService.getMailNotiEvalFixedUserAndEvaluatorWOTime(
            period,
            companyGroupCode,
          );
        break;
      case EmailTypeFixed.EVAL_EVALUATOR_WITHOUT_TIME:
        mailResult = await this.mailService.getMailNotiEvalFixedEvaluatorWOTime(
          period,
          companyGroupCode,
          evaluationId,
        );
        break;
      case EmailTypeFixed.EVAL_USER_AND_EVALUATOR:
        mailResult =
          await this.mailService.getMailNotiEvalFixedUserAndEvaluator(
            period,
            companyGroupCode,
          );
        break;
    }

    return {
      content: mailResult.content,
      title: mailResult.title,
    };
  }

  async checkStatusRecordSend(rowData: any, type: EmailTypeFixed) {
    const idValids = [];
    const listEvaluations = await this.approvalRepository.getEvaluationByListId(
      rowData.id,
    );
    listEvaluations.forEach((evaluation) => {
      if (
        (type === EmailTypeFixed.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME &&
          [0, 1, 2].includes(evaluation.status)) || //
        ((type === EmailTypeFixed.GOAL_EVALUATOR_WITHOUT_TIME ||
          type === EmailTypeFixed.GOAL_EVALUATOR_WITHOUT_TIME_STATUS) &&
          [3, 4, 5, 6, 7, 8].includes(evaluation.status)) ||
        (type === EmailTypeFixed.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME &&
          [50, 51, 52].includes(evaluation.status)) ||
        ((type === EmailTypeFixed.EVAL_EVALUATOR_WITHOUT_TIME ||
          type === EmailTypeFixed.EVAL_EVALUATOR_WITHOUT_TIME_STATUS) &&
          [53, 54, 55, 56, 57, 58, 59, 60, 61].includes(evaluation.status))
      ) {
        idValids.push(Number(evaluation.id));
      }
    });

    // for (const id of rowData?.id) {
    //   const evaluation = await this.approvalRepository.getEvaluationById(id);
    //   if (evaluation) {
    //     if (
    //       (type === EmailTypeFixed.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME &&
    //         [0, 1, 2].includes(evaluation.status)) || //
    //       (type === EmailTypeFixed.GOAL_EVALUATOR_WITHOUT_TIME &&
    //         [3, 4, 5, 6, 7, 8].includes(evaluation.status)) ||
    //       (type === EmailTypeFixed.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME &&
    //         [50, 51, 52].includes(evaluation.status)) ||
    //       (type === EmailTypeFixed.EVAL_EVALUATOR_WITHOUT_TIME &&
    //         [53, 54, 55, 56, 57, 58, 59, 60, 61].includes(evaluation.status))
    //     ) {
    //       idValids.push(Number(id));
    //     }
    //   }
    // }

    return {
      result: idValids,
    };
  }

  async checkImportUser(query: any, companyGroupCode: string) {
    const results = await this.userRepo.checkImportUser(
      query,
      companyGroupCode,
    );
    return results;
  }

  async importUserProcedue(
    query: any,
    companyGroupCode: string,
    timeZone: string,
  ) {
    await this.proSkillRepository.insertHistoryPublicProSkill(
      query.year,
      query.periodIndex,
      companyGroupCode,
    );

    await this.userRepo.importUserProcedure(
      query.year,
      query.periodIndex,
      null,
      1,
      companyGroupCode,
      timeZone,
    );

    // Override 全社設定 dates with department-specific settings where applicable.
    const period = await this.evaluationPeriodRepo.findOnePeriod({
      year: query.year,
      periodIndex: query.periodIndex,
      companyGroupCode,
    });
    if (period?.id) {
      await this.periodDeptSettingRepo.applyAllDeptDatesToEvaluations(
        period.id,
        companyGroupCode,
      );
    }

    return true;
  }

  // async importUser(query: any) {
  //   const year = query.year;
  //   const periodIndex = query.periodIndex;
  //   const dataEvaluationPeroid = await this.userRepo.getEvaluationPeriodByYear(
  //     year,
  //     periodIndex,
  //   );

  //   // const yearsPeriod = moment();
  //   // const periods = await this.evaluationPeriodRepo.getAll({
  //   //   year: yearsPeriod.format('YYYY'),
  //   // });

  //   if (dataEvaluationPeroid?.id) {
  //     /** lấy list user có quyền F1 */
  //     const listUser = await this.userRepo.getListUserRoleF1();

  //     const userImportList = [];
  //     const userCheckList = [];

  //     listUser.map((item: any) => {
  //       userImportList.push({
  //         userId: item.id,
  //         evaluationPeriodId: dataEvaluationPeroid?.id,
  //         level: item.level,
  //         departmentName: item.department?.name,
  //         departmentId: item.department ? item.department.id : null,
  //         divisionName: item.division?.name,
  //         divisionId: item.division ? item.division.id : null,
  //         flagSkill: item.flagSkill,
  //       });
  //       userCheckList.push(item.id);
  //     });

  //     let listSkillUsers = [];
  //     for (let i = 0; i < listUser.length; i++) {
  //       const item = listUser[i];

  //       if (item.flagSkill === 1) {
  //         const listDepDivId = [];
  //         const userId = item.id;
  //         const departmentId = item.departmentId;
  //         const divisionId = item.divisionId;
  //         if (departmentId) listDepDivId.push(departmentId);
  //         if (divisionId) listDepDivId.push(divisionId);

  //         const listSkills = await this.userRepo.getListSkillByDepDivId(
  //           listDepDivId,
  //         );

  //         if (listSkills.length > 0) {
  //           for (let i = 0; i < listSkills.length; i++) {
  //             const element = listSkills[i];

  //             listSkillUsers.push({
  //               userId: userId,
  //               skillId: element.skillId,
  //               periodId: dataEvaluationPeroid?.id,
  //               evaluationId: null,
  //               type: 0,
  //             });
  //           }
  //         }
  //       }
  //     }

  //     const checkUserImport = await this.userRepo.countUserBeforeImport(
  //       userCheckList,
  //       dataEvaluationPeroid?.id,
  //     );

  //     if (checkUserImport > 0) {
  //       throw new RuntimeException('Have user already import', 409);
  //     } else {
  //       /** Thêm user trong bảng evaluator_default */
  //       await this.userRepo.importUser(userImportList);

  //       /** Thêm skill user trong bảng skill_user_tbl */
  //       await this.userRepo.importSkillUser(listSkillUsers);

  //       /** Trường hợp chưa đến ngày đặt mục tiêu thì ko tạo record cho user trong bảng evaluation,
  //        * chỉ trường hợp ngày hiện tại nằm trong khoảng thời gian đặt mục tiêu thì mới tạo record cho user trong bảng evaluation */

  //       /* Lấy thông tin user */

  //       /** 1. list user đã tạo evaluation */
  //       const listUser =
  //         await this.userRepo.getListUserEvaluationByEvaluationPeriodId(
  //           userCheckList,
  //           dataEvaluationPeroid?.id,
  //         );
  //       const temListUsers = [];
  //       listUser.map((item: any) => {
  //         temListUsers.push(item.userId);
  //       });

  //       /** 2. list user chưa dc tạo evaluation */
  //       const userNotCreateEvaluationList = userCheckList.filter(
  //         (val) => !temListUsers.includes(val),
  //       );

  //       const listUserInfor = await this.userRepo.getListUserInforByListId(
  //         userNotCreateEvaluationList,
  //       );
  //       /** end */

  //       /** set title cho các evaluation*/
  //       const titleEvaluation =
  //         dataEvaluationPeroid.periodIndex === 1
  //           ? dataEvaluationPeroid.year + '年上期'
  //           : dataEvaluationPeroid.year + '年下期';

  //       /** tao record evaluation cho user 1-7 */
  //       // for (let index = 0; index < periods.length; index++) {
  //       if (
  //         compareDatePeriod(
  //           dataEvaluationPeroid.dateCreationGoalStart,
  //           dataEvaluationPeroid.dateCreationGoalEnd,
  //         )
  //       ) {
  //         listUserInfor.map(async (item: any) => {
  //           if (item.level >= 1 && item.level <= 7) {
  //             await this.createEvaluation17(
  //               dataEvaluationPeroid?.id,
  //               titleEvaluation,
  //               item.id,
  //             );
  //           }
  //         });
  //       }
  //       // }
  //       /** end */

  //       /** tao record evaluation cho user 8-10 */
  //       // for (let index = 0; index < periods.length; index++) {
  //       if (
  //         compareDatePeriod(
  //           dataEvaluationPeroid.dateCreationGoalDepartmentStart,
  //           dataEvaluationPeroid.dateCreationGoalDepartmentEnd,
  //         )
  //       ) {
  //         listUserInfor.map(async (item: any) => {
  //           if (item.level > 7) {
  //             await this.createEvaluation810(
  //               dataEvaluationPeroid?.id,
  //               titleEvaluation,
  //               item.id,
  //             );
  //           }
  //         });
  //       }
  //       // }
  //       /** end */
  //     }
  //   }
  //   return true;
  // }

  async findListUserToSettingEvaluation(query: any) {
    const results = await this.userRepo.findListUserToSettingEvaluation(query);
    return results;
  }

  async addUserSettingEvaluationProcedure(
    query: any,
    companyGroupCode: string,
    timeZone: string,
    userId?: number,
  ) {
    // Fetch period first so we can gate on checkFixed before doing any writes.
    const period = await this.evaluationPeriodRepo.findOnePeriod({
      year: query.state.year,
      periodIndex: query.state.periodIndex,
      companyGroupCode,
    });

    if (period?.checkFixed === 2) {
      throw new RuntimeException(
        'Evaluation period is fixed',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    await this.userRepo.importUserProcedure(
      query.state.year,
      query.state.periodIndex,
      query.selectedRowKeys,
      0,
      companyGroupCode,
      timeZone,
    );
    if (period?.id) {
      // Step 1: Sync division_id / department_id / names from evaluator_default_tbl.
      // import_user may leave division_id NULL; without this, applyAllDeptDatesToEvaluations
      // cannot match division-level settings via et.division_id.
      await this.periodDeptSettingRepo.syncEvaluationOrgFromDefault(
        period.id,
        companyGroupCode,
        query.selectedRowKeys,
      );

      // Step 2: Apply dept-setting dates to non-personal evaluations within the goal period.
      await this.periodDeptSettingRepo.applyAllDeptDatesToEvaluations(
        period.id,
        companyGroupCode,
      );

      // Step 3 (部署別 tab only): Override names to reflect the configured setting hierarchy.
      await this.periodDeptSettingRepo.updateEvaluationNamesFromSettings(
        period.id,
        companyGroupCode,
        query.selectedRowKeys,
      );

      // When adding from 個人別 tab, mark the evaluation records as individual exceptions.
      if (query.tabMode === 'personal' && userId) {
        await this.userRepo.markEvaluationsAsPersonal(
          query.selectedRowKeys,
          period.id,
          userId,
          companyGroupCode,
        );
      }
    }

    return true;
  }

  // async addUserSettingEvaluation(query: any) {
  //   const year = query.state.year;
  //   const periodIndex = query.state.periodIndex;
  //   const listUserSelected = query.selectedRowKeys;
  //   const dataEvaluationPeroid = await this.userRepo.getEvaluationPeriodByYear(
  //     year,
  //     periodIndex,
  //   );

  //   // const yearsPeriod = moment();
  //   // const periods = await this.evaluationPeriodRepo.getAll({
  //   //   year: yearsPeriod.format('YYYY'),
  //   // });

  //   if (dataEvaluationPeroid?.id) {
  //     const checkUserAdded = await this.userRepo.checkUserAdded(
  //       listUserSelected,
  //       dataEvaluationPeroid?.id,
  //     );
  //     if (checkUserAdded > 0) {
  //       throw new RuntimeException('Have user already added', 409);
  //     } else {
  //       const listUserImports = [];
  //       const listUserIdAddSkill = [];
  //       /** Trường hợp chưa đến ngày đặt mục tiêu thì ko tạo record cho user trong bảng evaluation,
  //        * chỉ trường hợp ngày hiện tại nằm trong khoảng thời gian đặt mục tiêu thì mới tạo record cho user trong bảng evaluation */

  //       /* Lấy thông tin user */

  //       /** 1. list user đã tạo evaluation */
  //       const listUser =
  //         await this.userRepo.getListUserEvaluationByEvaluationPeriodId(
  //           listUserSelected,
  //           dataEvaluationPeroid?.id,
  //         );
  //       const temListUsers = [];
  //       listUser.map((item: any) => {
  //         temListUsers.push(item.userId);
  //       });

  //       /** 2. list user chưa dc tạo evaluation */
  //       const listUserNotCreateEvaluation = listUserSelected.filter(
  //         (val) => !temListUsers.includes(val),
  //       );

  //       for (const item of listUserNotCreateEvaluation) {
  //         const userInfo = await this.userRepo.getUserDetailById(item);
  //         listUserImports.push({
  //           userId: item,
  //           evaluationPeriodId: dataEvaluationPeroid?.id,
  //           departmentName: userInfo.department.name,
  //           departmentId: userInfo.department ? userInfo.department.id : null,
  //           divisionName: userInfo.division.name,
  //           divisionId: userInfo.division ? userInfo.division.id : null,
  //           level: userInfo.level,
  //           flagSkill: userInfo.flagSkill,
  //         });
  //         listUserIdAddSkill.push(item);
  //       }

  //       /** 2. list user đã có tạo evaluation để import lại vào bảng evaluator_default */
  //       const listUserCreateEvaluation = listUserSelected.filter(
  //         (val) => !listUserNotCreateEvaluation.includes(val),
  //       );

  //       /** Lấy lại thông tin evaluator để import lại vào bảng evaluator_default */
  //       for (let i = 0; i < listUserCreateEvaluation.length; i++) {
  //         // eslint-disable-next-line no-await-in-loop
  //         const maxEvaluationId = await this.userRepo.findMaxIdEvaluation(
  //           listUserCreateEvaluation[i],
  //           dataEvaluationPeroid?.id,
  //         );

  //         if (maxEvaluationId) {
  //           const evaluator05 =
  //             // eslint-disable-next-line no-await-in-loop
  //             await this.userRepo.getEvaluatorByEvaluationIdAndOrder(
  //               maxEvaluationId,
  //               0.5,
  //             );
  //           const evaluator1 =
  //             // eslint-disable-next-line no-await-in-loop
  //             await this.userRepo.getEvaluatorByEvaluationIdAndOrder(
  //               maxEvaluationId,
  //               1.0,
  //             );
  //           const evaluator2 =
  //             // eslint-disable-next-line no-await-in-loop
  //             await this.userRepo.getEvaluatorByEvaluationIdAndOrder(
  //               maxEvaluationId,
  //               2.0,
  //             );

  //           const evaluationInfo =
  //             await await this.evaluatorRepo.getEvaluationById(maxEvaluationId);

  //           listUserImports.push({
  //             userId: listUserCreateEvaluation[i],
  //             evaluationPeriodId: dataEvaluationPeroid?.id,
  //             evaluator05Id:
  //               evaluator05 === null ? null : evaluator05.evaluatorId,
  //             evaluator1Id: evaluator1 === null ? null : evaluator1.evaluatorId,
  //             evaluator2Id: evaluator2 === null ? null : evaluator2.evaluatorId,
  //             departmentName: evaluationInfo.departmentName,
  //             departmentId: evaluationInfo.departmentId,
  //             divisionName: evaluationInfo.divisionName,
  //             divisionId: evaluationInfo.divisionId,
  //             level: evaluationInfo.level,
  //             flagSkill: evaluationInfo.flagSkill,
  //           });

  //           listUserIdAddSkill.push(listUserCreateEvaluation[i]);
  //         }
  //       }
  //       // end

  //       /** Thêm user trong bảng evaluator_default */
  //       await this.userRepo.createUserEvaluatorDefault(listUserImports);
  //       /** end */

  //       //**Xử lý thêm skill user cho từng user */
  //       const listUserSkillInfo = await this.userRepo.getListUserInforByListId(
  //         listUserIdAddSkill,
  //       );
  //       let listSkillUsers = [];
  //       for (let i = 0; i < listUserSkillInfo.length; i++) {
  //         const item = listUserSkillInfo[i];

  //         if (item?.flagSkill === 1) {
  //           const listDepDivId = [];
  //           const userId = item.id;
  //           const departmentId = item.departmentId;
  //           const divisionId = item.divisionId;
  //           if (departmentId) listDepDivId.push(departmentId);
  //           if (divisionId) listDepDivId.push(divisionId);

  //           const listSkills = await this.userRepo.getListSkillByDepDivId(
  //             listDepDivId,
  //           );

  //           if (listSkills.length > 0) {
  //             for (let i = 0; i < listSkills.length; i++) {
  //               const element = listSkills[i];

  //               listSkillUsers.push({
  //                 userId: userId,
  //                 skillId: element.skillId,
  //                 periodId: dataEvaluationPeroid?.id,
  //                 evaluationId: null,
  //                 type: 0,
  //               });
  //             }
  //           }
  //         }
  //       }
  //       //** Thêm skill user trong bảng skill_user_tbl */
  //       await this.userRepo.importSkillUser(listSkillUsers);

  //       //** end */

  //       const listUserInfor = await this.userRepo.getListUserInforByListId(
  //         listUserNotCreateEvaluation,
  //       );

  //       /** set title cho các evaluation*/
  //       const titleEvaluation =
  //         dataEvaluationPeroid.periodIndex === 1
  //           ? dataEvaluationPeroid.year + '年上期'
  //           : dataEvaluationPeroid.year + '年下期';

  //       /** tao record evaluation cho user 1-7 */
  //       // for (let index = 0; index < periods.length; index++) {
  //       if (
  //         compareDatePeriod(
  //           dataEvaluationPeroid.dateCreationGoalStart,
  //           dataEvaluationPeroid.dateCreationGoalEnd,
  //         )
  //       ) {
  //         listUserInfor.map(async (item: any) => {
  //           if (item.level >= 1 && item.level <= 7) {
  //             await this.createEvaluation17(
  //               dataEvaluationPeroid?.id,
  //               titleEvaluation,
  //               item.id,
  //             );
  //           }
  //         });
  //       }
  //       // }
  //       /** end */

  //       /** tao record evaluation cho user 8-10 */
  //       // for (let index = 0; index < periods.length; index++) {
  //       if (
  //         compareDatePeriod(
  //           dataEvaluationPeroid.dateCreationGoalDepartmentStart,
  //           dataEvaluationPeroid.dateCreationGoalDepartmentEnd,
  //         )
  //       ) {
  //         listUserInfor.map(async (item: any) => {
  //           if (item.level > 7) {
  //             await this.createEvaluation810(
  //               dataEvaluationPeroid?.id,
  //               titleEvaluation,
  //               item.id,
  //             );
  //           }
  //         });
  //       }
  //       // }
  //       /** end */
  //     }
  //   }

  //   return true;
  // }

  async deleteUserSettingEvaluator(params: any, companyGroupCode: string) {
    const period = await this.evaluationPeriodRepo.findOnePeriod({
      year: params.state?.year,
      periodIndex: params.state?.periodIndex,
      companyGroupCode,
    });

    if (period?.checkFixed === 2) {
      throw new RuntimeException(
        'Evaluation period is fixed',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    return await this.userRepo.deleteUserSettingEvaluator(
      params,
      companyGroupCode,
    );
  }

  async checkIsFixed(query: any, companyGroupCode: string) {
    const results = await this.userRepo.checkIsFixed(query, companyGroupCode);
    return results;
  }

  // async createEvaluation810(
  //   evaluationPeriodId: number,
  //   title: string,
  //   userId: number,
  // ) {
  //   const periodId = await this.evaluationPeriodRepo.findOnePeriod({
  //     [Op.and]: [{ id: evaluationPeriodId }],
  //   });

  //   if (periodId) {
  //     // get verion setting
  //     // User có flag skill type = 2 , không có flag skill type = 4
  //     const versionSetting = (
  //       await this.versionSettingRepository.listPointSettingCron()
  //     ).reduce((acc, curr) => {
  //       acc[curr.type] = curr;
  //       return acc;
  //     }, {});
  //     // version guide
  //     const guideSkill = await this.guideEvaluationRepository.findOneGuide({
  //       status: 4,
  //       type: 2,
  //     });
  //     const guideNoSkill = await this.guideEvaluationRepository.findOneGuide({
  //       status: 4,
  //       type: 4,
  //     });

  //     const userInfor = await this.userRepo.getUserInforById(userId);
  //     let data: {
  //       title: string;
  //       userId: any;
  //       departmentName: string;
  //       divisionName: string;
  //       departmentId: any;
  //       divisionId: any;
  //       companyName: any;
  //       periodStart: string;
  //       periodEnd: string;
  //       status: number;
  //       level: any;
  //       evaluationPeriodId: number;
  //       guideVersionId: number;
  //       creationUser: any;
  //       skillPercent: number;
  //       achievementPercent: number;
  //       behaviorPercent: number;
  //       createdByCronjob: number;
  //       flagSkill: number;
  //     };

  //     if (Object.keys(versionSetting).length > 0) {
  //       const levelSetting =
  //         // eslint-disable-next-line no-await-in-loop
  //         await this.versionSettingRepository.findOneSetting({
  //           versionId: versionSetting[userInfor?.flagSkill === 1 ? 2 : 4].id,
  //           level: userInfor.level,
  //         });

  //       data = {
  //         title: title,
  //         userId: userInfor.id,
  //         departmentName: userInfor.department
  //           ? `${userInfor.department.name}`
  //           : null,
  //         divisionName: userInfor?.division
  //           ? `${userInfor?.division.name}`
  //           : null,
  //         departmentId: userInfor.department ? userInfor.department.id : null,
  //         divisionId: userInfor.division ? userInfor?.division.id : null,
  //         companyName: userInfor.company.name,
  //         periodStart: periodId.periodStart,
  //         periodEnd: periodId.periodEnd,
  //         status: 0,
  //         level: userInfor.level,
  //         evaluationPeriodId: periodId.id,
  //         guideVersionId:
  //           userInfor?.flagSkill === 1 ? guideSkill.id : guideNoSkill.id,
  //         creationUser: null,
  //         skillPercent:
  //           userInfor?.flagSkill === 1
  //             ? levelSetting?.skillPercent || null
  //             : null,
  //         achievementPercent: levelSetting?.achievementPercent || null,
  //         behaviorPercent: levelSetting?.behaviorPercent || null,
  //         createdByCronjob: 1,
  //         flagSkill: userInfor?.flagSkill,
  //       };
  //     } else {
  //       data = {
  //         title: title,
  //         userId: userInfor.id,
  //         departmentName: userInfor.department
  //           ? `${userInfor.department.name}`
  //           : null,
  //         divisionName: userInfor?.division.name,
  //         departmentId: userInfor.department ? userInfor.department.id : null,
  //         divisionId: userInfor?.division ? userInfor?.division.id : null,
  //         companyName: userInfor.company.name,
  //         periodStart: periodId.periodStart,
  //         periodEnd: periodId.periodEnd,
  //         status: 0,
  //         level: userInfor.level,
  //         evaluationPeriodId: periodId.id,
  //         guideVersionId:
  //           userInfor?.flagSkill === 1 ? guideSkill.id : guideNoSkill.id,
  //         creationUser: null,
  //         skillPercent: null,
  //         achievementPercent: null,
  //         behaviorPercent: null,
  //         createdByCronjob: 1,
  //         flagSkill: userInfor?.flagSkill,
  //       };
  //     }
  //     const result = await this.evaluationRepository.createEvaluation810(data);
  //     //** xử lý trong truong hợp add mới ở popup add */
  //     if (result[0]) {
  //       if (userInfor?.flagSkill === 1) {
  //         const userId = result[0].dataValues.userId;
  //         const evaluationId = result[0].dataValues.id;
  //         const periodId = result[0].dataValues.evaluationPeriodId;

  //         const listDepDivId = [];
  //         let listSkillUsers = [];
  //         const departmentId = userInfor.departmentId;
  //         const divisionId = userInfor.divisionId;
  //         if (departmentId) listDepDivId.push(departmentId);
  //         if (divisionId) listDepDivId.push(divisionId);

  //         const listSkills = await this.userRepo.getListSkillByDepDivId(
  //           listDepDivId,
  //         );

  //         if (listSkills.length > 0) {
  //           for (let i = 0; i < listSkills.length; i++) {
  //             const element = listSkills[i];

  //             listSkillUsers.push({
  //               userId: userId,
  //               skillId: element.skillId,
  //               periodId: periodId,
  //               evaluationId: evaluationId,
  //               type: 0,
  //             });
  //           }
  //         }

  //         await this.userRepo.importSkillUser(listSkillUsers);
  //       }
  //     }
  //   }

  //   return true;
  // }

  // async createEvaluation17(
  //   evaluationPeriodId: number,
  //   title: string,
  //   userId: number,
  // ) {
  //   const periodId = await this.evaluationPeriodRepo.findOnePeriod({
  //     [Op.and]: [{ id: evaluationPeriodId }],
  //   });

  //   if (periodId) {
  //     try {
  //       // get verion setting
  //       // User có flag skill type = 1 , không có flag skill type =3
  //       const versionSetting = (
  //         await this.versionSettingRepository.listPointSettingCron()
  //       ).reduce((acc, curr) => {
  //         acc[curr.type] = curr;
  //         return acc;
  //       }, {});
  //       // version guide
  //       const guideSkill = await this.guideEvaluationRepository.findOneGuide({
  //         status: 4,
  //         type: 1,
  //       });
  //       const guideNoSkill = await this.guideEvaluationRepository.findOneGuide({
  //         status: 4,
  //         type: 3,
  //       });

  //       const userInfor = await this.userRepo.getUserInforById(userId);
  //       let data: {
  //         title: string;
  //         userId: any;
  //         departmentName: string;
  //         divisionName: string;
  //         departmentId: any;
  //         divisionId: any;
  //         companyName: any;
  //         periodStart: string;
  //         periodEnd: string;
  //         status: number;
  //         level: any;
  //         evaluationPeriodId: number;
  //         guideVersionId: number;
  //         creationUser: any;
  //         skillPercent: number;
  //         achievementPercent: number;
  //         behaviorPercent: number;
  //         createdByCronjob: number;
  //         flagSkill: number;
  //       };

  //       if (Object.keys(versionSetting).length > 0) {
  //         const levelSetting =
  //           // eslint-disable-next-line no-await-in-loop
  //           await this.versionSettingRepository.findOneSetting({
  //             versionId: versionSetting[userInfor?.flagSkill === 1 ? 1 : 3].id,
  //             level: userInfor.level,
  //           });

  //         data = {
  //           title: title,
  //           userId: userInfor.id,
  //           departmentName: userInfor.department
  //             ? `${userInfor.department.name}`
  //             : null,
  //           divisionName: userInfor?.division
  //             ? `${userInfor?.division.name}`
  //             : null,
  //           departmentId: userInfor.department ? userInfor.department.id : null,
  //           divisionId: userInfor.division ? userInfor?.division.id : null,
  //           companyName: userInfor.company.name,
  //           periodStart: periodId.periodStart,
  //           periodEnd: periodId.periodEnd,
  //           status: 0,
  //           level: userInfor.level,
  //           evaluationPeriodId: periodId.id,
  //           guideVersionId:
  //             userInfor?.flagSkill === 1 ? guideSkill.id : guideNoSkill.id,
  //           creationUser: null,
  //           skillPercent:
  //             userInfor?.flagSkill === 1
  //               ? levelSetting?.skillPercent || null
  //               : null,
  //           achievementPercent: levelSetting?.achievementPercent || null,
  //           behaviorPercent: levelSetting?.behaviorPercent || null,
  //           createdByCronjob: 1,
  //           flagSkill: userInfor?.flagSkill,
  //         };
  //       } else {
  //         data = {
  //           title: title,
  //           userId: userInfor.id,
  //           departmentName: userInfor.department
  //             ? `${userInfor.department.name}`
  //             : null,
  //           divisionName: userInfor?.division.name,
  //           departmentId: userInfor.department ? userInfor.department.id : null,
  //           divisionId: userInfor?.division ? userInfor?.division.id : null,
  //           companyName: userInfor.company.name,
  //           periodStart: periodId.periodStart,
  //           periodEnd: periodId.periodEnd,
  //           status: 0,
  //           level: userInfor.level,
  //           evaluationPeriodId: periodId.id,
  //           guideVersionId:
  //             userInfor?.flagSkill === 1 ? guideSkill.id : guideNoSkill.id,
  //           creationUser: null,
  //           skillPercent: null,
  //           achievementPercent: null,
  //           behaviorPercent: null,
  //           createdByCronjob: 1,
  //           flagSkill: userInfor?.flagSkill,
  //         };
  //       }

  //       const result = await this.evaluationRepository.createEvaluation17(data);

  //       if (result[0]) {
  //         if (userInfor?.flagSkill === 1) {
  //           const userId = result[0].dataValues.userId;
  //           const evaluationId = result[0].dataValues.id;
  //           const periodId = result[0].dataValues.evaluationPeriodId;

  //           const listDepDivId = [];
  //           let listSkillUsers = [];
  //           const departmentId = userInfor.departmentId;
  //           const divisionId = userInfor.divisionId;
  //           if (departmentId) listDepDivId.push(departmentId);
  //           if (divisionId) listDepDivId.push(divisionId);

  //           const listSkills = await this.userRepo.getListSkillByDepDivId(
  //             listDepDivId,
  //           );

  //           if (listSkills.length > 0) {
  //             for (let i = 0; i < listSkills.length; i++) {
  //               const element = listSkills[i];

  //               listSkillUsers.push({
  //                 userId: userId,
  //                 skillId: element.skillId,
  //                 periodId: periodId,
  //                 evaluationId: evaluationId,
  //                 type: 0,
  //               });
  //             }
  //           }

  //           await this.userRepo.importSkillUser(listSkillUsers);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   return true;
  // }
  async getUsersEmailList(conditions: string, companyGroupCode: string) {
    return await this.userRepo.usersMailList(conditions, companyGroupCode);
  }

  async importUserFromExcel(body: any) {
    // this.logger.log(null, '*** Start import user from file excel ***' + '\n');

    const year = body.state.year;
    const periodIndex = body.state.periodIndex;
    const listUser = body.itemsExcel;
    const listUserCanotImport = [];
    const listEvaluatorCannotImport = [];
    const dataEvaluationPeroid = await this.userRepo.getEvaluationPeriodByYear(
      year,
      periodIndex,
    );

    if (dataEvaluationPeroid?.id) {
      for (let i = 0; i < listUser.length; i++) {
        const element = listUser[i];
        const user = await this.userRepo.getUserInfoByFullname(
          element?.fullName,
        );

        if (user) {
          // this.logger.log(
          //   null,
          //   '\n' +
          //     `Position: ${i} - User added with id  ${JSON.stringify(user)}` +
          //     '\n' +
          //     `User information  ${JSON.stringify(element)}` +
          //     '\n' +
          //     '**********',
          // );

          /** get evaluator information 0.5 */
          const evaluator05 = await this.userRepo.getUserInfoByFullname(
            element?.evaluator05,
          );
          if (
            element?.evaluator05 !== '-' &&
            (evaluator05 === null || evaluator05 === undefined)
          ) {
            // this.logger.error(
            //   null,
            //   '\n' +
            //     `Position: ${i} - Evaluator 0.5: ${element?.evaluator05} can not setting evaluator for user below` +
            //     '\n' +
            //     `User information   ${JSON.stringify(element)}` +
            //     '\n' +
            //     'Please check again' +
            //     '\n' +
            //     '**********',
            // );
            listEvaluatorCannotImport.push(element);
          }

          /** get evaluator information 1.0 */
          const evaluator10 = await this.userRepo.getUserInfoByFullname(
            element?.evaluator10,
          );
          if (
            element?.evaluator10 !== '-' &&
            (evaluator10 === null || evaluator10 === undefined)
          ) {
            // this.logger.error(
            //   null,
            //   '\n' +
            //     `Position: ${i} - Evaluator 1.0: ${element?.evaluator10} can not setting evaluator for user below` +
            //     '\n' +
            //     `User information   ${JSON.stringify(element)}` +
            //     '\n' +
            //     'Please check again' +
            //     '\n' +
            //     '**********',
            // );
            listEvaluatorCannotImport.push(element);
          }

          /** get evaluator information 2.0 */
          const evaluator20 = await this.userRepo.getUserInfoByFullname(
            element?.evaluator20,
          );
          if (
            element?.evaluator20 !== '-' &&
            (evaluator20 === null || evaluator20 === undefined)
          ) {
            // this.logger.error(
            //   null,
            //   '\n' +
            //     `Position: ${i} - Evaluator 2.0: ${element?.evaluator20} can not setting evaluator for user below` +
            //     '\n' +
            //     `User information   ${JSON.stringify(element)}` +
            //     '\n' +
            //     'Please check again' +
            //     '\n' +
            //     '**********',
            // );
            listEvaluatorCannotImport.push(element);
          }

          /** create data to import */
          const data = {
            userId: user?.id,
            evaluationPeriodId: dataEvaluationPeroid?.id,
            evaluator05Id:
              evaluator05 === null || evaluator05 === undefined
                ? null
                : evaluator05?.id,
            evaluator1Id:
              evaluator10 === null || evaluator10 === undefined
                ? null
                : evaluator10?.id,
            evaluator2Id:
              evaluator20 === null || evaluator20 === undefined
                ? null
                : evaluator20?.id,
          };

          /** import data */
          await this.userRepo.importUserFromExcel(data);
        } else {
          // this.logger.error(
          //   null,
          //   '\n' +
          //     `Position: ${i} - User information can not import from file excel  ${JSON.stringify(
          //       element,
          //     )}` +
          //     '\n' +
          //     'Please check again' +
          //     '\n' +
          //     '**********',
          // );
          listUserCanotImport.push(element);
        }
      }
    }
    const listEvaluatorCannotSetting = Object.values(
      listEvaluatorCannotImport.reduce(
        (acc, cur) => Object.assign(acc, { [cur.employeeNumber]: cur }),
        {},
      ),
    );

    // this.logger.log(
    //   null,
    //   '\n' +
    //     '*** End import user from file excel ***' +
    //     '\n' +
    //     `Total user import: ${listUser.length}`,
    // );
    return {
      listUserCanotImport: listUserCanotImport,
      listEvaluatorCannotSetting: listEvaluatorCannotSetting,
    };
  }

  handleReturnFlagSkillByLevel = (item: {
    flagSkill: number;
    level: number;
  }): string => {
    const { flagSkill, level } = item;
    if (level === null && flagSkill === null) {
      return '未設定';
    } else {
      if (level >= 8) {
        return '対象外';
      } else {
        if (flagSkill === 1) {
          return 'あり';
        } else if (flagSkill === 0) {
          return 'なし';
        } else {
          return '';
        }
      }
    }
  };

  async exportListUser(params: any) {
    const datas = await this.userRepo.getDataExportListUser2(params);
    const roleName = {
      1: '被評価者',
      2: '評価者',
      3: '専門スキル設定',
      4: '専門スキル承認',
      5: '評価／目標状況一覧',
      6: '評価設定',
      7: '評価／目標期間設定・状況管理',
      8: 'ユーザ管理',
    };

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();
    worksheet.columns = [
      { header: '社員番号', key: '社員番号' },
      { header: '氏名', key: '氏名' },
      { header: '会社', key: '会社' },
      { header: '部署名', key: '部署名' },
      { header: '課名', key: '課名' },
      { header: '等級', key: '等級' },
      { header: 'スキル評価', key: 'スキル評価' },
      { header: 'メール', key: 'メール' },
      { header: 'ロール', key: 'ロール' },
    ];
    for (let i = 1; i <= worksheet.columnCount; i++) {
      worksheet.getCell(1, i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff91d2ff' },
      };
    }

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getCell('A1').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.columns[0].width = 10;
    worksheet.columns[1].width = 20;
    worksheet.columns[2].width = 30;
    worksheet.columns[3].width = 30;
    worksheet.columns[4].width = 30;
    worksheet.columns[5].width = 10;
    worksheet.columns[6].width = 15;
    worksheet.columns[7].width = 30;
    worksheet.columns[8].width = 30;
    const createOuterBorder = (
      worksheet: any,
      start = { row: 1, col: 1 },
      end = { row: 1, col: 1 },
      borderWidth = 'thin',
    ) => {
      const borderStyle = {
        style: borderWidth,
      };
      for (let i = start.row; i <= end.row; i++) {
        for (let j = start.col; j <= end.col; j++) {
          const leftBorderCell = worksheet.getCell(i, j);
          leftBorderCell.border = {
            ...leftBorderCell.border,
            left: borderStyle,
            right: borderStyle,
            top: borderStyle,
            bottom: borderStyle,
          };
        }
      }
    };

    datas.data.forEach((item: any, _index: any) => {
      worksheet.addRow([
        item.employeeNumber,
        item.fullName,
        item.company === null ? '未設定' : item.company.name,
        item.division === null ? '未設定' : item.division.name,
        item.department === null ? '未設定' : item.department.name,
        item.level === null ? '未設定' : item.level,
        item.flagSkill ? 'あり' : 'なし',
        // this.handleReturnFlagSkillByLevel(item),
        item.email ? item.email : '',
        item.roles.length === 0
          ? '未設定'
          : item.roles
              .sort((a: any, b: any) => {
                if (a.id < b.id) {
                  return -1;
                }
                if (a.id > b.id) {
                  return 1;
                }

                return 0;
              })
              .map((i: any, index: any) => {
                return (
                  roleName[`${i.id}`] +
                  (index !== item.roles.length - 1 ? '\r\n' : '')
                );
              })
              .toString()
              .replaceAll(',', ''),
      ]);

      let rowIndex = 1;
      for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
        worksheet.getRow(rowIndex).alignment = {
          wrapText: true,
          vertical: 'middle',
        };
      }

      worksheet.getColumn(6).alignment = {
        wrapText: true,
        horizontal: 'center',
        vertical: 'middle',
      };
      worksheet.getColumn(7).alignment = {
        wrapText: true,
        horizontal: 'center',
        vertical: 'middle',
      };

      // bat dau dem tu 1, 9 la tong so cot
      // format header align -> center
      for (let i = 1; i <= 9; i++) {
        worksheet.getCell(1, i).alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
      }
    });
    createOuterBorder(
      worksheet,
      { row: 1, col: 1 },
      { row: worksheet.rowCount, col: worksheet.columnCount },
    );
    // Tạo file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
  async listTemplateCreationGoal(query: any, id: number) {
    return await this.userRepo.listTemplateCreationGoal(query, id);
  }

  async listUserTheSameInforWithEvaluator(query: any) {
    return await this.userRepo.listUserTheSameInforWithEvaluator(query);
  }

  async getAllSkill(companyGroupCode: string) {
    const results = await this.userRepo.getAllSkill(companyGroupCode);
    return results;
  }

  async getAllSkillPublic(companyGroupCode: string) {
    const results = await this.userRepo.getAllSkillPublic(companyGroupCode);
    return results;
  }

  async undoException(data: any, req: any) {
    const evaluationDetail = await this.evaluatorRepo.getEvaluationById(
      data.id,
    );

    if (
      new Date(data.updatedTime).getTime() !==
      new Date(evaluationDetail.updatedTime).getTime()
    )
      throw new RuntimeException('Evaluation is duplicate', 409);

    return await this.userRepo.undoException(data, req);
  }
}
