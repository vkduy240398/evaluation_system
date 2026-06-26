import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { User } from 'src/entity/User';
import { AddUser } from 'src/model/getUserDataOracleDto';
import { Department } from 'src/entity/Department';
import { Company } from 'src/entity/Company';
import { Op, QueryTypes, Sequelize, Transaction } from 'sequelize';
import { dateNowMoment } from 'src/common/util';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationAchievementPersonal } from 'src/entity/EvaluationAchievementPersonal';
import { EvaluationAchievementAdditional } from 'src/entity/EvaluationAchievementAdditional';
import { EvaluationBasicBehavior } from 'src/entity/EvaluationBasicBehavior';
import { EvaluationPro } from 'src/entity/EvaluationPro';
import { HistoryApproveEvaluation } from 'src/entity/HistoryApproveEvaluation';
import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
import { EvaluationAchievementPersonalSub } from 'src/entity/EvaluationAchievementPersonalSub';
import { VersionSetting } from 'src/entity/VersionSetting';
import { SettingLevel } from 'src/entity/SettingLevel';
import { Evaluator } from 'src/entity/Evaluator';
import { EvaluatorDefault } from 'src/entity/EvaluatorDefault';
import { UserUpdateDto } from 'src/model/request/UserUpdateDto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
import * as moment from 'moment';
import { Permission } from 'src/entity/Permission';
// moment.tz.setDefault('Asia/Tokyo');
// import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ManagementUserRepository {
  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  @Inject(EntityConstant.DEPARTMENT)
  private departmentRepository: typeof Department;

  @Inject(EntityConstant.COMPANY)
  private companyRepository: typeof Company;

  @Inject(EntityConstant.EVALUATION_PERIOD)
  private evaluationPeriodEntity: typeof EvaluationPeriod;

  @Inject(EntityConstant.EVALUATION)
  private evaluationEntity: typeof Evaluation;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL)
  private evaluationAchievementPersonalEntity: typeof EvaluationAchievementPersonal;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_ADDITIONAL)
  private evaluationAchievementAdditionalEntity: typeof EvaluationAchievementAdditional;

  @Inject(EntityConstant.EVALUATION_BASIC_BEHAVIOR)
  private evaluationBasicBehaviorEntity: typeof EvaluationBasicBehavior;

  @Inject(EntityConstant.EVALUATION_PRO)
  private evaluationPro: typeof EvaluationPro;

  @Inject(EntityConstant.HISTORY_APPROVE_EVALUATION)
  private historyApproveEntity: typeof HistoryApproveEvaluation;

  @Inject(EntityConstant.VERSION_GUIDE_EVALUATION)
  private versionGuideEvaluationEntity: typeof VersionGuideEvaluation;

  @Inject(EntityConstant.LIST_BASIC_BEHAVIOR)
  private listBasicBehaviorEntity: typeof ListBasicBehavior;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL_SUB)
  private evaluationAchievementPersonalSub: typeof EvaluationAchievementPersonalSub;

  @Inject(EntityConstant.VERSION_SETTING)
  private versionSettingEntity: typeof VersionSetting;

  @Inject(EntityConstant.EVALUATOR)
  private evaluatorEnity: typeof Evaluator;

  @Inject(EntityConstant.EVALUATOR_DEFAULT)
  private evaluatorDefaultEnity: typeof EvaluatorDefault;

  @Inject(EntityConstant.PERMISSION)
  private permissionEntity: typeof Permission;

  // async addUser(body: AddUser, companyId) {
  // private compnayRepository: typeof Company;
  async addUser(body: AddUser, companyId, companyGroupCode: string) {
    const { employeeNumber, fullName, email } = body;
    const datas = await this.userEntity.findOrCreate({
      where: { employeeNumber: employeeNumber, companyGroupCode },
      defaults: {
        employeeNumber: employeeNumber,
        fullName: fullName,
        // departmentId: departmentId,
        email: email,
        active: 1,
        companyId: companyId,
        companyGroupCode,
      },
    });

    if (!datas[1]) {
      await this.userEntity.update(
        {
          departmentId: null,
          active: 1,
          companyId: companyId,
          divisionId: null,
          level: null,
        },
        {
          where: {
            employeeNumber: employeeNumber,
            companyGroupCode: companyGroupCode,
          },
        },
      );
    }

    return datas;
  }
  async addDepartment(body: AddUser) {
    const { departmentId, department } = body;

    const departments = await this.departmentRepository.findOrCreate({
      where: { code: departmentId },
      defaults: {
        code: departmentId,
        name: department,
        class: 0,
        type: 0,
        active: 1,
      },
    });
    if (!departments[1]) {
      await this.departmentRepository.update(
        { active: 1 },
        { where: { code: departmentId } },
      );
    }

    return departments;
  }
  async addCompany(body: AddUser) {
    const { company } = body;
    return await this.companyRepository.findOrCreate({
      where: { name: { [Op.like]: company } },
      defaults: {
        name: company,
      },
    });
  }

  async getEvaluationPeriodCurrent(
    companyGroupCode: string,
    timeZone: string,
  ): Promise<EvaluationPeriod[]> {
    const fieldGoalStart = 'period_start';
    const fieldGoalEnd = 'period_end';
    const dateNow = dateNowMoment(timeZone);
    const periods = (
      await this.evaluationPeriodEntity.findAll({
        attributes: [
          'id',
          'dateCreationGoalStart',
          'dateCreationGoalEnd',
          'dateCreationGoalDepartmentStart',
          'dateCreationGoalDepartmentEnd',
          'year',
          'periodIndex',
        ],
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn(
                'TO_DATE',
                Sequelize.col(`${fieldGoalStart}`),
                '%YYYY/%MM',
              ),
              {
                [Op.lte]: Sequelize.fn('TO_DATE', dateNow, '%YYYY/%MM'),
              },
            ),

            Sequelize.where(
              Sequelize.fn(
                'TO_DATE',
                Sequelize.col(`${fieldGoalEnd}`),
                '%YYYY/%MM',
              ),
              {
                [Op.gte]: Sequelize.fn('TO_DATE', dateNow, '%YYYY/%MM'),
              },
            ),
          ],
          companyGroupCode: companyGroupCode,
        },
      })
    ).map((data) => data && data.get({ plain: true }));

    return periods;
  }

  async getEvaluationByUserIdPeriodId(
    _periodIds: number,
    userIds: number[],
    isGetStatus50: boolean,
    companyGroupCode: string,
    level: number,
  ): Promise<Evaluation[]> {
    const arrayWheres = [];
    arrayWheres.push({ level: level });
    arrayWheres.push({ evaluationPeriodId: _periodIds });
    arrayWheres.push({ userId: { [Op.in]: userIds } });
    arrayWheres.push({ creationUser: { [Op.eq]: null } });
    arrayWheres.push({ companyGroupCode: companyGroupCode });
    // if (isGetStatus50) {
    arrayWheres.push({ status: { [Op.lt]: 50 } });
    // }
    const evaluations = await this.evaluationEntity.findAll({
      where: {
        [Op.and]: arrayWheres,
      },
      include: [
        { model: User, as: 'user' },
        { model: EvaluationPeriod, as: 'evaluationPeriod' },
      ],
    });

    return evaluations;
  }

  async countEvaluation(conditions: any) {
    return await this.evaluationEntity.count({
      where: conditions,
    });
  }

  async getNewTransaction() {
    return await this.userEntity.sequelize.transaction();
  }

  async getUserList(userIds: number[]) {
    return await this.userEntity.findAll({
      where: { id: { [Op.in]: userIds } },
      include: [
        { model: Company, as: 'company', attributes: ['name'] },
        { model: Department, as: 'department', attributes: ['name', 'code'] },
        { model: Department, as: 'division', attributes: ['name', 'code'] },
      ],
    });
  }

  async getCountUserList(userIds: number[], companyGroupCode: string) {
    return await this.userEntity.count({
      where: {
        id: { [Op.in]: userIds },
        active: 1,
        companyGroupCode: companyGroupCode,
      },
    });
  }

  async deleteEvaluationAchievementPersonal(
    evaluationId: number,
    transaction: Transaction,
  ) {
    // const achievementList =
    //   await this.evaluationAchievementPersonalEntity.findAll({
    //     where: { evaluationId },
    //     attributes: ['id'],
    //     transaction: transaction,
    //   });
    // const achievementIdList = achievementList.map(
    //   (achievement: EvaluationAchievementPersonal) => achievement.id,
    // );

    await this.evaluationAchievementPersonalSub.destroy({
      where: { achievementPersonalId: { [Op.is]: null } },
      transaction: transaction,
    });

    return await this.evaluationAchievementPersonalEntity.destroy({
      where: { evaluationId },
      transaction: transaction,
    });
  }
  async deleteAdditionAchievement(
    evaluationId: number,
    transaction: Transaction,
  ) {
    return await this.evaluationAchievementAdditionalEntity.destroy({
      where: { evaluationId },
      transaction: transaction,
    });
  }
  async deleteBasicBehavior(evaluationId: number, transaction: Transaction) {
    return await this.evaluationBasicBehaviorEntity.destroy({
      where: { evaluationId },
      transaction: transaction,
    });
  }
  async deleteEvaluators(
    evaluationId: number,
    userId: number,
    evaluationPeriodId: number,
    transaction: Transaction,
  ) {
    await this.evaluatorEnity.destroy({
      where: { evaluationId },
      transaction: transaction,
    });
    return await this.evaluatorDefaultEnity.update(
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        evaluator_0_5_id: null,
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        evaluator_1_id: null,
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        evaluator_2_id: null,
      },
      {
        where: { userId: userId, evaluationPeriodId: evaluationPeriodId },
        transaction: transaction,
      },
    );
  }
  async updateEvaluationBehavior(
    evaluationId: number,
    level: number,
    userFlagSkill: number,
    transaction: Transaction,
  ): Promise<any> {
    await this.evaluationBasicBehaviorEntity.destroy({
      where: { evaluationId: evaluationId, type: [2, 3] },
      transaction: transaction,
    });
    if (level) {
      // check flag_skill cua user (co skill/ko co skill)
      // flag_skill = 0 thi chon type 3 (behavior ko co skill)
      // flag_skill = 1 thi chon type 2 (behavior binh thuong)

      let type = userFlagSkill == 0 ? 3 : 2;
      if (level > 7) {
        type = userFlagSkill == 0 ? 6 : 5;
      }
      const behaviors = (
        await this.listBasicBehaviorEntity.findAll({
          include: {
            model: VersionBasicBehavior,
            as: 'versionBasicBehavior',
            where: { status: 4, level, type: type },
          },
          order: [['idItem', 'ASC']],
        })
      )
        .map((data) => data && data.get({ plain: true }))
        .map((v, i) => ({
          ...v,
          evaluationId,
          itemNo: i,
          type: type,
          itemTitle: v.title,
        }));

      return await this.evaluationBasicBehaviorEntity.bulkCreate(behaviors, {
        transaction: transaction,
      });
    }
  }

  async deleteProSkill(evaluationId: number, transaction: Transaction) {
    return await this.evaluationPro.destroy({
      where: { evaluationId },
      transaction: transaction,
    });
  }

  async deleteHistoryApprove(evaluationId: number, transaction: Transaction) {
    return await this.historyApproveEntity.destroy({
      where: { evaluationId },
      transaction: transaction,
    });
  }

  async updateUserProcedure(
    dataUpdateUser: UserUpdateDto,
    companyGroupCode: string,
    timeZone: string,
  ) {
    let condition = {
      userIdInput: dataUpdateUser.userIdInput,
      isChangeRoleF2: dataUpdateUser.isChangeRoleF2,
      isChangeRoleF3: dataUpdateUser.isChangeRoleF3,
      isChangeRoleF4: dataUpdateUser.isChangeRoleF4,
      typeChangeRoleF1: dataUpdateUser.typeChangeRoleF1,
      periodIdInput: dataUpdateUser.periodIdInput,
      radioLevelValue: dataUpdateUser.radioLevelValue,
      companyIdInput:
        dataUpdateUser.companyIdInput === undefined
          ? null
          : dataUpdateUser.companyIdInput,
      companyNameInput:
        dataUpdateUser.companyNameInput === undefined
          ? null
          : dataUpdateUser.companyNameInput,
      departmentIdInput:
        dataUpdateUser.departmentIdInput === undefined
          ? null
          : dataUpdateUser.departmentIdInput,
      departmentNameInput:
        dataUpdateUser.departmentNameInput === undefined
          ? null
          : dataUpdateUser.departmentNameInput,
      divisionIdInput:
        dataUpdateUser.divisionIdInput === undefined
          ? null
          : dataUpdateUser.divisionIdInput,
      divisionNameInput:
        dataUpdateUser.divisionNameInput === undefined
          ? null
          : dataUpdateUser.divisionNameInput,
      levelInput: dataUpdateUser.levelInput,
      levelOld: dataUpdateUser.levelOld,
      flagSkillValue: dataUpdateUser.flagSkillValue,
      oldFlagSkill: dataUpdateUser.oldFlagSkill,
      currentDateInput: moment().tz(timeZone).format('YYYY/M/D'),
      companyGroupCodeInput: companyGroupCode,
    };

    if (dataUpdateUser.roles) {
      condition['roles'] = dataUpdateUser.roles.length
        ? dataUpdateUser.roles
        : [0];
    }

    if (
      dataUpdateUser.listEvaluatorEvaluationIds &&
      dataUpdateUser.listEvaluatorEvaluationIds.length
    ) {
      condition['listEvaluatorEvaluationIds'] =
        dataUpdateUser.listEvaluatorEvaluationIds;
    }

    await this.userEntity.sequelize.query(
      `CALL update_user(:userIdInput, ${
        !dataUpdateUser.roles ? 'NULL' : 'ARRAY[:roles]'
      }, :isChangeRoleF2, :isChangeRoleF3, :isChangeRoleF4
          , :typeChangeRoleF1, ${
            !dataUpdateUser.listEvaluatorEvaluationIds ||
            !dataUpdateUser.listEvaluatorEvaluationIds.length
              ? 'NULL'
              : 'ARRAY[:listEvaluatorEvaluationIds]'
          }
          , :periodIdInput, :radioLevelValue, :companyIdInput, :companyNameInput, :departmentIdInput, :departmentNameInput, :divisionIdInput, :divisionNameInput
          , :levelInput, :levelOld, :flagSkillValue, :oldFlagSkill, :currentDateInput, :companyGroupCodeInput)`,
      {
        replacements: condition,
        type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
      },
    );
  }

  async getGuideVersion() {
    const results = (
      await this.versionGuideEvaluationEntity.findAll({
        attributes: ['id', 'type'],
        where: { status: 4 },
      })
    ).map((data) => data && data.get({ plain: true }));

    const data: {
      guideEvaluation17: number | null;
      guideEvaluation17Ns: number | null;
      guideEvaluation810: number | null;
      guideEvaluation810Ns: number | null;
    } = {
      guideEvaluation17: null,
      guideEvaluation17Ns: null,
      guideEvaluation810: null,
      guideEvaluation810Ns: null,
    };

    if (results.length > 0) {
      const guideEvaluation17 = results.find((f) => f.type === 1);
      if (guideEvaluation17) data.guideEvaluation17 = guideEvaluation17.id;

      const guideEvaluation17Ns = results.find((f) => f.type === 3);
      if (guideEvaluation17Ns)
        data.guideEvaluation17Ns = guideEvaluation17Ns.id;

      const guideEvaluation810 = results.find((f) => f.type === 2);
      if (guideEvaluation810) data.guideEvaluation810 = guideEvaluation810.id;

      const guideEvaluation810Ns = results.find((f) => f.type === 4);
      if (guideEvaluation810Ns)
        data.guideEvaluation810Ns = guideEvaluation810.id;

      return data;
    }
    return data;
  }
  async getVersionSettingByLevel(level: number, flagSkill: number | boolean) {
    let type = flagSkill ? 1 : 3;
    if (level > 7) {
      type = flagSkill ? 2 : 4;
    }
    return await this.versionSettingEntity.findOne({
      where: { type: type, status: 4 },
      attributes: ['id'],
      include: {
        model: SettingLevel,
        as: 'settingLevel',
        where: { level: level },
      },
    });
  }

  async getListUserInforCurrent(userIds: number[]) {
    return await this.userEntity.findAll({
      where: { id: { [Op.in]: userIds } },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name'],
        },
      ],
      attributes: [
        'id',
        'employeeNumber',
        'fullName',
        'email',
        'departmentId',
        'divisionId',
        'companyId',
        'level',
        'updatedTime',
        'flagSkill',
      ],
    });
  }

  async countEvaluationByUserId(
    _periodIds: number,
    userIds: number[],
    companyGroupCode: string,
  ) {
    const arrayWheres = [];
    arrayWheres.push({ companyGroupCode: companyGroupCode });
    arrayWheres.push({ evaluationPeriodId: _periodIds });
    arrayWheres.push({ userId: { [Op.in]: userIds } });
    arrayWheres.push({ creationUser: { [Op.eq]: null } });

    return await this.evaluationEntity.count({
      where: {
        [Op.and]: arrayWheres,
      },
    });
  }

  async updateFullNameUser(userId: number, fullName: string) {
    return await this.userEntity.update(
      { fullName: fullName },
      { where: { id: userId } },
    );
  }

  async changeRoleUserManagement(
    userId: number,
    roles: any[],
    companyGroupCode: string,
    isChangeRoleF2: boolean,
    isChangeRoleF3: boolean,
    isChangeRoleF4: boolean,
    typeChangeRoleF1: number,
    listEvaluationIds: number[],
  ) {
    try {
      const condition: any = {
        userIdInput: userId,
        isChangeRoleF2,
        isChangeRoleF3,
        isChangeRoleF4,
        typeChangeRoleF1,
        companyGroupCodeInput: companyGroupCode,
      };

      if (roles && roles.length) {
        condition.roles = roles;
      }

      if (listEvaluationIds && listEvaluationIds.length) {
        condition.listEvaluatorEvaluationIds = listEvaluationIds;
      }

      await this.permissionEntity.sequelize.query(
        `CALL sp_change_role_user(:userIdInput, ${
          !roles || !roles.length ? 'NULL' : 'ARRAY[:roles]'
        }, :isChangeRoleF2, :isChangeRoleF3, :isChangeRoleF4, :typeChangeRoleF1, ${
          !listEvaluationIds || !listEvaluationIds.length
            ? 'NULL'
            : 'ARRAY[:listEvaluatorEvaluationIds]'
        }, :companyGroupCodeInput)`,
        {
          replacements: condition,
          type: QueryTypes.RAW,
        },
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật danh sách role:', error);
      throw error;
    }
  }
}
