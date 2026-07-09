/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { getPeriodCurrent, isFormatDate } from 'src/common/util';
import { EvaluationByPeriodType } from 'src/interfaces/service/evaluationPeriod.interface';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { UserRepository } from 'src/repository/user.repository';
// const moment = require('moment');
// moment.tz.setDefault('Asia/Tokyo');
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';

import { EvaluatorRepository } from 'src/repository/evaluator.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { CustomLogger } from './logger.service';
import { SettingLevelRepository } from 'src/repository/settingLevel.repository';
import { AdminEvaluationRepositoryI } from 'src/interfaces/repository/adminEvaluation.repository';
import { AdminEvaluationRepository } from 'src/repository/adminEvaluation.repository';
import { ManagementUserRepository } from 'src/repository/managementUser.repository';
import { EvaluationPeriodDepartmentSettingRepository } from 'src/repository/evaluationPeriodDepartmentSetting.repository';
import * as moment from 'moment';

@Injectable()
export class EvaluationPeriodService {
  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;

  @Inject(UserRepository)
  private userRepo: UserRepository;

  @Inject(ManagementUserRepository)
  private managementUserRepository: ManagementUserRepository;

  @Inject(EvaluationRepository)
  private evaluationRepository: EvaluationRepository;

  @Inject(GuideEvaluationRepository)
  private guideEvaluationRepository: GuideEvaluationRepository;

  @Inject(EvaluatorRepository)
  private evaluatorRepository: EvaluatorRepository;

  @Inject(HistoryCronJobRepository)
  private historyCronJobRepository: HistoryCronJobRepository;

  @Inject(SettingLevelRepository)
  private settingLevelRepo: SettingLevelRepository;

  @Inject(AdminEvaluationRepository)
  private adminEvaluationRepo: AdminEvaluationRepositoryI;

  @Inject(EvaluationPeriodDepartmentSettingRepository)
  private deptSettingRepo: EvaluationPeriodDepartmentSettingRepository;

  constructor(private logger: CustomLogger) {
    //
  }

  async getNotificationPeriod(companyGroupCode: string, timeZone: string) {
    const results = [];
    const today = moment().tz(timeZone).format('YYYY/MM/DD');
    const periods: any[] = await this.evaluationPeriodRepo.getProgressingPeriod(
      companyGroupCode,
      timeZone,
    );

    if (periods && periods.length > 0) {
      for (let i = 0; i < periods.length; i++) {
        if (
          (today >=
            moment(periods[i].date_creation_goal_start, 'YYYY/M/D')
              .tz(timeZone)
              .format('YYYY/MM/DD') &&
            today <=
              moment(periods[i].date_creation_goal_end, 'YYYY/M/D')
                .tz(timeZone)
                .format('YYYY/MM/DD')) ||
          (today >=
            moment(periods[i].date_creation_goal_department_start, 'YYYY/M/D')
              .tz(timeZone)
              .format('YYYY/MM/DD') &&
            today <=
              moment(periods[i].date_creation_goal_department_end, 'YYYY/M/D')
                .tz(timeZone)
                .format('YYYY/MM/DD'))
        ) {
          const condition = {
            evaluationPeriodId: periods[i].id,
            status: { [Op.lt]: 50 },
            companyGroupCode: companyGroupCode,
          };
          const count = await this.managementUserRepository.countEvaluation(
            condition,
          );

          if (count) {
            results.push({
              type: '目標',
              period: `${periods[i].year}年${
                periods[i].period_index === 1 ? '上期' : '下期'
              }`,
              datePersonal:
                today >=
                  moment(periods[i].date_creation_goal_start, 'YYYY/M/D')
                    .tz(timeZone)
                    .format('YYYY/MM/DD') &&
                today <=
                  moment(periods[i].date_creation_goal_end, 'YYYY/M/D')
                    .tz(timeZone)
                    .format('YYYY/MM/DD')
                  ? `${periods[i].date_creation_goal_start} ～ ${periods[i].date_creation_goal_end}`
                  : '',
              dateDepartment:
                today >=
                  moment(
                    periods[i].date_creation_goal_department_start,
                    'YYYY/M/D',
                  )
                    .tz(timeZone)
                    .format('YYYY/MM/DD') &&
                today <=
                  moment(
                    periods[i].date_creation_goal_department_end,
                    'YYYY/M/D',
                  )
                    .tz(timeZone)
                    .format('YYYY/MM/DD')
                  ? `${periods[i].date_creation_goal_department_start} ～ ${periods[i].date_creation_goal_department_end}`
                  : '',
            });
          }
        }

        if (
          (today >=
            moment(periods[i].date_evaluation_start, 'YYYY/M/D')
              .tz(timeZone)
              .format('YYYY/MM/DD') &&
            today <=
              moment(periods[i].date_evaluation_end, 'YYYY/M/D')
                .tz(timeZone)
                .format('YYYY/MM/DD')) ||
          (today >=
            moment(periods[i].date_evaluation_department_start, 'YYYY/M/D')
              .tz(timeZone)
              .format('YYYY/MM/DD') &&
            today <=
              moment(periods[i].date_evaluation_department_end, 'YYYY/M/D')
                .tz(timeZone)
                .format('YYYY/MM/DD'))
        ) {
          const condition = {
            evaluationPeriodId: periods[i].id,
            status: { [Op.gte]: 99 },
            companyGroupCode: companyGroupCode,
          };
          const count = await this.managementUserRepository.countEvaluation(
            condition,
          );
          if (!count) {
            results.push({
              type: '評価',
              period: `${periods[i].year}年${
                periods[i].period_index === 1 ? '上期' : '下期'
              }`,
              datePersonal:
                today >=
                  moment(periods[i].date_evaluation_start, 'YYYY/M/D')
                    .tz(timeZone)
                    .format('YYYY/MM/DD') &&
                today <=
                  moment(periods[i].date_evaluation_end, 'YYYY/M/D')
                    .tz(timeZone)
                    .format('YYYY/MM/DD')
                  ? `${periods[i].date_evaluation_start} ～ ${periods[i].date_evaluation_end}`
                  : '',
              dateDepartment:
                today >=
                  moment(
                    periods[i].date_evaluation_department_start,
                    'YYYY/M/D',
                  )
                    .tz(timeZone)
                    .format('YYYY/MM/DD') &&
                today <=
                  moment(periods[i].date_evaluation_department_end, 'YYYY/M/D')
                    .tz(timeZone)
                    .format('YYYY/MM/DD')
                  ? `${periods[i].date_evaluation_department_start} ～ ${periods[i].date_evaluation_department_end}`
                  : '',
            });
          }
        }
      }
    }

    return results;
  }

  async getEvaluationPeriod(timeZone: string) {
    return await this.evaluationPeriodRepo.getEvaluationPeriod(timeZone);
  }
  async getAllPeriod(companyGroupCode: string, timeZone: string) {
    const years = moment().tz(timeZone);
    return await this.evaluationPeriodRepo.getAll({
      year: years.format('YYYY'),
      companyGroupCode: companyGroupCode,
    });
  }
  async getPeriodDetailByCondition(condition: any) {
    const periods = await this.evaluationPeriodRepo.getPeriodByCondition(
      condition,
    );
    return periods;
  }

  async listPeriodByYear(
    yearStart: number,
    yearEnd: number,
    companyGroupCode: string,
  ) {
    // key: Math.random().toString(36).slice(5),
    // evaluationPeriod: '2023年上期',
    // goals: '2023/04/05~2023/04/10',
    // departmentGoals: '2023/04/15~2023/04/20',
    // personalEvaluation: '2022/10/05~2022/10/10',
    // DivisionEvaluate: '2022/10/05~2022/10/10',

    const datas = await this.evaluationPeriodRepo.listPeriodByYear(
      yearStart,
      yearEnd,
      companyGroupCode,
    );
    const rangeYears = Array.from(
      // lấy ra từng năm ví dụ: search 2022 => 2026 thì giá trị của mảng là 2022 2023 2024 2025 2026
      { length: (yearEnd - yearStart) / 1 + 1 },
      (value, index) =>
        parseInt(yearStart.toString()) + parseInt(index.toString()) * 1,
    );

    const arrays = [];
    if (datas.length > 0) {
      const reducesArrays: {
        // đặt kiểu giá trị
        year: string;
        children: {
          periodIndex: number;
          goals: string;
          departmentGoals: string;
          personalEvaluation: string;
          divisionEvaluate: string;
          key: string;
          year: string;
          id: number;
        }[];
        periodLists: number[];
      }[] = datas.reduce((acc: any, current) => {
        // Record 1: 2023 ky 1 (Hiển thị đánh giá của kỳ hiện tại (kỳ 1) => Hiển thị mục tiêu cá nhân của kỳ sau là kỳ 2)
        // Record 2: 2023 kỳ 2. Hiển thị đánh giá kỳ hiện tại => Hiển thị mục tiêu cá nhân của kỳ sau là kỳ 1 năm 2024
        const founds = acc.find((v) => v.year === current.year);

        const value = {
          periodIndex: current.periodIndex,
          goals:
            current.dateCreationGoalStart &&
            current.dateCreationGoalEnd &&
            `${current.dateCreationGoalStart} ～ ${current.dateCreationGoalEnd}`,
          departmentGoals:
            current.dateCreationGoalDepartmentStart &&
            current.dateCreationGoalDepartmentEnd &&
            `${current.dateCreationGoalDepartmentStart} ～ ${current.dateCreationGoalDepartmentEnd}`,
          personalEvaluation:
            current.dateEvaluationStart &&
            current.dateEvaluationEnd &&
            `${current.dateEvaluationStart} ～ ${current.dateEvaluationEnd}`,
          divisionEvaluate:
            current.dateEvaluationDepartmentStart &&
            current.dateEvaluationDepartmentEnd &&
            `${current.dateEvaluationDepartmentStart} ～ ${current.dateEvaluationDepartmentEnd}`,

          key: Math.random().toString(36).slice(5),
          year: current.year,
          id: current.id,
          checkFixed: current.checkFixed,
        };
        if (!founds) {
          acc.push({
            year: current.year,
            children: [value],
            periodLists: [current.periodIndex],
          });
        } else {
          founds.children.push(value);
          founds.periodLists.push(current.periodIndex);
        }

        return acc;
      }, []);

      // Tìm những năm có trong database có thì push vào để khi cần tìm những value không có thì có thể lọc từ chổ này ra
      const arrayAlreadyExists = [];
      const sortChildrens = reducesArrays.sort((a, b) => {
        return b.children[0].periodIndex - a.children[0].periodIndex;
      });

      for (
        let index = yearStart;
        index <= parseInt(yearEnd.toString()) + 1;
        index++
      ) {
        sortChildrens.forEach((v) => {
          // Lý do dùng if thay vì else if => nếu dùng else if đi chung thì nếu chạy nó tìm thấy giá trị từ vòng if đầu sẽ ngưng tại chổ đấy
          // và không chạy xuống tiếp để so sánh => chạy tiếp vòng lặp
          // Dùng if nó sẽ kiểm tra từ trên xuống tất cả các điều kiện => Phù hợp nó sẽ chạy code bên trong

          if (parseInt(v.year) === parseInt(index.toString())) {
            arrayAlreadyExists.push(parseInt(v.year));
            // Tìm có kỳ 2 thì push vào arrays

            if (v.periodLists.includes(2)) {
              const record = v.children.find((val) => val.periodIndex === 2);
              // const recordNexts = reducesArrays.filter((val) => {
              //   return parseInt(val.year) === parseInt(index.toString()) + 1;
              // });

              record.key = Math.random().toString(36).slice(5);
              arrays.push({
                ...record,
                evaluationPeriod: `${v.year}年下期`,
                // nextCreationDepartment:
                //   recordNexts[0]?.children[0].departmentGoals || '',
                // nextCreationPeronal: recordNexts[0]?.children[0].goals || '',
              });
            }
            // Tìm có kỳ 1 thì push vào arrays
            if (v.periodLists.includes(1)) {
              const record = v.children.find((val) => val.periodIndex === 1);
              // const recordNext = v.children.find(
              //   (val) => val.periodIndex === 2,
              // );
              // 2023年上期評価＆2023年下期目標
              record.key = Math.random().toString(36).slice(5);
              arrays.push({
                ...record,
                evaluationPeriod: `${v.year}年上期`,
                // nextCreationDepartment: recordNext.departmentGoals,
                // nextCreationPeronal: recordNext.goals,
              });
            }

            // Có kỳ 1 nhưng hk có kỳ 2
            if (v.periodLists.includes(1) && !v.periodLists.includes(2)) {
              arrays.push({
                key: Math.random().toString(36).slice(5),
                evaluationPeriod: `${index}年下期`,
                goals: '',
                departmentGoals: '',
                personalEvaluation: '',
                divisionEvaluate: '',
                periodIndex: 2,
                year: v.year,
                id: 0,
              });
            }

            // Có kỳ 2 nhưng hk có kỳ 1
            if (v.periodLists.includes(2) && !v.periodLists.includes(1)) {
              arrays.push({
                key: Math.random().toString(36).slice(5),
                evaluationPeriod: `${index}年上期`,
                goals: '',
                departmentGoals: '',
                personalEvaluation: '',
                divisionEvaluate: '',
                periodIndex: 1,
                year: v.year,
                id: 0,
              });
            }
          }
        });
      }

      //  Tìm năm search không có trong database
      const arraysNoMatchs = rangeYears.filter(
        (v) => !arrayAlreadyExists.includes(v),
      );
      for (let index = 0; index < arraysNoMatchs.length; index++) {
        arrays.push({
          key: Math.random().toString(36).slice(5),
          evaluationPeriod: `${arraysNoMatchs[index]}年下期`,
          goals: '',
          departmentGoals: '',
          personalEvaluation: '',
          divisionEvaluate: '',
          periodIndex: 2,
          year: arraysNoMatchs[index],
          id: 0,
        });
        arrays.push({
          key: Math.random().toString(36).slice(5),
          evaluationPeriod: `${arraysNoMatchs[index]}年上期`,
          goals: '',
          departmentGoals: '',
          personalEvaluation: '',
          divisionEvaluate: '',
          periodIndex: 1,
          year: arraysNoMatchs[index],
          id: 0,
        });
      }
      // Batch fetch date fields to compute 部署別期間
      const validPeriodIds = arrays.filter((a) => a.id > 0).map((a) => a.id);
      const evalDatesMap = new Map<number, any[]>();
      const deptDatesMap = new Map<number, any[]>();

      if (validPeriodIds.length > 0) {
        const [evalDates, deptDates] = await Promise.all([
          this.evaluationPeriodRepo.getEvaluationDatesByPeriodIds(
            validPeriodIds,
            companyGroupCode,
          ),
          this.deptSettingRepo.getDeptSettingDatesByPeriodIds(
            validPeriodIds,
            companyGroupCode,
          ),
        ]);
        (evalDates as any[]).forEach((e) => {
          const list = evalDatesMap.get(e.evaluationPeriodId) || [];
          list.push(e);
          evalDatesMap.set(e.evaluationPeriodId, list);
        });
        (deptDates as any[]).forEach((d) => {
          const list = deptDatesMap.get(d.evaluationPeriodId) || [];
          list.push(d);
          deptDatesMap.set(d.evaluationPeriodId, list);
        });
      }

      const parseDateMoment = (d: string | null | undefined) =>
        d ? moment(d, 'YYYY/M/D') : null;

      const pickMinDate = (
        dates: (string | null | undefined)[],
      ): string | null => {
        const moments = dates
          .map(parseDateMoment)
          .filter((m): m is moment.Moment => m !== null && m.isValid());
        if (!moments.length) return null;
        return moments
          .reduce((min, m) => (m.isBefore(min) ? m : min))
          .format('YYYY/M/D');
      };

      const pickMaxDate = (
        dates: (string | null | undefined)[],
      ): string | null => {
        const moments = dates
          .map(parseDateMoment)
          .filter((m): m is moment.Moment => m !== null && m.isValid());
        if (!moments.length) return null;
        return moments
          .reduce((max, m) => (m.isAfter(max) ? m : max))
          .format('YYYY/M/D');
      };

      for (let i = 0; i < arrays.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const goalRecord = await this.adminEvaluationRepo.countEvaluationFixed(
          'goal',
          arrays[i].id,
          companyGroupCode,
        );
        const evaluationRecord =
          // eslint-disable-next-line no-await-in-loop
          await this.adminEvaluationRepo.countEvaluationFixed(
            'evaluation',
            arrays[i].id,
            companyGroupCode,
          );
        const evaluationConfirmRecord =
          // eslint-disable-next-line no-await-in-loop
          await this.adminEvaluationRepo.countEvaluationFixed(
            'evaluationConfirm',
            arrays[i].id,
            companyGroupCode,
          );
        const totalRecord = await this.adminEvaluationRepo.totalEvaluation(
          arrays[i].id,
          '',
          companyGroupCode,
        );
        const goalFixedRecord = await this.adminEvaluationRepo.totalEvaluation(
          arrays[i].id,
          'goal',
          companyGroupCode,
        );

        const evaluationFixedRecord =
          await this.adminEvaluationRepo.totalEvaluation(
            arrays[i].id,
            'evaluation',
            companyGroupCode,
          );
        const evaluationConfirmFixedRecord =
          await this.adminEvaluationRepo.totalEvaluation(
            arrays[i].id,
            'evaluationConfirm',
            companyGroupCode,
          );

        arrays[i] = {
          ...arrays[i],
          // id: data[i].id,
          // year: data[i].year,
          // periodIndex: data[i].periodIndex,
          goalRecord: goalRecord,
          evaluationRecord: evaluationRecord,
          evaluationConfirmRecord: evaluationConfirmRecord,
          totalRecord: totalRecord,
          goalFixedRecord: goalFixedRecord,
          evaluationFixedRecord: evaluationFixedRecord,
          evaluationConfirmFixedRecord: evaluationConfirmFixedRecord,
        };

        // Compute 部署別 目標設定期間 and 部署別 評価実施期間
        if (arrays[i].id > 0) {
          const periodRecord = datas.find((d) => d.id === arrays[i].id);
          const evalRecs = evalDatesMap.get(arrays[i].id) || [];
          const deptRecs = deptDatesMap.get(arrays[i].id) || [];

          if (periodRecord) {
            // departmentGoals start: take min across all sources
            const deptGoalStartList: string[] = [];
            evalRecs.forEach((e) => {
              if (e.dateCreationGoalStart)
                deptGoalStartList.push(e.dateCreationGoalStart);
            });
            deptRecs.forEach((d) => {
              const v = pickMinDate([
                d.dateCreationGoalStart,
                d.dateCreationGoalDepartmentStart,
              ]);
              if (v) deptGoalStartList.push(v);
            });
            const pgs = pickMinDate([
              periodRecord.dateCreationGoalStart,
              periodRecord.dateCreationGoalDepartmentStart,
            ]);
            if (pgs) deptGoalStartList.push(pgs);
            const deptGoalStart = pickMinDate(deptGoalStartList);

            // departmentGoals end: take max across all sources
            const deptGoalEndList: string[] = [];
            evalRecs.forEach((e) => {
              if (e.dateCreationGoalEnd)
                deptGoalEndList.push(e.dateCreationGoalEnd);
            });
            deptRecs.forEach((d) => {
              const v = pickMaxDate([
                d.dateCreationGoalEnd,
                d.dateCreationGoalDepartmentEnd,
              ]);
              if (v) deptGoalEndList.push(v);
            });
            const pge = pickMaxDate([
              periodRecord.dateCreationGoalEnd,
              periodRecord.dateCreationGoalDepartmentEnd,
            ]);
            if (pge) deptGoalEndList.push(pge);
            const deptGoalEnd = pickMaxDate(deptGoalEndList);

            arrays[i].goalDeptRange = {
              start: deptGoalStart || null,
              end: deptGoalEnd || null,
            };

            // divisionEvaluate start: take min across all sources
            const divEvalStartList: string[] = [];
            evalRecs.forEach((e) => {
              if (e.dateEvaluationStart)
                divEvalStartList.push(e.dateEvaluationStart);
            });
            deptRecs.forEach((d) => {
              const v = pickMinDate([
                d.dateEvaluationStart,
                d.dateEvaluationDepartmentStart,
              ]);
              if (v) divEvalStartList.push(v);
            });
            const pes = pickMinDate([
              periodRecord.dateEvaluationStart,
              periodRecord.dateEvaluationDepartmentStart,
            ]);
            if (pes) divEvalStartList.push(pes);
            const divEvalStart = pickMinDate(divEvalStartList);

            // divisionEvaluate end: take max across all sources
            const divEvalEndList: string[] = [];
            evalRecs.forEach((e) => {
              if (e.dateEvaluationEnd) divEvalEndList.push(e.dateEvaluationEnd);
            });
            deptRecs.forEach((d) => {
              const v = pickMaxDate([
                d.dateEvaluationEnd,
                d.dateEvaluationDepartmentEnd,
              ]);
              if (v) divEvalEndList.push(v);
            });
            const pee = pickMaxDate([
              periodRecord.dateEvaluationEnd,
              periodRecord.dateEvaluationDepartmentEnd,
            ]);
            if (pee) divEvalEndList.push(pee);
            const divEvalEnd = pickMaxDate(divEvalEndList);

            arrays[i].evalDeptRange = {
              start: divEvalStart || null,
              end: divEvalEnd || null,
            };
          }
        }
      }
      const results = arrays.sort((a, b) => {
        return b.year - a.year;
      });

      return results;
    } else {
      // Nếu trong database rỗng sẽ thiết lập dữ liệu mẫu
      for (let index = yearStart; index <= yearEnd; index++) {
        arrays.push({
          key: Math.random().toString(36).slice(5),
          evaluationPeriod: `${index}年上期`,
          goals: '',
          departmentGoals: '',
          personalEvaluation: '',
          divisionEvaluate: '',
          periodIndex: 1,
          year: index,
          id: 0,
        });
        arrays.push({
          key: Math.random().toString(36).slice(5),
          evaluationPeriod: `${index}年下期`,
          goals: '',
          departmentGoals: '',
          personalEvaluation: '',
          divisionEvaluate: '',
          periodIndex: 1,
          year: index,
          id: 0,
        });
      }

      return arrays;
    }
  }
  async savePeriod(condition: any, body: any) {
    if (isNaN(Number(condition.year)) || isNaN(condition.period_index)) {
      throw new RuntimeException('Bad Request', 400);
    }

    // check conflict 409
    const currentPeriod = await this.evaluationPeriodRepo.getPeriodByCondition(
      condition,
    );
    if (currentPeriod)
      if (body.updatedTime !== currentPeriod.updatedTime.toISOString())
        throw new RuntimeException('Evaluation is duplicate', 409);
    const temp = {} as any;
    // const nextYear = parseInt(condition.year) + 1;
    // temp.year = condition.year;
    // temp.periodndex = condition.periodIndex;
    // temp.periodStart =
    //   condition.periodIndex === 1
    //     ? condition.year + '/4'
    //     : condition.year + '/10';
    // temp.periodEnd =
    //   condition.periodIndex === 1 ? condition.year + '/9' : nextYear + '/3';
    // temp.checkSendMailCreationGoal = body.checkSendMailCreationGoal;
    // temp.checkSendMailCreationGoalDepartment =
    //   body.checkSendMailCreationGoalDepartment;
    // temp.checkSendMailEvaluation = body.checkSendMailEvaluation;
    // temp.checkSendMailEvaluationDepartment =
    //   body.checkSendMailEvaluationDepartment;
    // temp.createdTime = body.createdTime;
    temp.dateCreationGoalDepartmentEnd = body.dateCreationGoalDepartmentEnd;
    temp.dateCreationGoalDepartmentStart = body.dateCreationGoalDepartmentStart;
    temp.dateCreationGoalEnd = body.dateCreationGoalEnd;
    temp.dateCreationGoalStart = body.dateCreationGoalStart;
    temp.dateEvaluationDepartmentEnd = body.dateEvaluationDepartmentEnd;
    temp.dateEvaluationDepartmentStart = body.dateEvaluationDepartmentStart;
    temp.dateEvaluationEnd = body.dateEvaluationEnd;
    temp.dateEvaluationStart = body.dateEvaluationStart;

    const results = await this.evaluationPeriodRepo.savePeriod(condition, temp);
    if (results && body) {
      // cài đặt cron job cho bậc lương 8 - 10
      if (
        body.dateCreationGoalDepartmentStart &&
        body.dateCreationGoalDepartmentEnd
      ) {
        await this.historyCronJobRepository.add({
          name: `settingCreationPersonalGoalsDepartment_${
            condition.period_index === 1
              ? condition.year + '年上期'
              : condition.year + '年下期'
          }`,
          type: 1,
          periodIndex: condition.period_index,
          dateCreationGoalDepartmentStart: body.dateCreationGoalDepartmentStart,
          dateCreationGoalDepartmentEnd: body.dateCreationGoalDepartmentEnd,
          year: condition.year,
          companyGroupCode: condition.company_group_code,
        });
      }

      // cài đặt cron job cho bậc lương 1 - 7
      if (body.dateCreationGoalStart && body.dateCreationGoalEnd) {
        await this.historyCronJobRepository.add({
          name: `settingCreationPersonalGoals_${
            condition.period_index === 1
              ? condition.year + '年上期'
              : condition.year + '年下期'
          }`,
          type: 2,
          periodIndex: condition.period_index,
          dateCreationGoalStart: body.dateCreationGoalStart,
          dateCreationGoalEnd: body.dateCreationGoalEnd,
          year: condition.year,
          companyGroupCode: condition.company_group_code,
        });
      }

      // // Gửi mail thông báo cài đặt mục tiêu bộ phận
      // if (body.dateSendMailCreationGoalDepartment) {
      //   await this.cronJobServices.addCronJobSettingSendMailCreationDepartment(
      //     `sendMailCreationDepartment_${
      //       condition.periodIndex === 1
      //         ? condition.year + '年上期'
      //         : condition.year + '年下期'
      //     }`,
      //     condition.periodIndex,
      //     condition.year,
      //     body.dateSendMailCreationGoalDepartment,
      //     body.dateSendMailCreationGoal,
      //     body.checkSendMailCreationGoalDepartment,
      //   );
      // }

      // // Gửi mail thông báo cài đặt mục tiêu cá nhân
      // if (body.dateSendMailCreationGoal) {
      //   await this.cronJobServices.addCronJobSettingSendMailCreationPersonal(
      //     `sendMailCreationPersonal_${
      //       condition.periodIndex === 1
      //         ? condition.year + '年上期'
      //         : condition.year + '年下期'
      //     }`,
      //     condition.periodIndex,
      //     condition.year,
      //     body.dateSendMailCreationGoal,
      //     body.dateSendMailCreationGoalDepartment,
      //     body.checkSendMailCreationGoal,
      //   );
      // }

      // // Gửi mail thông báo bắt đầu đánh giá cho cá nhân
      // if (body.dateSendMailEvaluation) {
      //   await this.cronJobServices.addCronJobSettingSendMailEvaluationPersonal(
      //     `sendMailEvaluationPersonal_${
      //       condition.periodIndex === 1
      //         ? condition.year + '年上期'
      //         : condition.year + '年下期'
      //     }`,
      //     condition.periodIndex,
      //     condition.year,
      //     body.dateSendMailEvaluation,
      //     body.dateSendMailEvaluationDepartment,
      //     body.checkSendMailEvaluation,
      //   );
      // }

      // // Gửi mail thông báo bắt đầu đánh giá cho department
      // if (body.dateSendMailEvaluationDepartment) {
      //   await this.cronJobServices.addCronJobSettingSendMailEvaluationDepartment(
      //     `sendMailEvaluationDepartment_${
      //       condition.periodIndex === 1
      //         ? condition.year + '年上期'
      //         : condition.year + '年下期'
      //     }`,
      //     condition.periodIndex,
      //     condition.year,
      //     body.dateSendMailEvaluationDepartment,
      //     body.dateSendMailEvaluation,
      //     body.checkSendMailEvaluationDepartment,
      //   );
      // }
    }
    return results;
  }

  // ** Exception Period

  async getUserActiveByCondition(
    departmentId: number,
    companyId: number,
    periodId: number,
    searchInput: string,
    limit: number | undefined,
    offset: number | undefined,
  ) {
    //
    const result = await this.userRepo.getUserActiveByCondition(
      departmentId,
      companyId,
      periodId,
      searchInput,
      limit,
      offset,
    );

    if (result.users.length > 0) {
      const dataList = result.users.map((v, i) => ({
        id: v.id,
        fullName: v.fullName,
        departmentName: v.department ? `${v.department.name}` : '',
        companyName: v.company.name,
        key: `${v.employeeNumber}-${i}-key`,
      }));

      return { dataList, count: result.count };
    }

    return { dataList: [], count: 0 };
  }

  async getEvaluatorUser(
    evaluationCreatorId: number | undefined,
    companyGroupCode: string,
  ) {
    const users = await this.userRepo.getListEvaluator(
      evaluationCreatorId,
      companyGroupCode,
    );

    if (users.length > 0) {
      const results = users.map((v: any) => ({
        value: v.id,
        label: `${v.employeeNumber}: ${v.fullName}`,
      }));

      return results;
    }

    return [];
  }

  async getEvaluationByPeriod(
    userId: number,
    year: number,
    periodIndex: number,
    companyGroupCode: string,
  ) {
    //
    const period = await this.evaluationPeriodRepo.getPeriodDetail(
      year,
      periodIndex,
      companyGroupCode,
    );

    if (period) {
      const itemPeriod: {
        id: number;
        dateCreationGoalStart: string;
        dateCreationGoalEnd: string;
        dateEvaluationStart: string;
        dateEvaluationEnd: string;
        dateCreationGoalDepartmentStart: string;
        dateCreationGoalDepartmentEnd: string;
        dateEvaluationDepartmentStart: string;
        dateEvaluationDepartmentEnd: string;
      } = {
        id: period.id,
        dateCreationGoalStart: period.dateCreationGoalStart,
        dateCreationGoalEnd: period.dateCreationGoalEnd,
        dateEvaluationStart: period.dateEvaluationStart,
        dateEvaluationEnd: period.dateEvaluationEnd,
        dateCreationGoalDepartmentStart: period.dateCreationGoalDepartmentStart,
        dateCreationGoalDepartmentEnd: period.dateCreationGoalDepartmentEnd,
        dateEvaluationDepartmentStart: period.dateEvaluationDepartmentStart,
        dateEvaluationDepartmentEnd: period.dateEvaluationDepartmentEnd,
      };
      const results: EvaluationByPeriodType[] = [];

      const evaluations = await this.evaluationPeriodRepo.getEvaluationByPeriod(
        userId,
        period.id,
        companyGroupCode,
      );

      if (evaluations.length > 0) {
        // Giả sử bạn đã có `period` với `evaluations` được lấy từ cơ sở dữ liệu
        const sortedEvaluations = evaluations.sort((a, b) => {
          const dateA = new Date(a.periodStart);
          const dateB = new Date(b.periodStart);

          if (dateA < dateB) {
            return 1;
          }
          if (dateA > dateB) {
            return -1;
          }

          return 0;
        });

        for (let i = 0; i < sortedEvaluations.length; i++) {
          const v = sortedEvaluations[i];
          const evaluator05 = v.evaluator.find(
            (f) => Number(f.evaluationOrder) === 0.5,
          );
          const evaluator10 = v.evaluator.find(
            (f) => Number(f.evaluationOrder) === 1.0,
          );
          const evaluator20 = v.evaluator.find(
            (f) => Number(f.evaluationOrder) === 2.0,
          );

          const skills =
            await this.evaluationPeriodRepo.getSkillUserOfEvaluation(v.id);

          results.push({
            id: v.id,
            userId: v.userId,
            updatedTime: v.updatedTime,
            companyName: v.companyName,
            departmentId: v.departmentId || null,
            departmentName: v.departmentName,
            divisionId: v.divisionId || null,
            divisionName: v.divisionName,
            period: `${year}年${periodIndex === 1 ? '上期' : '下期'}`,
            year: String(year),
            periodIndex: periodIndex,
            percentPoint: v.percentPoint,
            level: v.level,
            dateCreationGoalStart: v.dateCreationGoalStart
              ? v.dateCreationGoalStart
              : v.level <= 7
              ? period.dateCreationGoalStart
              : period.dateCreationGoalDepartmentStart,
            dateCreationGoalEnd: v.dateCreationGoalEnd
              ? v.dateCreationGoalEnd
              : v.level <= 7
              ? period.dateCreationGoalEnd
              : period.dateCreationGoalDepartmentEnd,
            dateEvaluationStart: v.dateEvaluationStart,
            dateEvaluationEnd: v.dateEvaluationEnd,
            periodStart: v.periodStart,
            periodEnd: v.periodEnd,
            evaluator05Id: evaluator05?.evaluatorId || null,
            evaluator05: evaluator05?.evaluatorId || null,
            evaluator05Name: evaluator05?.user
              ? `${evaluator05.user.employeeNumber}: ${evaluator05.user.fullName}`
              : '',
            evaluator05Email: evaluator05?.user?.email || '',
            evaluator10Id: evaluator10?.evaluatorId || null,
            evaluator10: evaluator10?.evaluatorId || null,
            evaluator10Name: evaluator10?.user
              ? `${evaluator10.user.employeeNumber}: ${evaluator10.user.fullName}`
              : '',
            evaluator10Email: evaluator10?.user?.email || '',
            evaluator20Id: evaluator20?.evaluatorId || null,
            evaluator20: evaluator20?.evaluatorId || null,
            evaluator20Name: evaluator20?.user
              ? `${evaluator20.user.employeeNumber}: ${evaluator20.user.fullName}`
              : '',
            evaluator20Email: evaluator20?.user?.email || '',
            isEdit: v.status < 50,
            evaluationPeriodId: period.id,
            key: `exception-key-${i}`,
            status: v.status,
            creationUser: v.creationUser,
            createdByCronjob: v.createdByCronjob,
            flagSkill: v.flagSkill,
            skillUser: skills,
          });
        }
      }

      return { period: itemPeriod, evaluations: results };
    }

    return { period: period, evaluations: [] };
  }

  async updateEvaluationPeriodException(
    evaluations: EvaluationByPeriodType[],
    userId: number,
    creationUser: number,
    deleteIds: number[],
    year: number,
    periodIndex: number,
    companyGroupCode: string,
  ) {
    const levelSettings = await this.settingLevelRepo.getLevelSettingPublic(
      companyGroupCode,
    );
    const guideEvaluations =
      await this.guideEvaluationRepository.getGuideEvaluationPublic(
        companyGroupCode,
      );

    const results =
      await this.evaluationPeriodRepo.updateEvaluationPeriodException(
        evaluations,
        userId,
        creationUser,
        deleteIds,
        year,
        periodIndex,
        levelSettings,
        guideEvaluations,
        companyGroupCode,
      );
    const {
      updateGoalPersonal810ByEvaluationIds,
      updateGoalPersonal17ByEvaluationIds,
      resetEvaluationIds,
      evaluationArrays,
      resetPersonalAchievement,
      evaluator05ErrorIds,
      evaluator10ErrorIds,
      evaluatorErrorNames,
      updateBehaviorByEvaluationIds,
    } = results;

    evaluationArrays.forEach((v) => {
      const evaluatorArrays = [];
      if (v.evaluator05 !== null) {
        evaluatorArrays.push(v.evaluator05);
      }
      if (v.evaluator10 !== null) {
        evaluatorArrays.push(v.evaluator10);
      }
      if (v.evaluator20 !== null) {
        evaluatorArrays.push(v.evaluator20);
      }
    });
    if (resetEvaluationIds.length > 0) {
      await this.evaluationPeriodRepo.resetEvaluationData(
        resetEvaluationIds,
        resetPersonalAchievement,
      );
    }

    if (
      updateGoalPersonal810ByEvaluationIds.length > 0 ||
      updateGoalPersonal17ByEvaluationIds.length > 0
    ) {
      await this.evaluationPeriodRepo.updateGoalPersonalByEvaluationIds(
        updateGoalPersonal17ByEvaluationIds,
        updateGoalPersonal810ByEvaluationIds,
      );
    }

    if (updateBehaviorByEvaluationIds.length > 0) {
      await this.evaluationPeriodRepo.updateBehaviorByEvaluationIds(
        updateBehaviorByEvaluationIds,
        companyGroupCode,
      );
    }

    return {
      resetEvaluationIds,
      evaluator05ErrorIds,
      evaluator10ErrorIds,
      evaluatorErrorNames,
      evaluationNewIds: evaluationArrays.map((v) => v.id),
    };
  }

  async getUserPeriodException(
    year: number,
    periodIndex: number,
    listUserId: number[],
    timeZone: string,
  ) {
    const results = await this.evaluationPeriodRepo.getUserPeriodException(
      year,
      periodIndex,
      listUserId,
    );

    const periodCurrent = getPeriodCurrent(null, timeZone);

    const convertPeriod = Number(`${Number(year) + 1}${periodIndex}`);
    const convertPeriodCurrent = Number(
      `${periodCurrent.year}${periodCurrent.periodIndex}`,
    );
    const isDisable = convertPeriodCurrent >= convertPeriod;
    if (results.dataList) {
      const dataList = results.dataList.map((v, index) => {
        v.evaluations.sort((a, b) => a.id - b.id);

        return {
          key: `parent-key-${v.id}-${index}`,
          isEdit: !!v.evaluatorDefault,
          isColSpan: true,
          companyName: `${v.employeeNumber}: ${v.fullName} (${
            v.level > 7 ? v.division?.name : v.department?.name
          })`,
          userId: v.id,
          fullName: `${v.employeeNumber}: ${v.fullName}`,
          email: v.email,
          departmentName: v.level > 7 ? v.division?.name : v.department?.name,
          companyName2: v.company.name,
          childrens: v.evaluations.map((evaluation) => ({
            isEdit: !!v.evaluatorDefault,
            id: v.id,
            userEmail: v.email,
            key: `children-key-${evaluation.id}`,
            companyName: evaluation.companyName,
            departmentName: evaluation.departmentName,
            divisionName: evaluation.divisionName,
            periodStart: evaluation.periodStart,
            periodEnd: evaluation.periodEnd,
            percentPoint: evaluation.percentPoint,
            level: evaluation.level,
            dateCreationGoalStart: evaluation.dateCreationGoalStart,
            // ||
            // (evaluation.level < 8
            //   ? evaluation.evaluationPeriod?.dateCreationGoalStart
            //   : evaluation.evaluationPeriod?.dateCreationGoalDepartmentStart),
            dateCreationGoalEnd: evaluation.dateCreationGoalEnd,
            //  ||
            // (evaluation.level < 8
            //   ? evaluation.evaluationPeriod?.dateCreationGoalEnd
            //   : evaluation.evaluationPeriod?.dateCreationGoalDepartmentEnd),

            dateEvaluationStart: evaluation.dateEvaluationStart,
            dateEvaluationEnd: evaluation.dateEvaluationEnd,
            year: evaluation.evaluationPeriod?.year,
            periodIndex: evaluation.evaluationPeriod?.periodIndex,

            evaluator05: evaluation.evaluator.find(
              (f) => Number(f.evaluationOrder) === 0.5,
            )?.user?.dataValues?.employeeNumberName,
            evaluator05Email: evaluation.evaluator.find(
              (f) => Number(f.evaluationOrder) === 0.5,
            )?.user?.dataValues?.email,
            evaluator10: evaluation.evaluator.find(
              (f) => Number(f.evaluationOrder) === 1.0,
            )?.user?.dataValues?.employeeNumberName,
            evaluator10Email: evaluation.evaluator.find(
              (f) => Number(f.evaluationOrder) === 1.0,
            )?.user?.dataValues?.email,
            evaluator20: evaluation.evaluator.find(
              (f) => Number(f.evaluationOrder) === 2.0,
            )?.user?.dataValues?.employeeNumberName,

            evaluator20Email: evaluation.evaluator.find(
              (f) => Number(f.evaluationOrder) === 2.0,
            )?.user?.dataValues?.email,
            isDisable,
            createdByCronjob: evaluation.createdByCronjob,
            flagSkill: evaluation.flagSkill,
            skillUser: evaluation.skillUser,
          })),
        };
      });

      return {
        dataList: dataList.map((v) => ({
          ...v,
          childrens: v.childrens.sort((a, b) => {
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
        })),
        // count: results.count,
      };
    }
    return { dataList: [] };
  }

  // **
  async getDetailEvaluationPeriodForMail(condition: any) {
    return await this.evaluationPeriodRepo.getPeriodListByCondition(condition);
  }

  //
  async fixEmergencyPeriod810(params: { [x: string]: any }) {
    const transaction = await this.evaluatorRepository.getNewTransaction();
    const periods =
      await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
        year: params.year,
        periodIndex: params.periodIndex,
      });
    const guide = await this.guideEvaluationRepository.findOneGuide({
      status: 4,
      type: 2,
    });
    const listUsers = await this.userRepo.listUserDepartment({
      level: {
        [Op.in]: [8, 10, 9],
      },
      active: 1,
    });
    const arrays810s = [];
    for (let index = 0; index < listUsers.length; index++) {
      arrays810s.push({
        title:
          params.periodIndex === 1
            ? params.year + '年上期'
            : params.year + '年下期',
        userId: listUsers[index].id,
        departmentName: listUsers[index].department.name,
        divisionName: listUsers[index]?.division.name || '',
        companyName: listUsers[index].company.name,
        periodStart: periods.periodStart,
        periodEnd: periods.periodEnd,
        status: 0,
        level: listUsers[index].level,
        evaluationPeriodId: periods.id,
        guideVersionId: guide.id,
        creationUser: null,
      });
    }
    try {
      const results = await this.evaluationRepository.createDepartmentGoals(
        arrays810s,
        transaction,
      );
      const evaluators = [];
      if (results) {
        for (let index = 0; index < results.length; index++) {
          if (results[index].id !== undefined) {
            const evaluatorDefaults05 =
              await this.userRepo.listEvaluatorDefault({
                userId: results[index].userId,
                evaluationPeriodId: periods.id,
              });

            if (evaluatorDefaults05 && evaluatorDefaults05.evaluator05Id) {
              evaluators.push({
                evaluationId: results[index].id,
                evaluatorId: results[index].userId,
                evaluationOrder: Number(0.5),
              });
            }
            if (evaluatorDefaults05 && evaluatorDefaults05.evaluator1Id) {
              evaluators.push({
                evaluationId: results[index].id,
                evaluatorId: results[index].userId,
                evaluationOrder: 1.0,
              });
            }
            if (evaluatorDefaults05 && evaluatorDefaults05.evaluator2Id) {
              evaluators.push({
                evaluationId: results[index].id,
                evaluatorId: results[index].userId,
                evaluationOrder: 2.0,
              });
            }
          }
        }
        await this.evaluatorRepository.createEvaluator(evaluators, transaction);
        await this.historyCronJobRepository.deleteHistory(
          { name: name },
          transaction,
        );
        return await transaction.commit();
      }
    } catch (error) {
      await transaction.rollback();
    }
    //
  }

  async getAllPeriodNotFixedGoalPeriod(day: number, companyGroupCode: string) {
    return await this.evaluationPeriodRepo.getAllPeriodNotFixedGoalPeriod(
      day,
      companyGroupCode,
    );
  }

  async getAllPeriodNotFixedEvalPeriod(day: number, companyGroupCode: string) {
    return await this.evaluationPeriodRepo.getAllPeriodNotFixedEvalPeriod(
      day,
      companyGroupCode,
    );
  }
  async getEvaluationPeriodCurrent(companyGroupCode: string, timeZone: string) {
    const datas =
      await this.managementUserRepository.getEvaluationPeriodCurrent(
        companyGroupCode,
        timeZone,
      );
    if (datas.length === 0) {
      return null;
    }

    return {
      datePersonal: `${datas[0].dateCreationGoalStart} ～ ${datas[0].dateCreationGoalEnd}`,
      dateDepartment: `${datas[0].dateCreationGoalDepartmentStart} ～ ${datas[0].dateCreationGoalDepartmentEnd}`,
      year: datas[0].year,
      periodIndex: datas[0].periodIndex,
    };
  }
}
