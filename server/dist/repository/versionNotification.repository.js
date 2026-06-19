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
exports.VersionNotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const User_1 = require("../entity/User");
const VersionNotificationStatus_1 = require("../enum/VersionNotificationStatus");
const RuntimeException_1 = require("../model/exception/RuntimeException");
let VersionNotificationRepository = class VersionNotificationRepository {
    async getListVersionPaging(param, companyGroupCode) {
        const condition = {};
        if (param.status !== '-1') {
            condition.status = param.status;
        }
        if (companyGroupCode !== undefined) {
            condition.companyGroupCode = companyGroupCode;
        }
        return await this.versionNotificationEntity.findAll({
            limit: param.limit,
            offset: param.offset,
            where: condition,
            attributes: [
                'id',
                'version',
                'subVersion',
                'status',
                'reason',
                'publicDate',
                'updatedTime',
                'lastUpdatedTime',
            ],
            include: [{ model: User_1.User, as: 'user' }],
            order: [
                ['version', 'DESC'],
                ['subVersion', 'DESC'],
            ],
        });
    }
    async countListVersionNotification(param, companyGroupCode) {
        const condition = {};
        if (param.status !== '-1') {
            condition.status = param.status;
        }
        if (companyGroupCode !== undefined) {
            condition.companyGroupCode = companyGroupCode;
        }
        return await this.versionNotificationEntity.count({
            where: condition,
        });
    }
    async getVersionNotificationById(versionId, companyGroupCode) {
        return await this.versionNotificationEntity.findOne({
            where: Object.assign({ id: versionId }, (companyGroupCode !== undefined && { companyGroupCode })),
            include: [{ model: User_1.User, attributes: ['id', 'fullName'] }],
        });
    }
    async existEditingVersion(versionId, companyGroupCode) {
        let versionIdStatement = '';
        const condition = {};
        if (versionId) {
            versionIdStatement = ' AND id != :versionId';
            condition['versionId'] = versionId;
        }
        if (companyGroupCode !== undefined) {
            versionIdStatement += ' AND company_group_code = :companyGroupCode';
            condition['companyGroupCode'] = companyGroupCode;
        }
        const querys = await this.versionNotificationEntity.sequelize.query(`SELECT EXISTS(SELECT 1 FROM version_notification_tbl WHERE status = 1 ${versionIdStatement})`, {
            replacements: condition,
        });
        const hasResult = querys[0][0]['exists'];
        return hasResult;
    }
    async isMainVersionPublic(version, companyGroupCode) {
        const querys = await this.versionNotificationEntity.sequelize.query(`SELECT EXISTS(SELECT 1
                     FROM version_notification_tbl
                     WHERE version = :version
                       AND sub_version = 0
                       AND status = 4
          ${companyGroupCode !== undefined
            ? ' AND company_group_code = :companyGroupCode'
            : ''})`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: Object.assign({ version: version }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
        const hasResult = querys[0]['exists'];
        return hasResult;
    }
    async findMaxSubVersion(version, companyGroupCode) {
        return await this.versionNotificationEntity.findOne({
            attributes: [
                [sequelize_1.Sequelize.fn('max', sequelize_1.Sequelize.col('sub_version')), 'subVersion'],
            ],
            where: Object.assign({ version: version }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
    }
    async createVersionNotification(data, t) {
        const result = await this.versionNotificationEntity.create(data, {
            transaction: t,
        });
        return result;
    }
    async updateVersionNotification(data, companyGroupCode, t) {
        return await this.versionNotificationEntity.update(data, {
            where: Object.assign({ id: data.id }, (companyGroupCode !== undefined && { companyGroupCode })),
            transaction: t,
        });
    }
    async getVersionUpdatedTime(versionId) {
        return await this.versionNotificationEntity.findByPk(versionId, {
            attributes: ['updatedTime'],
        });
    }
    async findUpdateTimeVersion(id, companyGroupCode) {
        return await this.versionNotificationEntity.findOne({
            where: Object.assign({ id: id }, (companyGroupCode !== undefined && { companyGroupCode })),
            include: [{ model: User_1.User, as: 'user' }],
        });
    }
    async findMaxVersion(companyGroupCode) {
        return await this.versionNotificationEntity.findOne({
            where: Object.assign({}, (companyGroupCode !== undefined && { companyGroupCode })),
            attributes: [[sequelize_1.Sequelize.fn('max', sequelize_1.Sequelize.col('version')), 'version']],
        });
    }
    async unPublicVersionSetting(idException, transaction, companyGroupCode) {
        await this.versionNotificationEntity.update({ status: VersionNotificationStatus_1.VersionNotificationStatus.PRIVATE, publicDate: null }, {
            where: Object.assign({ id: {
                    [sequelize_1.Op.ne]: idException,
                }, status: VersionNotificationStatus_1.VersionNotificationStatus.PUBLISHED }, (companyGroupCode !== undefined && { companyGroupCode })),
            transaction: transaction,
        });
        return true;
    }
    async getNewTransaction() {
        return await this.versionNotificationEntity.sequelize.transaction();
    }
    async getPublicVersionNotification(companyGroupCode) {
        return await this.versionNotificationEntity.findOne({
            where: Object.assign({ status: VersionNotificationStatus_1.VersionNotificationStatus.PUBLISHED }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
    }
    async findVersionById(versionId) {
        return await this.versionNotificationEntity.findByPk(versionId);
    }
    async publicVersionSetting(versionId, data, companyGroupCode) {
        const t = await this.versionNotificationEntity.sequelize.transaction();
        try {
            await this.versionNotificationEntity.update(data, {
                where: { id: versionId },
                transaction: t,
            });
            await this.versionNotificationEntity.update({ status: VersionNotificationStatus_1.VersionNotificationStatus.PRIVATE, publicDate: null }, {
                where: {
                    id: {
                        [sequelize_1.Op.ne]: versionId,
                    },
                    status: VersionNotificationStatus_1.VersionNotificationStatus.PUBLISHED,
                    companyGroupCode: companyGroupCode
                },
                transaction: t,
            });
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw new RuntimeException_1.RuntimeException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return true;
    }
    async create(dto) {
        return await this.versionNotificationEntity.create(dto);
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_NOTIFICATION),
    __metadata("design:type", Object)
], VersionNotificationRepository.prototype, "versionNotificationEntity", void 0);
VersionNotificationRepository = __decorate([
    (0, common_1.Injectable)()
], VersionNotificationRepository);
exports.VersionNotificationRepository = VersionNotificationRepository;
//# sourceMappingURL=versionNotification.repository.js.map