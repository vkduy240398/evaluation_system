/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { filter, from, map, mergeMap, toArray } from 'rxjs';
import { VersionSettingRepositoryI } from 'src/interfaces/repository/versionSetting.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { SettingAchievementAdditionalDto } from 'src/model/generic/SettingAchievementAdditionalDto';
import { SettingAchievementPersonalDto } from 'src/model/generic/SettingAchievementPersonalDto';
import { SettingLevelDto } from 'src/model/generic/SettingLevelDto';
import { SettingPointBasicBehaviorProDto } from 'src/model/generic/SettingPointBasicBehaviorProDto';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { VersionSettingDto } from 'src/model/generic/VersionSettingDto';
import { SettingPointBasicBehaviorProRepository } from 'src/repository/settingPointBasicBehaviorPro.repository';
import { SettingAchievementPersonalRepository } from 'src/repository/settingAchievementPersonal.repository';
import { SettingAchievementAdditionalRepository } from 'src/repository/settingAchievementAdditional.repository';
import { SettingLevelRepository } from 'src/repository/settingLevel.repository';
import { CreationUserDto } from 'src/model/generic/CreationUserDto';
import { Op, Transaction } from 'sequelize';
import { Request } from 'express';
import { VersionSettingStatus } from 'src/enum/VersionSettingStatus';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { compareDatePeriod, isFormatDate } from 'src/common/util';
import { RandomHelper } from 'src/common/RandomHelper';
import { ErrorMessageResponseDto } from 'src/model/response/ErrorMessageResponseDto';
import { SettingPointBasicBehaviorProType } from 'src/enum/SettingPointBasicBehaviorProType';
import { VersionSettingNsServiceI } from 'src/interfaces/service/versionSettingNs.service.interface';
import { SettingAchievementPersonalType } from 'src/enum/SettingAchievementPersonalType';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { CalculatorDetail810NSDto } from 'src/model/request/CalculatorDetail810Dto';
import { FlagSkill } from 'src/enum/FlagSkill';
import { VersionSettingType } from '../enum/VersionSettingType';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment-timezone');
const NEW_CREATE_TYPE = 'new';
const STATUS_CODE_CONFLICT = 1409;

@Injectable()
export class VersionSettingNsService implements VersionSettingNsServiceI {
  @Inject(VersionSettingRepository)
  private versionSettingRepository: VersionSettingRepositoryI;

  @Inject(SettingPointBasicBehaviorProRepository)
  private settingPointBasicBehaviorProRepository: SettingPointBasicBehaviorProRepository;

  @Inject(SettingAchievementPersonalRepository)
  private settingAchievementPersonalRepository: SettingAchievementPersonalRepository;

  @Inject(SettingAchievementAdditionalRepository)
  private settingAchievementAdditionalRepository: SettingAchievementAdditionalRepository;

  @Inject(SettingLevelRepository)
  private settingLevelRepository: SettingLevelRepository;

  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;

  /**
   * Get detail evaluation calculation history no skill
   *
   * @author tran.le.ha.nam
   *
   * @param versionSettingId id of version setting
   */
  async getDetailEvaluationCalculation17ns(
    versionSettingId: number,
    req: Request,
  ) {
    const versionSetting =
      await this.versionSettingRepository.getVersionSettingById(
        versionSettingId,
        req,
      );

    if (!versionSetting) {
      throw new RuntimeException(
        'Version setting not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = new VersionSettingDto();
    result.id = versionSetting.id;
    result.type = versionSetting.type;
    result.version = versionSetting.version;
    result.subVersion = versionSetting.subVersion;
    result.versionDisplay =
      versionSetting.version + '.' + versionSetting.subVersion;
    result.status = versionSetting.status;
    result.reason = versionSetting.reason;
    result.basicMaxDifficulty = versionSetting.basicMaxDifficulty;
    result.behaviorMaxWeight = versionSetting.behaviorMaxWeight;
    const creationUserDto = new CreationUserDto();
    creationUserDto.id = versionSetting.user.id;
    creationUserDto.fullName = versionSetting.user.fullName;
    result.user = creationUserDto;
    result.creationUser = versionSetting.creationUser;
    result.publicDate = versionSetting.publicDate;
    result.updatedTime = versionSetting.updatedTime;
    result.lastUpdatedTime = versionSetting.lastUpdatedTime;
    result.minPoint = versionSetting.minPoint;
    result.maxPoint = versionSetting.maxPoint;
    result.companyGroupCode = versionSetting.companyGroupCode;

    const listSettingPointBasicBehaviorPros =
      await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(
        versionSettingId,
      );

    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(
          filter((el) => el.type === SettingPointBasicBehaviorProType.BEHAVIOR),
        )
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          const NUM_OF_CHARS = 32;
          tmp.key = RandomHelper.randomString(NUM_OF_CHARS);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          listSettingPointBehaviorDto.push(tmp);
        });
    }
    result.settingPointBehavior = listSettingPointBehaviorDto;

    const listSettingAchievementPersonal =
      await this.settingAchievementPersonalRepository.getListSettingAchievementPersonalByVersionId(
        versionSettingId,
        TypeAchievement.PERSONAL_17,
      );
    const listSettingAchievementPersonalDiffDto: SettingAchievementPersonalDto[] =
      [];
    if (listSettingAchievementPersonal.length > 0) {
      from(listSettingAchievementPersonal)
        .pipe(
          filter((el) => el.type === SettingAchievementPersonalType.DIFFICULTY),
          toArray(),
          map((arr) => arr.sort((a, b) => b.point - a.point)),
          mergeMap((el) => el),
        )
        .subscribe((el) => {
          const tmp = new SettingAchievementPersonalDto();
          const NUM_OF_CHARS = 32;
          tmp.key = RandomHelper.randomString(NUM_OF_CHARS);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          tmp.typeEvaluation = el.typeEvaluation;
          listSettingAchievementPersonalDiffDto.push(tmp);
        });
    }
    result.settingAchievementPersonalDiff =
      listSettingAchievementPersonalDiffDto;

    const listSettingAchievementPersonalJudgeIndexDto: SettingAchievementPersonalDto[] =
      [];
    if (listSettingAchievementPersonal.length > 0) {
      from(listSettingAchievementPersonal)
        .pipe(
          filter(
            (el) => el.type === SettingAchievementPersonalType.JUDGE_INDEX,
          ),
          toArray(),
          map((arr) => arr.sort((a, b) => b.point - a.point)),
          mergeMap((el) => el),
        )
        .subscribe((el) => {
          const tmp = new SettingAchievementPersonalDto();
          const NUM_OF_CHARS = 32;
          tmp.key = RandomHelper.randomString(NUM_OF_CHARS);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          tmp.typeEvaluation = el.typeEvaluation;
          tmp.description = el.description;
          listSettingAchievementPersonalJudgeIndexDto.push(tmp);
        });
    }
    result.settingAchievementPersonalJudgeIndex =
      listSettingAchievementPersonalJudgeIndexDto;

    const listSettingAchievementAdditional =
      await this.settingAchievementAdditionalRepository.getListSettingAchievementAdditionalByVersionId(
        versionSettingId,
        TypeAchievement.PERSONAL_17,
      );
    const listSettingAchievementAdditionalDto: SettingAchievementAdditionalDto[] =
      [];
    if (listSettingAchievementAdditional.length > 0) {
      from(listSettingAchievementAdditional).subscribe((el) => {
        const tmp = new SettingAchievementAdditionalDto();
        const NUM_OF_CHARS = 32;
        tmp.key = RandomHelper.randomString(NUM_OF_CHARS);
        tmp.id = el.id;
        tmp.versionId = el.versionId;
        tmp.rating = el.rating;
        tmp.point = el.point;
        tmp.note = el.note;
        tmp.type = el.type;
        listSettingAchievementAdditionalDto.push(tmp);
      });
    }
    result.settingAchievementAdditional = listSettingAchievementAdditionalDto;

    const listSettingLevel =
      await this.settingLevelRepository.getListSettingLevelByVersionId(
        versionSettingId,
      );
    const listSettingLevelDto: SettingLevelDto[] = [];
    if (listSettingLevel.length > 0) {
      from(listSettingLevel).subscribe((el) => {
        const tmp = new SettingLevelDto();
        const NUM_OF_CHARS = 32;
        tmp.key = RandomHelper.randomString(NUM_OF_CHARS);
        tmp.versionId = el.versionId;
        tmp.level = el.level;
        tmp.behaviorPercent = el.behaviorPercent;
        tmp.achievementPercent = el.achievementPercent;
        listSettingLevelDto.push(tmp);
      });
    }
    result.settingLevel = listSettingLevelDto;

    const existEditingVersion =
      await this.versionSettingRepository.existEditingVersion(
        versionSettingId,
        versionSetting.type,
        req,
      );
    result.existEditingVersion = existEditingVersion;

    return result;
  }

  /**
   * Save draft version setting no skill
   *
   * @author tran.le.ha.nam
   *
   * @param versionSettingDto version setting object
   * @param type save type
   * @param req request object
   */
  async saveDraftVersionSetting17ns(
    versionSettingDto: VersionSettingDto,
    type: string,
    req: Request,
  ) {
    const isMainVersionPublic =
      await this.versionSettingRepository.isMainVersionPublic(
        versionSettingDto.version,
        versionSettingDto.type,
        req,
      );

    if (!isMainVersionPublic) {
      return new ErrorMessageResponseDto(
        STATUS_CODE_CONFLICT,
        '編集ベースとなるバージョンが非公開になったため保存できません。',
        Date.now(),
      );
    }

    const existEditingVersion =
      await this.versionSettingRepository.existEditingVersion(
        type !== NEW_CREATE_TYPE ? versionSettingDto.id : null,
        versionSettingDto.type,
        req,
      );

    if (existEditingVersion) {
      return new ErrorMessageResponseDto(
        STATUS_CODE_CONFLICT,
        '編集中のバージョンが存在しているため新規作成できません。',
        Date.now(),
      );
    }

    let result = new VersionSettingDto();
    const transaction = await this.versionSettingRepository.getNewTransaction();
    versionSettingDto.creationUser = req.user.id;
    versionSettingDto.lastUpdatedTime = isFormatDate(
      new Date(),
      'YYYY/M/D H:mm',
      req.user.timeZone,
    );

    versionSettingDto.maxPoint =
      versionSettingDto.maxPoint?.toString() == '' ||
      isNaN(versionSettingDto.maxPoint)
        ? null
        : versionSettingDto.maxPoint;
    versionSettingDto.minPoint =
      versionSettingDto.minPoint?.toString() == '' ||
      isNaN(versionSettingDto.minPoint)
        ? null
        : versionSettingDto.minPoint;

    try {
      if (type === NEW_CREATE_TYPE) {
        const maxSubVersion = (
          await this.versionSettingRepository.findMaxSubVersion(
            versionSettingDto.version,
            versionSettingDto.type,
            req,
          )
        ).subVersion;
        versionSettingDto.subVersion = maxSubVersion + 1;
        versionSettingDto.status = VersionSettingStatus.EDITING;
        versionSettingDto.id = null;
        versionSettingDto.publicDate = null;
        versionSettingDto.companyGroupCode = req.user.companyGroupCode;

        const newVersionSetting =
          await this.versionSettingRepository.createVersionSetting17T(
            versionSettingDto,
            transaction,
          );

        versionSettingDto.id = newVersionSetting.id;

        result = await this.bulkCreateSettingsToVersionNsT(
          versionSettingDto,
          transaction,
        );
      } else {
        const versionSetting =
          await this.versionSettingRepository.getVersionSettingById(
            versionSettingDto.id,
            req,
          );

        if (
          versionSettingDto.updatedTime &&
          versionSettingDto.updatedTime.toString() !==
            versionSetting.updatedTime.toISOString()
        ) {
          throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
        }

        await this.versionSettingRepository.updateVersionSettingT(
          versionSettingDto,
          transaction,
        );

        result = await this.batchUpdateSettingsToVersionT(
          versionSettingDto,
          transaction,
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  async saveDraft810NS(
    params: CalculatorDetail810NSDto,
    userId: number,
    req: Request,
  ): Promise<any> {
    const version = await this.versionSettingRepository.findUpdateTimeVersion(
      params.id,
      req,
    );
    if (
      params.isNew === 1 ||
      new Date(version.updatedTime).getTime() ===
        new Date(params.updatedTime).getTime()
    ) {
      if (params.isNew === 1) {
        const isEditVersion =
          await this.versionSettingRepository.existEditingVersion(
            params.id,
            VersionSettingType.LEVEL_8_10_NS,
            req,
          );
        if (isEditVersion) {
          return {
            code: 403,
            message: '編集中のバージョンが存在しているため新規作成できません。',
          };
        }
        const versionPublic =
          await this.versionSettingRepository.checkVersionPublic(
            VersionSettingType.LEVEL_8_10_NS,
            req,
          );
        if (
          versionPublic.version.toString() !== params.version.split('.')[0] &&
          params.isNew === 1
        ) {
          return {
            code: 411,
            message: `編集ベースとなるバージョンが非公開になったため保存できません。`,
            data: versionPublic,
          };
        }
      }
      const transaction =
        await this.versionSettingRepository.getNewTransaction();
      try {
        const versionSetting =
          await this.versionSettingRepository.saveDraftVersion(
            params,
            userId,
            params.isNew,
            FlagSkill.NO_SKILL,
            transaction,
            req,
          );

        await this.versionSettingRepository.saveDraftNSData(
          params,
          versionSetting[0].id,
          transaction,
        );
        await transaction.commit();
        return versionSetting;
      } catch (error) {
        console.log(error);
        await transaction.rollback();
        throw new RuntimeException(
          error,
          error?.status ||
            error?.statusCode ||
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else throw new RuntimeException('Date invalid', HttpStatus.CONFLICT);
  }

  async savePublicOrPrivateNS(
    params: CalculatorDetail810NSDto,
    userId: number,
    req: Request,
  ) {
    const version = await this.versionSettingRepository.findUpdateTimeVersion(
      params.id,
      req,
    );
    if (params.status === 4) {
      const years = moment().tz(req.user.timeZone);
      const periods = await this.evaluationPeriodRepo.getAll({
        [Op.and]: [
          {
            [Op.or]: [
              { year: years.tz(req.user.timeZone).format('YYYY') },
              { year: years.add(-1, 'Y').tz(req.user.timeZone).format('YYYY') },
            ],
          },
          {
            companyGroupCode: req?.user?.companyGroupCode,
          },
          {
            checkFixed: { [Op.ne]: 2 },
          },
        ],
      });

      let dateGoal: any;
      let dateEvaluation: any;
      for (let index = 0; index < periods.length; index++) {
        if (
          compareDatePeriod(
            periods[index].dateCreationGoalDepartmentStart,
            periods[index].dateCreationGoalDepartmentEnd,
            req.user.timeZone,
          ) ||
          compareDatePeriod(
            periods[index].dateEvaluationDepartmentStart,
            periods[index].dateEvaluationDepartmentEnd,
            req.user.timeZone,
          )
        ) {
          if (
            compareDatePeriod(
              periods[index].dateCreationGoalDepartmentStart,
              periods[index].dateCreationGoalDepartmentEnd,
              req.user.timeZone,
            )
          ) {
            dateGoal = {
              startCheck: periods[index].dateCreationGoalDepartmentStart,
              endCheck: periods[index].dateCreationGoalDepartmentEnd,
            };
          }
          if (
            compareDatePeriod(
              periods[index].dateEvaluationDepartmentStart,
              periods[index].dateEvaluationDepartmentEnd,
              req.user.timeZone,
            )
          ) {
            dateEvaluation = {
              startCheck: periods[index].dateEvaluationDepartmentStart,
              endCheck: periods[index].dateEvaluationDepartmentEnd,
            };
          }

          return {
            code: 403,
            dateGoal: dateGoal,
            dateEvaluation: dateEvaluation,
          };
        }
      }
    }
    if (
      params.isNew === 1 ||
      new Date(version.updatedTime).getTime() ===
        new Date(params.updatedTime).getTime()
    ) {
      const transaction =
        await this.versionSettingRepository.getNewTransaction();
      try {
        if (params.isNew === 1) {
          const isEditVersion =
            await this.versionSettingRepository.existEditingVersion(
              params.id,
              VersionSettingType.LEVEL_8_10_NS,
              req,
            );
          if (isEditVersion) {
            await transaction.rollback();
            return {
              code: 403,
              message:
                '編集中のバージョンが存在しているため新規作成できません。',
            };
          }
        }

        const versionPublic =
          await this.versionSettingRepository.checkVersionPublic(
            VersionSettingType.LEVEL_8_10_NS,
            req,
          );

        if (
          versionPublic?.version.toString() !== params.version.split('.')[0] &&
          params.isNew === 1
        ) {
          await transaction.rollback();
          return {
            code: 411,
            message: `編集ベースとなるバージョンが非公開になったため保存できません。`,
            data: versionPublic,
          };
        }
        const versionSetting =
          await this.versionSettingRepository.savePublicOrPrivate(
            params,
            userId,
            transaction,
            req,
          );
        await this.versionSettingRepository.saveDraftNSData(
          params,
          versionSetting[0].id,
          transaction,
        );
        await transaction.commit();
        return versionSetting;
      } catch (error) {
        await transaction.rollback();
        throw new RuntimeException(
          error,
          error?.status ||
            error?.statusCode ||
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else throw new RuntimeException('Date invalid', HttpStatus.CONFLICT);
  }

  /**
   * Save public version setting no skill
   *
   * @author tran.le.ha.nam
   *
   * @param versionSettingDto version setting object
   * @param req request object
   */
  async savePublicVersionSetting17ns(
    versionSettingDto: VersionSettingDto,
    req: Request,
  ) {
    const versionSetting =
      await this.versionSettingRepository.getVersionSettingById(
        versionSettingDto.id,
        req,
      );

    if (
      versionSettingDto.updatedTime &&
      versionSettingDto.updatedTime.toString() !==
        versionSetting.updatedTime.toISOString()
    ) {
      throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
    }

    const isMainVersionPublic =
      await this.versionSettingRepository.isMainVersionPublic(
        versionSettingDto.version,
        versionSettingDto.type,
        req,
      );

    if (!isMainVersionPublic) {
      return new ErrorMessageResponseDto(
        STATUS_CODE_CONFLICT,
        '編集ベースとなるバージョンが非公開になったため保存できません。',
        Date.now(),
      );
    }

    const years = moment().tz(req.user.timeZone);
    const periods = await this.evaluationPeriodRepo.getAll({
      [Op.and]: [
        {
          [Op.or]: [
            { year: years.tz(req.user.timeZone).format('YYYY') },
            { year: years.add(-1, 'Y').tz(req.user.timeZone).format('YYYY') },
          ],
        },
        {
          companyGroupCode: req.user.companyGroupCode,
        },
        {
          checkFixed: { [Op.ne]: 2 },
        },
      ],
    });

    for (let index = 0; index < periods.length; index++) {
      const isGoalCreationTime = compareDatePeriod(
        periods[index].dateCreationGoalStart,
        periods[index].dateCreationGoalEnd,
        req.user.timeZone,
      );
      const isEvaluationTime = compareDatePeriod(
        periods[index].dateEvaluationStart,
        periods[index].dateEvaluationEnd,
        req.user.timeZone,
      );

      if (isGoalCreationTime || isEvaluationTime) {
        return {
          code: HttpStatus.FORBIDDEN,
          startGoal: periods[index].dateCreationGoalStart,
          endGoal: periods[index].dateCreationGoalEnd,
          startEvaluation: periods[index].dateEvaluationStart,
          endEvaluation: periods[index].dateEvaluationEnd,
          isGoalCreationTime,
          isEvaluationTime,
        };
      }
    }

    let result = new VersionSettingDto();
    const transaction = await this.versionSettingRepository.getNewTransaction();
    versionSettingDto.creationUser = req.user.id;
    versionSettingDto.lastUpdatedTime = isFormatDate(
      new Date(),
      'YYYY/M/D H:mm',
      req.user.timeZone,
    );
    let httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

    try {
      if (versionSettingDto.status === VersionSettingStatus.CANCEL) {
        httpCode = HttpStatus.BAD_REQUEST;
        throw new RuntimeException('Version is cancelled', httpCode);
      }

      const maxVersion = (
        await this.versionSettingRepository.findMaxVersion(
          versionSettingDto.type,
          req,
        )
      ).version;
      versionSettingDto.version = maxVersion + 1;
      versionSettingDto.subVersion = 0;
      versionSettingDto.publicDate = isFormatDate(
        new Date(),
        'YYYY/M/D H:mm',
        req.user.timeZone,
      );
      versionSettingDto.companyGroupCode = req?.user?.companyGroupCode;

      if (versionSettingDto.status === VersionSettingStatus.PUBLISHED) {
        versionSettingDto.id = null;

        const newVersionSetting =
          await this.versionSettingRepository.createVersionSetting17T(
            versionSettingDto,
            transaction,
          );
        versionSettingDto.id = newVersionSetting.id;

        result = await this.bulkCreateSettingsToVersionNsT(
          versionSettingDto,
          transaction,
        );
      } else {
        versionSettingDto.status = VersionSettingStatus.PUBLISHED;

        await this.versionSettingRepository.updateVersionSettingT(
          versionSettingDto,
          transaction,
        );

        result = await this.batchUpdateSettingsToVersionT(
          versionSettingDto,
          transaction,
        );
      }

      await this.versionSettingRepository.unPublicVersionSetting(
        versionSettingDto.id,
        versionSettingDto.type,
        transaction,
        req,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || httpCode,
      );
    }

    return result;
  }

  private async bulkCreateSettingsToVersionNsT(
    versionSettingDto: VersionSettingDto,
    transaction: Transaction,
  ) {
    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    from(versionSettingDto.settingPointBehavior).subscribe((el) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = versionSettingDto.id;
      el.versionId = versionSettingDto.id;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointBehaviorDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProRepository.bulkCreate(
      listSettingPointBehaviorDto,
      transaction,
    );

    const listSettingAchievementPersonalDto: SettingAchievementPersonalDto[] =
      [];
    from(versionSettingDto.settingAchievementPersonalDiff).subscribe((el) => {
      const tmp = new SettingAchievementPersonalDto();
      tmp.versionId = versionSettingDto.id;
      el.versionId = versionSettingDto.id;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.typeEvaluation = el.typeEvaluation;
      listSettingAchievementPersonalDto.push(tmp);
    });
    from(versionSettingDto.settingAchievementPersonalJudgeIndex).subscribe(
      (el) => {
        const tmp = new SettingAchievementPersonalDto();
        tmp.versionId = versionSettingDto.id;
        el.versionId = versionSettingDto.id;
        tmp.type = el.type;
        tmp.point = el.point;
        tmp.note = el.note;
        tmp.typeEvaluation = el.typeEvaluation;
        tmp.description = el.description;
        listSettingAchievementPersonalDto.push(tmp);
      },
    );
    await this.settingAchievementPersonalRepository.bulkCreate(
      listSettingAchievementPersonalDto,
      transaction,
    );

    const listSettingAchievementAdditionalDto: SettingAchievementAdditionalDto[] =
      [];
    from(versionSettingDto.settingAchievementAdditional).subscribe((el) => {
      const tmp = new SettingAchievementAdditionalDto();
      tmp.versionId = versionSettingDto.id;
      el.versionId = versionSettingDto.id;
      tmp.rating = el.rating;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.type = el.type;
      listSettingAchievementAdditionalDto.push(tmp);
    });
    await this.settingAchievementAdditionalRepository.bulkCreate(
      listSettingAchievementAdditionalDto,
      transaction,
    );

    const listSettingLevellDto: SettingLevelDto[] = [];
    from(versionSettingDto.settingLevel).subscribe((el) => {
      const tmp = new SettingLevelDto();
      tmp.versionId = versionSettingDto.id;
      el.versionId = versionSettingDto.id;
      tmp.level = el.level;
      tmp.skillPercent = el.skillPercent;
      tmp.behaviorPercent = el.behaviorPercent;
      tmp.achievementPercent = el.achievementPercent;

      listSettingLevellDto.push(tmp);
    });
    await this.settingLevelRepository.bulkCreate(
      listSettingLevellDto,
      transaction,
    );

    return versionSettingDto;
  }

  private async batchUpdateSettingsToVersionT(
    versionSettingDto: VersionSettingDto,
    transaction: Transaction,
  ) {
    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    from(versionSettingDto.settingPointBehavior).subscribe((el) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = el.versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointBehaviorDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProRepository.bulkDelete(
      versionSettingDto.id,
      SettingPointBasicBehaviorProType.BEHAVIOR,
      transaction,
    );
    await this.settingPointBasicBehaviorProRepository.bulkCreate(
      listSettingPointBehaviorDto,
      transaction,
    );

    const listSettingAchievementPersonalDto: SettingAchievementPersonalDto[] =
      [];
    from(versionSettingDto.settingAchievementPersonalDiff).subscribe((el) => {
      const tmp = new SettingAchievementPersonalDto();
      tmp.versionId = el.versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.typeEvaluation = el.typeEvaluation;

      listSettingAchievementPersonalDto.push(tmp);
    });
    from(versionSettingDto.settingAchievementPersonalJudgeIndex).subscribe(
      (el) => {
        const tmp = new SettingAchievementPersonalDto();
        tmp.versionId = el.versionId;
        tmp.type = el.type;
        tmp.point = el.point;
        tmp.note = el.note;
        tmp.typeEvaluation = el.typeEvaluation;
        tmp.description = el.description;
        listSettingAchievementPersonalDto.push(tmp);
      },
    );
    await this.settingAchievementPersonalRepository.bulkDelete(
      versionSettingDto.id,
      transaction,
    );
    await this.settingAchievementPersonalRepository.bulkCreate(
      listSettingAchievementPersonalDto,
      transaction,
    );

    const listSettingAchievementAdditionalDto: SettingAchievementAdditionalDto[] =
      [];
    from(versionSettingDto.settingAchievementAdditional).subscribe((el) => {
      const tmp = new SettingAchievementAdditionalDto();
      tmp.versionId = el.versionId;
      tmp.rating = el.rating;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.type = el.type;

      listSettingAchievementAdditionalDto.push(tmp);
    });
    await this.settingAchievementAdditionalRepository.bulkDelete(
      versionSettingDto.id,
      transaction,
    );
    await this.settingAchievementAdditionalRepository.bulkCreate(
      listSettingAchievementAdditionalDto,
      transaction,
    );

    const listSettingLevellDto: SettingLevelDto[] = [];
    from(versionSettingDto.settingLevel).subscribe((el) => {
      const tmp = new SettingLevelDto();
      tmp.versionId = el.versionId;
      tmp.level = el.level;
      tmp.behaviorPercent = el.behaviorPercent;
      tmp.achievementPercent = el.achievementPercent;

      listSettingLevellDto.push(tmp);
    });
    await this.settingLevelRepository.bulkDelete(
      versionSettingDto.id,
      transaction,
    );
    await this.settingLevelRepository.bulkCreate(
      listSettingLevellDto,
      transaction,
    );

    return versionSettingDto;
  }
}
