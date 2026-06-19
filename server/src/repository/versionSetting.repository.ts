/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import {
  Op,
  QueryTypes,
  Sequelize,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { isFormatDate } from 'src/common/util';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingAchievementAdditional } from 'src/entity/SettingAchievementAdditional';
import { SettingAchievementPersonal } from 'src/entity/SettingAchievementPersonal';
import { SettingFormula810 } from 'src/entity/SettingFormula810';
import { SettingLevel } from 'src/entity/SettingLevel';
import { SettingPointBasicBehaviorPro } from 'src/entity/SettingPointBasicBehaviorPro';
import { SettingProFormula } from 'src/entity/SettingProFormula';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { User } from 'src/entity/User';
import { VersionSetting } from 'src/entity/VersionSetting';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { SettingPointBasicBehaviorProType } from 'src/enum/SettingPointBasicBehaviorProType';
import { VersionSettingStatus } from 'src/enum/VersionSettingStatus';
import { VersionSettingRepositoryI } from 'src/interfaces/repository/versionSetting.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { SettingAchievementAdditionalDto } from 'src/model/generic/SettingAchievementAdditionalDto';
import { SettingAchievementPersonalDto } from 'src/model/generic/SettingAchievementPersonalDto';
import { SettingPointBasicBehaviorProDto } from 'src/model/generic/SettingPointBasicBehaviorProDto';
import { SettingProFormulaDto } from 'src/model/generic/SettingProFormulaDto';
import {
  CalculatorDetail810Dto,
  CalculatorDetail810NSDto,
} from 'src/model/request/CalculatorDetail810Dto';
import { ListEvaluationCalculationHistoryDto } from 'src/model/request/F6/ListEvaluationCalculationHistoryDto';
import { SettingProFormulaSubDto } from 'src/model/response/SettingProFormulaSubDto';
import { SettingLevelDto } from 'src/model/generic/SettingLevelDto';
import { FlagSkill } from 'src/enum/FlagSkill';
import { VersionSettingType } from 'src/enum/VersionSettingType';
import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { Sequelize, Transaction } = require('sequelize');

@Injectable()
export class VersionSettingRepository implements VersionSettingRepositoryI {
  @Inject(EntityConstant.VERSION_SETTING)
  private versionSettingEntity: typeof VersionSetting;

  @Inject(EntityConstant.SETTING_FORMULA_8_10)
  private settingFormula810Entity: typeof SettingFormula810;

  @Inject(EntityConstant.SETTING_POINT_BASIC_BEHAVIOR_PRO)
  private settingPointBasicBehaviorProEntity: typeof SettingPointBasicBehaviorPro;

  @Inject(EntityConstant.SETTING_PRO_FORMULA)
  private settingProFormulaEntity: typeof SettingProFormula;

  @Inject(EntityConstant.SETTING_LEVEL)
  private settingLevelEntity: typeof SettingLevel;

  @Inject(EntityConstant.SETTING_ACHIEVEMENT_PERSONAL)
  private settingAchievementPersonalEntity: typeof SettingAchievementPersonal;

  @Inject(EntityConstant.SETTING_ACHIEVEMENT_ADDITIONAL)
  private settingAchievementAdditionalEntity: typeof SettingAchievementAdditional;

  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  async getListVersionSettingPaging(
    param: ListEvaluationCalculationHistoryDto,
    req: Request,
  ) {
    const condition: WhereOptions<any> = {};
    if (param.type !== '-1') {
      condition.type = param.type;
    }
    if (param.status !== '-1') {
      condition.status = param.status;
    }
    condition.companyGroupCode = req?.user?.companyGroupCode;

    return await this.versionSettingEntity.findAll({
      limit: param.limit,
      offset: param.offset,
      where: condition,
      attributes: [
        'id',
        'type',
        'version',
        'subVersion',
        'status',
        'reason',
        'basicMaxDifficulty',
        'behaviorMaxWeight',
        'publicDate',
        'updatedTime',
        'lastUpdatedTime',
      ],
      include: [{ model: User, as: 'user' }],
      order: [
        ['version', 'DESC'],
        ['subVersion', 'DESC'],
      ],
    });
  }

  async countListVersionSetting(
    param: ListEvaluationCalculationHistoryDto,
    req: Request,
  ) {
    const condition: WhereOptions<any> = {};
    if (param.type !== '-1') {
      condition.type = param.type;
    }
    if (param.status !== '-1') {
      condition.status = param.status;
    }
    condition.companyGroupCode = req?.user?.companyGroupCode;

    return await this.versionSettingEntity.count({
      where: condition,
    });
  }

  async getVersionSettingById(versionSettingId: number, req: Request) {
    return await this.versionSettingEntity.findOne({
      where: {
        id: versionSettingId,
        companyGroupCode: req?.user?.companyGroupCode,
      },
      include: [{ model: User, attributes: ['id', 'fullName'] }],
    });
  }

  async getVersionUpdatedTime(versionSettingId: number) {
    return await this.versionSettingEntity.findByPk(versionSettingId, {
      attributes: ['updatedTime'],
    });
  }

  async getListSettingProFormulaByVersionId(versionSettingId: number) {
    return await this.settingProFormulaEntity.findAll({
      where: { versionId: versionSettingId },
      include: [
        {
          model: SettingProFormulaSub,
          order: [['totalItem', 'ASC']],
          required: false,
        },
      ],
      order: [['point', 'DESC']],
    });
  }

  async getListSettingAchievementPersonalByVersionId(versionSettingId: number) {
    return await this.settingAchievementPersonalEntity.findAll({
      where: { versionId: versionSettingId },
      order: [['point', 'DESC']],
    });
  }

  async getNextVersion810(version: number, req: Request) {
    const data = await this.versionSettingEntity.findOne({
      attributes: ['subVersion'],
      where: {
        [Op.and]: [
          { type: VersionSettingType.LEVEL_8_10 },
          { version: version },
          { companyGroupCode: req?.user?.companyGroupCode },
        ],
      },
      order: [['subVersion', 'desc']],
    });
    return { version: version, subVersion: data.subVersion };
  }

  async getNextVersion810NS(version: number, req: Request) {
    const data = await this.versionSettingEntity.findOne({
      attributes: ['subVersion'],
      where: {
        [Op.and]: [
          { type: VersionSettingType.LEVEL_8_10_NS },
          { version: version },
          { companyGroupCode: req?.user?.companyGroupCode },
        ],
      },
      order: [['subVersion', 'desc']],
    });
    return { version: version, subVersion: data.subVersion };
  }

  getTypeVersionSettingBySkill810(skill: FlagSkill): VersionSettingType {
    if (skill === FlagSkill.HAVE_SKILL) {
      return VersionSettingType.LEVEL_8_10;
    } else {
      return VersionSettingType.LEVEL_8_10_NS;
    }
  }

  getNumberValueBeforeSetting(point: string | undefined | null | number) {
    return point == '' || isNaN(point as any) ? null : point;
  }

  async saveDraftVersion(
    params: CalculatorDetail810Dto,
    userId: number,
    isNew: Number,
    isHaveSkill: FlagSkill,
    transaction: Transaction,
    req: Request,
  ) {
    const { version, status, reason, data } = params;
    const {
      maxPoint,
      minPoint,
      maxPointDep,
      minPointDep,
      basicMaxDifficulty,
      behaviorMaxWeight,
    } = data;

    const versions = version.toString().split('.');
    let datas: any = await this.versionSettingEntity.findOrCreate({
      where: {
        version: Number(versions[0]),
        subVersion: Number(versions[1]),
        type: this.getTypeVersionSettingBySkill810(isHaveSkill),
        companyGroupCode: req?.user?.companyGroupCode,
      },
      defaults: {
        type: this.getTypeVersionSettingBySkill810(isHaveSkill),
        version: Number(versions[0]),
        subVersion: Number(versions[1]),
        status: status,
        reason: reason,
        creationUser: userId,
        maxPoint: this.getNumberValueBeforeSetting(maxPoint),
        minPoint: this.getNumberValueBeforeSetting(minPoint),
        maxPointDep: this.getNumberValueBeforeSetting(maxPointDep),
        minPointDep: this.getNumberValueBeforeSetting(minPointDep),
        basicMaxDifficulty:
          this.getNumberValueBeforeSetting(basicMaxDifficulty),
        behaviorMaxWeight: this.getNumberValueBeforeSetting(behaviorMaxWeight),
        companyGroupCode: req?.user?.companyGroupCode,
      },
      transaction: transaction,
    });
    if (isNew === 1 && datas[1] === false)
      datas = await this.versionSettingEntity.findOrCreate({
        where: {
          version: Number(versions[0]),
          subVersion: Number(versions[1]) + 1,
          type: this.getTypeVersionSettingBySkill810(isHaveSkill),
          companyGroupCode: req?.user?.companyGroupCode,
        },
        defaults: {
          type: this.getTypeVersionSettingBySkill810(isHaveSkill),
          version: Number(versions[0]),
          subVersion: Number(versions[1]) + 1,
          status: status,
          creationUser: userId,
          reason: reason,
          lastUpdatedTime: isFormatDate(
            new Date(),
            'YYYY/M/D H:mm',
            req.user.timeZone,
          ),
          maxPoint: this.getNumberValueBeforeSetting(maxPoint),
          minPoint: this.getNumberValueBeforeSetting(minPoint),
          maxPointDep: this.getNumberValueBeforeSetting(maxPointDep),
          minPointDep: this.getNumberValueBeforeSetting(minPointDep),
          basicMaxDifficulty:
            this.getNumberValueBeforeSetting(basicMaxDifficulty),
          behaviorMaxWeight:
            this.getNumberValueBeforeSetting(behaviorMaxWeight),
          companyGroupCode: req?.user?.companyGroupCode,
        },
        transaction: transaction,
      });
    else
      await this.versionSettingEntity.update(
        {
          creationUser: userId,
          reason: reason,
          lastUpdatedTime: isFormatDate(
            new Date(),
            'YYYY/M/D H:mm',
            req.user.timeZone,
          ),
          maxPoint: this.getNumberValueBeforeSetting(maxPoint),
          minPoint: this.getNumberValueBeforeSetting(minPoint),
          maxPointDep: this.getNumberValueBeforeSetting(maxPointDep),
          minPointDep: this.getNumberValueBeforeSetting(minPointDep),
          basicMaxDifficulty:
            this.getNumberValueBeforeSetting(basicMaxDifficulty),
          behaviorMaxWeight:
            this.getNumberValueBeforeSetting(behaviorMaxWeight),
        },
        {
          where: {
            id: datas[0].id,
            companyGroupCode: req?.user?.companyGroupCode,
          },
          transaction: transaction,
        },
      );
    return datas;
  }

  async saveDraftData(
    params: CalculatorDetail810Dto,
    versionId: number,
    transaction: Transaction,
    req: Request,
  ) {
    const { data } = params;
    // data dep saving
    data.settingAchievementDepDiff = data.settingAchievementDepDiff.filter(
      (item: any) =>
        (item.point !== undefined || item.note !== undefined) &&
        (item.point !== null || item.note !== '') &&
        (item.point !== null || item.note !== undefined) &&
        (item.point !== undefined || item.note !== ''),
    );
    data.settingAchievementDepJudgeIndex =
      data.settingAchievementDepJudgeIndex.filter(
        (item: any) =>
          (item.point !== undefined || item.note !== undefined) &&
          (item.point !== null || item.note !== '') &&
          (item.point !== null || item.note !== undefined) &&
          (item.point !== undefined || item.note !== ''),
      );
    data.settingAchievementAdditionalDep =
      data.settingAchievementAdditionalDep.filter(
        (item: any) =>
          (item.point !== undefined ||
            item.note !== undefined ||
            item.rating !== undefined) &&
          (item.point !== undefined ||
            item.note !== undefined ||
            item.rating !== null) &&
          (item.point !== null ||
            item.note !== '' ||
            item.rating !== undefined) &&
          (item.point !== null || item.note !== '' || item.rating !== null) &&
          (item.point !== null ||
            item.note !== undefined ||
            item.rating !== undefined) &&
          (item.point !== null ||
            item.note !== undefined ||
            item.rating !== null) &&
          (item.point !== undefined ||
            item.note !== '' ||
            item.rating !== undefined) &&
          (item.point !== undefined ||
            item.note !== '' ||
            item.rating !== null),
      );
    data.settingFormula810 = data.settingFormula810.filter(
      (item: any) =>
        (item.point !== undefined ||
          item.note !== undefined ||
          item.result !== undefined) &&
        (item.point !== undefined ||
          item.note !== undefined ||
          item.result !== null) &&
        (item.point !== null ||
          item.note !== '' ||
          item.result !== undefined) &&
        (item.point !== null || item.note !== '' || item.result !== null) &&
        (item.point !== null ||
          item.note !== undefined ||
          item.result !== undefined) &&
        (item.point !== null ||
          item.note !== undefined ||
          item.result !== null) &&
        (item.point !== undefined ||
          item.note !== '' ||
          item.result !== undefined) &&
        (item.point !== undefined || item.note !== '' || item.result !== null),
    );

    const {
      settingAchievementDepDiff,
      settingAchievementDepJudgeIndex,
      settingAchievementAdditionalDep,
      settingFormula810,
    } = data;

    await this.settingAchievementPersonalEntity.destroy({
      where: {
        versionId: versionId,
        typeEvaluation: TypeAchievement.DEPARTMENT_810,
      },
      transaction: transaction,
    });
    await this.settingAchievementAdditionalEntity.destroy({
      where: { versionId: versionId, type: TypeAchievement.DEPARTMENT_810 },
      transaction: transaction,
    });
    await this.settingFormula810Entity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
    for await (const num of settingAchievementDepDiff) {
      await this.settingAchievementPersonalEntity.create(
        {
          versionId: versionId,
          type: 1,
          point: !isNaN(num.point as any) ? num.point : null,
          note: num.note,
          typeEvaluation: TypeAchievement.DEPARTMENT_810,
        },
        { transaction: transaction },
      );
    }
    for await (const num of settingAchievementDepJudgeIndex) {
      await this.settingAchievementPersonalEntity.create(
        {
          versionId: versionId,
          type: 2,
          point:
            !isNaN(num.point as any) && num.point !== '' ? num.point : null,
          note: num.note,
          typeEvaluation: TypeAchievement.DEPARTMENT_810,
        },
        { transaction: transaction },
      );
    }
    for await (const e of settingAchievementAdditionalDep) {
      await this.settingAchievementAdditionalEntity.create(
        {
          versionId: versionId,
          rating: e.rating,
          point: !isNaN(e.point as any) && e.point !== '' ? e.point : null,
          note: e.note,
          type: TypeAchievement.DEPARTMENT_810,
        },
        { transaction: transaction },
      );
    }
    for await (const e of settingFormula810) {
      await this.settingFormula810Entity.create(
        {
          versionId: versionId,
          result: e.result,
          point: !isNaN(e.point as any) && e.point !== '' ? e.point : null,
          note: e.note,
        },
        { transaction: transaction },
      );
    }

    // data personal saving
    const {
      settingPointBasic,
      settingPointPro,
      settingProFormula,
      settingPointBehavior,
      settingAchievementPersonalDiff,
      settingAchievementPersonalJudgeIndex,
      settingAchievementAdditional,
      settingLevel,
    } = data;

    const listSettingPointBasicDto: SettingPointBasicBehaviorProDto[] = [];
    from(settingPointBasic).subscribe((el: SettingPointBasicBehaviorProDto) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointBasicDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProEntity.destroy({
      where: {
        versionId: versionId,
        type: SettingPointBasicBehaviorProType.BASIC,
      },
      transaction: transaction,
    });
    await this.settingPointBasicBehaviorProEntity.bulkCreate(
      listSettingPointBasicDto as any,
      { transaction: transaction },
    );

    const listSettingPointProDto: SettingPointBasicBehaviorProDto[] = [];
    from(settingPointPro).subscribe((el: SettingPointBasicBehaviorProDto) => {
      const tmp = new SettingPointBasicBehaviorProDto();
      tmp.versionId = versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      listSettingPointProDto.push(tmp);
    });
    await this.settingPointBasicBehaviorProEntity.destroy({
      where: {
        versionId: versionId,
        type: SettingPointBasicBehaviorProType.PRO,
      },
      transaction: transaction,
    });
    await this.settingPointBasicBehaviorProEntity.bulkCreate(
      listSettingPointProDto as any,
      { transaction: transaction },
    );

    // const listSettingProFormulaDto: SettingProFormulaDto[] = [];
    // let listSettingProFormulaSubDto: SettingProFormulaSubDto[] = [];
    // const formulaIds = [];
    // from(settingProFormula).subscribe((el) => {
    //   const tmp = new SettingProFormulaDto();
    //   tmp.versionId = versionId;
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
    // await this.settingProFormulaEntity.destroy({
    //   where: {
    //     versionId: versionId,
    //   },
    //   transaction: transaction,
    // });
    // await this.settingProFormulaEntity.bulkCreate(
    //   listSettingProFormulaDto as any,
    //   {
    //     include: [{ model: SettingProFormulaSub, as: 'settingProFormulaSub' }],
    //     transaction: transaction,
    //   },
    // );

    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    from(settingPointBehavior).subscribe(
      (el: SettingPointBasicBehaviorProDto) => {
        const tmp = new SettingPointBasicBehaviorProDto();
        tmp.versionId = versionId;
        tmp.type = el.type;
        tmp.point = el.point;
        tmp.note = el.note;
        listSettingPointBehaviorDto.push(tmp);
      },
    );
    await this.settingPointBasicBehaviorProEntity.destroy({
      where: {
        versionId: versionId,
        type: SettingPointBasicBehaviorProType.BEHAVIOR,
      },
      transaction: transaction,
    });
    await this.settingPointBasicBehaviorProEntity.bulkCreate(
      listSettingPointBehaviorDto as any,
      { transaction: transaction },
    );

    const listSettingAchievementPersonalDto: SettingAchievementPersonalDto[] =
      [];
    from(settingAchievementPersonalDiff).subscribe((el) => {
      const tmp = new SettingAchievementPersonalDto();
      tmp.versionId = versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.typeEvaluation = el.typeEvaluation;

      listSettingAchievementPersonalDto.push(tmp);
    });
    from(settingAchievementPersonalJudgeIndex).subscribe((el) => {
      const tmp = new SettingAchievementPersonalDto();
      tmp.versionId = versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.typeEvaluation = el.typeEvaluation;
      tmp.description = el.description;
      listSettingAchievementPersonalDto.push(tmp);
    });
    await this.settingAchievementPersonalEntity.destroy({
      where: {
        versionId: versionId,
        typeEvaluation: TypeAchievement.PERSONAL_810,
      },
      transaction: transaction,
    });
    await this.settingAchievementPersonalEntity.bulkCreate(
      listSettingAchievementPersonalDto as any,
      {
        transaction: transaction,
      },
    );

    const listSettingAchievementAdditionalDto: SettingAchievementAdditionalDto[] =
      [];
    from(settingAchievementAdditional).subscribe((el) => {
      const tmp = new SettingAchievementAdditionalDto();
      tmp.versionId = versionId;
      tmp.rating = el.rating;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.type = el.type;

      listSettingAchievementAdditionalDto.push(tmp);
    });
    await this.settingAchievementAdditionalEntity.destroy({
      where: { versionId: versionId, type: TypeAchievement.PERSONAL_810 },
      transaction: transaction,
    });
    await this.settingAchievementAdditionalEntity.bulkCreate(
      listSettingAchievementAdditionalDto as any,
      {
        transaction: transaction,
      },
    );

    const listSettingLevellDto: SettingLevelDto[] = [];
    from(settingLevel).subscribe((el) => {
      const tmp = new SettingLevelDto();
      tmp.versionId = versionId;
      tmp.level = el.level;
      tmp.skillPercent = el.skillPercent;
      tmp.behaviorPercent = el.behaviorPercent;
      tmp.achievementPercent = el.achievementPercent;

      listSettingLevellDto.push(tmp);
    });
    await this.settingLevelEntity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
    await this.settingLevelEntity.bulkCreate(listSettingLevellDto as any, {
      transaction: transaction,
    });

    return 1;
  }

  async saveDraftNSData(
    params: CalculatorDetail810NSDto,
    versionId: number,
    transaction: Transaction,
  ) {
    const { data } = params;
    // data dep saving
    data.settingAchievementDepDiff = data.settingAchievementDepDiff.filter(
      (item: any) =>
        (item.point !== undefined || item.note !== undefined) &&
        (item.point !== null || item.note !== '') &&
        (item.point !== null || item.note !== undefined) &&
        (item.point !== undefined || item.note !== ''),
    );
    data.settingAchievementDepJudgeIndex =
      data.settingAchievementDepJudgeIndex.filter(
        (item: any) =>
          (item.point !== undefined || item.note !== undefined) &&
          (item.point !== null || item.note !== '') &&
          (item.point !== null || item.note !== undefined) &&
          (item.point !== undefined || item.note !== ''),
      );
    data.settingAchievementAdditionalDep =
      data.settingAchievementAdditionalDep.filter(
        (item: any) =>
          (item.point !== undefined ||
            item.note !== undefined ||
            item.rating !== undefined) &&
          (item.point !== undefined ||
            item.note !== undefined ||
            item.rating !== null) &&
          (item.point !== null ||
            item.note !== '' ||
            item.rating !== undefined) &&
          (item.point !== null || item.note !== '' || item.rating !== null) &&
          (item.point !== null ||
            item.note !== undefined ||
            item.rating !== undefined) &&
          (item.point !== null ||
            item.note !== undefined ||
            item.rating !== null) &&
          (item.point !== undefined ||
            item.note !== '' ||
            item.rating !== undefined) &&
          (item.point !== undefined ||
            item.note !== '' ||
            item.rating !== null),
      );
    data.settingFormula810 = data.settingFormula810.filter(
      (item: any) =>
        (item.point !== undefined ||
          item.note !== undefined ||
          item.result !== undefined) &&
        (item.point !== undefined ||
          item.note !== undefined ||
          item.result !== null) &&
        (item.point !== null ||
          item.note !== '' ||
          item.result !== undefined) &&
        (item.point !== null || item.note !== '' || item.result !== null) &&
        (item.point !== null ||
          item.note !== undefined ||
          item.result !== undefined) &&
        (item.point !== null ||
          item.note !== undefined ||
          item.result !== null) &&
        (item.point !== undefined ||
          item.note !== '' ||
          item.result !== undefined) &&
        (item.point !== undefined || item.note !== '' || item.result !== null),
    );

    const {
      settingAchievementDepDiff,
      settingAchievementDepJudgeIndex,
      settingAchievementAdditionalDep,
      settingFormula810,
    } = data;

    await this.settingAchievementPersonalEntity.destroy({
      where: {
        versionId: versionId,
        typeEvaluation: TypeAchievement.DEPARTMENT_810,
      },
      transaction: transaction,
    });
    await this.settingAchievementAdditionalEntity.destroy({
      where: { versionId: versionId, type: TypeAchievement.DEPARTMENT_810 },
      transaction: transaction,
    });
    await this.settingFormula810Entity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
    for await (const num of settingAchievementDepDiff) {
      await this.settingAchievementPersonalEntity.create(
        {
          versionId: versionId,
          type: 1,
          point: !isNaN(num.point as any) ? num.point : null,
          note: num.note,
          typeEvaluation: TypeAchievement.DEPARTMENT_810,
        },
        { transaction: transaction },
      );
    }
    for await (const num of settingAchievementDepJudgeIndex) {
      await this.settingAchievementPersonalEntity.create(
        {
          versionId: versionId,
          type: 2,
          point:
            !isNaN(num.point as any) && num.point !== '' ? num.point : null,
          note: num.note,
          typeEvaluation: TypeAchievement.DEPARTMENT_810,
        },
        { transaction: transaction },
      );
    }
    for await (const e of settingAchievementAdditionalDep) {
      await this.settingAchievementAdditionalEntity.create(
        {
          versionId: versionId,
          rating: e.rating,
          point: !isNaN(e.point as any) && e.point !== '' ? e.point : null,
          note: e.note,
          type: TypeAchievement.DEPARTMENT_810,
        },
        { transaction: transaction },
      );
    }
    for await (const e of settingFormula810) {
      await this.settingFormula810Entity.create(
        {
          versionId: versionId,
          result: e.result,
          point: !isNaN(e.point as any) && e.point !== '' ? e.point : null,
          note: e.note,
        },
        { transaction: transaction },
      );
    }

    // data personal saving
    const {
      settingPointBehavior,
      settingAchievementPersonalDiff,
      settingAchievementPersonalJudgeIndex,
      settingAchievementAdditional,
      settingLevel,
    } = data;

    const listSettingPointBehaviorDto: SettingPointBasicBehaviorProDto[] = [];
    from(settingPointBehavior).subscribe(
      (el: SettingPointBasicBehaviorProDto) => {
        const tmp = new SettingPointBasicBehaviorProDto();
        tmp.versionId = versionId;
        tmp.type = el.type;
        tmp.point = el.point;
        tmp.note = el.note;
        listSettingPointBehaviorDto.push(tmp);
      },
    );
    await this.settingPointBasicBehaviorProEntity.destroy({
      where: {
        versionId: versionId,
        type: SettingPointBasicBehaviorProType.BEHAVIOR,
      },
      transaction: transaction,
    });
    await this.settingPointBasicBehaviorProEntity.bulkCreate(
      listSettingPointBehaviorDto as any,
      { transaction: transaction },
    );

    const listSettingAchievementPersonalDto: SettingAchievementPersonalDto[] =
      [];
    from(settingAchievementPersonalDiff).subscribe((el) => {
      const tmp = new SettingAchievementPersonalDto();
      tmp.versionId = versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.typeEvaluation = el.typeEvaluation;

      listSettingAchievementPersonalDto.push(tmp);
    });
    from(settingAchievementPersonalJudgeIndex).subscribe((el) => {
      const tmp = new SettingAchievementPersonalDto();
      tmp.versionId = versionId;
      tmp.type = el.type;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.typeEvaluation = el.typeEvaluation;
      tmp.description = el.description;
      listSettingAchievementPersonalDto.push(tmp);
    });
    await this.settingAchievementPersonalEntity.destroy({
      where: {
        versionId: versionId,
        typeEvaluation: TypeAchievement.PERSONAL_810,
      },
      transaction: transaction,
    });
    await this.settingAchievementPersonalEntity.bulkCreate(
      listSettingAchievementPersonalDto as any,
      {
        transaction: transaction,
      },
    );

    const listSettingAchievementAdditionalDto: SettingAchievementAdditionalDto[] =
      [];
    from(settingAchievementAdditional).subscribe((el) => {
      const tmp = new SettingAchievementAdditionalDto();
      tmp.versionId = versionId;
      tmp.rating = el.rating;
      tmp.point = el.point;
      tmp.note = el.note;
      tmp.type = el.type;

      listSettingAchievementAdditionalDto.push(tmp);
    });
    await this.settingAchievementAdditionalEntity.destroy({
      where: { versionId: versionId, type: TypeAchievement.PERSONAL_810 },
      transaction: transaction,
    });
    await this.settingAchievementAdditionalEntity.bulkCreate(
      listSettingAchievementAdditionalDto as any,
      {
        transaction: transaction,
      },
    );

    const listSettingLevellDto: SettingLevelDto[] = [];
    from(settingLevel).subscribe((el) => {
      const tmp = new SettingLevelDto();
      tmp.versionId = versionId;
      tmp.level = el.level;
      tmp.skillPercent = el.skillPercent;
      tmp.behaviorPercent = el.behaviorPercent;
      tmp.achievementPercent = el.achievementPercent;

      listSettingLevellDto.push(tmp);
    });
    await this.settingLevelEntity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
    await this.settingLevelEntity.bulkCreate(listSettingLevellDto as any, {
      transaction: transaction,
    });

    return 1;
  }

  async cancelSetting(id: number, _userId: number, req: Request) {
    return await this.versionSettingEntity.update(
      {
        status: 2,
        // creationUser: userId,
        // lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
      },
      { where: { id: id, companyGroupCode: req?.user?.companyGroupCode } },
    );
  }

  async listPointSetting(companyGroupCode: string): Promise<VersionSetting> {
    return await this.versionSettingEntity.findOne({
      where: {
        status: 4,
        type: 1,
        companyGroupCode: companyGroupCode,
      },
      include: [{ model: SettingProFormula, as: 'settingProFormula' }],
      order: [
        [
          { model: SettingProFormula, as: 'settingProFormula' },
          'point',
          'DESC',
        ],
      ],
    });
  }

  async listPointSettingByType(
    type: number,
    companyGroupCode: string,
  ): Promise<VersionSetting> {
    return await this.versionSettingEntity.findOne({
      where: {
        status: 4,
        type: type,
        companyGroupCode: companyGroupCode,
      },
      include: [{ model: SettingProFormula, as: 'settingProFormula' }],
      order: [
        [
          { model: SettingProFormula, as: 'settingProFormula' },
          'point',
          'DESC',
        ],
      ],
    });
  }

  async findMaxVersion(type: number, req: Request) {
    return await this.versionSettingEntity.findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('version')), 'version']],
      where: { type: type, companyGroupCode: req?.user?.companyGroupCode },
    });
  }

  async findMaxSubVersion(version: number, type: number, req: Request) {
    return await this.versionSettingEntity.findOne({
      attributes: [
        [Sequelize.fn('max', Sequelize.col('sub_version')), 'subVersion'],
      ],
      where: {
        version: version,
        type: type,
        companyGroupCode: req?.user?.companyGroupCode,
      },
    });
  }

  async findVersionSettingById(versionId: number) {
    return await this.versionSettingEntity.findByPk(versionId);
  }

  async publicVersionSetting(
    versionId: number,
    type: number,
    data: any,
    companyGroupCode: string,
  ) {
    const t = await this.versionSettingEntity.sequelize.transaction();

    try {
      await this.versionSettingEntity.update(data, {
        where: { id: versionId },
        transaction: t,
      });

      await this.versionSettingEntity.update(
        { status: VersionSettingStatus.PRIVATE, publicDate: null },
        {
          where: {
            id: {
              [Op.ne]: versionId,
            },
            type: type,
            status: VersionSettingStatus.PUBLISHED,
            companyGroupCode: companyGroupCode,
          },
          transaction: t,
        },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new RuntimeException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  async findOneSetting(where: { [x: string]: any }) {
    return await this.settingLevelEntity.findOne({ where: where });
  }

  async createVersionSetting17T(data: any, t: Transaction) {
    const result = await this.versionSettingEntity.create(data, {
      transaction: t,
    });

    return result;
  }

  async updateVersionSettingT(data: any, t: Transaction) {
    return await this.versionSettingEntity.update(data, {
      where: { id: data.id },
      transaction: t,
    });
  }

  async updateVersionSetting(versionId, data: any, req: Request) {
    return await this.versionSettingEntity.update(data, {
      where: { id: versionId, companyGroupCode: req?.user?.companyGroupCode },
    });
  }

  async getNewTransaction() {
    return await this.versionSettingEntity.sequelize.transaction();
  }

  async checkVersionPublic(
    type: VersionSettingType,
    req: Request,
  ): Promise<VersionSetting> {
    return await this.versionSettingEntity.findOne({
      where: {
        [Op.and]: [
          { status: 4 },
          { type },
          {
            companyGroupCode: req?.user?.companyGroupCode,
          },
        ],
      },
    });
  }

  async savePublicOrPrivate(
    params: CalculatorDetail810Dto | CalculatorDetail810NSDto,
    userId: number,
    transaction: Transaction,
    req: Request,
  ) {
    const { type, status, reason, version, isUpdate } = params;
    const {
      maxPoint,
      minPoint,
      maxPointDep,
      minPointDep,
      basicMaxDifficulty,
      behaviorMaxWeight,
    } = params.data;
    const versions = version.toString().split('.');

    const datas = await this.versionSettingEntity.findOrCreate({
      where: {
        version: Number(versions[0]),
        subVersion: Number(versions[1]),
        type,
        companyGroupCode: req.user.companyGroupCode,
      },
      defaults: {
        type,
        version: Number(versions[0]),
        subVersion: Number(versions[1]),
        status: 3,
        reason: reason,
        creationUser: userId,
        basicMaxDifficulty,
        behaviorMaxWeight,
        maxPoint: maxPoint,
        minPoint: minPoint,
        maxPointDep: maxPointDep,
        minPointDep: minPointDep,
        companyGroupCode: req.user.companyGroupCode,
      },
      transaction: transaction,
    });
    if (status === 4) {
      await this.versionSettingEntity.update(
        { status: 3, publicDate: null },
        {
          where: {
            type,
            status: 4,
            companyGroupCode: req?.user?.companyGroupCode,
          },
          transaction: transaction,
        },
      );
      const versionMax = await this.versionSettingEntity.findOne({
        where: { type, companyGroupCode: req?.user?.companyGroupCode },
        order: [['version', 'desc']],
      });
      await this.versionSettingEntity.update(
        {
          reason: reason,
          status: status,
          publicDate: isFormatDate(
            new Date(),
            'YYYY/M/D H:mm',
            req.user.timeZone,
          ),
          lastUpdatedTime: isFormatDate(
            new Date(),
            'YYYY/M/D H:mm',
            req.user.timeZone,
          ),
          version: versionMax.version + 1,
          subVersion: 0,
          basicMaxDifficulty,
          behaviorMaxWeight,
          maxPoint: maxPoint,
          minPoint: minPoint,
          maxPointDep: maxPointDep,
          minPointDep: minPointDep,
          // creationUser: userId,
        },
        {
          where: {
            [Op.and]: [
              { id: datas[0].id },
              { subVersion: { [Op.notIn]: [0] } },
              { companyGroupCode: req?.user?.companyGroupCode },
            ],
          },
          transaction: transaction,
        },
      );
      await this.versionSettingEntity.update(
        {
          status: status,
          reason: reason,
          publicDate: isFormatDate(
            new Date(),
            'YYYY/M/D H:mm',
            req.user.timeZone,
          ),
          lastUpdatedTime: isFormatDate(
            new Date(),
            'YYYY/M/D H:mm',
            req.user.timeZone,
          ),
          subVersion: 0,
          basicMaxDifficulty,
          behaviorMaxWeight,
          maxPoint: maxPoint,
          minPoint: minPoint,
          maxPointDep: maxPointDep,
          minPointDep: minPointDep,
          // creationUser: userId,
        },
        {
          where: {
            [Op.and]: [
              { id: datas[0].id },
              { subVersion: 0 },
              { companyGroupCode: req?.user?.companyGroupCode },
            ],
          },
          transaction: transaction,
        },
      );
    } else {
      await this.versionSettingEntity.update(
        {
          status: status,
          reason: reason,
          basicMaxDifficulty,
          behaviorMaxWeight,
          maxPoint: maxPoint,
          minPoint: minPoint,
          maxPointDep: maxPointDep,
          minPointDep: minPointDep,
        },
        {
          where: {
            id: datas[0].id,
            companyGroupCode: req?.user?.companyGroupCode,
          },
          transaction: transaction,
        },
      );
    }
    if (isUpdate) {
      await this.versionSettingEntity.update(
        {
          creationUser: userId,
          lastUpdatedTime: isFormatDate(
            new Date(),
            'YYYY/M/D H:mm',
            req.user.timeZone,
          ),
        },
        {
          where: {
            id: datas[0].id,
            companyGroupCode: req?.user?.companyGroupCode,
          },
          transaction: transaction,
        },
      );
    }

    return datas;
  }

  async findDatePublic(companyGroupCode: string) {
    return await this.versionSettingEntity.findOne({
      attributes: ['publicDate'],
      where: { type: 2, status: 4, companyGroupCode: companyGroupCode },
    });
  }

  async findUpdateTimeVersion(id: number, req: Request, t?: Transaction) {
    return await this.versionSettingEntity.findOne({
      where: { id: id, companyGroupCode: req?.user?.companyGroupCode },
      include: [{ model: User, as: 'user' }],
      transaction: t,
    });
  }

  async findEditVersion() {
    const editVersion = await this.versionSettingEntity.findOne({
      where: { type: VersionSettingType.LEVEL_8_10, status: 1 },
    });
    return editVersion ? true : false;
  }

  async unPublicVersionSetting(
    idException: number,
    type: number,
    transaction: Transaction,
    req: Request,
  ): Promise<boolean> {
    await this.versionSettingEntity.update(
      { status: VersionSettingStatus.PRIVATE, publicDate: null },
      {
        where: {
          id: {
            [Op.ne]: idException,
          },
          type: type,
          status: VersionSettingStatus.PUBLISHED,
          companyGroupCode: req?.user?.companyGroupCode,
        },
        transaction: transaction,
      },
    );

    return true;
  }

  async existEditingVersion(versionId: number, type: number, req: Request) {
    let versionIdStatement = '';
    const condition: any = {};
    if (versionId) {
      versionIdStatement = ' AND id!=:versionId';
      condition['versionId'] = versionId;
    }
    condition['type'] = type;
    condition['companyGroupCode'] = req?.user?.companyGroupCode;
    const querys = await this.settingLevelEntity.sequelize.query(
      `SELECT EXISTS(SELECT 1 FROM version_setting_tbl WHERE status=1 AND type=:type${versionIdStatement} AND company_group_code=:companyGroupCode)`,
      {
        replacements: condition,
      },
    );

    const hasResult = querys[0][0]['exists'] as boolean;

    return hasResult;
  }

  async isMainVersionPublic(version: number, type: number, req: Request) {
    const querys = await this.versionSettingEntity.sequelize.query(
      `SELECT EXISTS(SELECT 1 FROM version_setting_tbl WHERE version= :version AND sub_version=0 AND status=4 AND type= :type AND company_group_code=:companyGroupCode)`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          version: version,
          type: type,
          companyGroupCode: req?.user?.companyGroupCode,
        },
      },
    );

    const hasResult = querys[0]['exists'] as boolean;

    return hasResult;
  }

  async listPointSettingCron(
    companyGroupCode: string,
  ): Promise<VersionSetting[]> {
    return await this.versionSettingEntity.findAll({
      where: {
        status: 4,
        companyGroupCode: companyGroupCode,
      },
      include: [{ model: SettingProFormula, as: 'settingProFormula' }],
      order: [
        [
          { model: SettingProFormula, as: 'settingProFormula' },
          'point',
          'DESC',
        ],
      ],
    });
  }

  async getVersionSrtting17(flagSkill: number, companyGroupCode: string) {
    return await this.versionSettingEntity.findOne({
      where: {
        type: flagSkill === 1 ? 1 : 3,
        status: 4,
        companyGroupCode: companyGroupCode,
      },
      attributes: ['maxPoint', 'minPoint'],
      include: [
        {
          model: SettingAchievementAdditional,
          as: 'settingAchievementAdditional',
          attributes: ['id', 'versionId', 'rating', 'point', 'note'],
        },
      ],
    });
  }
}
