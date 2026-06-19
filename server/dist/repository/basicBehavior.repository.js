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
exports.BasicBehaviorRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const User_1 = require("../entity/User");
const VersionBasicBehavior_1 = require("../entity/VersionBasicBehavior");
let BasicBehaviorRepository = class BasicBehaviorRepository {
    async listBasicBehavior(params) {
        if (params.status === 'すべて')
            params.status = null;
        const results = await this.basicBehaviorEntity.findAndCountAll({
            where: {
                [sequelize_1.Op.and]: [
                    { type: { [sequelize_1.Op.in]: params.type } },
                    { status: params.status || { [sequelize_1.Op.not]: null } },
                    { level: params.level && { [sequelize_1.Op.in]: params.level } },
                    { companyGroupCode: params.companyGroupCode },
                ],
            },
            attributes: [
                'id',
                'type',
                'level',
                'version',
                'subVersion',
                'status',
                'reason',
                'publicDate',
                'updatedTime',
                'lastUpdatedTime',
            ],
            include: [
                {
                    model: User_1.User,
                    attributes: ['fullName'],
                },
            ],
            order: [
                ['level', 'DESC'],
                ['version', 'DESC'],
                ['subVersion', 'DESC'],
            ],
            offset: params.offset,
            limit: params.limit,
        });
        return { data: results.rows, total: results.count };
    }
    async inforCriteria(id) {
        return await this.listBasicBehaviorEnity.findAll({
            where: {
                versionId: id,
            },
            include: [
                {
                    model: VersionBasicBehavior_1.VersionBasicBehavior,
                    as: 'versionBasicBehavior',
                    required: false,
                    where: {
                        id: id,
                    },
                    include: [
                        {
                            model: User_1.User,
                            as: 'user',
                            attributes: ['fullName'],
                        },
                    ],
                },
            ],
            order: [['idItem', 'ASC']],
            limit: 100,
        });
    }
    async inforCriteriaStep(id) {
        return await this.basicBehaviorEntity.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['fullName'],
                },
            ],
        });
    }
    async maxSubVersion(object) {
        const max = await this.basicBehaviorEntity.max('subVersion', {
            where: object,
        });
        return max;
    }
    async updateAllVersionToPrivate(object, transaction) {
        return await this.basicBehaviorEntity.update({
            status: 3,
            publicDate: null,
        }, {
            where: object,
            transaction: transaction,
        });
    }
    async updateVersion(versionId, object, transaction) {
        return await this.basicBehaviorEntity.update(object, {
            where: {
                id: versionId,
            },
            returning: true,
            transaction: transaction,
        });
    }
    async maxVersion(where, fields) {
        const max = await this.basicBehaviorEntity.max(fields, {
            where: where,
        });
        return max;
    }
    async findOne(versionId) {
        return await this.basicBehaviorEntity.findOne({
            where: {
                id: versionId,
            },
        });
    }
    async createNewVersion(object) {
        const results = await this.basicBehaviorEntity.create(object);
        return results;
    }
    async createBulkListProSkill(object, transaction) {
        return await this.listBasicBehaviorEnity.bulkCreate(object, {
            transaction: transaction,
        });
    }
    async deleteAllListVersion(versionId, transaction) {
        return await this.listBasicBehaviorEnity.destroy({
            where: {
                versionId: versionId,
            },
            transaction: transaction,
        });
    }
    async cancelVersionProSkill(versionId, _userId, companyGroupCode) {
        return await this.basicBehaviorEntity.update({
            status: 2,
        }, {
            where: {
                id: versionId,
                companyGroupCode: companyGroupCode,
            },
        });
    }
    async getDetailBasicBehaviorSkill(id) {
        const result = await this.basicBehaviorEntity.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName'],
                },
            ],
        });
        return result;
    }
    async getListBasicBehaviorSkillByVersionId(versionId) {
        const results = await this.listBasicBehaviorEnity.findAll({
            where: { versionId: versionId },
            order: [['idItem', 'ASC']],
        });
        return results;
    }
    async findEvaluationItemsBasicBehaviorSkill(query) {
        let level = query.level;
        let status = query.status;
        const classification = query.classification;
        let type;
        const limit = query.limit;
        const offset = query.offset;
        if (status === 'すべて')
            status = null;
        if (level === 'すべて')
            level = null;
        if (classification === '1') {
            type = 1;
        }
        else if (classification === '3') {
            type = 2;
        }
        const datas = await this.basicBehaviorEntity.findAll({
            where: classification === '1'
                ? {
                    [sequelize_1.Op.and]: [
                        { status: status || { [sequelize_1.Op.not]: null } },
                        { type: type },
                    ],
                }
                : {
                    [sequelize_1.Op.and]: [
                        { level: level || { [sequelize_1.Op.not]: null } },
                        { status: status || { [sequelize_1.Op.not]: null } },
                        { type: type },
                    ],
                },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'employeeNumber', 'fullName'],
                },
            ],
            order: classification === '1'
                ? [
                    ['version', 'DESC'],
                    ['subVersion', 'DESC'],
                ]
                : [
                    ['level', 'DESC'],
                    ['version', 'DESC'],
                    ['subVersion', 'DESC'],
                ],
            offset: offset,
            limit: limit,
        });
        const counts = await this.basicBehaviorEntity.count({
            where: classification === '1'
                ? {
                    [sequelize_1.Op.and]: [
                        { status: status || { [sequelize_1.Op.not]: null } },
                        { type: type },
                    ],
                }
                : {
                    [sequelize_1.Op.and]: [
                        { level: level || { [sequelize_1.Op.not]: null } },
                        { status: status || { [sequelize_1.Op.not]: null } },
                        { type: type },
                    ],
                },
        });
        return { data: datas, counts: counts };
    }
    async transactionBehaviorBasic() {
        return await this.basicBehaviorEntity.sequelize.transaction();
    }
    async findAllByCondition(object) {
        return await this.basicBehaviorEntity.findAll({
            attributes: ['publicDate', 'type', 'id', 'status'],
            where: object,
            limit: 1,
        });
    }
    async findOneByCondition(object) {
        return await this.basicBehaviorEntity.findOne({
            attributes: [
                'publicDate',
                'type',
                'id',
                'status',
                'version',
                'subVersion',
            ],
            where: object,
            limit: 1,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], BasicBehaviorRepository.prototype, "basicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.LIST_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], BasicBehaviorRepository.prototype, "listBasicBehaviorEnity", void 0);
BasicBehaviorRepository = __decorate([
    (0, common_1.Injectable)()
], BasicBehaviorRepository);
exports.BasicBehaviorRepository = BasicBehaviorRepository;
//# sourceMappingURL=basicBehavior.repository.js.map