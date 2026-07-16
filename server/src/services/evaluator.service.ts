/* eslint-disable no-self-assign */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Evaluator } from 'src/entity/Evaluator';
import {
  EvaluatorSearchInterfaces,
  ReceiverOrderType,
  StatusRejectType,
  TypeApprovedStatus,
} from 'src/interfaces/evaluator.interfaces';
import { EvaluatorRepositoryI } from 'src/interfaces/repository/evaluator.repository.interfaces';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { EvaluatorRepository } from 'src/repository/evaluator.repository';
import { MailService } from './mail.service';
import { UserRepository } from 'src/repository/user.repository';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { isFormatDate } from 'src/common/util';
import { ReportService } from './report.service';
import { ExportHistoryEvaluationEvaluatorDto } from 'src/model/request/EvaluatorRequestDto';

@Injectable()
export class EvaluatorServices {
  @Inject(EvaluatorRepository)
  private evaluatorRepo: EvaluatorRepositoryI;

  @Inject(UserRepository)
  private userRepo: UserRepositoryI;

  @Inject(MailService)
  private mailService: MailService;

  @Inject(ReportService)
  private reportService: ReportService;

  // async searchListUserEvaluator(params: EvaluatorSearchInterfaces) {
  //   const evaluationEnds = await this.evaluatorRepo.listUserEvaluator(params);

  //   const counts = await this.evaluatorRepo.countListUserEvaluator(params); // count

  //   const arrays = [];
  //   const listIdUsers = [0];
  //   const arrayExceptions = [];
  //   for (let index = 0, len = evaluationEnds.length; index < len; index++) {
  //     listIdUsers.push(evaluationEnds[index].userId);
  //     // eslint-disable-next-line no-await-in-loop
  //     const finds = await this.evaluatorRepo.findEvaluatorByPeriod(
  //       evaluationEnds[index].userId,
  //       evaluationEnds[index].evaluationPeriodId,
  //     );
  //     if (finds.length > 0) {
  //       let isBool = false;
  //       if (finds.length > 1) {
  //         finds[0].evaluator.map((v) => {
  //           if (v.evaluatorId === params.evaluatorId) {
  //             isBool = true;
  //           }
  //         });
  //       }

  //       finds.map((v) => {
  //         v.evaluator.map((val) => {
  //           if (val.evaluatorId === params.evaluatorId) {
  //             arrays.push({
  //               userId: v.userId,
  //               title: v.title,
  //               fullName: v.user.fullName,
  //               employeeNumber: v.user.employeeNumber,
  //               level: v.level,
  //               departmentName: v.departmentName,
  //               divisionName: v.divisionName,
  //               evaluationOrder: val.evaluationOrder,
  //               evaluationId: val.evaluationId,
  //               status: v.status,
  //               summaryPointEvaluator2:
  //                 v.status === 100
  //                   ? v.level <= 7
  //                     ? v.summaryPointEvaluator2
  //                     : v.summaryDepartment?.summaryPointEvaluator2
  //                   : '',
  //               percentPoint: v.percentPoint,
  //               periodStart: v.periodStart,
  //               periodEnd: v.periodEnd,
  //               evaluatorId: val.evaluatorId,
  //               dateEvaluationStart: v.evaluationPeriod.dateEvaluationStart,
  //               dateEvaluationEnd: v.evaluationPeriod.dateEvaluationEnd,
  //               dateEvaluationDepartmentStart:
  //                 v.evaluationPeriod.dateEvaluationDepartmentStart,
  //               dateEvaluationDepartmentEnd:
  //                 v.evaluationPeriod.dateEvaluationDepartmentEnd,
  //               dateEvaluationStartEval: v.dateEvaluationStart,
  //               dateEvaluationEndEval: v.dateEvaluationEnd,
  //               isBool: false,
  //               creationUser: v.creationUser,
  //             });
  //           } else {
  //             // không phải là người đánh giá của evaluation này

  //             if (isBool) {
  //               arrayExceptions.push({
  //                 userId: v.userId,
  //                 title: v.title,
  //                 fullName: v.user.fullName,
  //                 employeeNumber: v.user.employeeNumber,
  //                 level: v.level,
  //                 departmentName: v.departmentName,
  //                 divisionName: v.divisionName,
  //                 evaluationOrder: 0,
  //                 evaluationId: v.id,
  //                 status: v.status,
  //                 summaryPointEvaluator2:
  //                   v.status === 100
  //                     ? v.level <= 7
  //                       ? v.summaryPointEvaluator2
  //                       : v.summaryDepartment?.summaryPointEvaluator2
  //                     : '',
  //                 percentPoint: v.percentPoint,
  //                 periodStart: v.periodStart,
  //                 periodEnd: v.periodEnd,
  //                 evaluatorId: val.evaluatorId,
  //                 dateEvaluationStart: v.evaluationPeriod.dateEvaluationStart,
  //                 dateEvaluationEnd: v.evaluationPeriod.dateEvaluationEnd,
  //                 dateEvaluationDepartmentStart:
  //                   v.evaluationPeriod.dateEvaluationDepartmentStart,
  //                 dateEvaluationDepartmentEnd:
  //                   v.evaluationPeriod.dateEvaluationDepartmentEnd,
  //                 dateEvaluationStartEval: v.dateEvaluationStart,
  //                 dateEvaluationEndEval: v.dateEvaluationEnd,
  //                 isBool: true,
  //                 creationUser: v.creationUser,
  //               });
  //             }
  //           }
  //         });
  //       });
  //     } else {
  //       finds[0].evaluator.map((v) => {
  //         if (v.evaluatorId === params.evaluatorId) {
  //           arrays.push({
  //             evaluationPeriodId: evaluationEnds[index].evaluationPeriodId,
  //             userId: evaluationEnds[index].userId,
  //             title: finds[0].title,
  //             fullName: finds[0].user.fullName,
  //             employeeNumber: finds[0].user.employeeNumber,
  //             departmentName: finds[0].departmentName,
  //             divisionName: finds[0].divisionName,
  //             evaluationOrder: v.evaluationOrder,
  //             level: finds[0].level,
  //             status: finds[0].status,
  //             summaryPointEvaluator2:
  //               finds[0].status === 100
  //                 ? finds[0].level <= 7
  //                   ? finds[0].summaryPointEvaluator2
  //                   : finds[0].summaryDepartment?.summaryPointEvaluator2
  //                 : '',
  //             percentPoint: finds[0].percentPoint,
  //             periodStart: finds[0].periodStart,
  //             periodEnd: finds[0].periodEnd,
  //             evaluationId: v.evaluationId,
  //             dateEvaluationStart:
  //               finds[0].evaluationPeriod.dateEvaluationStart,
  //             dateEvaluationEnd: finds[0].evaluationPeriod.dateEvaluationEnd,
  //             dateEvaluationDepartmentStart:
  //               finds[0].evaluationPeriod.dateEvaluationDepartmentStart,
  //             dateEvaluationDepartmentEnd:
  //               finds[0].evaluationPeriod.dateEvaluationDepartmentEnd,
  //             dateEvaluationStartEval: finds[0].dateEvaluationStart,
  //             dateEvaluationEndEval: finds[0].dateEvaluationEnd,
  //             isBool: false,
  //             creationUser: finds[0].creationUser,
  //           });
  //         }
  //       });
  //     }
  //   }

  //   const newsArrayEvaluations = [];
  //   for (let index = 0; index < arrayExceptions.length; index++) {
  //     const finds = arrays.find(
  //       (v) => v.evaluationId === arrayExceptions[index].evaluationId,
  //     );
  //     if (!finds) {
  //       newsArrayEvaluations.push(arrayExceptions[index]);
  //     }
  //   }
  //   const reducesEvaluations = newsArrayEvaluations
  //     .map((v) => v.evaluationId)
  //     .filter((value, index, seft) => seft.indexOf(value) === index)
  //     .map((val) => newsArrayEvaluations.find((ob) => ob.evaluationId === val))
  //     .concat(arrays);

  //   const inActives = await this.userRepo.getDefaultActive({
  //     [Op.and]: [
  //       {
  //         evaluationPeriodId:
  //           evaluationEnds.length > 0
  //             ? evaluationEnds[0].evaluationPeriodId
  //             : 0,
  //       },
  //     ],
  //   });
  //   const listUserIdDefaults = [];
  //   const listInActives = [];
  //   inActives.forEach((v) => {
  //     listUserIdDefaults.push(v.userId);
  //   });

  //   const reduceListInActives = listInActives
  //     .map((v) => v)
  //     .filter((value, index, self) => self.indexOf(value) === index)
  //     .map((v) => listInActives.find((ob) => ob === v));

  //   const levels17s = [1, 2, 3, 4, 5, 6, 7];
  //   const levels810s = [8, 9, 10];
  //   const evaluationIds = [];

  //   const results = reducesEvaluations.reduce((acc, curr) => {
  //     const found = acc.find((a) => a.userId === curr.userId);
  //     let value = {};

  //     if (!evaluationIds.includes(curr.evaluationId)) {
  //       value = {
  //         ...curr,
  //         title: `${curr.periodStart} ～ ${curr.periodEnd}`,
  //         dateEvaluationStartEval: curr.dateEvaluationStartEval,
  //         dateEvaluationEndEval: curr.dateEvaluationEndEval,
  //       };
  //       evaluationIds.push(curr.evaluationId);
  //     }

  //     if (!found) {
  //       // ================================

  //       acc.push({
  //         id: Math.random().toString(36).slice(4),
  //         userId: curr.userId,
  //         title: curr.title,
  //         fullName: `${curr.employeeNumber}: ${curr.fullName}`,
  //         summaryPointEvaluator2: curr.summaryPointEvaluator2,
  //         children: [value],
  //         evaluationId: curr.evaluationId,
  //         dateEvaluationStart: curr.dateEvaluationStart,
  //         dateEvaluationEnd: curr.dateEvaluationEnd,
  //         dateEvaluationDepartmentStart: curr.dateEvaluationDepartmentStart,
  //         dateEvaluationDepartmentEnd: curr.dateEvaluationDepartmentEnd,
  //         dateEvaluationStartEval: curr.dateEvaluationStartEval,
  //         dateEvaluationEndEval: curr.dateEvaluationEndEval,
  //       });
  //     } else {
  //       found.children.push(value);
  //     }
  //     return acc;
  //   }, []);

  //   const resultsFinals = [];
  //   let arraysChilds = [];
  //   for (let index = 0; index < results.length; index++) {
  //     let stringNotSameRank = '';
  //     let totalPoint: any = 0;
  //     const currentCheck = new Date();
  //     //  ============ 1 - 7 =====================
  //     // dateEvaluationDepartmentStart
  //     // dateEvaluationDepartmentEnd
  //     const levels = [[], []];
  //     let stringStatusAlone = '';

  //     if (results[index].children.length === 1) {
  //       if (results[index].children[0].creationUser === null) {
  //         if (levels17s.includes(results[index].children[0].level)) {
  //           if (
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') >=
  //               isFormatDate(
  //                 results[index].dateEvaluationStart,
  //                 'YYYY/MM/DD',
  //               ) &&
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') <=
  //               isFormatDate(results[index].dateEvaluationEnd, 'YYYY/MM/DD')
  //           ) {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[1];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           } else {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[0];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           }
  //         } else {
  //           if (
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') >=
  //               isFormatDate(
  //                 results[index].dateEvaluationDepartmentStart,
  //                 'YYYY/MM/DD',
  //               ) &&
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') <=
  //               isFormatDate(
  //                 results[index].dateEvaluationDepartmentEnd,
  //                 'YYYY/MM/DD',
  //               )
  //           ) {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[1];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           } else {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[0];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           }
  //         }
  //       } else {
  //         if (levels17s.includes(results[index].children[0].level)) {
  //           if (
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') >=
  //               isFormatDate(
  //                 results[index].children[0].dateEvaluationStartEval ||
  //                   results[index].dateEvaluationStart,
  //                 'YYYY/MM/DD',
  //               ) &&
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') <=
  //               isFormatDate(
  //                 results[index].children[0].dateEvaluationEndEval ||
  //                   results[index].dateEvaluationEnd,
  //                 'YYYY/MM/DD',
  //               )
  //           ) {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[1];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           } else {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[0];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           }
  //         } else {
  //           if (
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') >=
  //               isFormatDate(
  //                 results[index].children[0].dateEvaluationStartEval ||
  //                   results[index].dateEvaluationDepartmentStart,
  //                 'YYYY/MM/DD',
  //               ) &&
  //             isFormatDate(currentCheck, 'YYYY/MM/DD') <=
  //               isFormatDate(
  //                 results[index].children[0].dateEvaluationEndEval ||
  //                   results[index].dateEvaluationDepartmentEnd,
  //                 'YYYY/MM/DD',
  //               )
  //           ) {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[1];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           } else {
  //             if (results[index].children[0].status === 50) {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status].split(
  //                   '/',
  //                 )[0];
  //             } else {
  //               stringStatusAlone =
  //                 statusEvaluation[results[index].children[0].status];
  //             }
  //           }
  //         }
  //       }

  //       delete results[index].children[0].title;
  //       delete results[index].children[0].fullName;

  //       resultsFinals.push({
  //         ...results[index].children[0],
  //         fullName: results[index].fullName,
  //         id: results[index].id,
  //         summaryPointEvaluator2:
  //           results[index].children[0].status === 100
  //             ? results[index].children[0].level > 7
  //               ? Math.round(
  //                   Number(results[index].children[0].summaryPointEvaluator2) *
  //                     (results[index].children[0].percentPoint
  //                       ? results[index].children[0].percentPoint / 100
  //                       : 1) *
  //                     10,
  //                 ) / 10
  //               : Math.round(
  //                   Number(results[index].children[0].summaryPointEvaluator2) *
  //                     (results[index].children[0].percentPoint
  //                       ? results[index].children[0].percentPoint / 100
  //                       : 1),
  //                 )
  //             : null,
  //         title: results[index].title,
  //         userId: results[index].userId,
  //         isInActive:
  //           reduceListInActives.includes(results[index].userId) ||
  //           !listUserIdDefaults.includes(results[index].userId),
  //         stringStatus: stringStatusAlone,
  //         isBool: results[index].children[0].isBool,
  //       });
  //     } else {
  //       // const minStatus = [];
  //       const levelsArrs = [];
  //       let stringStatusChildren = '';
  //       let index17s;
  //       let index810s;
  //       let parentStringStatus: string = statusEvaluation[100];
  //       let parentStatus = 100;
  //       results[index].children?.forEach((v) => {
  //         // if (v.status !== undefined) {
  //         //   minStatus.push(v.status);
  //         // }
  //         levelsArrs.push(v.level);

  //         if (v.userId === results[index].userId) {
  //           if (levels17s.includes(v.level)) {
  //             levels[0].push(v.level);
  //             if (
  //               isFormatDate(currentCheck, 'YYYY/MM/DD') >=
  //                 isFormatDate(
  //                   v.dateEvaluationStartEval ||
  //                     results[index].dateEvaluationStart,
  //                   'YYYY/MM/DD',
  //                 ) &&
  //               isFormatDate(currentCheck, 'YYYY/MM/DD') <=
  //                 isFormatDate(
  //                   v.dateEvaluationEndEval || results[index].dateEvaluationEnd,
  //                   'YYYY/MM/DD',
  //                 )
  //             ) {
  //               if (v.status === 50) {
  //                 stringStatusChildren =
  //                   statusEvaluation[v.status].split('/')[1];
  //               } else {
  //                 stringStatusChildren = statusEvaluation[v.status];
  //               }
  //             } else {
  //               if (v.status === 50) {
  //                 stringStatusChildren =
  //                   statusEvaluation[v.status].split('/')[0];
  //               } else {
  //                 stringStatusChildren = statusEvaluation[v.status];
  //               }
  //             }
  //           } else {
  //             levels[1].push(v.level);
  //             if (
  //               isFormatDate(currentCheck, 'YYYY/MM/DD') >=
  //                 isFormatDate(
  //                   v.dateEvaluationStartEval ||
  //                     results[index].dateEvaluationDepartmentStart,
  //                   'YYYY/MM/DD',
  //                 ) &&
  //               isFormatDate(currentCheck, 'YYYY/MM/DD') <=
  //                 isFormatDate(
  //                   v.dateEvaluationEndEval ||
  //                     results[index].dateEvaluationDepartmentEnd,
  //                   'YYYY/MM/DD',
  //                 )
  //             ) {
  //               if (v.status === 50) {
  //                 stringStatusChildren =
  //                   statusEvaluation[v.status].split('/')[1];
  //               } else {
  //                 stringStatusChildren = statusEvaluation[v.status];
  //               }
  //             } else {
  //               if (v.status === 50) {
  //                 stringStatusChildren =
  //                   statusEvaluation[v.status].split('/')[0];
  //               } else {
  //                 stringStatusChildren = statusEvaluation[v.status];
  //               }
  //             }
  //           }

  //           index810s = levels810s.findIndex((v) => levels[1].includes(v));

  //           if (v.status === 100) {
  //             totalPoint +=
  //               (Number(v.summaryPointEvaluator2) *
  //                 (v.percentPoint !== null ? v.percentPoint : 100)) /
  //               100;
  //           }
  //           index17s = levels17s.findIndex((v) => levels[0].includes(v));
  //           // kiểm tra user trong kỳ có 2 thời điểm bậc lương khác nhau sẽ không cộng lại

  //           arraysChilds.push({
  //             ...v,
  //             summaryPointEvaluator2:
  //               v.status === 100 && v.summaryPointEvaluator2
  //                 ? v.level > 7
  //                   ? Math.round(Number(v.summaryPointEvaluator2) * 10) / 10
  //                   : Math.round(v.summaryPointEvaluator2)
  //                 : null,
  //             isInActive:
  //               reduceListInActives.includes(v.userId) ||
  //               !listUserIdDefaults.includes(v.userId),
  //             fullName: `${v.employeeNumber}: ${v.fullName}`,
  //             stringStatus: stringStatusChildren,
  //             isBool: v.isBool,
  //             financialYear: results[index].title,
  //           });
  //         }
  //         if (parentStatus >= v.status) {
  //           if (v.status === 50 && parentStatus === 50) {
  //             if (stringStatusChildren !== parentStringStatus)
  //               parentStringStatus = statusEvaluation[50].split('/')[0];
  //           } else parentStringStatus = stringStatusChildren;
  //           parentStatus = v.status;
  //         }
  //       });
  //       if (index810s !== -1 && index17s >= 0) {
  //         totalPoint = 0;
  //         stringNotSameRank = '-';
  //       } else {
  //         if (index17s >= 0 && totalPoint !== 0) {
  //           totalPoint = Math.round(totalPoint);
  //         }
  //         if (index810s >= 0 && totalPoint !== 0) {
  //           totalPoint = Math.round(Number(totalPoint) * 10) / 10;
  //         }
  //       }
  //       // Sắp xếp lại theo period start ~ period end
  //       const sortings = arraysChilds.sort((a: any, b: any) => {
  //         const dateA = new Date(a.periodStart);
  //         const dateB = new Date(b.periodStart);

  //         if (dateA < dateB) {
  //           return 1;
  //         }
  //         if (dateA > dateB) {
  //           return -1;
  //         }

  //         return 0;
  //       });
  //       // Xóa record children
  //       delete results[index].children;
  //       resultsFinals.push({
  //         ...results[index],
  //         childs: sortings,
  //         stringStatus: parentStringStatus,
  //         summaryPointEvaluator2: totalPoint || null,
  //         stringNotSameRank: stringNotSameRank,
  //         isInActive:
  //           reduceListInActives.includes(results[index].userId) ||
  //           !listUserIdDefaults.includes(results[index].userId),
  //       });
  //       arraysChilds = []; // clear array
  //     }
  //   }

  //   resultsFinals.sort((a, b) => {
  //     return a.fullName.split(':')[0] - b.fullName.split(':')[0];
  //   });

  //   return {
  //     data: resultsFinals,
  //     counts: counts,
  //   };
  // }

  // fix bug tang performance
  async searchListUserEvaluator2(params: EvaluatorSearchInterfaces) {
    const listUsers = await this.evaluatorRepo.listUserEvaluator(params);

    // const counts = await this.evaluatorRepo.countListUserEvaluator(params); // count
    const counts = listUsers[0]?.count;
    const arrays = [];
    const arrayIdUserList = listUsers.map((e) => e.userId);
    const listEvaluationsFull = await this.evaluatorRepo.findEvaluatorByPeriod(
      arrayIdUserList,
      params,
    );

    arrayIdUserList.forEach((record: number) => {
      const listEvaluations = listEvaluationsFull.filter(
        (v) => v.user.id === record,
      );
      let isHasOneEvaluation = false;
      const arrayChilds = [];

      let evaluationEnd = listEvaluations[0];

      // Trường hợp có nhiều evaluation
      if (listEvaluations.length > 1) {
        // check xem có phải là người đánh giá của evaluation mới nhất không
        const lastEvaluator =
          evaluationEnd.evaluator.findIndex(
            (v) => v.evaluatorId === params.evaluatorId,
          ) >= 0;

        //trường hợp là người đánh giá của evaluation mới nhất
        if (lastEvaluator) {
          listEvaluations.map((evaluation) => {
            arrayChilds.push({
              userId: evaluation.userId,
              employeeNumber: evaluation.user?.employeeNumber,
              level: evaluation.level,
              departmentName: evaluation.departmentName,
              divisionName: evaluation.divisionName,
              evaluationPeriodId: evaluation.evaluationPeriodId,
              title: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
              fullName: `${evaluation.user?.employeeNumber}: ${evaluation.user?.fullName}`,
              evaluationOrder: evaluation.evaluator.find(
                (e) => e.evaluatorId === params.evaluatorId,
              )?.evaluationOrder,
              evaluatorId: params.evaluatorId,
              status: evaluation.status,
              summaryPointEvaluator2:
                evaluation.status === 100
                  ? evaluation.level <= 7
                    ? evaluation.summaryPointEvaluator2 !== null
                      ? Math.round(evaluation.summaryPointEvaluator2)
                      : ''
                    : evaluation.summaryDepartment?.summaryPointEvaluator2 !==
                      null
                    ? (
                        Math.floor(
                          evaluation.summaryDepartment?.summaryPointEvaluator2 *
                            10,
                        ) / 10
                      ).toFixed(1)
                    : ''
                  : '',
              percentPoint: evaluation.percentPoint,
              periodStart: evaluation.periodStart,
              periodEnd: evaluation.periodEnd,
              evaluationId:
                evaluation.evaluator[0]?.evaluationId || evaluation.id,
              dateEvaluationStartEval: evaluation.dateEvaluationStart
                ? evaluation.dateEvaluationStart
                : evaluation.level <= 7
                ? evaluation.evaluationPeriod[0].dateEvaluationStart
                : evaluation.evaluationPeriod[0].dateEvaluationDepartmentStart,
              dateEvaluationEndEval: evaluation.dateEvaluationEnd
                ? evaluation.dateEvaluationEnd
                : evaluation.level <= 7
                ? evaluation.evaluationPeriod[0].dateEvaluationEnd
                : evaluation.evaluationPeriod[0].dateEvaluationDepartmentEnd,
            });
          });
        } else {
          const evaluationOfEvaluator = listEvaluations.filter((evaluation) =>
            evaluation.evaluator.some(
              (e) => e.evaluatorId === params.evaluatorId,
            ),
          );

          // Trường hợp không phải là người đánh giá mới nhất và có 1 evaluation do mình đánh giá
          if (evaluationOfEvaluator?.length <= 1) {
            isHasOneEvaluation = true;
            evaluationEnd = evaluationOfEvaluator[0];
          } else {
            evaluationOfEvaluator.map((evaluation) => {
              arrayChilds.push({
                userId: evaluation.userId,
                employeeNumber: evaluation.user?.employeeNumber,
                level: evaluation.level,
                departmentName: evaluation.departmentName,
                divisionName: evaluation.divisionName,
                evaluationPeriodId: evaluation.evaluationPeriodId,
                title: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
                fullName: `${evaluation.user?.employeeNumber}: ${evaluation.user?.fullName}`,
                evaluationOrder: evaluation.evaluator.find(
                  (e) => e.evaluatorId === params.evaluatorId,
                )?.evaluationOrder,
                evaluatorId: params.evaluatorId,
                status: evaluation.status,
                summaryPointEvaluator2:
                  evaluation.status === 100
                    ? evaluation.level <= 7
                      ? evaluation.summaryPointEvaluator2 !== null
                        ? Math.round(evaluation.summaryPointEvaluator2)
                        : ''
                      : evaluation.summaryDepartment?.summaryPointEvaluator2 !==
                        null
                      ? Math.round(
                          Number(
                            evaluation.summaryDepartment
                              ?.summaryPointEvaluator2,
                          ) * 10,
                        ) / 10
                      : ''
                    : '',
                percentPoint: evaluation.percentPoint,
                periodStart: evaluation.periodStart,
                periodEnd: evaluation.periodEnd,
                evaluationId:
                  evaluation.evaluator[0]?.evaluationId || evaluation.id,
                dateEvaluationStartEval: evaluation.dateEvaluationStart
                  ? evaluation.dateEvaluationStart
                  : evaluation.level <= 7
                  ? evaluation.evaluationPeriod[0].dateEvaluationStart
                  : evaluation.evaluationPeriod[0]
                      .dateEvaluationDepartmentStart,
                dateEvaluationEndEval: evaluation.dateEvaluationEnd
                  ? evaluation.dateEvaluationEnd
                  : evaluation.level <= 7
                  ? evaluation.evaluationPeriod[0].dateEvaluationEnd
                  : evaluation.evaluationPeriod[0].dateEvaluationDepartmentEnd,
              });
            });
          }
        }
      } else {
        //trường hợp có 1 evaluation
        isHasOneEvaluation = true;
      }

      let totalPoint = undefined;
      if (isHasOneEvaluation) {
        totalPoint =
          evaluationEnd.status === 100
            ? evaluationEnd.level <= 7
              ? evaluationEnd.summaryPointEvaluator2 !== null
                ? Math.round(evaluationEnd.summaryPointEvaluator2)
                : ''
              : evaluationEnd.summaryDepartment?.summaryPointEvaluator2 !== null
              ? Math.round(
                  Number(
                    evaluationEnd.summaryDepartment?.summaryPointEvaluator2,
                  ) * 10,
                ) / 10
              : ''
            : '';
      } else if (arrayChilds?.length > 0) {
        const allStatusesAre100 = arrayChilds.every(
          (child) => child.status === 100,
        );

        // Kiểm tra xem tất cả các đối tượng có level nhỏ hơn 8 hoặc lớn hơn hoặc bằng 8
        const allLevels17 = arrayChilds.every((child) => child.level < 8);

        const allLevels810 = arrayChilds.every((child) => child.level >= 8);

        // Kết hợp các điều kiện
        const allConditionsMet =
          allStatusesAre100 && (allLevels17 || allLevels810);

        if (allConditionsMet) {
          let isHasSummaryPoint = false;
          totalPoint = 0;
          arrayChilds.map((v) => {
            if (
              v.summaryPointEvaluator2 !== null &&
              v.summaryPointEvaluator2 !== ''
            ) {
              isHasSummaryPoint = true;
              totalPoint +=
                (Number(v.summaryPointEvaluator2) *
                  (v.percentPoint !== null ? v.percentPoint : 100)) /
                100;
            }
          });

          if (isHasSummaryPoint) {
            if (allLevels17) {
              totalPoint = Math.round(totalPoint);
            } else if (allLevels810) {
              totalPoint = Math.round(Number(totalPoint) * 10) / 10;
            }
          } else {
            totalPoint = '';
          }
        } else if (allStatusesAre100 && !allLevels17 && !allLevels810) {
          totalPoint = '-';
        }
      }

      arrays.push({
        id: isHasOneEvaluation
          ? undefined
          : Math.random().toString(36).slice(4),
        userId: evaluationEnd.userId,
        employeeNumber: evaluationEnd.user?.employeeNumber,
        level: evaluationEnd.level,
        departmentName: evaluationEnd.departmentName,
        divisionName: evaluationEnd.divisionName,
        evaluationPeriodId: evaluationEnd.evaluationPeriodId,
        title: evaluationEnd.title,
        fullName: `${evaluationEnd.user?.employeeNumber}: ${evaluationEnd.user?.fullName}`,
        evaluationOrder: isHasOneEvaluation
          ? evaluationEnd.evaluator.find(
              (v) => v.evaluatorId === params.evaluatorId,
            ).evaluationOrder
          : null,
        evaluatorId: params.evaluatorId,
        status: evaluationEnd.status,
        summaryPointEvaluator2: totalPoint,
        percentPoint: evaluationEnd.percentPoint,
        periodStart: evaluationEnd.periodStart,
        periodEnd: evaluationEnd.periodEnd,
        evaluationId:
          evaluationEnd.evaluator[0]?.evaluationId || evaluationEnd.id,
        dateEvaluationStartEval: evaluationEnd.dateEvaluationStart
          ? evaluationEnd.dateEvaluationStart
          : evaluationEnd.level <= 7
          ? evaluationEnd.evaluationPeriod[0].dateEvaluationStart
          : evaluationEnd.evaluationPeriod[0].dateEvaluationDepartmentStart,
        dateEvaluationEndEval: evaluationEnd.dateEvaluationEnd
          ? evaluationEnd.dateEvaluationEnd
          : evaluationEnd.level <= 7
          ? evaluationEnd.evaluationPeriod[0].dateEvaluationEnd
          : evaluationEnd.evaluationPeriod[0].dateEvaluationDepartmentEnd,
        childs: isHasOneEvaluation ? undefined : arrayChilds,
      });
    });
    return {
      data: arrays,
      counts: counts,
    };
  }

  findSendApproveNextPerson(
    evaluators: Evaluator[],
    evaluationOrder: number[],
  ) {
    const evaluator = evaluators.find((f) => {
      return evaluationOrder.some((s) => s === Number(f.evaluationOrder));
    });

    if (Number(evaluator?.evaluationOrder) === 1) return 5;
    if (Number(evaluator?.evaluationOrder) === 2) return 7;
    return 49;
  }

  async sendApproveStatus(
    evaluationId: number,
    comment: string,
    approverId: number,
    type: TypeApprovedStatus,
    updateTime: string,
    host: string,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const evaluationDetail = await this.evaluatorRepo.getEvaluationById(
      evaluationId,
    );

    if (updateTime !== evaluationDetail.updatedTime.toISOString())
      throw new RuntimeException('Evaluation is duplicate', 409);

    const evaluatorDefault = await this.userRepo.getEvaluatorDefault(
      evaluationDetail.user.id,
      evaluationDetail.evaluationPeriodId,
    );
    if (evaluationDetail.user.active !== 1 || !evaluatorDefault) {
      throw new RuntimeException('Evaluation is duplicate', 409);
    }

    let receiverOrder: ReceiverOrderType | number = 0;
    const status = '承認';
    const evaluators = evaluationDetail.evaluator;
    const findEvaluator = evaluators.find((f) => f.evaluatorId === approverId);
    const statusEvaluationSend = evaluationDetail.status;
    if (!findEvaluator && ![49, 98].includes(evaluationDetail.status))
      throw new RuntimeException('Not found evaluation id', 500);
    receiverOrder = findEvaluator?.evaluationOrder;

    // ** F6
    if (statusEvaluationSend === 49) {
      type = 0;
      evaluationDetail.status = 50;
    }
    if (statusEvaluationSend === 98) {
      type = 1;
      evaluationDetail.status = 99;
    }
    let selectedOrder = ``;
    if ([7, 8].includes(statusEvaluationSend) && Number(receiverOrder) === 2) {
      evaluationDetail.status = 49;
      // status = '二次評価：承認';
    }
    if ([5, 6].includes(statusEvaluationSend) && Number(receiverOrder) === 1) {
      const statusNumber = this.findSendApproveNextPerson(evaluators, [2]);
      evaluationDetail.status = statusNumber;
      // status = '一次評価：承認';
      if (statusNumber === 7) selectedOrder = '2.0';
    }
    if (
      [3, 4].includes(statusEvaluationSend) &&
      Number(receiverOrder) === 0.5
    ) {
      const statusNumber = this.findSendApproveNextPerson(evaluators, [1, 2]);
      evaluationDetail.status = statusNumber;
      // status = '仮評価：承認';
      if (statusNumber === 5) selectedOrder = '1.0';
      if (statusNumber === 7) selectedOrder = '2.0';
    }

    if (statusEvaluationSend === 53 && Number(receiverOrder) === 0.5) {
      evaluationDetail.status = 54;
      // status = '仮評価：承認';
    }
    if (statusEvaluationSend === 56 && Number(receiverOrder) === 1) {
      evaluationDetail.status = 57;
      // status = '一次評価：承認';
    }
    if (statusEvaluationSend === 59 && Number(receiverOrder) === 2) {
      evaluationDetail.status = 60;
      // status = '二次評価：承認';
    }

    const transaction = await this.evaluatorRepo.getNewTransaction();
    const dates = new Date(isFormatDate(new Date(), 'YYYY/M/D H:m', timeZone));

    try {
      await this.evaluatorRepo
        .updateApprovedStatus(
          evaluationId,
          comment,
          approverId,
          null,
          receiverOrder,
          type,
          status,
          transaction,
          // dates,
        )
        .then(() => evaluationDetail.save({ transaction }));

      if (evaluationDetail.status < 50 && selectedOrder) {
        const tempApprover = evaluators.filter((item: any) => {
          if (item.evaluationOrder === selectedOrder) return item;
        });

        await this.mailService.sendMailApproveGoalSetting(
          tempApprover[0].evaluatorId,
          evaluationDetail.userId,
          evaluationId,
          host,
          companyGroupCode,
        );
      } else if ([7, 59].includes(evaluationDetail.status)) {
        // 7: '【目標】二次評価者確認中',
        // 59: '【評価】二次評価者確認中',
        // Gửi mail cho user và cc evaluator 0.5/1 khi evaluator 2 approve
        // const tempApprover = evaluators.filter((item: any) => {
        //   if (['0.5', '1.0'].includes(item.evaluationOrder)) return item;
        // });
        // await this.mailService.sendMailEvaluatorApproved(
        //   tempApprover,
        //   evaluationDetail.userId,
        //   evaluationId,
        //   host,
        // );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      statusNumber: evaluationDetail.status,
      updateTime: evaluationDetail.updatedTime.toISOString(),
    };
  }

  findSendRejectNextPerson(
    evaluators: Evaluator[],
    dataInput: {
      evaluationOrder: number;
      statusReject: string;
    }[],
    dataReturn: {
      statusReject: string;
      receiverId: number;
      evaluationOrder: number;
    },
  ) {
    // 0.5 -> 1 -> 2
    for (let i = 0; i < dataInput.length; i++) {
      const element = dataInput[i];
      const evaluator = evaluators.find(
        (f) => Number(f.evaluationOrder) === element.evaluationOrder,
      );
      if (evaluator) {
        return {
          statusReject: element.statusReject,
          receiverId: evaluator.evaluatorId,
          evaluationOrder: evaluator.evaluationOrder,
        };
      }
    }
    return dataReturn;
  }

  async sendRejectStatus(
    evaluationId: number,
    comment: string,
    approverId: number,
    type: TypeApprovedStatus,
    statusReject: StatusRejectType,
    updateTime: string,
    host: string,
    companyGroupCode: string,
    timeZone: string,
  ) {
    //
    const evaluationDetail = await this.evaluatorRepo.getEvaluationById(
      evaluationId,
    );
    if (updateTime !== evaluationDetail.updatedTime.toISOString())
      throw new RuntimeException('Evaluation is duplicate', 409);

    const evaluatorDefault = await this.userRepo.getEvaluatorDefault(
      evaluationDetail.user.id,
      evaluationDetail.evaluationPeriodId,
    );
    if (evaluationDetail.user.active !== 1 || !evaluatorDefault) {
      throw new RuntimeException('Evaluation is duplicate', 409);
    }

    let receiverOrder: ReceiverOrderType | number = 0;
    let receiverId = 0;
    let status = '';
    const evaluators = evaluationDetail.evaluator;
    const findEvaluator = evaluators.find((f) => f.evaluatorId === approverId);

    if (evaluationDetail.status < 50) type = 0;
    else type = 1;

    // ** Status 2, 4, 6
    const dataRet = {
      statusReject: '2',
      receiverId: evaluationDetail.userId,
      evaluationOrder: 0,
    };

    const evaluatorObject = {
      '0.5': '仮評価者へ差戻',
      '1.0': '一次評価者へ差戻',
      '2.0': '二次評価者へ差戻',
    };
    status = ''; // `${evaluatorNameObject[findEvaluator.evaluationOrder]} : `;
    if (statusReject === '2') {
      evaluationDetail.status = Number(statusReject);
      receiverId = evaluationDetail.userId;
      status = status + '被評価者へ差戻';
    }

    if (statusReject === '4') {
      const evaluator = this.findSendRejectNextPerson(
        evaluators,
        [{ evaluationOrder: 0.5, statusReject }],
        { ...dataRet },
      );
      if (!evaluator)
        throw new RuntimeException('Not found evaluator 0.5', 500);
      evaluationDetail.status = Number(evaluator.statusReject);
      receiverId = evaluator.receiverId;
      receiverOrder = evaluator.evaluationOrder;
      status = status + evaluatorObject[evaluator.evaluationOrder];
    }

    if (statusReject === '6') {
      const evaluator = this.findSendRejectNextPerson(
        evaluators,
        [
          { evaluationOrder: 1.0, statusReject },
          { evaluationOrder: 0.5, statusReject: '4' },
        ],
        { ...dataRet },
      );

      evaluationDetail.status = Number(evaluator.statusReject);
      receiverId = evaluator.receiverId;
      receiverOrder = evaluator.evaluationOrder;
      status = status + evaluatorObject[evaluator.evaluationOrder];
    }

    if (statusReject === '8') {
      //
      const evaluator = this.findSendRejectNextPerson(
        evaluators,
        [
          { evaluationOrder: 2.0, statusReject },
          { evaluationOrder: 1.0, statusReject: '6' },
          { evaluationOrder: 0.5, statusReject: '4' },
        ],
        { ...dataRet },
      );

      evaluationDetail.status = Number(evaluator.statusReject);
      receiverId = evaluator.receiverId;
      receiverOrder = evaluator.evaluationOrder;
      status = status + evaluatorObject[evaluator.evaluationOrder];
    }

    // ** Status 52, 54, 58
    const dataRet2 = {
      statusReject: '2',
      receiverId: evaluationDetail.userId,
      evaluationOrder: 0,
    };
    if (statusReject === '52') {
      evaluationDetail.status = Number(statusReject);
      receiverId = evaluationDetail.userId;
      status = status + '被評価者へ差戻';
    }

    if (statusReject === '55') {
      const evaluator = this.findSendRejectNextPerson(
        evaluators,
        [{ evaluationOrder: 0.5, statusReject }],
        { ...dataRet2 },
      );
      evaluationDetail.status = Number(evaluator.statusReject);
      receiverId = evaluator.receiverId;
      receiverOrder = evaluator.evaluationOrder;
      status = status + evaluatorObject[evaluator.evaluationOrder];
    }

    if (statusReject === '58') {
      const evaluator = this.findSendRejectNextPerson(
        evaluators,
        [
          { evaluationOrder: 1.0, statusReject },
          { evaluationOrder: 0.5, statusReject: '54' },
        ],
        { ...dataRet2 },
      );

      evaluationDetail.status = Number(evaluator.statusReject);
      receiverId = evaluator.receiverId;
      receiverOrder = evaluator.evaluationOrder;
      status = status + evaluatorObject[evaluator.evaluationOrder];
    }

    if (statusReject === '61') {
      const evaluator = this.findSendRejectNextPerson(
        evaluators,
        [
          { evaluationOrder: 2.0, statusReject },
          { evaluationOrder: 1.0, statusReject: '58' },
          { evaluationOrder: 0.5, statusReject: '54' },
        ],
        { ...dataRet2 },
      );

      evaluationDetail.status = Number(evaluator.statusReject);
      receiverId = evaluator.receiverId;
      receiverOrder = evaluator.evaluationOrder;
      status = status + evaluatorObject[evaluator.evaluationOrder];
    }

    const transaction = await this.evaluatorRepo.getNewTransaction();
    const dates = new Date(
      isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
    );
    try {
      await this.evaluatorRepo
        .updateApprovedStatus(
          evaluationId,
          comment,
          approverId,
          receiverId,
          receiverOrder,
          type,
          status,
          transaction,
          // dates,
        )
        .then(() => evaluationDetail.save({ transaction }));

      // get cc reject list
      const tempOrder = findEvaluator?.evaluationOrder || '3.0';
      let rejectCcList = evaluators.filter((item: any) => {
        if (
          item.evaluationOrder > receiverOrder &&
          item.evaluationOrder < tempOrder
        )
          return item;
      });
      if (rejectCcList)
        rejectCcList = rejectCcList.map((item: any) => {
          return item.user.email;
        });
      await this.mailService.sendMailRejectGoalSetting(
        approverId,
        receiverId ?? evaluationDetail.userId,
        evaluationDetail.userId,
        evaluationId,
        Number(statusReject),
        rejectCcList,
        host,
        'evaluation',
        companyGroupCode,
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      statusNumber: evaluationDetail.status,
      updateTime: evaluationDetail.updatedTime.toISOString(),
      comment,
    };
  }

  async exportHistoryEvaluationEvaluator(
    params: ExportHistoryEvaluationEvaluatorDto,
    userId: number,
    companyGroupCode: string,
  ) {
    const { fullName, yearStart, yearEnd, yearEvaluate, periodEvaluate } =
      params;
    const { department = null } = params;

    const data = await this.evaluatorRepo.exportHistoryEvaluationEvaluator(
      department,
      fullName,
      yearStart,
      yearEnd,
      userId,
      companyGroupCode,
      yearEvaluate,
      periodEvaluate,
    );
    return data;
  }

  async getListDepartmentToExportHistoryEvaluation(
    userId: number,
    companyGroupCode: string,
    params: any,
  ) {
    const data = await this.evaluatorRepo.getDivDepToExportHistoryEvaluation(
      userId,
      companyGroupCode,
      params,
    );

    return data;
  }

  async listUserProSkillExpertise(
    params: any,
    userId: number,
    companyGroupCode: string,
  ) {
    const {
      fullName,
      yearStart,
      yearEnd,
      offset,
      limit,
      sortColumns,
      sortDirections,
      yearEvaluate,
      periodEvaluate,
    } = params;
    let { department = null } = params;

    if (department != null) {
      department = department?.map((dep: string) => dep.split(':')[1]);
    }
    const data = await this.evaluatorRepo.listUserProSkillExpertise(
      department,
      fullName,
      yearStart,
      yearEnd,
      userId,
      companyGroupCode,
      offset,
      limit,
      sortColumns ?? [],
      sortDirections ?? [],
      yearEvaluate,
      periodEvaluate,
    );
    return data;
  }

  async getListDepartmentExpertise(
    userId: number,
    companyGroupCode: string,
    params: { yearEvaluate: string; periodEvaluate: string },
  ) {
    const data = await this.evaluatorRepo.getListDepartmentExpertise(
      userId,
      companyGroupCode,
      params,
    );

    return data;
  }

  async exportPDFProSkillExpertise(
    body: any,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const year = body.year;
    const periodIndex = body.periodIndex;
    const userId = body.userId;
    const evaluationDatas =
      await this.evaluatorRepo.getListEvaluationToExportPDF(
        year,
        periodIndex,
        userId,
        companyGroupCode,
      );

    if (
      evaluationDatas.evaluationNormal !== null ||
      evaluationDatas.evaluationException !== null
    ) {
      if (evaluationDatas.evaluationNormal !== null) {
        //** xuất file PDF record bình thường */
        const idList = [];
        idList.push(evaluationDatas.evaluationNormal.id);
        if (evaluationDatas.evaluationNormal.level < 8) {
          const data = await this.reportService.exportReportPdfReview17(
            idList,
            userId,
            true,
            false,
            false,
            companyGroupCode,
            timeZone,
          );
          const result = {
            dataPdf: data,
            dataLenght: 1,
          };
          return result;
        } else {
          const data = await this.reportService.exportReportPdfReview810(
            idList,
            userId,
            true,
            false,
            false,
            companyGroupCode,
            timeZone,
          );
          const result = {
            dataPdf: data,
            dataLenght: 1,
          };
          return result;
        }
      } else if (evaluationDatas.evaluationException !== null) {
        //** xuất file PDF record ngoại lệ */
        const childrenList = [];
        evaluationDatas.evaluationException.map((item: any) => {
          childrenList.push({
            evaluationId: item.id,
            level: item.level,
          });
        });

        if (childrenList.length > 1) {
          const idList810: number[] = [];
          const idList17: number[] = [];
          const idList: number[] = [];
          childrenList.map((child) => {
            if ([8, 9, 10].includes(child.level))
              idList810.push(child.evaluationId);
            if (child.level <= 7) idList17.push(child.evaluationId);
            idList.push(child.evaluationId);
          });

          //** get PDF list only includes 8~10
          if (idList810.length === childrenList.length) {
            const data = await this.reportService.exportReportPdfReview810(
              idList810,
              userId,
              true,
              true,
              true,
              companyGroupCode,
              timeZone,
            );
            const result = {
              dataPdf: data,
              dataLenght: childrenList.length,
            };
            return result;
          }

          //** get PDF list only includes 1~7
          if (idList17.length === childrenList.length) {
            const data = await this.reportService.exportReportPdfReview17(
              idList17,
              userId,
              true,
              true,
              true,
              companyGroupCode,
              timeZone,
            );
            const result = {
              dataPdf: data,
              dataLenght: childrenList.length,
            };
            return result;
          }

          //** */ get PDF list includes 1~7 and 8~10
          if (
            idList810.length !== childrenList.length &&
            idList17.length !== childrenList.length
          ) {
            const data = await this.reportService.exportPDFMultiLevel(
              userId,
              idList17,
              idList810,
              'admin',
              true,
              companyGroupCode,
              timeZone,
            );
            const result = {
              dataPdf: data,
              dataLenght: childrenList.length,
            };
            return result;
          }
        } else if (childrenList.length === 1) {
          const idList = [];
          idList.push(childrenList[0].evaluationId);
          if (childrenList[0].level < 8) {
            const data = await this.reportService.exportReportPdfReview17(
              idList,
              userId,
              true,
              false,
              false,
              companyGroupCode,
              timeZone,
            );
            const result = {
              dataPdf: data,
              dataLenght: 1,
            };
            return result;
          } else {
            const data = await this.reportService.exportReportPdfReview810(
              idList,
              userId,
              true,
              false,
              false,
              companyGroupCode,
              timeZone,
            );
            const result = {
              dataPdf: data,
              dataLenght: 1,
            };
            return result;
          }
        }
      }
    } else {
      const result = {
        dataPdf: [],
        dataLenght: 0,
      };
      return result;
    }
  }
}
