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
exports.ManagementEvaluationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Department_1 = require("../entity/Department");
const Role_1 = require("../entity/Role");
const SkillGroup_1 = require("../entity/SkillGroup");
const SkillRole_1 = require("../entity/SkillRole");
const User_1 = require("../entity/User");
const RuntimeException_1 = require("../model/exception/RuntimeException");
let ManagementEvaluationRepository = class ManagementEvaluationRepository {
    async getAll(departmentId, limit, offset) {
        const condition = departmentId !== '-1' ? { id: departmentId } : { id: { [sequelize_1.Op.not]: null } };
        const results = await this.departmentEntity.findAndCountAll({
            attributes: ['id', 'code', 'name', 'type', 'setting'],
            where: Object.assign(Object.assign({}, condition), { active: 1, type: 1 }),
            limit: limit || undefined,
            offset: offset || undefined,
            distinct: true,
            order: [['code', 'ASC']],
        });
        const { rows, count } = results;
        return { results: rows, count };
    }
    async getAllSkills(skillId, detailed, limit, offset, companyGroupCode) {
        const condition = skillId && skillId !== '-1'
            ? { id: skillId }
            : { id: { [sequelize_1.Op.not]: null } };
        const includes = detailed
            ? [
                {
                    model: SkillRole_1.SkillRole,
                    as: 'skillRoles',
                    attributes: ['role'],
                    include: [
                        {
                            model: User_1.User,
                            as: 'user',
                            attributes: ['employeeNumber', 'fullName', 'id'],
                        },
                    ],
                },
                {
                    model: SkillGroup_1.SkillGroup,
                    as: 'skills',
                    attributes: ['department_id'],
                    include: [
                        {
                            model: Department_1.Department,
                            as: 'department',
                            attributes: ['id', 'name', 'type'],
                        },
                    ],
                },
            ]
            : [];
        const results = await this.skillEntity.findAndCountAll({
            attributes: ['id', 'name'],
            where: Object.assign(Object.assign({}, condition), { active: 1, companyGroupCode: companyGroupCode }),
            limit: limit || undefined,
            offset: offset || undefined,
            distinct: true,
            order: [['name', 'ASC']],
            include: includes,
        });
        const { rows, count } = results;
        return { results: rows, count };
    }
    async countSkillVersions(skillId) {
        var _a;
        const count = await this.skillGroupEntity.count({
            where: { skillId: skillId },
        });
        const sqlCountSkillUser = `SELECT COUNT(SU.*) FROM SKILL_USER_TBL SU 
    LEFT JOIN EVALUATION_PERIOD_TBL EP ON SU.PERIOD_ID = EP.ID WHERE SU.SKILL_ID = :skillId AND EP.CHECK_FIXED <> 2`;
        const countSkillUser = await this.skillUserEntity.sequelize.query(sqlCountSkillUser, {
            nest: true,
            replacements: {
                skillId: skillId,
            },
        });
        return count + (((_a = countSkillUser[0]) === null || _a === void 0 ? void 0 : _a.count) || 0);
    }
    async deleteAdminEvalutionSkill(skillId) {
        const transaction = await this.skillEntity.sequelize.transaction();
        try {
            const results = await this.skillEntity.update({ active: 0 }, { where: { id: skillId }, transaction: transaction });
            await SkillRole_1.SkillRole.destroy({
                where: { skillId: skillId },
                transaction: transaction,
            });
            await transaction.commit();
            return results[0] > 0;
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserActive(companyGroupCode) {
        return await this.userEntity.findAll({
            where: { active: 1, companyGroupCode: companyGroupCode },
            include: [
                { model: Role_1.Role, as: 'roles', where: { id: { [sequelize_1.Op.or]: [3, 4] } } },
            ],
            order: [['employeeNumber', 'ASC']],
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], ManagementEvaluationRepository.prototype, "departmentEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL),
    __metadata("design:type", Object)
], ManagementEvaluationRepository.prototype, "skillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], ManagementEvaluationRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_GROUP),
    __metadata("design:type", Object)
], ManagementEvaluationRepository.prototype, "skillGroupEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_USER_ENTITY),
    __metadata("design:type", Object)
], ManagementEvaluationRepository.prototype, "skillUserEntity", void 0);
ManagementEvaluationRepository = __decorate([
    (0, common_1.Injectable)()
], ManagementEvaluationRepository);
exports.ManagementEvaluationRepository = ManagementEvaluationRepository;
//# sourceMappingURL=managementEvaluation.repository.js.map