"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementUserRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const User_1 = require("../entity/User");
const Department_1 = require("../entity/Department");
const Company_1 = require("../entity/Company");
const sequelize_1 = require("sequelize");
const util_1 = require("../common/util");
const EvaluationPeriod_1 = require("../entity/EvaluationPeriod");
const VersionBasicBehavior_1 = require("../entity/VersionBasicBehavior");
const SettingLevel_1 = require("../entity/SettingLevel");
const moment = require("moment");
let ManagementUserRepository = class ManagementUserRepository {
    async addUser(body, companyId, companyGroupCode) {
        const { employeeNumber, fullName, email } = body;
        const datas = await this.userEntity.findOrCreate({
            where: { employeeNumber: employeeNumber, companyGroupCode },
            defaults: {
                employeeNumber: employeeNumber,
                fullName: fullName,
                email: email,
                active: 1,
                companyId: companyId,
                companyGroupCode,
            },
        });
        if (!datas[1]) {
            await this.userEntity.update({
                departmentId: null,
                active: 1,
                companyId: companyId,
                divisionId: null,
                level: null,
            }, {
                where: {
                    employeeNumber: employeeNumber,
                    companyGroupCode: companyGroupCode,
                },
            });
        }
        return datas;
    }
    async addDepartment(body) {
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
            await this.departmentRepository.update({ active: 1 }, { where: { code: departmentId } });
        }
        return departments;
    }
    async addCompany(body) {
        const { company } = body;
        return await this.companyRepository.findOrCreate({
            where: { name: { [sequelize_1.Op.like]: company } },
            defaults: {
                name: company,
            },
        });
    }
    async getEvaluationPeriodCurrent(companyGroupCode, timeZone) {
        const fieldGoalStart = 'period_start';
        const fieldGoalEnd = 'period_end';
        const dateNow = (0, util_1.dateNowMoment)(timeZone);
        const periods = (await this.evaluationPeriodEntity.findAll({
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
                [sequelize_1.Op.and]: [
                    sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('TO_DATE', sequelize_1.Sequelize.col(`${fieldGoalStart}`), '%YYYY/%MM'), {
                        [sequelize_1.Op.lte]: sequelize_1.Sequelize.fn('TO_DATE', dateNow, '%YYYY/%MM'),
                    }),
                    sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('TO_DATE', sequelize_1.Sequelize.col(`${fieldGoalEnd}`), '%YYYY/%MM'), {
                        [sequelize_1.Op.gte]: sequelize_1.Sequelize.fn('TO_DATE', dateNow, '%YYYY/%MM'),
                    }),
                ],
                companyGroupCode: companyGroupCode,
            },
        })).map((data) => data && data.get({ plain: true }));
        return periods;
    }
    async getEvaluationByUserIdPeriodId(_periodIds, userIds, isGetStatus50, companyGroupCode, level) {
        const arrayWheres = [];
        arrayWheres.push({ level: level });
        arrayWheres.push({ evaluationPeriodId: _periodIds });
        arrayWheres.push({ userId: { [sequelize_1.Op.in]: userIds } });
        arrayWheres.push({ creationUser: { [sequelize_1.Op.eq]: null } });
        arrayWheres.push({ companyGroupCode: companyGroupCode });
        arrayWheres.push({ status: { [sequelize_1.Op.lt]: 50 } });
        const evaluations = await this.evaluationEntity.findAll({
            where: {
                [sequelize_1.Op.and]: arrayWheres,
            },
            include: [
                { model: User_1.User, as: 'user' },
                { model: EvaluationPeriod_1.EvaluationPeriod, as: 'evaluationPeriod' },
            ],
        });
        return evaluations;
    }
    async countEvaluation(conditions) {
        return await this.evaluationEntity.count({
            where: conditions,
        });
    }
    async getNewTransaction() {
        return await this.userEntity.sequelize.transaction();
    }
    async getUserList(userIds) {
        return await this.userEntity.findAll({
            where: { id: { [sequelize_1.Op.in]: userIds } },
            include: [
                { model: Company_1.Company, as: 'company', attributes: ['name'] },
                { model: Department_1.Department, as: 'department', attributes: ['name', 'code'] },
                { model: Department_1.Department, as: 'division', attributes: ['name', 'code'] },
            ],
        });
    }
    async getCountUserList(userIds, companyGroupCode) {
        return await this.userEntity.count({
            where: {
                id: { [sequelize_1.Op.in]: userIds },
                active: 1,
                companyGroupCode: companyGroupCode,
            },
        });
    }
    async deleteEvaluationAchievementPersonal(evaluationId, transaction) {
        await this.evaluationAchievementPersonalSub.destroy({
            where: { achievementPersonalId: { [sequelize_1.Op.is]: null } },
            transaction: transaction,
        });
        return await this.evaluationAchievementPersonalEntity.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
    }
    async deleteAdditionAchievement(evaluationId, transaction) {
        return await this.evaluationAchievementAdditionalEntity.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
    }
    async deleteBasicBehavior(evaluationId, transaction) {
        return await this.evaluationBasicBehaviorEntity.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
    }
    async deleteEvaluators(evaluationId, userId, evaluationPeriodId, transaction) {
        await this.evaluatorEnity.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
        return await this.evaluatorDefaultEnity.update({
            evaluator_0_5_id: null,
            evaluator_1_id: null,
            evaluator_2_id: null,
        }, {
            where: { userId: userId, evaluationPeriodId: evaluationPeriodId },
            transaction: transaction,
        });
    }
    async updateEvaluationBehavior(evaluationId, level, userFlagSkill, transaction) {
        await this.evaluationBasicBehaviorEntity.destroy({
            where: { evaluationId: evaluationId, type: [2, 3] },
            transaction: transaction,
        });
        if (level) {
            let type = userFlagSkill == 0 ? 3 : 2;
            if (level > 7) {
                type = userFlagSkill == 0 ? 6 : 5;
            }
            const behaviors = (await this.listBasicBehaviorEntity.findAll({
                include: {
                    model: VersionBasicBehavior_1.VersionBasicBehavior,
                    as: 'versionBasicBehavior',
                    where: { status: 4, level, type: type },
                },
                order: [['idItem', 'ASC']],
            }))
                .map((data) => data && data.get({ plain: true }))
                .map((v, i) => (Object.assign(Object.assign({}, v), { evaluationId, itemNo: i, type: type, itemTitle: v.title })));
            return await this.evaluationBasicBehaviorEntity.bulkCreate(behaviors, {
                transaction: transaction,
            });
        }
    }
    async deleteProSkill(evaluationId, transaction) {
        return await this.evaluationPro.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
    }
    async deleteHistoryApprove(evaluationId, transaction) {
        return await this.historyApproveEntity.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
    }
    async updateUserProcedure(dataUpdateUser, companyGroupCode, timeZone) {
        let condition = {
            userIdInput: dataUpdateUser.userIdInput,
            isChangeRoleF2: dataUpdateUser.isChangeRoleF2,
            isChangeRoleF3: dataUpdateUser.isChangeRoleF3,
            isChangeRoleF4: dataUpdateUser.isChangeRoleF4,
            typeChangeRoleF1: dataUpdateUser.typeChangeRoleF1,
            periodIdInput: dataUpdateUser.periodIdInput,
            radioLevelValue: dataUpdateUser.radioLevelValue,
            companyIdInput: dataUpdateUser.companyIdInput === undefined
                ? null
                : dataUpdateUser.companyIdInput,
            companyNameInput: dataUpdateUser.companyNameInput === undefined
                ? null
                : dataUpdateUser.companyNameInput,
            departmentIdInput: dataUpdateUser.departmentIdInput === undefined
                ? null
                : dataUpdateUser.departmentIdInput,
            departmentNameInput: dataUpdateUser.departmentNameInput === undefined
                ? null
                : dataUpdateUser.departmentNameInput,
            divisionIdInput: dataUpdateUser.divisionIdInput === undefined
                ? null
                : dataUpdateUser.divisionIdInput,
            divisionNameInput: dataUpdateUser.divisionNameInput === undefined
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
        if (dataUpdateUser.listEvaluatorEvaluationIds &&
            dataUpdateUser.listEvaluatorEvaluationIds.length) {
            condition['listEvaluatorEvaluationIds'] =
                dataUpdateUser.listEvaluatorEvaluationIds;
        }
        await this.userEntity.sequelize.query(`CALL update_user(:userIdInput, ${!dataUpdateUser.roles ? 'NULL' : 'ARRAY[:roles]'}, :isChangeRoleF2, :isChangeRoleF3, :isChangeRoleF4
          , :typeChangeRoleF1, ${!dataUpdateUser.listEvaluatorEvaluationIds ||
            !dataUpdateUser.listEvaluatorEvaluationIds.length
            ? 'NULL'
            : 'ARRAY[:listEvaluatorEvaluationIds]'}
          , :periodIdInput, :radioLevelValue, :companyIdInput, :companyNameInput, :departmentIdInput, :departmentNameInput, :divisionIdInput, :divisionNameInput
          , :levelInput, :levelOld, :flagSkillValue, :oldFlagSkill, :currentDateInput, :companyGroupCodeInput)`, {
            replacements: condition,
            type: sequelize_1.QueryTypes.RAW,
        });
    }
    async getGuideVersion() {
        const results = (await this.versionGuideEvaluationEntity.findAll({
            attributes: ['id', 'type'],
            where: { status: 4 },
        })).map((data) => data && data.get({ plain: true }));
        const data = {
            guideEvaluation17: null,
            guideEvaluation17Ns: null,
            guideEvaluation810: null,
            guideEvaluation810Ns: null,
        };
        if (results.length > 0) {
            const guideEvaluation17 = results.find((f) => f.type === 1);
            if (guideEvaluation17)
                data.guideEvaluation17 = guideEvaluation17.id;
            const guideEvaluation17Ns = results.find((f) => f.type === 3);
            if (guideEvaluation17Ns)
                data.guideEvaluation17Ns = guideEvaluation17Ns.id;
            const guideEvaluation810 = results.find((f) => f.type === 2);
            if (guideEvaluation810)
                data.guideEvaluation810 = guideEvaluation810.id;
            const guideEvaluation810Ns = results.find((f) => f.type === 4);
            if (guideEvaluation810Ns)
                data.guideEvaluation810Ns = guideEvaluation810.id;
            return data;
        }
        return data;
    }
    async getVersionSettingByLevel(level, flagSkill) {
        let type = flagSkill ? 1 : 3;
        if (level > 7) {
            type = flagSkill ? 2 : 4;
        }
        return await this.versionSettingEntity.findOne({
            where: { type: type, status: 4 },
            attributes: ['id'],
            include: {
                model: SettingLevel_1.SettingLevel,
                as: 'settingLevel',
                where: { level: level },
            },
        });
    }
    async getListUserInforCurrent(userIds) {
        return await this.userEntity.findAll({
            where: { id: { [sequelize_1.Op.in]: userIds } },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Company_1.Company,
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
    async countEvaluationByUserId(_periodIds, userIds, companyGroupCode) {
        const arrayWheres = [];
        arrayWheres.push({ companyGroupCode: companyGroupCode });
        arrayWheres.push({ evaluationPeriodId: _periodIds });
        arrayWheres.push({ userId: { [sequelize_1.Op.in]: userIds } });
        arrayWheres.push({ creationUser: { [sequelize_1.Op.eq]: null } });
        return await this.evaluationEntity.count({
            where: {
                [sequelize_1.Op.and]: arrayWheres,
            },
        });
    }
    async updateFullNameUser(userId, fullName) {
        return await this.userEntity.update({ fullName: fullName }, { where: { id: userId } });
    }
    async changeRoleUserManagement(userId, roles, companyGroupCode) {
        try {
            await this.permissionEntity.destroy({
                where: { userId: userId },
                force: true,
            });
            const arrays = await Promise.all(roles.map(async (role) => {
                return {
                    userId: userId,
                    roleId: role,
                    createdTime: new Date(),
                };
            }));
            return await this.permissionEntity.sequelize.query(`CALL sp_update_user_permissions(:rolesJson)`, {
                replacements: {
                    rolesJson: JSON.stringify(arrays),
                },
                type: sequelize_1.QueryTypes.RAW,
            });
        }
        catch (error) {
            console.error('Lỗi khi cập nhật danh sách role:', error);
            throw error;
        }
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "departmentRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.COMPANY),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "companyRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluationPeriodEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluationAchievementPersonalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_ADDITIONAL),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluationAchievementAdditionalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluationBasicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PRO),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluationPro", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_APPROVE_EVALUATION),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "historyApproveEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_GUIDE_EVALUATION),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "versionGuideEvaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.LIST_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "listBasicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL_SUB),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluationAchievementPersonalSub", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_SETTING),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "versionSettingEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluatorEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "evaluatorDefaultEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.PERMISSION),
    __metadata("design:type", Object)
], ManagementUserRepository.prototype, "permissionEntity", void 0);
ManagementUserRepository = __decorate([
    (0, common_1.Injectable)()
], ManagementUserRepository);
exports.ManagementUserRepository = ManagementUserRepository;
//# sourceMappingURL=managementUser.repository.js.map