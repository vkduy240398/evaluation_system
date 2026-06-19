/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { filter, from, map, mergeMap, toArray } from 'rxjs';
import { Op, Transaction } from 'sequelize';
import { RandomHelper } from 'src/common/RandomHelper';
import { compareDatePeriod, isFormatDate } from 'src/common/util';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { SettingAchievementPersonalType } from 'src/enum/SettingAchievementPersonalType';
import { SettingPointBasicBehaviorProType } from 'src/enum/SettingPointBasicBehaviorProType';
import { VersionSettingStatus } from 'src/enum/VersionSettingStatus';
import { AdminEvaluationRepositoryI } from 'src/interfaces/repository/adminEvaluation.repository';
import { VersionSettingRepositoryI } from 'src/interfaces/repository/versionSetting.repository.interface';
import { VersionSettingServiceI } from 'src/interfaces/service/versionSetting.service.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { CreationUserDto } from 'src/model/generic/CreationUserDto';
import { SettingAchievementAdditionalDto } from 'src/model/generic/SettingAchievementAdditionalDto';
import { SettingAchievementPersonalDto } from 'src/model/generic/SettingAchievementPersonalDto';
import { SettingLevelDto } from 'src/model/generic/SettingLevelDto';
import { SettingPointBasicBehaviorProDto } from 'src/model/generic/SettingPointBasicBehaviorProDto';
import { SettingProFormulaDto } from 'src/model/generic/SettingProFormulaDto';
import {
  VersionSetting810Dto,
  VersionSettingDto,
} from 'src/model/generic/VersionSettingDto';
import { CalculatorDetail810Dto } from 'src/model/request/CalculatorDetail810Dto';
import { ListEvaluationCalculationHistoryDto } from 'src/model/request/F6/ListEvaluationCalculationHistoryDto';
import { PublicVersionSettingDto } from 'src/model/request/PublicVersionSettingDto';
import { ErrorMessageResponseDto } from 'src/model/response/ErrorMessageResponseDto';
import { ListEvaluationCalculationHistoryResponseDto } from 'src/model/response/F6/ListEvaluationCalculationResponseDto';
import { SettingProFormulaSubDto } from 'src/model/response/SettingProFormulaSubDto';
import { AdminEvaluationRepository } from 'src/repository/adminEvaluation.repository';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { SettingAchievementAdditionalRepository } from 'src/repository/settingAchievementAdditional.repository';
import { SettingAchievementPersonalRepository } from 'src/repository/settingAchievementPersonal.repository';
import { SettingLevelRepository } from 'src/repository/settingLevel.repository';
import { SettingPointBasicBehaviorProRepository } from 'src/repository/settingPointBasicBehaviorPro.repository';
import { SettingProFormulaRepository } from 'src/repository/settingProFormula.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { FlagSkill } from 'src/enum/FlagSkill';
import { VersionSettingType } from '../enum/VersionSettingType';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment-timezone');
const NEW_CREATE_TYPE = 'new';
const STATUS_CODE_CONFLICT = 1409;

@Injectable()
export class VersionSettingService implements VersionSettingServiceI {
  @Inject(VersionSettingRepository)
  private versionSettingRepository: VersionSettingRepositoryI;

  @Inject(SettingPointBasicBehaviorProRepository)
  private settingPointBasicBehaviorProRepository: SettingPointBasicBehaviorProRepository;

  @Inject(SettingProFormulaRepository)
  private settingProFormulaRepository: SettingProFormulaRepository;

  @Inject(SettingAchievementPersonalRepository)
  private settingAchievementPersonalRepository: SettingAchievementPersonalRepository;

  @Inject(SettingAchievementAdditionalRepository)
  private settingAchievementAdditionalRepository: SettingAchievementAdditionalRepository;

  @Inject(SettingLevelRepository)
  private settingLevelRepository: SettingLevelRepository;

  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;

  @Inject(AdminEvaluationRepository)
  private adminEvaluation: AdminEvaluationRepositoryI;

  /**
   * Get list evaluation calculation history
   *
   * @author tran.le.ha.nam
   */
  async getListEvaluationCalculationHistory(
    param: ListEvaluationCalculationHistoryDto,
    req: Request,
  ) {
    const result = new ListEvaluationCalculationHistoryResponseDto();

    try {
      const listEvaluationCalculationHistories =
        await this.versionSettingRepository.getListVersionSettingPaging(
          param,
          req,
        );

      const total = await this.versionSettingRepository.countListVersionSetting(
        param,
        req,
      );

      const records: VersionSettingDto[] = [];
      result.counts = total;

      if (listEvaluationCalculationHistories.length > 0) {
        listEvaluationCalculationHistories
          .map((el) => {
            const versionSettingDto = new VersionSettingDto();
            versionSettingDto.id = el.id;
            versionSettingDto.type = el.type;
            versionSettingDto.version = el.version;
            versionSettingDto.subVersion = el.subVersion;
            versionSettingDto.versionDisplay = el.version + '.' + el.subVersion;
            versionSettingDto.status = el.status;
            versionSettingDto.reason = el.reason;
            versionSettingDto.basicMaxDifficulty = el.basicMaxDifficulty;
            versionSettingDto.behaviorMaxWeight = el.behaviorMaxWeight;
            versionSettingDto.publicDate = el.publicDate;
            const creationUserDto = new CreationUserDto();
            creationUserDto.id = el.user?.id;
            creationUserDto.fullName = el.user?.fullName;
            versionSettingDto.user = creationUserDto;
            versionSettingDto.creationUser = el.creationUser;
            versionSettingDto.updatedTime = el.updatedTime;
            versionSettingDto.lastUpdatedTime = el.lastUpdatedTime;
            return versionSettingDto;
          })
          .forEach((el) => {
            records.push(el);
          });
      }

      result.rows = records;
    } catch (err) {
      throw new RuntimeException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  /**
   * Get detail evaluation calculation history
   *
   * @author tran.le.ha.nam
   *
   * @param versionSettingId id of version setting
   */
  async getDetailEvaluationCalculation17(
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
    result.maxPoint = versionSetting.maxPoint;
    result.minPoint = versionSetting.minPoint;

    const listSettingPointBasicBehaviorPros =
      await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(
        versionSettingId,
      );

    const listSettingPointBasicDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(filter((el) => el.type === 1))
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          tmp.key = RandomHelper.randomString(32);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          listSettingPointBasicDto.push(tmp);
        });
    }
    result.settingPointBasic = listSettingPointBasicDto;

    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(filter((el) => el.type === 2))
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          tmp.key = RandomHelper.randomString(32);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          listSettingPointBehaviorDto.push(tmp);
        });
    }
    result.settingPointBehavior = listSettingPointBehaviorDto;

    const listSettingPointProDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(filter((el) => el.type === 3))
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          tmp.key = RandomHelper.randomString(32);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          listSettingPointProDto.push(tmp);
        });
    }
    result.settingPointPro = listSettingPointProDto;

    // const listSettingProFormulas =
    //   await this.settingProFormulaRepository.getListSettingProFormulaByVersionId(
    //     versionSettingId,
    //   );
    // const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    // if (listSettingProFormulas.length > 0) {
    //   from(listSettingProFormulas).subscribe((el) => {
    //     const tmp = new SettingProFormulaDto();
    //     tmp.key = RandomHelper.randomString(32);
    //     tmp.id = el.id;
    //     tmp.versionId = el.versionId;
    //     tmp.point = el.point;
    //     tmp.note = el.note;

    //     const listSettingProFormulaSub: SettingProFormulaSubDto[] = [];
    //     from(el.settingProFormulaSub).subscribe((sub) => {
    //       const tmpSub = new SettingProFormulaSubDto();
    //       tmpSub.key = RandomHelper.randomString(32);
    //       tmpSub.id = sub.id;
    //       tmpSub.formulaId = sub.formulaId;
    //       tmpSub.totalItem = sub.totalItem;
    //       tmpSub.coefficient = sub.coefficient;
    //       listSettingProFormulaSub.push(tmpSub);
    //     });
    //     tmp.settingProFormulaSub = listSettingProFormulaSub;

    //     listSettingProFormulaDto.push(tmp);
    //   });
    // }
    // result.settingProFormula = listSettingProFormulaDto;

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
          tmp.key = RandomHelper.randomString(32);
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
        tmp.key = RandomHelper.randomString(32);
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
        tmp.key = RandomHelper.randomString(32);
        tmp.versionId = el.versionId;
        tmp.level = el.level;
        tmp.skillPercent = el.skillPercent;
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

  async getDetailEvaluationCalculation810(
    versionSettingId: number,
    req: Request,
  ): Promise<VersionSetting810Dto> {
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

    const result = new VersionSetting810Dto();
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
    result.maxPoint = versionSetting.maxPoint;
    result.minPoint = versionSetting.minPoint;
    result.maxPointDep = versionSetting.maxPointDep;
    result.minPointDep = versionSetting.minPointDep;
    result.companyGroupCode = versionSetting.companyGroupCode;

    const listSettingPointBasicBehaviorPros =
      await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(
        versionSettingId,
      );

    const listSettingPointBasicDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(filter((el) => el.type === 1))
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          tmp.key = RandomHelper.randomString(32);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          listSettingPointBasicDto.push(tmp);
        });
    }
    result.settingPointBasic = listSettingPointBasicDto;

    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(filter((el) => el.type === 2))
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          tmp.key = RandomHelper.randomString(32);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          listSettingPointBehaviorDto.push(tmp);
        });
    }
    result.settingPointBehavior = listSettingPointBehaviorDto;

    const listSettingPointProDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(filter((el) => el.type === 3))
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          tmp.key = RandomHelper.randomString(32);
          tmp.id = el.id;
          tmp.versionId = el.versionId;
          tmp.type = el.type;
          tmp.point = el.point;
          tmp.note = el.note;
          listSettingPointProDto.push(tmp);
        });
    }
    result.settingPointPro = listSettingPointProDto;

    // const listSettingProFormulas =
    //   await this.settingProFormulaRepository.getListSettingProFormulaByVersionId(
    //     versionSettingId,
    //   );
    // const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    // if (listSettingProFormulas.length > 0) {
    //   from(listSettingProFormulas).subscribe((el) => {
    //     const tmp = new SettingProFormulaDto();
    //     tmp.key = RandomHelper.randomString(32);
    //     tmp.id = el.id;
    //     tmp.versionId = el.versionId;
    //     tmp.point = el.point;
    //     tmp.note = el.note;

    //     const listSettingProFormulaSub: SettingProFormulaSubDto[] = [];
    //     from(el.settingProFormulaSub).subscribe((sub) => {
    //       const tmpSub = new SettingProFormulaSubDto();
    //       tmpSub.key = RandomHelper.randomString(32);
    //       tmpSub.id = sub.id;
    //       tmpSub.formulaId = sub.formulaId;
    //       tmpSub.totalItem = sub.totalItem;
    //       tmpSub.coefficient = sub.coefficient;
    //       listSettingProFormulaSub.push(tmpSub);
    //     });
    //     tmp.settingProFormulaSub = listSettingProFormulaSub;

    //     listSettingProFormulaDto.push(tmp);
    //   });
    // }
    // result.settingProFormula = listSettingProFormulaDto;

    const listSettingAchievementPersonal =
      await this.settingAchievementPersonalRepository.getListSettingAchievementPersonalByVersionId(
        versionSettingId,
        TypeAchievement.PERSONAL_810,
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
          tmp.key = RandomHelper.randomString(32);
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
        TypeAchievement.PERSONAL_810,
      );
    const listSettingAchievementAdditionalDto: SettingAchievementAdditionalDto[] =
      [];
    if (listSettingAchievementAdditional.length > 0) {
      from(listSettingAchievementAdditional).subscribe((el) => {
        const tmp = new SettingAchievementAdditionalDto();
        tmp.key = RandomHelper.randomString(32);
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
        tmp.key = RandomHelper.randomString(32);
        tmp.versionId = el.versionId;
        tmp.level = el.level;
        tmp.skillPercent = el.skillPercent;
        tmp.behaviorPercent = el.behaviorPercent;
        tmp.achievementPercent = el.achievementPercent;
        listSettingLevelDto.push(tmp);
      });
    }
    result.settingLevel = listSettingLevelDto;

    result.settingAchievementDepDiff =
      await this.adminEvaluation.getAchievementDep(
        versionSettingId,
        1,
        TypeAchievement.DEPARTMENT_810,
      );

    result.settingAchievementDepJudgeIndex =
      await this.adminEvaluation.getAchievementDep(
        versionSettingId,
        2,
        TypeAchievement.DEPARTMENT_810,
      );

    result.settingAchievementAdditionalDep =
      await this.adminEvaluation.getAchievementAdditionalDep(versionSettingId);

    result.settingFormula810 = await this.adminEvaluation.getFormula(
      versionSettingId,
    );
    result.isHaveEditRecord = await this.adminEvaluation.haveRecordEdit(req);

    return result;
  }

  async getDetailEvaluationCalculation810NS(
    versionSettingId: number,
    req: Request,
  ): Promise<VersionSetting810Dto> {
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

    const result = new VersionSetting810Dto();
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
    result.maxPoint = versionSetting.maxPoint;
    result.minPoint = versionSetting.minPoint;
    result.maxPointDep = versionSetting.maxPointDep;
    result.minPointDep = versionSetting.minPointDep;
    result.companyGroupCode = versionSetting.companyGroupCode;

    const listSettingPointBasicBehaviorPros =
      await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(
        versionSettingId,
      );

    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    if (listSettingPointBasicBehaviorPros.length > 0) {
      from(listSettingPointBasicBehaviorPros)
        .pipe(filter((el) => el.type === 2))
        .subscribe((el) => {
          const tmp = new SettingPointBasicBehaviorProDto();
          tmp.key = RandomHelper.randomString(32);
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
        TypeAchievement.PERSONAL_810,
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
          tmp.key = RandomHelper.randomString(32);
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
        TypeAchievement.PERSONAL_810,
      );
    const listSettingAchievementAdditionalDto: SettingAchievementAdditionalDto[] =
      [];
    if (listSettingAchievementAdditional.length > 0) {
      from(listSettingAchievementAdditional).subscribe((el) => {
        const tmp = new SettingAchievementAdditionalDto();
        tmp.key = RandomHelper.randomString(32);
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
        tmp.key = RandomHelper.randomString(32);
        tmp.versionId = el.versionId;
        tmp.level = el.level;
        tmp.skillPercent = el.skillPercent;
        tmp.behaviorPercent = el.behaviorPercent;
        tmp.achievementPercent = el.achievementPercent;
        listSettingLevelDto.push(tmp);
      });
    }
    result.settingLevel = listSettingLevelDto;

    result.settingAchievementDepDiff =
      await this.adminEvaluation.getAchievementDep(
        versionSettingId,
        1,
        TypeAchievement.DEPARTMENT_810,
      );

    result.settingAchievementDepJudgeIndex =
      await this.adminEvaluation.getAchievementDep(
        versionSettingId,
        2,
        TypeAchievement.DEPARTMENT_810,
      );

    result.settingAchievementAdditionalDep =
      await this.adminEvaluation.getAchievementAdditionalDep(versionSettingId);

    result.settingFormula810 = await this.adminEvaluation.getFormula(
      versionSettingId,
    );
    result.isHaveEditRecord = await this.adminEvaluation.haveRecordEditNS(req);

    return result;
  }

  async getDetailEvaluationCalculationCommon(
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
    result.maxPoint = versionSetting.maxPoint;
    result.minPoint = versionSetting.minPoint;

    const listSettingProFormulas =
      await this.settingProFormulaRepository.getListSettingProFormulaByVersionId(
        versionSettingId,
      );
    const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    if (listSettingProFormulas.length > 0) {
      from(listSettingProFormulas).subscribe((el) => {
        const tmp = new SettingProFormulaDto();
        tmp.key = RandomHelper.randomString(32);
        tmp.id = el.id;
        tmp.versionId = el.versionId;
        tmp.point = el.point;
        tmp.note = el.note;

        const listSettingProFormulaSub: SettingProFormulaSubDto[] = [];
        from(el.settingProFormulaSub).subscribe((sub) => {
          const tmpSub = new SettingProFormulaSubDto();
          tmpSub.key = RandomHelper.randomString(32);
          tmpSub.id = sub.id;
          tmpSub.formulaId = sub.formulaId;
          tmpSub.totalItem = sub.totalItem;
          tmpSub.coefficient = sub.coefficient;
          listSettingProFormulaSub.push(tmpSub);
        });
        tmp.settingProFormulaSub = listSettingProFormulaSub;

        listSettingProFormulaDto.push(tmp);
      });
    }
    result.settingProFormula = listSettingProFormulaDto;

    const existEditingVersion =
      await this.versionSettingRepository.existEditingVersion(
        versionSettingId,
        versionSetting.type,
        req,
      );
    result.existEditingVersion = existEditingVersion;

    return result;
  }

  async savePublicVersionSettingCommon(
    versionSettingDto: VersionSettingDto,
    req: Request,
  ) {
    const versionSetting =
      await this.versionSettingRepository.getVersionSettingById(
        versionSettingDto.id,
        req,
      );

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
      const isEvaluationTimePersonal = compareDatePeriod(
        periods[index].dateEvaluationStart,
        periods[index].dateEvaluationEnd,
        req.user.timeZone
      );

      const isEvaluationTimeDepartment = compareDatePeriod(
        periods[index].dateEvaluationDepartmentStart,
        periods[index].dateEvaluationDepartmentEnd,
        req.user.timeZone
      );

      if (isEvaluationTimePersonal || isEvaluationTimeDepartment) {
        return {
          code: 403,
          startEvaluationPersonal: periods[index].dateEvaluationStart,
          endEvaluationPersonal: periods[index].dateEvaluationEnd,
          startEvaluationDepartment:
            periods[index].dateEvaluationDepartmentStart,
          endEvaluationDepartment: periods[index].dateEvaluationDepartmentEnd,
          isEvaluationTimePersonal,
          isEvaluationTimeDepartment,
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
    const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

    try {
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

        result = await this.bulkCreateSettingsToVersionCommon(
          versionSettingDto,
          transaction,
        );
      } else {
        if (
          versionSettingDto.updatedTime &&
          versionSettingDto.updatedTime.toString() !==
            versionSetting.updatedTime.toISOString()
        ) {
          throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
        }

        versionSettingDto.status = VersionSettingStatus.PUBLISHED;

        await this.versionSettingRepository.updateVersionSettingT(
          versionSettingDto,
          transaction,
        );

        result = await this.batchUpdateSettingsToVersionCommon(
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

  async publicVersionSettingCommon(
    publicVersionSettingDto: PublicVersionSettingDto,
    req: Request,
  ): Promise<any> {
    const versionSetting =
      await this.versionSettingRepository.findVersionSettingById(
        publicVersionSettingDto.versionId,
      );

    if (!versionSetting) {
      throw new RuntimeException('Version not found', HttpStatus.NOT_FOUND);
    }

    if (
      publicVersionSettingDto.updatedTime &&
      publicVersionSettingDto.updatedTime !==
        versionSetting.updatedTime.toISOString()
    ) {
      throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
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
      const isEvaluationTimePersonal = compareDatePeriod(
        periods[index].dateEvaluationStart,
        periods[index].dateEvaluationEnd,
        req.user.timeZone
      );

      const isEvaluationTimeDepartment = compareDatePeriod(
        periods[index].dateEvaluationDepartmentStart,
        periods[index].dateEvaluationDepartmentEnd,
        req.user.timeZone
      );

      if (isEvaluationTimePersonal || isEvaluationTimeDepartment) {
        return {
          code: 403,
          startEvaluationPersonal: periods[index].dateEvaluationStart,
          endEvaluationPersonal: periods[index].dateEvaluationEnd,
          startEvaluationDepartment:
            periods[index].dateEvaluationDepartmentStart,
          endEvaluationDepartment: periods[index].dateEvaluationDepartmentEnd,
          isEvaluationTimePersonal,
          isEvaluationTimeDepartment,
        };
      }
    }

    const maxVersion = (
      await this.versionSettingRepository.findMaxVersion(
        versionSetting.type,
        req,
      )
    ).version;

    const data = {
      status: publicVersionSettingDto.status,
      version: publicVersionSettingDto.version
        ? publicVersionSettingDto.version
        : maxVersion + 1,
      subVersion: 0,
      publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
      lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
    };

    await this.versionSettingRepository.publicVersionSetting(
      publicVersionSettingDto.versionId,
      publicVersionSettingDto.type,
      data,
      req.user.companyGroupCode,
    );

    const result = {
      ...publicVersionSettingDto,
    };

    return result;
  }

  async saveDraftVersionSettingCommon(
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
    versionSettingDto.user = req.user;
    versionSettingDto.companyGroupCode = req?.user?.companyGroupCode;
    versionSettingDto.lastUpdatedTime = isFormatDate(
      new Date(),
      'YYYY/M/D H:mm',
      req.user.timeZone,
    );
    // versionSettingDto.maxPoint =
    //   versionSettingDto.maxPoint?.toString() == '' ||
    //   isNaN(versionSettingDto.maxPoint)
    //     ? null
    //     : versionSettingDto.maxPoint;
    // versionSettingDto.minPoint =
    //   versionSettingDto.minPoint?.toString() == '' ||
    //   isNaN(versionSettingDto.minPoint)
    //     ? null
    //     : versionSettingDto.minPoint;

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

        const newVersionSetting =
          await this.versionSettingRepository.createVersionSetting17T(
            versionSettingDto,
            transaction,
          );

        versionSettingDto.id = newVersionSetting.id;

        result = await this.bulkCreateSettingsToVersionCommon(
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
        // save draft versionSetting 1~7
        await this.versionSettingRepository.updateVersionSettingT(
          versionSettingDto,
          transaction,
        );
        result = await this.batchUpdateSettingsToVersionCommon(
          versionSettingDto,
          transaction,
        );
      }
      await transaction.commit();

      const updatedVersionSetting =
        await this.versionSettingRepository.getVersionUpdatedTime(
          versionSettingDto.id,
        );

      versionSettingDto.updatedTime = updatedVersionSetting.updatedTime;
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  private async bulkCreateSettingsToVersionCommon(
    versionSettingDto: VersionSettingDto,
    transaction: Transaction,
  ) {
    const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    let listSettingProFormulaSubDto: SettingProFormulaSubDto[] = [];
    from(versionSettingDto.settingProFormula).subscribe((el) => {
      const tmp = new SettingProFormulaDto();
      tmp.versionId = versionSettingDto.id;
      el.versionId = versionSettingDto.id;
      tmp.point = el.point;
      tmp.note = el.note;

      listSettingProFormulaSubDto = [];
      from(el.settingProFormulaSub).subscribe((sub) => {
        const tmp2 = new SettingProFormulaSubDto();
        tmp2.totalItem = sub.totalItem;
        tmp2.coefficient = sub.coefficient;

        listSettingProFormulaSubDto.push(tmp2);
      });

      tmp.settingProFormulaSub = listSettingProFormulaSubDto;
      listSettingProFormulaDto.push(tmp);
    });
    await this.settingProFormulaRepository.bulkCreate(
      listSettingProFormulaDto,
      transaction,
    );

    return versionSettingDto;
  }

  async getNextVersion810(version: number, req: Request) {
    return await this.versionSettingRepository.getNextVersion810(version, req);
  }

  async getNextVersion810NS(version: number, req: Request) {
    return await this.versionSettingRepository.getNextVersion810NS(
      version,
      req,
    );
  }

  async saveDraft810(
    params: CalculatorDetail810Dto,
    userId: number,
    req: Request,
  ) {
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
            VersionSettingType.LEVEL_8_10,
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
            VersionSettingType.LEVEL_8_10,
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
            FlagSkill.HAVE_SKILL,
            transaction,
            req,
          );

        await this.versionSettingRepository.saveDraftData(
          params,
          versionSetting[0].id,
          transaction,
          req,
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

  async cancelSetting(id: number, params: any, userId: number, req: Request) {
    const version = await this.versionSettingRepository.findUpdateTimeVersion(
      id,
      req,
    );
    if (
      new Date(version.updatedTime).getTime() ===
      new Date(params.updatedTime).getTime()
    )
      return await this.versionSettingRepository.cancelSetting(id, userId, req);
    else throw new RuntimeException('Date invalid', HttpStatus.CONFLICT);
  }

  async checkDatePublic(companyGroupCode: string, timeZone: string) {
    const datePublic = await this.versionSettingRepository.findDatePublic(
      companyGroupCode,
    );

    if (
      moment(datePublic.publicDate).tz(timeZone).format('YYYY/M/D') ===
      moment().tz(timeZone).format('YYYY/M/D')
    )
      return true;
    return false;
  }

  async publicVersionSetting17(
    publicVersionSettingDto: PublicVersionSettingDto,
    req: Request,
  ): Promise<any> {
    const versionSetting =
      await this.versionSettingRepository.findVersionSettingById(
        publicVersionSettingDto.versionId,
      );

    if (!versionSetting) {
      throw new RuntimeException('Version not found', HttpStatus.NOT_FOUND);
    }

    if (
      publicVersionSettingDto.updatedTime &&
      publicVersionSettingDto.updatedTime !==
        versionSetting.updatedTime.toISOString()
    ) {
      throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
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
    let startGoal: any;
    let endGoal: any;
    let startEvaluation: any;
    let endEvaluation: any;
    for (let index = 0; index < periods.length; index++) {
      if (
        compareDatePeriod(
          periods[index].dateCreationGoalStart,
          periods[index].dateCreationGoalEnd,
          req.user.timeZone
        ) ||
        compareDatePeriod(
          periods[index].dateEvaluationStart,
          periods[index].dateEvaluationEnd,
          req.user.timeZone
        )
      ) {
        if (
          compareDatePeriod(
            periods[index].dateCreationGoalStart,
            periods[index].dateCreationGoalEnd,
            req.user.timeZone
          )
        ) {
          startGoal = periods[index].dateCreationGoalStart;
          endGoal = periods[index].dateCreationGoalEnd;
        } else if (
          compareDatePeriod(
            periods[index].dateEvaluationStart,
            periods[index].dateEvaluationEnd,
            req.user.timeZone
          )
        ) {
          startEvaluation = periods[index].dateEvaluationStart;
          endEvaluation = periods[index].dateEvaluationEnd;
        }

        return {
          code: HttpStatus.FORBIDDEN,
          startGoal: startGoal,
          endGoal: endGoal,
          startEvaluation: startEvaluation,
          endEvaluation: endEvaluation,
        };
      }
    }

    for (let index = 0; index < periods.length; index++) {
      const isGoalCreationTime = compareDatePeriod(
        periods[index].dateCreationGoalStart,
        periods[index].dateCreationGoalEnd,
        req.user.timeZone
      );
      const isEvaluationTime = compareDatePeriod(
        periods[index].dateEvaluationStart,
        periods[index].dateEvaluationEnd,
        req.user.timeZone
      );

      if (isGoalCreationTime || isEvaluationTime) {
        return {
          code: 403,
          startGoal: periods[index].dateCreationGoalStart,
          endGoal: periods[index].dateCreationGoalEnd,
          startEvaluation: periods[index].dateEvaluationStart,
          endEvaluation: periods[index].dateEvaluationEnd,
          isGoalCreationTime,
          isEvaluationTime,
        };
      }
    }

    const maxVersion = (
      await this.versionSettingRepository.findMaxVersion(
        versionSetting.type,
        req,
      )
    ).version;

    const data = {
      status: publicVersionSettingDto.status,
      version: publicVersionSettingDto.version
        ? publicVersionSettingDto.version
        : maxVersion + 1,
      subVersion: 0,
      publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
      lastUpdatedTime: isFormatDate(
        new Date(),
        'YYYY/M/D H:mm',
        req.user.timeZone,
      ),
    };

    await this.versionSettingRepository.publicVersionSetting(
      publicVersionSettingDto.versionId,
      publicVersionSettingDto.type,
      data,
      req.user.companyGroupCode,
    );

    const result = {
      ...publicVersionSettingDto,
    };

    return result;
  }

  async saveDraftVersionSetting17(
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
    versionSettingDto.user = req.user;
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
        versionSettingDto.companyGroupCode = req?.user?.companyGroupCode;

        const newVersionSetting =
          await this.versionSettingRepository.createVersionSetting17T(
            versionSettingDto,
            transaction,
          );

        versionSettingDto.id = newVersionSetting.id;

        result = await this.bulkCreateSettingsToVersion(
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

        // save draft versionSetting 1~7
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

      const updatedVersionSetting =
        await this.versionSettingRepository.getVersionUpdatedTime(
          versionSettingDto.id,
        );

      versionSettingDto.updatedTime = updatedVersionSetting.updatedTime;
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  async savePublicVersionSetting17(
    versionSettingDto: VersionSettingDto,
    req: Request,
  ) {
    const versionSetting =
      await this.versionSettingRepository.getVersionSettingById(
        versionSettingDto.id,
        req,
      );

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
        req.user.timeZone
      );
      const isEvaluationTime = compareDatePeriod(
        periods[index].dateEvaluationStart,
        periods[index].dateEvaluationEnd,
        req.user.timeZone
      );

      if (isGoalCreationTime || isEvaluationTime) {
        return {
          code: 403,
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
    const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

    try {
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

        result = await this.bulkCreateSettingsToVersion(
          versionSettingDto,
          transaction,
        );
      } else {
        if (
          versionSettingDto.updatedTime &&
          versionSettingDto.updatedTime.toString() !==
            versionSetting.updatedTime.toISOString()
        ) {
          throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
        }

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

  private async bulkCreateSettingsToVersion(
    versionSettingDto: VersionSettingDto,
    transaction: Transaction,
  ) {
    const listSettingPointBasicDto: SettingPointBasicBehaviorProDto[] = [];
    from(versionSettingDto.settingPointBasic).subscribe((el) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = versionSettingDto.id;
      el.versionId = versionSettingDto.id;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointBasicDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProRepository.bulkCreate(
      listSettingPointBasicDto,
      transaction,
    );

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

    const listSettingPointProDto: SettingPointBasicBehaviorProDto[] = [];
    from(versionSettingDto.settingPointPro).subscribe((el) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = versionSettingDto.id;
      el.versionId = versionSettingDto.id;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointProDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProRepository.bulkCreate(
      listSettingPointProDto,
      transaction,
    );

    // const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    // let listSettingProFormulaSubDto: SettingProFormulaSubDto[] = [];
    // from(versionSettingDto.settingProFormula).subscribe((el) => {
    //   const tmp = new SettingProFormulaDto();
    //   tmp.versionId = versionSettingDto.id;
    //   el.versionId = versionSettingDto.id;
    //   tmp.point = el.point;
    //   tmp.note = el.note;

    //   listSettingProFormulaSubDto = [];
    //   from(el.settingProFormulaSub).subscribe((sub) => {
    //     const tmp2 = new SettingProFormulaSubDto();
    //     tmp2.totalItem = sub.totalItem;
    //     tmp2.coefficient = sub.coefficient;

    //     listSettingProFormulaSubDto.push(tmp2);
    //   });

    //   tmp.settingProFormulaSub = listSettingProFormulaSubDto;
    //   listSettingProFormulaDto.push(tmp);
    // });
    // await this.settingProFormulaRepository.bulkCreate(
    //   listSettingProFormulaDto,
    //   transaction,
    // );

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
    const listSettingPointBasicDto: SettingPointBasicBehaviorProDto[] = [];
    from(versionSettingDto.settingPointBasic).subscribe((el) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = el.versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointBasicDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProRepository.bulkDelete(
      versionSettingDto.id,
      SettingPointBasicBehaviorProType.BASIC,
      transaction,
    );
    await this.settingPointBasicBehaviorProRepository.bulkCreate(
      listSettingPointBasicDto,
      transaction,
    );

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

    const listSettingPointProDto: SettingPointBasicBehaviorProDto[] = [];
    from(versionSettingDto.settingPointPro).subscribe((el) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = el.versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointProDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProRepository.bulkDelete(
      versionSettingDto.id,
      SettingPointBasicBehaviorProType.PRO,
      transaction,
    );
    await this.settingPointBasicBehaviorProRepository.bulkCreate(
      listSettingPointProDto,
      transaction,
    );

    // const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    // let listSettingProFormulaSubDto: SettingProFormulaSubDto[] = [];
    // const formulaIds = [];
    // from(versionSettingDto.settingProFormula).subscribe((el) => {
    //   const tmp = new SettingProFormulaDto();
    //   tmp.versionId = versionSettingDto.id;
    //   tmp.point = el.point;
    //   tmp.note = el.note;
    //   formulaIds.push(el.id);

    //   listSettingProFormulaSubDto = [];
    //   from(el.settingProFormulaSub).subscribe((sub) => {
    //     const tmp2 = new SettingProFormulaSubDto();
    //     tmp2.totalItem = sub.totalItem;
    //     tmp2.coefficient = sub.coefficient;

    //     listSettingProFormulaSubDto.push(tmp2);
    //   });

    //   tmp.settingProFormulaSub = listSettingProFormulaSubDto;
    //   listSettingProFormulaDto.push(tmp);
    // });

    // await this.settingProFormulaRepository.bulkDelete(
    //   versionSettingDto.id,
    //   transaction,
    // );
    // await this.settingProFormulaRepository.bulkCreate(
    //   listSettingProFormulaDto,
    //   transaction,
    // );

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
      tmp.skillPercent = el.skillPercent;
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

  private async batchUpdateSettingsToVersionCommon(
    versionSettingDto: VersionSettingDto,
    transaction: Transaction,
  ) {
    const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    let listSettingProFormulaSubDto: SettingProFormulaSubDto[] = [];
    const formulaIds = [];
    from(versionSettingDto.settingProFormula).subscribe((el) => {
      const tmp = new SettingProFormulaDto();
      tmp.versionId = versionSettingDto.id;
      tmp.point = el.point;
      tmp.note = el.note;
      formulaIds.push(el.id);

      listSettingProFormulaSubDto = [];
      from(el.settingProFormulaSub).subscribe((sub) => {
        const tmp2 = new SettingProFormulaSubDto();
        tmp2.totalItem = sub.totalItem;
        tmp2.coefficient = sub.coefficient;

        listSettingProFormulaSubDto.push(tmp2);
      });

      tmp.settingProFormulaSub = listSettingProFormulaSubDto;
      listSettingProFormulaDto.push(tmp);
    });

    await this.settingProFormulaRepository.bulkDelete(
      versionSettingDto.id,
      transaction,
    );
    await this.settingProFormulaRepository.bulkCreate(
      listSettingProFormulaDto,
      transaction,
    );

    return versionSettingDto;
  }

  async savePublicOrPrivate(
    params: CalculatorDetail810Dto,
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
            req.user.timeZone
          ) ||
          compareDatePeriod(
            periods[index].dateEvaluationDepartmentStart,
            periods[index].dateEvaluationDepartmentEnd,
            req.user.timeZone
          )
        ) {
          if (
            compareDatePeriod(
              periods[index].dateCreationGoalDepartmentStart,
              periods[index].dateCreationGoalDepartmentEnd,
              req.user.timeZone
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
              req.user.timeZone
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
              VersionSettingType.LEVEL_8_10,
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
            VersionSettingType.LEVEL_8_10,
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
        await this.versionSettingRepository.saveDraftData(
          params,
          versionSetting[0].id,
          transaction,
          req,
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

  async findMaxSubVersion(version: number, type: number, req: Request) {
    return (
      await this.versionSettingRepository.findMaxSubVersion(version, type, req)
    ).subVersion;
  }

  async cancelVersionSetting17(versionId: number, data: any, req: Request) {
    const version = await this.versionSettingRepository.findUpdateTimeVersion(
      versionId,
      req,
    );

    if (
      data.updatedTime &&
      version.updatedTime.toISOString() !== data.updatedTime
    ) {
      throw new RuntimeException('Date invalid', HttpStatus.CONFLICT);
    }

    delete data.updatedTime;
    await this.versionSettingRepository.updateVersionSetting(
      versionId,
      data,
      req,
    );

    const result = await this.versionSettingRepository.findUpdateTimeVersion(
      versionId,
      req,
    );

    return result;
  }
}
