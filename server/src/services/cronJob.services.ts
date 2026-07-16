/* eslint-disable no-await-in-loop */
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { UserRepository } from 'src/repository/user.repository';
import { MailService } from './mail.service';
import { isFormatDate } from 'src/common/util';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { CustomLogger } from './logger.service';
import { EvaluationPeriodService } from './evaluationPeriod.service';
import { EvaluationService } from './evaluation.service';
import { Op } from 'sequelize';
import { CompanyGroupService } from './companyGroup.service';
import { EvaluatorRepository } from 'src/repository/evaluator.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';

interface EvaluationAuto {
  id: number;
  status: number;
  level: number;
  creation_user: number;
  user_email: string;
  year: string;
  period_index: number;
  evaluator_05_email: string;
  evaluator_1_email: string;
  evaluator_2_email: string;
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
// moment.tz.setDefault('Asia/Tokyo');
const momentTz = require('moment-timezone');
import * as moment from 'moment';
@Injectable()
export class CronJobServices {
  @Inject(HistoryCronJobRepository)
  private historyCronJobRepository: HistoryCronJobRepository;

  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;

  @Inject(UserRepository)
  private userRepo: UserRepository;

  @Inject(EvaluatorRepository)
  private evaluatorRepository: EvaluatorRepository;

  @Inject(MailService)
  private mailService: MailService;

  @Inject(MailSettingRepository)
  private mailSettingRepository: MailSettingRepository;

  @Inject(EvaluationRepository)
  private evaluationRepository: EvaluationRepository;

  @Inject(EvaluationService)
  private evaluationServices: EvaluationService;

  @Inject(EvaluationPeriodService)
  private evaluationPeriodService: EvaluationPeriodService;

  @Inject(CompanyGroupService)
  private companyGroupService: CompanyGroupService;

  @Inject(VersionSettingRepository)
  private versionSettingRepository: VersionSettingRepository;

  @Inject(GuideEvaluationRepository)
  private guideEvaluationRepository: GuideEvaluationRepository;

  @Inject(ProSkillRepository)
  private proSkillRepository: ProSkillRepository;

  constructor(private logger: CustomLogger) {
    //
  }

  @Cron('0 1 * * * *', {
    timeZone: 'Asia/Tokyo',
    name: 'notifications',
    disabled: false,
  })
  async triggerNotifications() {
    // Lấy tất cả company groups
    const companyGroups = await this.companyGroupService.getCompanyByHour([
      3, 5,
    ]);

    for (const group of companyGroups) {
      this.logger.log(
        null,
        `Running cron job for company: ${group.name}, Timezone: ${group.timezone}`,
      );

      if (group.hour == '3') {
        await this.processCompanyGroupSettingGoals(group);
      } else if (group.hour == '5') {
        await this.processCompanyGroupSendMail(group);
      }
    }
  }

  public async processCompanyGroupSettingGoals(group: any) {
    const historyLists = await this.historyCronJobRepository.getAllByCondition({
      companyGroupCode: group.code,
    });

    for (const history of historyLists) {
      const period =
        history.periodIndex === 1
          ? `${history.year}年上期`
          : `${history.year}年下期`;

      if (history.type === 1) {
        await this.addCronJobSettingDepartmentGoals(
          history.name,
          period,
          history.year,
          history.dateCreationGoalDepartmentStart,
          history.dateCreationGoalDepartmentEnd,
          history.periodIndex,
          history.companyGroupCode,
          group.timezone,
        );
      } else if (history.type === 2) {
        await this.addCronJobSettingPersonalGoals(
          history.name,
          period,
          history.year,
          history.dateCreationGoalStart,
          history.dateCreationGoalEnd,
          history.periodIndex,
          history.companyGroupCode,
          group.timezone,
        );
      }
    }
  }

  // eslint-disable-next-line complexity
  async addCronJobSettingDepartmentGoals(
    name: string,
    title: string,
    year: string,
    start: string,
    end: string,
    periodIndex: number,
    companyGroupCode: string,
    timezone: string,
  ) {
    // type = 1 => createGoalDepartment
    // await this.historyCronJobRepository.add({
    //   name: name,
    //   type: 1,
    //   periodIndex: periodIndex,
    //   dateCreationGoalDepartmentStart: start,
    //   dateCreationGoalDepartmentEnd: end,
    //   year: year,
    // });

    this.logger.log(null, `Check addCronJobSettingDepartmentGoals - ${start}`);
    if (
      isFormatDate(momentTz(new Date()).tz(timezone), 'YYYY/M/D', timezone) ===
      start
    ) {
      this.logger.log(
        null,
        `start addCronJobSettingDepartmentGoals ---${name} - ${momentTz(
          new Date(),
        ).tz(timezone)}`,
      );
      const periodId = await this.evaluationPeriodRepo.findOnePeriod({
        [Op.and]: [
          { periodIndex: periodIndex },
          { year: year },
          {
            dateCreationGoalDepartmentStart: start,
          },
          {
            companyGroupCode: companyGroupCode,
          },
        ],
      });
      if (periodId) {
        const transaction = await this.evaluatorRepository.getNewTransaction();
        await this.proSkillRepository.insertHistoryPublicProSkill(
          year,
          periodIndex,
          companyGroupCode,
        );
        const versionSettings = (
          await this.versionSettingRepository.listPointSettingCron(
            companyGroupCode,
          )
        ).reduce((acc, curr) => {
          acc[curr.type] = curr;
          return acc;
        }, {});

        // version guide
        const guideSkill = await this.guideEvaluationRepository.findOneGuide({
          status: 4,
          type: 2,
          companyGroupCode: companyGroupCode,
        });
        const guideNoSkill = await this.guideEvaluationRepository.findOneGuide({
          status: 4,
          type: 4,
          companyGroupCode: companyGroupCode,
        });

        const listUsers810s = await this.userRepo.listUserDepartmentVersionTwo(
          {
            level: {
              [Op.in]: [8, 9, 10],
            },
            active: 1,
            companyGroupCode: companyGroupCode,
          },
          periodId.id,
        );
        const arrays = [];
        const evaluators = [];
        for (let index = 0; index < listUsers810s.length; index++) {
          if (Object.keys(versionSettings).length > 0) {
            const levelSetting =
              // eslint-disable-next-line no-await-in-loop
              await this.versionSettingRepository.findOneSetting({
                versionId:
                  versionSettings[
                    listUsers810s[index].user.flagSkill === 1 ? 2 : 4
                  ].id,
                level: listUsers810s[index].user.level,
              });
            arrays.push({
              title: title,
              userId: listUsers810s[index].user.id,
              departmentId: listUsers810s[index].user.department
                ? `${listUsers810s[index].user.department.id}`
                : null,
              departmentName: listUsers810s[index].user.department
                ? listUsers810s[index].user.department.name
                : null,
              divisionId: listUsers810s[index]?.user.division
                ? `${listUsers810s[index]?.user.division.id}`
                : null,
              divisionName: listUsers810s[index]?.user.division
                ? listUsers810s[index]?.user.division.name
                : null,
              companyName: listUsers810s[index].user.company
                ? listUsers810s[index].user.company.name
                : null,
              periodStart: periodId.periodStart,
              periodEnd: periodId.periodEnd,
              status: 0,
              level: listUsers810s[index].user.level,
              evaluationPeriodId: periodId.id,
              guideVersionId:
                listUsers810s[index].user.flagSkill === 1
                  ? guideSkill.id
                  : guideNoSkill.id,
              creationUser: null,
              skillPercent:
                listUsers810s[index].user.flagSkill === 1
                  ? levelSetting?.skillPercent || null
                  : null,
              achievementPercent: levelSetting?.achievementPercent || null,
              behaviorPercent: levelSetting?.behaviorPercent || null,
              createdByCronjob: 1,
              flagSkill: listUsers810s[index].user.flagSkill,
              companyGroupCode: listUsers810s[index].user.companyGroupCode,
            });
          } else {
            arrays.push({
              title: title,
              userId: listUsers810s[index].user.id,
              departmentId: listUsers810s[index].user.department
                ? `${listUsers810s[index].user.department.id}`
                : null,
              departmentName: listUsers810s[index].user.department
                ? listUsers810s[index].user.department.name
                : null,
              divisionId: listUsers810s[index]?.user.division
                ? `${listUsers810s[index]?.user.division.id}`
                : null,
              divisionName: listUsers810s[index]?.user.division
                ? listUsers810s[index]?.user.division.name
                : null,
              companyName: listUsers810s[index].user.company
                ? listUsers810s[index].user.company.name
                : null,
              periodStart: periodId.periodStart,
              periodEnd: periodId.periodEnd,
              status: 0,
              level: listUsers810s[index].user.level,
              evaluationPeriodId: periodId.id,
              guideVersionId:
                listUsers810s[index].user.flagSkill === 1
                  ? guideSkill.id
                  : guideNoSkill.id,
              creationUser: null,
              skillPercent: null,
              achievementPercent: null,
              behaviorPercent: null,
              createdByCronjob: 1,
              flagSkill: listUsers810s[index].user.flagSkill,
              companyGroupCode: listUsers810s[index].user.companyGroupCode,
            });
          }
        }
        try {
          const results = await this.evaluationRepository.createDepartmentGoals(
            arrays,
            transaction,
          );
          if (results) {
            this.logger.log(
              null,
              `Creation department goals success - ${results} ---- ${name}`,
            );
            for (let index = 0; index < results.length; index++) {
              if (results[index].id !== undefined) {
                const evaluatorDefaults05 =
                  await this.userRepo.listEvaluatorDefault({
                    userId: results[index].userId,
                    evaluationPeriodId: periodId.id,
                  });

                const condition = {
                  [Op.and]: [
                    { user_id: results[index].userId },
                    {
                      evaluation_period_id: periodId.id,
                    },
                  ],
                };
                const data = {
                  departmentName: results[index].departmentName,
                  level: results[index].level,
                  flagSkill: results[index].flagSkill,
                  departmentId: results[index].departmentId,
                  divisionId: results[index].divisionId,
                  divisionName: results[index].divisionName,
                  companyGroupCode: companyGroupCode,
                };
                await this.userRepo.updateEvaluatorDefault(
                  condition,
                  data,
                  transaction,
                );

                if (evaluatorDefaults05 && evaluatorDefaults05.evaluator05Id) {
                  evaluators.push({
                    evaluationId: results[index].id,
                    evaluatorId: evaluatorDefaults05.evaluator05Id,
                    evaluationOrder: Number(0.5),
                  });
                }
                if (evaluatorDefaults05 && evaluatorDefaults05.evaluator1Id) {
                  evaluators.push({
                    evaluationId: results[index].id,
                    evaluatorId: evaluatorDefaults05.evaluator1Id,
                    evaluationOrder: 1.0,
                  });
                }
                if (evaluatorDefaults05 && evaluatorDefaults05.evaluator2Id) {
                  evaluators.push({
                    evaluationId: results[index].id,
                    evaluatorId: evaluatorDefaults05.evaluator2Id,
                    evaluationOrder: 2.0,
                  });
                }
              }
            }

            await this.evaluatorRepository.createEvaluator(
              evaluators,
              transaction,
            );

            this.logger.log(null, `success creation ${results} --- ${name}`);
            await this.historyCronJobRepository.deleteHistory(
              {
                name: name,
                companyGroupCode: companyGroupCode,
              },
              transaction,
            );
            await transaction.commit();
          }
        } catch (error) {
          this.logger.log(null, `Error exception ${error} --- ${name}`);
          await transaction.rollback();
        }
      } else {
        this.logger.log(null, `No search have period ${periodId} --- ${name}`);
      }
    }

    return true;
  }

  async addCronJobSettingPersonalGoals(
    name: string,
    title: string,
    year: string,
    start: string,
    end: string,
    periodIndex: number,
    companyGroupCode: string,
    timezone: string,
  ) {
    // type = 2 => createGoal

    // await this.historyCronJobRepository.add({
    //   name: name,
    //   type: 2,
    //   periodIndex: periodIndex,
    //   dateCreationGoalStart: start,
    //   dateCreationGoalEnd: end,
    //   year: year,
    // });

    this.logger.log(null, `Check addCronJobSettingPersonalGoals - ${start}`);

    if (
      isFormatDate(momentTz(new Date()).tz(timezone), 'YYYY/M/D', timezone) ===
      start
    ) {
      this.logger.log(
        null,
        `start addCronJobSettingPersonalGoals ---- ${name}`,
      );
      const periodId = await this.evaluationPeriodRepo.findOnePeriod({
        [Op.and]: [
          { periodIndex: periodIndex },
          { year: year },
          {
            dateCreationGoalStart: start,
          },
          {
            companyGroupCode: companyGroupCode,
          },
        ],
      });

      if (periodId) {
        const transaction = await this.evaluatorRepository.getNewTransaction();
        try {
          await this.proSkillRepository.insertHistoryPublicProSkill(
            year,
            periodIndex,
            companyGroupCode,
          );

          // get verion setting
          // Có flag skill  type = 1 : type =3
          const versionSettings = (
            await this.versionSettingRepository.listPointSettingCron(
              companyGroupCode,
            )
          ).reduce((acc, curr) => {
            acc[curr.type] = curr;
            return acc;
          }, {});
          // version guide
          const guideSkill = await this.guideEvaluationRepository.findOneGuide({
            status: 4,
            type: 1,
            companyGroupCode: companyGroupCode,
          });
          const guideNoSkill =
            await this.guideEvaluationRepository.findOneGuide({
              status: 4,
              type: 3,
              companyGroupCode: companyGroupCode,
            });

          const listUsers = await this.userRepo.listUserDepartmentVersionTwo(
            {
              level: {
                [Op.in]: [1, 2, 3, 4, 5, 6, 7],
              },
              active: 1,
              companyGroupCode: companyGroupCode,
            },
            periodId.id,
          );
          const arrays = [];
          const evaluatorsArrays = [];
          for (let index = 0; index < listUsers.length; index++) {
            if (Object.keys(versionSettings).length > 0) {
              const levelSetting =
                // eslint-disable-next-line no-await-in-loop
                await this.versionSettingRepository.findOneSetting({
                  versionId:
                    versionSettings[
                      listUsers[index].user.flagSkill === 1 ? 1 : 3
                    ].id,
                  level: listUsers[index].user.level,
                });
              arrays.push({
                title: title,
                userId: listUsers[index].user.id,
                departmentId: listUsers[index].user.department
                  ? `${listUsers[index].user.department.id}`
                  : null,
                departmentName: listUsers[index].user.department
                  ? listUsers[index].user.department.name
                  : null,
                divisionId: listUsers[index]?.user.division
                  ? `${listUsers[index]?.user.division.id}`
                  : null,
                divisionName: listUsers[index]?.user.division
                  ? listUsers[index]?.user.division.name
                  : null,
                companyName: listUsers[index].user.company.name,
                periodStart: periodId.periodStart,
                periodEnd: periodId.periodEnd,
                status: 0,
                level: listUsers[index].user.level,
                evaluationPeriodId: periodId.id,
                guideVersionId:
                  listUsers[index].user.flagSkill === 1
                    ? guideSkill.id
                    : guideNoSkill.id,
                creationUser: null,
                skillPercent:
                  listUsers[index].user.flagSkill === 1
                    ? levelSetting?.skillPercent || null
                    : null,
                achievementPercent: levelSetting?.achievementPercent || null,
                behaviorPercent: levelSetting?.behaviorPercent || null,
                createdByCronjob: 1,
                flagSkill: listUsers[index].user.flagSkill,
                companyGroupCode: listUsers[index].user.companyGroupCode,
              });
            } else {
              arrays.push({
                title: title,
                userId: listUsers[index].user.id,
                departmentId: listUsers[index].user.department
                  ? `${listUsers[index].user.department.id}`
                  : null,
                departmentName: listUsers[index].user.department
                  ? listUsers[index].user.department.name
                  : null,
                divisionId: listUsers[index]?.user.division
                  ? `${listUsers[index]?.user.division.id}`
                  : null,
                divisionName: listUsers[index]?.user.division
                  ? listUsers[index]?.user.division.name
                  : null,
                companyName: listUsers[index].user.company.name,
                periodStart: periodId.periodStart,
                periodEnd: periodId.periodEnd,
                status: 0,
                level: listUsers[index].user.level,
                evaluationPeriodId: periodId.id,
                guideVersionId:
                  listUsers[index].user.flagSkill === 1
                    ? guideSkill.id
                    : guideNoSkill.id,
                creationUser: null,
                skillPercent: null,
                achievementPercent: null,
                behaviorPercent: null,
                createdByCronjob: 1,
                flagSkill: listUsers[index].user.flagSkill,
                companyGroupCode: listUsers[index].user.companyGroupCode,
              });
            }
          }

          const results = await this.evaluationRepository.createPersonalGoals(
            arrays,
            transaction,
          );
          for (let index = 0; index < results.length; index++) {
            if (results[index].id !== undefined) {
              const evaluatorDefaults05 =
                await this.userRepo.listEvaluatorDefault({
                  userId: results[index].userId,
                  evaluationPeriodId: periodId.id,
                });

              const condition = {
                [Op.and]: [
                  { user_id: results[index].userId },
                  {
                    evaluation_period_id: periodId.id,
                  },
                ],
              };

              const data = {
                departmentName: results[index].departmentName,
                level: results[index].level,
                flagSkill: results[index].flagSkill,
                departmentId: results[index].departmentId,
                divisionId: results[index].divisionId,
                divisionName: results[index].divisionName,
                companyGroupCode: companyGroupCode,
              };
              await this.userRepo.updateEvaluatorDefault(
                condition,
                data,
                transaction,
              );

              if (evaluatorDefaults05 && evaluatorDefaults05.evaluator05Id) {
                evaluatorsArrays.push({
                  evaluationId: results[index].id,
                  evaluatorId: evaluatorDefaults05.evaluator05Id,
                  evaluationOrder: Number(0.5),
                });
              }
              if (evaluatorDefaults05 && evaluatorDefaults05.evaluator1Id) {
                evaluatorsArrays.push({
                  evaluationId: results[index].id,
                  evaluatorId: evaluatorDefaults05.evaluator1Id,
                  evaluationOrder: 1.0,
                });
              }
              if (evaluatorDefaults05 && evaluatorDefaults05.evaluator2Id) {
                evaluatorsArrays.push({
                  evaluationId: results[index].id,
                  evaluatorId: evaluatorDefaults05.evaluator2Id,
                  evaluationOrder: 2.0,
                });
              }
            }
          }
          if (results) {
            this.logger.log(
              null,
              `creation peronal goals success ${results.length} ---- ${name}`,
            );

            await this.evaluatorRepository.createEvaluator(
              evaluatorsArrays,
              transaction,
            );
            await this.historyCronJobRepository.deleteHistory(
              { name: name, companyGroupCode: companyGroupCode },
              transaction,
            );
            await transaction.commit();
          }
        } catch (error) {
          this.logger.error(null, ` ${error} -- ${name}`);
          await transaction.rollback();
        }
      } else {
        this.logger.log(
          null,
          ` Exist period ${periodId} --- ${start} ~ ${end} ---- ${name}`,
        );
      }
    }

    return true;
  }

  public async processCompanyGroupSendMail(group: any) {
    const historyLists = await this.historyCronJobRepository.getAllByCondition({
      companyGroupCode: group.code,
    });

    this.logger.log(
      null,
      `Running cron job  ${historyLists.toString()}   ${new Date()}`,
    );

    for (let index = 0; index < historyLists.length; index++) {
      if (historyLists[index].type === 7) {
        await this.addCronJobSettingSendMailCreation(
          historyLists[index].name,
          historyLists[index].periodIndex,
          historyLists[index].year,
          historyLists[index].dateSendMailEvaluationGoal,
          historyLists[index].type,
          historyLists[index].companyGroupCode,
          group.timezone,
        );
      }
      if (historyLists[index].type === 8) {
        await this.addCronJobSettingSendMailEvaluation(
          historyLists[index].name,
          historyLists[index].periodIndex,
          historyLists[index].year,
          historyLists[index].dateSendMailEvaluationGoal,
          historyLists[index].type,
          historyLists[index].companyGroupCode,
          group.timezone,
        );
      }
      if ([5, 6].includes(historyLists[index].type)) {
        await this.addCronJobExeptionsCreationByUser(
          historyLists[index].name,
          historyLists[index].dateSendMailEvaluationGoal,
          historyLists[index].type,
          historyLists[index].companyGroupCode,
          group.timezone,
        );
      }
    }
  }

  async addCronJobSettingSendMailCreation(
    name: string,
    periodIndex: number,
    year: string,
    dateSendMail: string,
    type: number,
    companyGroupCode: string,
    timezone: string,
  ) {
    this.logger.log(
      null,
      `Check addCronJobSettingSendMailCreation - ${dateSendMail}`,
    );

    if (dateSendMail) {
      if (
        isFormatDate(
          momentTz(new Date()).tz(timezone),
          'YYYY/M/D',
          timezone,
        ) === dateSendMail
      ) {
        this.logger.log(
          null,
          `start addCronJobSettingSendMailCreation---${name} - ${momentTz(
            new Date(),
          ).tz(timezone)}`,
        );
        const getCronb = await this.historyCronJobRepository.findOneByCondition(
          {
            name: name,
            companyGroupCode,
          },
        );
        // type = 3 => send mail create goal
        const periods =
          await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
            id: getCronb.evaluationPeriodId,
          });
        if (periods) {
          // ==============

          const idMailSetting = await this.mailSettingRepository.findOne({
            cronjobId: getCronb.id,
            companyGroupCode: companyGroupCode,
          });

          try {
            for (const email of idMailSetting?.mailTo?.split(',')) {
              let toUserText = ``;
              // eslint-disable-next-line no-await-in-loop
              const username = await this.userRepo.getUserNameFromEmail(
                email,
                companyGroupCode,
              );
              if (username) {
                toUserText += `${username?.fullName?.split(' ')[0]}${
                  username?.fullName?.split(' ')?.length > 1 ? 'さん' : ''
                }<br><br>`;
              }

              await this.mailService.sendMailCustoms(
                [email],
                [],
                idMailSetting.title,
                `${toUserText}${idMailSetting.contentMail}`,
              );
            }

            await this.historyCronJobRepository.deleteHistory(
              { name: name, companyGroupCode: companyGroupCode },
              null,
            );
            await this.mailSettingRepository.updateMailHistory(
              {
                status: 1,
                sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
              },
              idMailSetting.id,
            );
          } catch (error) {
            this.logger.error(
              null,
              `Error send mail  sendMailStartGoalSetting To:${idMailSetting?.mailTo} --- ${name} ---- Error: ${error}`,
            );
          }
        } else {
          this.logger.log(
            null,
            `Exist period  * ${periods} ${dateSendMail}*---${name} - ${new Date()}`,
          );
        }
      }
    }
  }

  async addCronJobSettingSendMailEvaluation(
    name: string,
    periodIndex: number,
    year: string,
    dateSendMail: string,
    type: number,
    companyGroupCode: string,
    timezone: string,
  ) {
    this.logger.log(
      null,
      `Check addCronJobSettingSendMailEvaluationDepartment - ${dateSendMail}`,
    );
    if (dateSendMail) {
      if (
        isFormatDate(
          momentTz(new Date()).tz(timezone),
          'YYYY/M/D',
          timezone,
        ) === dateSendMail
      ) {
        const getCronb = await this.historyCronJobRepository.findOneByCondition(
          {
            name: name,
            companyGroupCode,
          },
        );
        this.logger.log(
          null,
          `Running addCronJobSettingSendMailEvaluationDepartment  ---${name} - ${momentTz(
            new Date(),
          ).tz(timezone)}`,
        );
        const periods =
          await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
            id: getCronb.evaluationPeriodId,
          });

        if (periods) {
          const idMailSetting = await this.mailSettingRepository.findOne({
            cronjobId: getCronb.id,
            companyGroupCode: companyGroupCode,
          });

          try {
            for (const email of idMailSetting?.mailTo?.split(',')) {
              let toUserText = ``;
              // eslint-disable-next-line no-await-in-loop
              const username = await this.userRepo.getUserNameFromEmail(
                email,
                companyGroupCode,
              );
              if (username) {
                toUserText += `${username?.fullName?.split(' ')[0]}${
                  username?.fullName?.split(' ')?.length > 1 ? 'さん' : ''
                }<br><br>`;

                const conditionCountException = {
                  userId: username.id,
                  evaluationPeriodId: getCronb.evaluationPeriodId,
                  creationUser: { [Op.ne]: null },
                  dateEvaluationStart: { [Op.ne]: null },
                  dateEvaluationEnd: { [Op.ne]: null },
                };

                const countException =
                  await this.userRepo.countEvaluationException(
                    conditionCountException,
                  );

                if (countException > 0) {
                  const condition17 = {
                    userId: username.id,
                    evaluationPeriodId: getCronb.evaluationPeriodId,
                    creationUser: { [Op.ne]: null },
                    dateEvaluationStart: periods.dateEvaluationStart,
                    dateEvaluationEnd: periods.dateEvaluationEnd,
                    level: { [Op.lte]: 7 },
                  };
                  const exception17 =
                    await this.userRepo.countEvaluationException(condition17);

                  const condition810 = {
                    userId: username.id,
                    evaluationPeriodId: getCronb.evaluationPeriodId,
                    creationUser: { [Op.ne]: null },
                    dateEvaluationStart: periods.dateEvaluationDepartmentStart,
                    dateEvaluationEnd: periods.dateEvaluationDepartmentEnd,
                    level: { [Op.gte]: 8 },
                  };
                  const exception810 =
                    await this.userRepo.countEvaluationException(condition810);
                  if (!exception17 && !exception810) {
                    continue;
                  }
                }
              }
              await this.mailService.sendMailCustoms(
                [email],
                [],
                idMailSetting.title,
                `${toUserText}${idMailSetting.contentMail}`,
              );
            }

            await this.historyCronJobRepository.deleteHistory(
              { name: name, companyGroupCode: companyGroupCode },
              null,
            );
            this.mailSettingRepository.updateMailHistory(
              {
                status: 1,
                sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
              },
              idMailSetting.id,
            );
          } catch (error) {
            this.logger.error(
              null,
              `Error send mail  sendMailStartGoalSetting To:${idMailSetting?.mailTo} --- ${name} ---- Error: ${error}`,
            );
          }
        } else {
          this.logger.log(
            null,
            `Exist period  * ${periods} ${dateSendMail}*---${name} - ${new Date()}`,
          );
        }
      }
    }
  }

  // =================
  async addCronJobExeptionsCreationByUser(
    name: string,
    dateSendMail: string,
    type: number,
    companyGroupCode: string,
    timezone: string,
  ) {
    this.logger.log(
      null,
      `Check addCronJobExeptionsCreationByUser - ${dateSendMail}`,
    );

    if (dateSendMail) {
      if (
        isFormatDate(
          momentTz(new Date()).tz(timezone),
          'YYYY/M/D',
          timezone,
        ) === dateSendMail
      ) {
        this.logger.log(
          null,
          `Running addCronJobExeptionsCreationByUser  * ${dateSendMail} *---${name} - ${momentTz(
            new Date(),
          ).tz(timezone)}`,
        );
        // const toEmails = [];
        const getCronb = await this.historyCronJobRepository.findOneByCondition(
          {
            name: name,
            companyGroupCode,
          },
        );
        const periods =
          await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
            id: getCronb.evaluationPeriodId,
          });

        if (periods) {
          const listMailTo = await this.mailSettingRepository.findOne({
            cronjobId: getCronb.id,
            companyGroupCode: companyGroupCode,
          });

          try {
            let infoEmail = listMailTo.contentMail;
            const mailUser = listMailTo?.mailTo;
            const toUser = await this.userRepo.getUserNameFromEmail(
              mailUser,
              companyGroupCode,
            );
            infoEmail = infoEmail.replace(
              /{{toUser}}/gi,
              toUser?.fullName?.toString()?.split(' ')[0] +
                `${
                  toUser?.fullName?.toString()?.split(' ')?.length > 1
                    ? 'さん'
                    : ''
                }`,
            );

            // CC evaluator
            const ccEmails: string[] = [];
            if (listMailTo?.mailCC?.split(',').length > 0) {
              const listNameCCs = [];
              for (const evaluator of listMailTo?.mailCC?.split(',')) {
                ccEmails.push(evaluator);
                const nameCC = await this.userRepo.getUserByEmail(
                  evaluator,
                  companyGroupCode,
                );
                if (nameCC) {
                  listNameCCs.push(nameCC.fullName);
                }
              }
              infoEmail = infoEmail.replace(
                /{{ccEvaluator}}/gi,
                listNameCCs
                  .map(
                    (e) =>
                      `${e?.toString()?.split(' ')[0]}${
                        e?.toString()?.split(' ')?.length > 1 ? 'さん' : ''
                      }`,
                  )
                  .join('、'),
              );
            } else {
              infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, '');
            }

            await this.mailService.sendMailCustoms(
              [mailUser],
              ccEmails,
              listMailTo.title,
              infoEmail,
            );

            await this.historyCronJobRepository.deleteHistory(
              { name: name, companyGroupCode: companyGroupCode },
              null,
            );
            this.mailSettingRepository.updateMailHistory(
              {
                status: 1,
                sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
                contentMail: infoEmail,
              },
              listMailTo.id,
            );
          } catch (error) {
            this.logger.error(
              null,
              `Error send mail  sendMailStartGoalSetting To:${listMailTo?.mailTo} --- ${name} ---- Error: ${error}`,
            );
          }
        } else {
          this.logger.log(
            null,
            `Exist period  * ${periods} -  ${dateSendMail}*---${name} - ${new Date()}`,
          );
        }
      }
    }
  }

  getDayStrSendMail(day: number) {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + day);
    const dateStr = `${dateNow.getFullYear()}/${
      dateNow.getMonth() + 1
    }/${dateNow.getDate()}`;

    return dateStr;
  }

  getListEmailFromEvaluation(listEvaluation: EvaluationAuto[]) {
    let listEmail = [];

    listEvaluation.forEach((item) => {
      if (
        [0, 1, 2, 50, 51, 52].includes(item.status) &&
        item.user_email !== null &&
        !listEmail.some((email) => email === item.user_email)
      ) {
        listEmail.push(item.user_email);
      }

      if (
        [3, 4, 53, 54, 55].includes(item.status) &&
        item.evaluator_05_email !== null &&
        !listEmail.some((email) => email === item.evaluator_05_email)
      ) {
        listEmail.push(item.evaluator_05_email);
      }

      if (
        [5, 6, 56, 57, 58].includes(item.status) &&
        item.evaluator_1_email !== null &&
        !listEmail.some((email) => email === item.evaluator_1_email)
      ) {
        listEmail.push(item.evaluator_1_email);
      }

      if (
        [7, 8, 59, 60, 61].includes(item.status) &&
        item.evaluator_2_email !== null &&
        !listEmail.some((email) => email === item.evaluator_2_email)
      ) {
        listEmail.push(item.evaluator_2_email);
      }
    });

    return listEmail;
  }

  @Cron('0 0 10 * * *', {
    timeZone: 'Asia/Tokyo',
    name: 'remindEvaluation',
    disabled: false,
  })
  async handleCronJobSendMailRemindEvaluation() {
    this.logger.log(null, `Check addCronJobSendMailRemindEvaluation`);

    const listCompanyGroup =
      await this.companyGroupService.getAllCompanyGroup();

    for (const companyGroup of listCompanyGroup) {
      this.logger.log(null, `check companyGroupCode - ${companyGroup.code}`);
      const resultGoals =
        await this.mailService.getSettingSendMailRemindGoalUserPeriod(
          companyGroup.code,
        );
      for (const data of resultGoals) {
        const { goalActive, goalDays } = data;

        if (goalActive) {
          for (let day of goalDays) {
            const dateEndStr = this.getDayStrSendMail(day);
            await this.sendMailRemindGoalPeriod(
              day,
              dateEndStr,
              companyGroup.code,
              companyGroup.emailHR,
            );
          }
        }
      }

      const resultEvals =
        await this.mailService.getSettingSendMailRemindEvalPeriod(
          companyGroup.code,
        );
      for (const data of resultEvals) {
        const { evalActive, evalDays } = data;
        if (evalActive) {
          for (let day of evalDays) {
            const dateEndStr = this.getDayStrSendMail(day);
            await this.sendMailRemindEvalPeriod(
              day,
              dateEndStr,
              companyGroup.code,
              companyGroup.emailHR
            );
          }
        }
      }
    }
  }

  async sendMailRemindGoalPeriod(
    day: number,
    dateEndStr: string,
    companyGroupCode: string,
    emailHR: string,
  ) {
    const listGoalPeriodRaw: [
      [
        {
          id: number;
          year: string;
          period_index: number;
        },
      ],
      {},
    ] = await this.evaluationPeriodService.getAllPeriodNotFixedGoalPeriod(
      day,
      companyGroupCode,
    );
    const listGoalPeriod = listGoalPeriodRaw[0];
    if (listGoalPeriod.length > 0) {
      for (
        let indexPeriod = 0;
        indexPeriod < listGoalPeriod.length;
        indexPeriod++
      ) {
        const period = listGoalPeriod[indexPeriod];

        const listEvaluationGoalRaw: [
          [
            {
              id: number;
              status: number;
              level: number;
              division_name: string;
              creation_user: number;
              user_email: string;
              user_full_name: string;
              year: string;
              period_index: number;
              evaluator_05_email: string;
              evaluator_05_full_name: string;
              evaluator_1_email: string;
              evaluator_1_full_name: string;
              evaluator_2_email: string;
              evaluator_2_full_name: string;
            },
          ],
          {},
        ] = await this.evaluationServices.getEvalNotFixedGoalPeriod(
          period.year,
          period.period_index,
          day,
          companyGroupCode,
        );
        const listEvaluationGoal = listEvaluationGoalRaw[0];
        let listEmailGoal = this.getListEmailFromEvaluation(listEvaluationGoal);
        const { title, content } =
          await this.mailService.getMailNotiGoalNotFixed(
            period.year,
            period.period_index,
            dateEndStr,
            listEmailGoal,
            companyGroupCode,
          );
        const dataNotFixedGoal = {
          listEvaluation: listEvaluationGoal,
          toEmails: listEmailGoal,
          title,
          content,
          type: 'notFixedGoal',
          emailType: 1,
          evaluationPeriodId: period.id,
          companyGroupCode: companyGroupCode,
        };

        await this.evaluationServices.sendMaiNotFixed(
          dataNotFixedGoal,
          emailHR,
        );
      }
    }
  }

  async sendMailRemindEvalPeriod(
    day: number,
    dateEndStr: string,
    companyGroupCode: string,
    emailHR: string,
  ) {
    const listEvalPeriodRaw: [
      [
        {
          id: number;
          year: string;
          period_index: number;
        },
      ],
      {},
    ] = await this.evaluationPeriodService.getAllPeriodNotFixedEvalPeriod(
      day,
      companyGroupCode,
    );
    const listEvalPeriod = listEvalPeriodRaw[0];
    if (listEvalPeriod.length > 0) {
      for (
        let indexPeriod = 0;
        indexPeriod < listEvalPeriod.length;
        indexPeriod++
      ) {
        const period = listEvalPeriod[indexPeriod];

        const listEvaluationEvalRaw: [
          [
            {
              id: number;
              status: number;
              level: number;
              division_name: string;
              creation_user: number;
              user_email: string;
              user_full_name: string;
              year: string;
              period_index: number;
              evaluator_05_email: string;
              evaluator_05_full_name: string;
              evaluator_1_email: string;
              evaluator_1_full_name: string;
              evaluator_2_email: string;
              evaluator_2_full_name: string;
            },
          ],
          {},
        ] = await this.evaluationServices.getEvalNotFixedEvalPeriod(
          period.year,
          period.period_index,
          day,
          companyGroupCode,
        );
        const listEvaluationEval = listEvaluationEvalRaw[0];
        let listEmailEval = this.getListEmailFromEvaluation(listEvaluationEval);

        const { title, content } =
          await this.mailService.getMailNotiEvalNotFixed(
            period.year,
            period.period_index,
            dateEndStr,
            listEmailEval,
            companyGroupCode,
          );

        const dataNotFixedEval = {
          listEvaluation: listEvaluationEval,
          toEmails: listEmailEval,
          title,
          content,
          type: 'notFixedEval',
          emailType: 3,
          evaluationPeriodId: period.id,
          companyGroupCode,
        };
        await this.evaluationServices.sendMaiNotFixed(dataNotFixedEval, emailHR);
      }
    }
  }
}
