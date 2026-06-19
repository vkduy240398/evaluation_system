import { Injectable, Inject } from '@nestjs/common';
import { compareDatePeriod, isFormatDate } from 'src/common/util';
import { DetailBasicBehavior } from 'src/interfaces/criteriaManagement';
import { BasicBehaviorRepositoryI } from 'src/interfaces/repository/basicBehavior.repository.interfaces';
import { BasicBehaviorSearchInterfaces } from 'src/interfaces/service/basicBehavior.interfaces';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { BasicBehaviorRepository } from 'src/repository/basicBehavior.repository';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { MailService } from './mail.service';
import { VersionSettingRepositoryI } from 'src/interfaces/repository/versionSetting.repository.interface';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { Op } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
// moment.tz.setDefault('Asia/Tokyo');
import * as moment from 'moment';
@Injectable()
export class BasicBehaviorServices {
  @Inject(BasicBehaviorRepository)
  private basicBehaviorRepo: BasicBehaviorRepositoryI;
  @Inject(MailService)
  private mailService: MailService;
  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;

  @Inject(VersionSettingRepository)
  private versionSettingRepository: VersionSettingRepositoryI;
  async searchListBasicBehavior(params: BasicBehaviorSearchInterfaces) {
    const results = await this.basicBehaviorRepo.listBasicBehavior(params);
    const counts = results.total;
    const datas = results.data;
    const arrays = [];
    for (let index = 0; index < datas.length; index++) {
      let statusName = '';
      if (datas[index].status === 1) {
        statusName = '編集中';
      } else if (datas[index].status === 2) {
        statusName = '取消';
      } else if (datas[index].status === 3) {
        statusName = '非公開';
      } else if (datas[index].status === 4) {
        statusName = '公開中';
      }
      arrays.push({
        key: datas[index].id,
        level: this.displayLevel(datas[index].type, datas[index].level),
        versionNo: datas[index].version + '.' + datas[index].subVersion,
        state: statusName,
        updatedBy: datas[index].user?.fullName,
        updatedAt: datas[index].updatedTime,
        releasedDate: datas[index].publicDate,
        status: datas[index].status,
        type: datas[index].type,
        lastUpdatedTime: datas[index].lastUpdatedTime,
      });
    }
    return {
      dataSources: arrays,
      counts,
    };
  }

  displayLevel(type: any, level: any) {
    if (type == 1) {
      return '1 ～ 7等級';
    } else if (type == 4) {
      return '8 ～ 10等級';
    } else {
      return level;
    }
  }

  async getInformationCriteria(
    id: number,
    isEdit: string,
    companyGroupCode: string,
  ) {
    const datas = await this.basicBehaviorRepo.inforCriteria(id);

    //  ====================== lấy list điểm version_setting_tbl ==========================
    let type: number;
    if (datas.length > 0) {
      // ====  get list 難易度
      const listPoints = [];
      if (isEdit === 'true') {
        //** basic skill (level == null)*/
        if (datas[0].versionBasicBehavior.level === null) {
          if (datas[0].versionBasicBehavior.type === 1) {
            type = 1; // type basic level 1-7
          } else if (datas[0].versionBasicBehavior.type === 4) {
            type = 2; // type basic level 8-10
          }
          const listPointBasics =
            await this.versionSettingRepository.listPointSettingByType(
              type,
              companyGroupCode,
            );
          if (listPointBasics) {
            for (
              let index = 1;
              index <= listPointBasics.basicMaxDifficulty;
              index++
            ) {
              listPoints.push({
                value: index,
                label: index,
              });
            }
          }
        } else {
          //** Behavior skill (level != null) */
          if (datas[0].versionBasicBehavior.type === 2) {
            type = 1; // type behavior 1-7 (have skill)
          } else if (datas[0].versionBasicBehavior.type === 3) {
            type = 3; // type behavior 1-7 (no skill)
          } else if (datas[0].versionBasicBehavior.type === 5) {
            type = 2; // type behavior 8-10 (have skill)
          } else if (datas[0].versionBasicBehavior.type === 6) {
            type = 4; // type behavior 8-10 (no skill)
          }
          const listPointBehavior =
            await this.versionSettingRepository.listPointSettingByType(
              type,
              companyGroupCode,
            );

          if (listPointBehavior) {
            for (
              let index = 1;
              index <= listPointBehavior.behaviorMaxWeight;
              index++
            ) {
              listPoints.push({
                value: index,
                label: index,
              });
            }
          }
        }
      }
      // ==================
      const maxVersion = await this.basicBehaviorRepo.maxSubVersion({
        version: datas[0].versionBasicBehavior.version,
        type: datas[0].versionBasicBehavior.type,
        level: datas[0].versionBasicBehavior.level,
        companyGroupCode: companyGroupCode,
      });

      // Check có version nào đang được chỉnh sửa ở thời điểm hiện tại hk
      const editAlreadys = await this.basicBehaviorRepo.findAllByCondition({
        [Op.and]: [
          { type: datas[0].versionBasicBehavior.type },
          { level: datas[0].versionBasicBehavior.level },
          { status: 1 },
          {
            id: { [Op.notIn]: [id] },
          },
          { companyGroupCode: companyGroupCode },
        ],
      });

      const results = datas.reduce((acc: DetailBasicBehavior[], curr) => {
        const index = acc.find((v) => v.versionId === curr.versionId);
        const childrens = {
          id: Math.random().toString(36).slice(4),
          versionId: curr.versionId,
          title: curr.title,
          content: curr.content,
          difficulty: curr.difficulty,
        };
        let statusName = '';
        if (curr.versionBasicBehavior.status === 1) {
          statusName = '編集中';
        } else if (curr.versionBasicBehavior.status === 2) {
          statusName = '取消';
        } else if (curr.versionBasicBehavior.status === 3) {
          statusName = '非公開';
        } else if (curr.versionBasicBehavior.status === 4) {
          statusName = '公開中';
        }
        if (!index) {
          acc.push({
            id: curr.versionBasicBehavior.id,
            versionId: curr.versionId,
            createdTime: isFormatDate(
              curr.versionBasicBehavior.createdTime,
              'YYYY/M/D',
            ),
            creationUser: curr.versionBasicBehavior.creationUser,
            publicDate: curr.versionBasicBehavior.publicDate,
            reason: curr.versionBasicBehavior.reason,
            status: curr.versionBasicBehavior.status,
            subVersion: curr.versionBasicBehavior.subVersion,
            type: curr.versionBasicBehavior.type,
            updatedTime: curr.versionBasicBehavior.updatedTime,
            lastUpdatedTime: curr.versionBasicBehavior.lastUpdatedTime,
            statusName: statusName,
            updatedBy: curr.versionBasicBehavior?.user?.fullName || '',
            version: curr.versionBasicBehavior.version,
            timer: curr.versionBasicBehavior.updatedTime,
            level: this.displayLevel(
              curr.versionBasicBehavior.type,
              curr.versionBasicBehavior.level,
            ),
            children: [childrens],
          });
        } else {
          index.children.push(childrens);
        }
        return acc;
      }, []);

      return {
        data: results[0],
        subVersion: maxVersion,
        listPoints: listPoints,
        edited: editAlreadys.length > 0,
      };
    } else {
      const arraySteps = await this.basicBehaviorRepo.inforCriteriaStep(id);
      // Check có version nào đang được chỉnh sửa ở thời điểm hiện tại hk

      const editAlreadys = await this.basicBehaviorRepo.findAllByCondition({
        [Op.and]: [
          { type: arraySteps.type },
          { level: arraySteps.level },
          { status: 1 },
          {
            id: { [Op.notIn]: [parseInt(id.toString())] },
          },
          { companyGroupCode: companyGroupCode },
        ],
      });
      // ====  get list 難易度
      const listPoints = [];
      if (isEdit === 'true') {
        //** basic skill (level == null)*/
        if (arraySteps.level === null) {
          if (arraySteps.type === 1) {
            type = 1; // type basic level 1-7
          } else if (arraySteps.type === 4) {
            type = 2; // type basic level 8-10
          }
          const listPointBasics =
            await this.versionSettingRepository.listPointSettingByType(
              type,
              companyGroupCode,
            );
          if (listPointBasics) {
            for (
              let index = 1;
              index <= listPointBasics.basicMaxDifficulty;
              index++
            ) {
              listPoints.push({
                value: index,
                label: index,
              });
            }
          }
        } else {
          //** Behavior skill (level != null) */
          if (arraySteps.type === 2) {
            type = 1; // type behavior 1-7 (have skill)
          } else if (arraySteps.type === 3) {
            type = 3; // type behavior 1-7 (no skill)
          } else if (arraySteps.type === 5) {
            type = 2; // type behavior 8-10 (have skill)
          } else if (arraySteps.type === 6) {
            type = 4; // type behavior 8-10 (no skill)
          }
          const listPointBehavior =
            await this.versionSettingRepository.listPointSettingByType(
              type,
              companyGroupCode,
            );
          if (listPointBehavior) {
            for (
              let index = 1;
              index <= listPointBehavior.behaviorMaxWeight;
              index++
            ) {
              listPoints.push({
                value: index,
                label: index,
              });
            }
          }
        }
      }
      // =============================================================
      const maxVersion = await this.basicBehaviorRepo.maxSubVersion({
        version: arraySteps.version,
        type: arraySteps.type,
        level: arraySteps.level,
        companyGroupCode: companyGroupCode,
      });

      const results = [];
      let statusName = '';
      if (arraySteps.status === 1) {
        statusName = '編集中';
      } else if (arraySteps.status === 2) {
        statusName = '取消';
      } else {
        statusName = '編集済み';
      }
      results.push({
        id: arraySteps.id,
        versionId: arraySteps.id,
        createdTime: isFormatDate(arraySteps.createdTime, 'YYYY/M/D'),
        creationUser: arraySteps.creationUser,
        publicDate: arraySteps.publicDate,
        reason: arraySteps.reason,
        status: arraySteps.status,
        subVersion: arraySteps.subVersion,
        type: arraySteps.type,
        updatedTime: isFormatDate(arraySteps.updatedTime, 'YYYY/M/D H:mm'),
        statusName: statusName,
        updatedBy: arraySteps.user?.fullName || '',
        version: arraySteps.version,
        timer: arraySteps.updatedTime,
        lastUpdatedTime: arraySteps.lastUpdatedTime,
        level: this.displayLevel(arraySteps.type, arraySteps.level),
        children: [],
      });
      return {
        data: results[0],
        subVersion: maxVersion,
        listPoints: listPoints,
        edited: editAlreadys.length > 0,
      };
    }
  }

  async publicVersion(params) {
    const type17 = [1, 2, 3];
    const type810 = [4, 5, 6];
    const currentVersion = await this.basicBehaviorRepo.findOne(
      params.versionId,
    );
    const years = moment().tz(params.timeZone);
    const periods = await this.evaluationPeriodRepo.getAll({
      [Op.and]: [
        {
          [Op.or]: [
            { year: years.tz(params.timeZone).format('YYYY') },
            { year: years.add(-1, 'y').tz(params.timeZone).format('YYYY') },
          ],
        },
        {
          companyGroupCode: params.companyGroupCode,
        },
        {
          checkFixed: { [Op.ne]: 2 },
        },
      ],
    });
    for (let index = 0; index < periods.length; index++) {
      if (
        compareDatePeriod(
          periods[index].dateCreationGoalStart,
          periods[index].dateCreationGoalEnd,
          params.timeZone
        ) &&
        type17.includes(currentVersion.type)
      ) {
        return {
          code: 403,
          start: periods[index].dateCreationGoalStart,
          end: periods[index].dateCreationGoalEnd,
        };
      } else if (
        compareDatePeriod(
          periods[index].dateCreationGoalDepartmentStart,
          periods[index].dateCreationGoalDepartmentEnd,
          params.timeZone
        ) &&
        type810.includes(currentVersion.type)
      ) {
        return {
          code: 403,
          start: periods[index].dateCreationGoalDepartmentStart,
          end: periods[index].dateCreationGoalDepartmentEnd,
        };
      }
    }

    if (
      new Date(currentVersion.updatedTime).getTime() ===
      new Date(params.timer).getTime()
    ) {
      const transactionBehaviorBasic =
        await this.basicBehaviorRepo.transactionBehaviorBasic();
      try {
        await this.basicBehaviorRepo.updateAllVersionToPrivate(
          {
            status: 4,
            type: currentVersion.type,
            level: currentVersion.level,
            companyGroupCode: params.companyGroupCode,
          },
          transactionBehaviorBasic,
        );

        if (currentVersion.subVersion !== 0) {
          const newVersion = await this.basicBehaviorRepo.maxVersion(
            {
              type: params.type,
              companyGroupCode: params.companyGroupCode,
            },
            'version',
          );

          const objects = {
            version: newVersion + 1,
            subVersion: 0,
            publicDate: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              params.timeZone,
            ),
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              params.timeZone,
            ),
            creationUser: params?.userId,
            status: 4,
            companyGroupCode: params.companyGroupCode,
          };
          // this.mailService.sendMailPublicBasicAndBehavior(
          //   newVersion + 1,
          //   '0',
          //   params.hostname,
          //   currentVersion.type,
          //   currentVersion.level,
          // );
          const results = await this.basicBehaviorRepo.updateVersion(
            params.versionId,
            objects,
            transactionBehaviorBasic,
          );
          await transactionBehaviorBasic.commit();
          return results;
        } else {
          const objects = {
            version: params.version,
            subVersion: params.subVersion,
            publicDate: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              params.timeZone,
            ),
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              params.timeZone,
            ),
            creationUser: params?.userId,
            status: 4,
            companyGroupCode: params.companyGroupCode,
          };

          // this.mailService.sendMailPublicBasicAndBehavior(
          //   params.version,
          //   params.subVersion,
          //   params.hostname,
          //   currentVersion.type,
          //   currentVersion.level,
          // );

          const results = await this.basicBehaviorRepo.updateVersion(
            params.versionId,
            objects,
            transactionBehaviorBasic,
          );

          await transactionBehaviorBasic.commit();
          return results;
        }
      } catch (error) {
        await transactionBehaviorBasic.rollback();
        throw new RuntimeException(error, 500);
      }
    } else {
      throw new RuntimeException('Invalid time', 409);
    }
  }

  async saveDraftData(
    body: any,
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {

    const currentVersion = await this.basicBehaviorRepo.findOne(body.id);
    const editAlreadys = await this.basicBehaviorRepo.findAllByCondition({
      [Op.and]: [
        { type: currentVersion.type },
        { level: currentVersion.level },
        {
          status: 1,
        },
        {
          id: { [Op.notIn]: [currentVersion.id] },
        },
        {
          companyGroupCode: companyGroupCode,
        },
      ],
    });

    if (editAlreadys.length > 0) {
      return {
        id: body.id,
        timer: body.updated,
        subVersion: body.subVersion,
        version: body.version,
        status: body.status,
        lastUpdatedTime: body.updated,
        edited: true,
        code: 406,
      };
    }
    if (![1, 4].includes(currentVersion.status)) {
      return {
        code: 407,
        id: currentVersion.id,
        status: currentVersion.status,
        type: body.type,
      };
    }
    if (
      new Date(currentVersion.updatedTime).getTime() ===
      new Date(body.updated).getTime()
    ) {
      if (currentVersion.status !== 4 && currentVersion.status !== 1) {
        return {
          id: body.id,
          timer: body.updated,
          subVersion: body.subVersion,
          version: body.version,
          status: body.status,
          lastUpdatedTime: body.updated,
          edited: true,
          code: 407,
        };
      }

      const transactionBehaviorBasic =
        await this.basicBehaviorRepo.transactionBehaviorBasic();
      if (body.status === 3 || body.status === 4) {
        try {
          const objectNewVersion = {
            type: body.type,
            version: body.version,
            subVersion: body.subVersion + 1,
            creationUser: userId,
            status: 1,
            level: currentVersion.level,
            reason: body.reason,
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
            companyGroupCode: companyGroupCode,
          };

          this.basicBehaviorRepo.updateVersion(
            body.id,
            {
              type: body.type,
              companyGroupCode: companyGroupCode,
            },
            transactionBehaviorBasic,
          );

          const versionId = await this.basicBehaviorRepo.createNewVersion(
            objectNewVersion,
          );

          const childrens = body.childrens.map((v) => {
            if (isNaN(parseInt(v.difficulty))) {
              v.difficulty = null;
            }
            delete v.id;
            v.versionId = versionId.id;
            return v;
          });
          await this.basicBehaviorRepo.createBulkListProSkill(
            childrens,
            transactionBehaviorBasic,
          );
          await transactionBehaviorBasic.commit();
          return {
            id: versionId.id,
            updatedTime: versionId.updatedTime,
            subVersion: versionId.subVersion,
            version: versionId.version,
            status: versionId.status,
            lastUpdatedTime: versionId.lastUpdatedTime,
            code: 200,
          };
        } catch (error) {
          await transactionBehaviorBasic.rollback();
          throw new RuntimeException(error, 500);
        }
      } else if (body.status === 1) {
        try {
          const result = await this.basicBehaviorRepo.updateVersion(
            body.id,
            {
              type: body.type,
              creationUser: userId,
              lastUpdatedTime: isFormatDate(
                new Date(),
                'YYYY/M/D H:mm',
                timeZone,
              ),
              reason: body.reason,
              companyGroupCode: companyGroupCode,
            },
            transactionBehaviorBasic,
          );
          await this.basicBehaviorRepo.deleteAllListVersion(
            body.id,
            transactionBehaviorBasic,
          );
          const childrens = body.childrens.map((v) => {
            if (isNaN(parseInt(v.difficulty))) {
              v.difficulty = null;
            }
            delete v.id;
            v.versionId = body.id;
            return v;
          });

          await this.basicBehaviorRepo.createBulkListProSkill(
            childrens,
            transactionBehaviorBasic,
          );
          await transactionBehaviorBasic.commit();
          return {
            id: result[1][0].id,
            updatedTime: result[1][0].updatedTime,
            lastUpdatedTime: result[1][0].lastUpdatedTime,
            subVersion: result[1][0].subVersion,
            version: result[1][0].version,
            status: 1,
            code: 200,
          };
        } catch (error) {
          await transactionBehaviorBasic.rollback();
          throw new RuntimeException(error, 500);
        }
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }

  async cancelVersionPro(
    versionId: number,
    userId: number,
    body: any,
    companyGroupCode: string,
  ) {
    const version = await this.basicBehaviorRepo.findOne(versionId);
    if (
      version.status === 1 &&
      new Date(version.updatedTime).getTime() === new Date(body.timer).getTime()
    ) {
      return await this.basicBehaviorRepo.cancelVersionProSkill(
        versionId,
        userId,
        companyGroupCode,
      );
    }
    throw new RuntimeException('No status valid or Date', 409);
  }

  async savePublicVersion(params) {
    const type17 = [1, 2, 3];
    const type810 = [4, 5, 6];
    const years = moment().tz(params.timeZone);
    const periods = await this.evaluationPeriodRepo.getAll({
      [Op.and]: [
        {
          [Op.or]: [
            { year: years.tz(params.timeZone).format('YYYY') },
            { year: years.add(-1, 'y').tz(params.timeZone).format('YYYY') },
          ],
        },
        {
          companyGroupCode: params.companyGroupCode,
        },
        {
          checkFixed: { [Op.ne]: 2 },
        },
      ],
    });
    for (let index = 0; index < periods.length; index++) {
      if (
        compareDatePeriod(
          periods[index].dateCreationGoalStart,
          periods[index].dateCreationGoalEnd,
          params.timeZone
        ) &&
        type17.includes(params.type)
      ) {
        return {
          code: 403,
          start: periods[index].dateCreationGoalStart,
          end: periods[index].dateCreationGoalEnd,
        };
      } else if (
        compareDatePeriod(
          periods[index].dateCreationGoalDepartmentStart,
          periods[index].dateCreationGoalDepartmentEnd,
          params.timeZone
        ) &&
        type810.includes(params.type)
      ) {
        return {
          code: 403,
          start: periods[index].dateCreationGoalDepartmentStart,
          end: periods[index].dateCreationGoalDepartmentEnd,
        };
      }
    }
    const currentVersion = await this.basicBehaviorRepo.findOne(
      params.versionId,
    );
    if (![1, 4].includes(currentVersion.status)) {
      return {
        code: 407,
        id: params.versionId,
        status: currentVersion.status,
        type: params.type,
      };
    }

    //* check điểm độ khó với version setting
    let typeVersionSetting;
    let listPointDiffent = [];
    if (params.type == 1 || params.type == 2) {
      typeVersionSetting = 1;
    } else if (params.type == 4 || params.type == 5) {
      typeVersionSetting = 2;
    } else if (params.type == 3) {
      typeVersionSetting = 3;
    } else if (params.type == 6) {
      typeVersionSetting = 4;
    }

    const versionSetting =
      await this.versionSettingRepository.listPointSettingByType(
        typeVersionSetting,
        params.companyGroupCode,
      );
    if (versionSetting) {
      if (params.type == 1 || params.type == 4) {
        //** check basic */
        for (let i = 0; i < params.data.length; i++) {
          const element = params.data[i];
          if (
            parseInt(element.difficulty) > versionSetting.basicMaxDifficulty
          ) {
            listPointDiffent.push(element.difficulty);
          }
        }
      } else {
        //* check behavior
        for (let i = 0; i < params.data.length; i++) {
          const element = params.data[i];
          if (parseInt(element.difficulty) > versionSetting.behaviorMaxWeight) {
            listPointDiffent.push(element.difficulty);
          }
        }
      }
    }
    if (
      new Date(currentVersion.updatedTime).getTime() ===
        new Date(params.timer).getTime() &&
      listPointDiffent.length <= 0
    ) {
      const transactionBehaviorBasic =
        await this.basicBehaviorRepo.transactionBehaviorBasic();
      try {
        const newVersion = await this.basicBehaviorRepo.maxVersion(
          {
            type: params.type,
            level: params.type == 1 || params.type == 4 ? null : params.level,
            companyGroupCode: params.companyGroupCode,
          },
          'version',
        );
        await this.basicBehaviorRepo.updateAllVersionToPrivate(
          {
            status: 4,
            type: currentVersion.type,
            level:
              params.type == 1 || params.type == 4
                ? null
                : currentVersion.level,
            companyGroupCode: params.companyGroupCode,
          },
          transactionBehaviorBasic,
        );
        if (params.status !== 1 && params.status !== 2) {
          this.basicBehaviorRepo.updateVersion(
            params.versionId,
            {
              type: params.type,
              companyGroupCode: params.companyGroupCode,
            },
            transactionBehaviorBasic,
          );
          const objectNewVersion = {
            subVersion: 0,
            version: newVersion + 1,
            status: 4,
            creationUser: params.userId,
            type: params.type,
            reason: params.reason,
            level: params.type == 1 || params.type == 4 ? null : params.level,
            publicDate: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              params.timeZone,
            ),
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              params.timeZone,
            ),
            companyGroupCode: params.companyGroupCode,
          };

          const versionNew = await this.basicBehaviorRepo.createNewVersion(
            objectNewVersion,
          );
          const childrens = params.data.map((v) => {
            delete v.id;
            v.versionId = versionNew.id;
            return v;
          });

          await this.basicBehaviorRepo.createBulkListProSkill(
            childrens,
            transactionBehaviorBasic,
          );
          // this.mailService.sendMailPublicBasicAndBehavior(
          //   newVersion + 1,
          //   '0',
          //   params.hostname,
          //   currentVersion.type,
          //   currentVersion.level,
          // );
          await transactionBehaviorBasic.commit();
          return {
            id: versionNew.id,
            status: versionNew.status,
            type: params.type,
          };
        } else {
          await this.basicBehaviorRepo.deleteAllListVersion(
            params.versionId,
            transactionBehaviorBasic,
          );
          this.basicBehaviorRepo.updateVersion(
            params.versionId,
            {
              type: params.type,
              status: 4,
              level: params.type == 1 || params.type == 4 ? null : params.level,
              subVersion: 0,
              version: newVersion + 1,
              creationUser: params.userId,
              reason: params.reason,
              publicDate: isFormatDate(
                new Date(),
                'YYYY/M/D H:mm',
                params.timeZone,
              ),
              lastUpdatedTime: isFormatDate(
                new Date(),
                'YYYY/M/D H:mm',
                params.timeZone,
              ),
              companyGroupCode: params.companyGroupCode,
            },
            transactionBehaviorBasic,
          );
          const childrens = params.data.map((v) => {
            delete v.id;
            v.versionId = params.versionId;
            return v;
          });
          await this.basicBehaviorRepo.createBulkListProSkill(
            childrens,
            transactionBehaviorBasic,
          );
          // this.mailService.sendMailPublicBasicAndBehavior(
          //   newVersion + 1,
          //   '0',
          //   params.hostname,
          //   currentVersion.type,
          //   currentVersion.level,
          // );
          await transactionBehaviorBasic.commit();
          return {
            id: params.versionId,
            status: 4,
            type: params.type,
          };
        }
      } catch (error) {
        await transactionBehaviorBasic.rollback();
        throw new RuntimeException(error, 500);
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }
}
