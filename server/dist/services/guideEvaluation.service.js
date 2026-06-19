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
exports.GuideEvaluationService = void 0;
const common_1 = require("@nestjs/common");
const guideEvaluation_repository_1 = require("../repository/guideEvaluation.repository");
const util_1 = require("../common/util");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const sequelize_1 = require("sequelize");
const evaluation_repository_1 = require("../repository/evaluation.repository");
const EvaluationPeriodHelper_1 = require("../common/datetime/EvaluationPeriodHelper");
let GuideEvaluationService = class GuideEvaluationService {
    async getGuideEvaluation(level, flagSkill, companyGroupCode) {
        return await this.guideEvaluationRepo.getGuideEvaluation(level, flagSkill, companyGroupCode);
    }
    async findListEvaluationCriteriaHistory(query, companyGroupCode) {
        return await this.guideEvaluationRepo.findListEvaluationCriteriaHistory(query, companyGroupCode);
    }
    async getInformationCriteria(id, companyGroupCode) {
        var _a, _b;
        const arraySteps = await this.guideEvaluationRepo.inforCriteriaStep(id, companyGroupCode);
        if (!arraySteps) {
            return {
                isShowEdit: null,
                data: null,
                subVersion: 0,
            };
        }
        const criteriaIsEditingList = await this.guideEvaluationRepo.getCriteriaVersionIsEditing(arraySteps.type, companyGroupCode);
        const isShowEdit = criteriaIsEditingList.length === 0;
        const findOneVersion = await this.guideEvaluationRepo.findOne(id);
        const maxVersion = !findOneVersion
            ? 0
            : (_a = (await this.guideEvaluationRepo.maxSubVersion(Object.assign({ version: findOneVersion.version, type: findOneVersion.type }, (companyGroupCode !== undefined && { companyGroupCode }))))) !== null && _a !== void 0 ? _a : 0;
        let statusName;
        let level;
        if (arraySteps.status === 1) {
            statusName = '編集中';
        }
        else if (arraySteps.status === 2) {
            statusName = '取消';
        }
        else if (arraySteps.status === 3) {
            statusName = '非公開';
        }
        else {
            statusName = '公開中';
        }
        if (arraySteps.type === 1 || arraySteps.type === 3) {
            level = '1 ～ 7';
        }
        else {
            level = '8 ～ 10';
        }
        const results = {
            id: arraySteps.id,
            level: level,
            versionId: arraySteps.id,
            createdTime: (0, util_1.isFormatDate)(arraySteps.createdTime, 'YYYY/M/D'),
            creationUser: arraySteps.creationUser,
            publicDate: arraySteps.publicDate !== null && arraySteps.publicDate,
            reason: arraySteps.reason,
            status: arraySteps.status,
            subVersion: arraySteps.subVersion,
            type: arraySteps.type,
            updatedTime: (0, util_1.isFormatDate)(arraySteps.updatedTime, 'YYYY/M/D H:mm'),
            statusName: statusName,
            updatedBy: ((_b = arraySteps.user) === null || _b === void 0 ? void 0 : _b.fullName) || '',
            version: arraySteps.version,
            timer: arraySteps.updatedTime,
            contentEvaluationCriteria: arraySteps.contentEvaluationCriteria,
            contentNotes: arraySteps.contentNotes,
            lastUpdatedTime: arraySteps.lastUpdatedTime,
        };
        return {
            isShowEdit: isShowEdit,
            data: results,
            subVersion: maxVersion,
        };
    }
    async publicVersion(params, companyGroupCode, timeZone) {
        const currentVersion = await this.guideEvaluationRepo.findOne(params.versionId, companyGroupCode);
        if (new Date(currentVersion.updatedTime).getTime() ===
            new Date(params.timer).getTime()) {
            await this.guideEvaluationRepo.updateAllVersionToPrivate({
                type: currentVersion.type,
            }, companyGroupCode);
            if (currentVersion.subVersion !== 0) {
                const newVersion = await this.guideEvaluationRepo.maxVersion(Object.assign({ type: params.type }, (companyGroupCode !== undefined && { companyGroupCode })), 'version');
                const objects = {
                    version: newVersion + 1,
                    subVersion: 0,
                    publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    status: 4,
                };
                await this.updateGuideEvaluation(params.type, params.versionId, companyGroupCode, timeZone);
                return await this.guideEvaluationRepo.updateVersion(params.versionId, objects, companyGroupCode);
            }
            else {
                const objects = {
                    version: params.version,
                    subVersion: params.subVersion,
                    publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    status: 4,
                };
                await this.updateGuideEvaluation(params.type, params.versionId, companyGroupCode, timeZone);
                return await this.guideEvaluationRepo.updateVersion(params.versionId, objects, companyGroupCode);
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
    async saveDraftData(body, userId, companyGroupCode, timeZone) {
        const currentVersion = await this.guideEvaluationRepo.findOne(body.id, companyGroupCode);
        const editAlreadys = await this.guideEvaluationRepo.findAllByCondition({
            [sequelize_1.Op.and]: [
                { type: currentVersion.type },
                {
                    status: 1,
                },
                {
                    id: { [sequelize_1.Op.notIn]: [currentVersion.id] },
                },
                companyGroupCode === undefined ? {} : { companyGroupCode },
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
                code: 406,
            };
        }
        if (![1, 4].includes(currentVersion.status)) {
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
        if (new Date(currentVersion.updatedTime).getTime() ===
            new Date(body.updated).getTime()) {
            if (body.status === 3 || body.status === 4) {
                const objectNewVersion = {
                    type: body.type,
                    version: body.version,
                    subVersion: body.subVersion + 1,
                    creationUser: userId,
                    status: 1,
                    reason: body.reason,
                    contentEvaluationCriteria: body.contentEvaluationCriteria,
                    contentNotes: body.contentNotes,
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    companyGroupCode,
                };
                await this.guideEvaluationRepo.updateVersion(body.id, {
                    type: body.type,
                }, companyGroupCode);
                const versionId = await this.guideEvaluationRepo.createNewVersion(objectNewVersion);
                return {
                    id: versionId.id,
                    updatedTime: versionId.updatedTime,
                    subVersion: versionId.subVersion,
                    version: versionId.version,
                    lastUpdatedTime: versionId.lastUpdatedTime,
                    code: 200,
                };
            }
            else if (body.status === 1) {
                const results = await this.guideEvaluationRepo.updateVersion(body.id, {
                    type: body.type,
                    creationUser: userId,
                    reason: body.reason,
                    contentEvaluationCriteria: body.contentEvaluationCriteria,
                    contentNotes: body.contentNotes,
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                }, companyGroupCode);
                return {
                    id: results[1][0].id,
                    updatedTime: results[1][0].updatedTime,
                    subVersion: results[1][0].subVersion,
                    version: results[1][0].version,
                    lastUpdatedTime: results[1][0].lastUpdatedTime,
                    code: 200,
                };
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
    async cancelVersionPro(versionId, userId, body, companyGroupCode) {
        const version = await this.guideEvaluationRepo.findOne(versionId, companyGroupCode);
        const lastUpdatedTime = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm');
        if (version.status === 1 &&
            new Date(version.updatedTime).getTime() === new Date(body.timer).getTime()) {
            return await this.guideEvaluationRepo.cancelVersionProSkill(versionId, userId, lastUpdatedTime, companyGroupCode);
        }
        throw new RuntimeException_1.RuntimeException('No status valid or Date', 409);
    }
    async savePrivateVersion(params) {
        const currentVersion = await this.guideEvaluationRepo.findOne(params.versionId);
        if (new Date(currentVersion.updatedTime).getTime() ===
            new Date(params.timer).getTime()) {
            if (params.status !== 1 && params.status !== 2) {
                const subVersionByMax = await this.guideEvaluationRepo.maxSubVersion({
                    version: currentVersion.version,
                    type: currentVersion.type,
                    companyGroupCode: params.companyGroupCode,
                });
                await this.guideEvaluationRepo.updateVersion(params.versionId, {
                    type: params.type,
                });
                const objectNewVersion = {
                    subVersion: subVersionByMax + 1,
                    version: currentVersion.version,
                    status: 3,
                    creationUser: params.userId,
                    type: params.type,
                    reason: params.reason,
                    contentEvaluationCriteria: params.contentEvaluationCriteria,
                    contentNotes: params.contentNotes,
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm'),
                    companyGroupCode: params.companyGroupCode,
                };
                const versionNew = await this.guideEvaluationRepo.createNewVersion(objectNewVersion);
                return {
                    id: versionNew.id,
                    status: 3,
                    type: params.type,
                };
            }
            else {
                await this.guideEvaluationRepo.updateVersion(params.versionId, {
                    type: params.type,
                    status: 3,
                    contentEvaluationCriteria: params.contentEvaluationCriteria,
                    contentNotes: params.contentNotes,
                    creationUser: params.userId,
                    reason: params.reason,
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm'),
                });
                return {
                    id: params.versionId,
                    status: 3,
                    type: params.type,
                    contentEvaluationCriteria: params.contentEvaluationCriteria,
                    contentNotes: params.contentNotes,
                    creationUser: params.userId,
                    reason: params.reason,
                };
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
    async savePublicVersion(params, companyGroupCode, timeZone) {
        var _a;
        const currentVersion = await this.guideEvaluationRepo.findOne(params.versionId, companyGroupCode);
        if (![1, 4].includes(currentVersion.status)) {
            return {
                code: 407,
                id: params.versionId,
                status: currentVersion.status,
                type: params.type,
            };
        }
        if (new Date(currentVersion.updatedTime).getTime() ===
            new Date(params.timer).getTime()) {
            const newVersion = (_a = (await this.guideEvaluationRepo.maxVersion(Object.assign({ type: params.type }, (companyGroupCode !== undefined && { companyGroupCode })), 'version'))) !== null && _a !== void 0 ? _a : 0;
            if (params.status !== 1 && params.status !== 2) {
                await this.guideEvaluationRepo.updateAllVersionToPrivate({
                    type: currentVersion.type,
                }, companyGroupCode);
                await this.guideEvaluationRepo.updateVersion(params.versionId, {
                    type: params.type,
                }, companyGroupCode);
                const objectNewVersion = {
                    subVersion: 0,
                    version: newVersion + 1,
                    status: 4,
                    creationUser: params.userId,
                    type: params.type,
                    reason: params.reason,
                    contentEvaluationCriteria: params.contentEvaluationCriteria,
                    contentNotes: params.contentNotes,
                    publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    companyGroupCode,
                };
                const versionNew = await this.guideEvaluationRepo.createNewVersion(objectNewVersion);
                await this.updateGuideEvaluation(params.type, versionNew.id, companyGroupCode, timeZone);
                return {
                    id: versionNew.id,
                    status: 4,
                    type: params.type,
                };
            }
            else {
                await this.guideEvaluationRepo.updateAllVersionToPrivate({
                    type: currentVersion.type,
                }, companyGroupCode);
                await this.guideEvaluationRepo.updateVersion(params.versionId, {
                    type: params.type,
                    status: 4,
                    subVersion: 0,
                    version: newVersion + 1,
                    creationUser: params.userId,
                    contentEvaluationCriteria: params.contentEvaluationCriteria,
                    contentNotes: params.contentNotes,
                    reason: params.reason,
                    publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                }, companyGroupCode);
                await this.updateGuideEvaluation(params.type, params.versionId, companyGroupCode, timeZone);
                return {
                    id: params.versionId,
                    status: 4,
                    type: params.type,
                    contentEvaluationCriteria: params.contentEvaluationCriteria,
                    contentNotes: params.contentNotes,
                    creationUser: params.userId,
                    reason: params.reason,
                };
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
    async updateGuideEvaluation(type, versionId, companyGroupCode, timeZone) {
        const periodTitle = `${EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodYear(timeZone)}年${EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone)}`;
        await this.evaluationRepo.updateEvaluationWithoutTransaction({ guideVersionId: versionId }, {
            [sequelize_1.Op.and]: [
                {
                    level: type === 1 || type === 3 ? { [sequelize_1.Op.lte]: 7 } : { [sequelize_1.Op.gt]: 7 },
                },
                type === 2 ? {} : { flagSkill: type === 1 ? 1 : 0 },
                { title: periodTitle },
                companyGroupCode === undefined ? {} : { companyGroupCode },
            ],
        });
    }
};
__decorate([
    (0, common_1.Inject)(guideEvaluation_repository_1.GuideEvaluationRepository),
    __metadata("design:type", guideEvaluation_repository_1.GuideEvaluationRepository)
], GuideEvaluationService.prototype, "guideEvaluationRepo", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_repository_1.EvaluationRepository),
    __metadata("design:type", evaluation_repository_1.EvaluationRepository)
], GuideEvaluationService.prototype, "evaluationRepo", void 0);
GuideEvaluationService = __decorate([
    (0, common_1.Injectable)()
], GuideEvaluationService);
exports.GuideEvaluationService = GuideEvaluationService;
//# sourceMappingURL=guideEvaluation.service.js.map