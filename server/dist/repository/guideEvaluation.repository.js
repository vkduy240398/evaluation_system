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
exports.GuideEvaluationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const User_1 = require("../entity/User");
const VersionSettingType_1 = require("../enum/VersionSettingType");
let GuideEvaluationRepository = class GuideEvaluationRepository {
    async getGuideEvaluation(level, flagSkill, companyGroupCode) {
        return await this.guideEvaluationRepository.findOne({
            attributes: ['contentEvaluationCriteria', 'contentNotes', 'type'],
            where: {
                [sequelize_1.Op.and]: [
                    {
                        type: level < 8 ? (flagSkill === 1 ? 1 : 3) : flagSkill === 1 ? 2 : 4,
                    },
                    { status: 4 },
                    { companyGroupCode: companyGroupCode },
                ],
            },
        });
    }
    async findListEvaluationCriteriaHistory(query, companyGroupCode) {
        let status = query === null || query === void 0 ? void 0 : query.status;
        const type = query === null || query === void 0 ? void 0 : query.type;
        const limit = query === null || query === void 0 ? void 0 : query.limit;
        const offset = query === null || query === void 0 ? void 0 : query.offset;
        const flagSkill = query === null || query === void 0 ? void 0 : query.flagSkill;
        let tempType;
        if (status === 'すべて')
            status = undefined;
        if (type === '1') {
            if (flagSkill === '1') {
                tempType = VersionSettingType_1.VersionSettingType.LEVEL_1_7;
            }
            else if (flagSkill === '3') {
                tempType = VersionSettingType_1.VersionSettingType.LEVEL_1_7_NS;
            }
        }
        else if (type === '2') {
            if (flagSkill === '1') {
                tempType = VersionSettingType_1.VersionSettingType.LEVEL_8_10;
            }
            else if (flagSkill === '3') {
                tempType = VersionSettingType_1.VersionSettingType.LEVEL_8_10_NS;
            }
        }
        const datas = await this.guideEvaluationRepository.findAndCountAll({
            where: Object.assign(Object.assign({ type: tempType }, (status !== undefined && { status })), (companyGroupCode !== undefined && { companyGroupCode })),
            attributes: {
                exclude: ['contentEvaluationCriteria', 'contentNotes'],
            },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'employeeNumber', 'fullName'],
                },
            ],
            order: [
                ['version', 'DESC'],
                ['subVersion', 'DESC'],
            ],
            distinct: true,
            offset: offset,
            limit: limit,
        });
        return { data: datas.rows, counts: datas.count };
    }
    async inforCriteria(id) {
        return await this.guideEvaluationRepository.findOne({
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
    async inforCriteriaStep(id, companyGroupCode) {
        return await this.guideEvaluationRepository.findOne({
            where: Object.assign({ id: id }, (companyGroupCode !== undefined && { companyGroupCode })),
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['fullName'],
                },
            ],
        });
    }
    async findOne(versionId, companyGroupCode) {
        return await this.guideEvaluationRepository.findOne({
            where: Object.assign({ id: versionId }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
    }
    async maxSubVersion(object) {
        const max = await this.guideEvaluationRepository.max('subVersion', {
            where: object,
        });
        return max;
    }
    async updateAllVersionToPrivate(object, companyGroupCode) {
        return await this.guideEvaluationRepository.update({
            status: 3,
            publicDate: null,
        }, {
            where: Object.assign({ type: object.type, status: { [sequelize_1.Op.notIn]: [2] } }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
    }
    async maxVersion(where, fields) {
        const max = await this.guideEvaluationRepository.max(fields, {
            where: where,
        });
        return max;
    }
    async updateVersion(versionId, object, companyGroupCode) {
        return await this.guideEvaluationRepository.update(object, {
            where: Object.assign({ id: versionId }, (companyGroupCode !== undefined && { companyGroupCode })),
            returning: true,
        });
    }
    async createNewVersion(object) {
        const results = await this.guideEvaluationRepository.create(object);
        return results;
    }
    async cancelVersionProSkill(versionId, _userId, _lastUpdatedTime, companyGroupCode) {
        return await this.guideEvaluationRepository.update({
            status: 2,
        }, {
            where: Object.assign({ id: versionId }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
    }
    async findOneGuide(where) {
        return await this.guideEvaluationRepository.findOne({
            where: where,
        });
    }
    async getGuideEvaluationPublic(companyGroupCode) {
        return await this.guideEvaluationRepository.findAll({
            attributes: ['id', 'type'],
            where: { status: 4, companyGroupCode: companyGroupCode },
        });
    }
    async getCriteriaVersionIsEditing(type, companyGroupCode) {
        const datas = await this.guideEvaluationRepository.findAll({
            where: Object.assign({ type: type, status: 1 }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
        return datas;
    }
    async findAllByCondition(object) {
        return await this.guideEvaluationRepository.findAll({
            attributes: ['publicDate', 'type', 'id', 'status'],
            where: object,
            limit: 1,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_GUIDE_EVALUATION),
    __metadata("design:type", Object)
], GuideEvaluationRepository.prototype, "guideEvaluationRepository", void 0);
GuideEvaluationRepository = __decorate([
    (0, common_1.Injectable)()
], GuideEvaluationRepository);
exports.GuideEvaluationRepository = GuideEvaluationRepository;
//# sourceMappingURL=guideEvaluation.repository.js.map