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
exports.VersionNotificationService = void 0;
const common_1 = require("@nestjs/common");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const CreationUserDto_1 = require("../model/generic/CreationUserDto");
const versionNotification_repository_1 = require("../repository/versionNotification.repository");
const VersionNotificationDto_1 = require("../model/generic/VersionNotificationDto");
const ListVersionNotificationResponse_1 = require("../model/response/F6/ListVersionNotificationResponse");
const util_1 = require("../common/util");
const VersionNotificationStatus_1 = require("../enum/VersionNotificationStatus");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const ErrorMessageResponseDto_1 = require("../model/response/ErrorMessageResponseDto");
const moment = require('moment-timezone');
const NEW_CREATE_TYPE = 'new';
const STATUS_CODE_CONFLICT = 1409;
let VersionNotificationService = class VersionNotificationService {
    async getListVersionNotification(param, companyGroupCode) {
        const result = new ListVersionNotificationResponse_1.ListVersionNotificationResponse();
        try {
            const listEvaluationCalculationHistories = await this.versionNotificationRepository.getListVersionPaging(param, companyGroupCode);
            const total = await this.versionNotificationRepository.countListVersionNotification(param, companyGroupCode);
            let records = [];
            result.counts = total;
            if (listEvaluationCalculationHistories.length > 0) {
                records = listEvaluationCalculationHistories.map((el) => {
                    var _a, _b;
                    const versionNotificationDto = new VersionNotificationDto_1.VersionNotificationDto();
                    versionNotificationDto.id = el.id;
                    versionNotificationDto.version = el.version;
                    versionNotificationDto.subVersion = el.subVersion;
                    versionNotificationDto.versionDisplay =
                        el.version + '.' + el.subVersion;
                    versionNotificationDto.status = el.status;
                    versionNotificationDto.reason = el.reason;
                    versionNotificationDto.publicDate = el.publicDate;
                    const creationUserDto = new CreationUserDto_1.CreationUserDto();
                    creationUserDto.id = (_a = el.user) === null || _a === void 0 ? void 0 : _a.id;
                    creationUserDto.fullName = (_b = el.user) === null || _b === void 0 ? void 0 : _b.fullName;
                    versionNotificationDto.user = creationUserDto;
                    versionNotificationDto.creationUser = el.creationUser;
                    versionNotificationDto.updatedTime = el.updatedTime;
                    versionNotificationDto.lastUpdatedTime = el.lastUpdatedTime;
                    return versionNotificationDto;
                });
            }
            result.rows = records;
        }
        catch (err) {
            throw new RuntimeException_1.RuntimeException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async getDetailNotification(versionId, companyGroupCode) {
        const versionNotification = await this.versionNotificationRepository.getVersionNotificationById(versionId, companyGroupCode);
        if (!versionNotification) {
            throw new RuntimeException_1.RuntimeException('Version not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = new VersionNotificationDto_1.VersionNotificationDto();
        result.id = versionNotification.id;
        result.version = versionNotification.version;
        result.subVersion = versionNotification.subVersion;
        result.versionDisplay =
            versionNotification.version + '.' + versionNotification.subVersion;
        result.status = versionNotification.status;
        result.reason = versionNotification.reason;
        const creationUserDto = new CreationUserDto_1.CreationUserDto();
        creationUserDto.id = versionNotification.user.id;
        creationUserDto.fullName = versionNotification.user.fullName;
        result.user = creationUserDto;
        result.creationUser = versionNotification.creationUser;
        result.content = versionNotification.content;
        result.publicDate = versionNotification.publicDate;
        result.updatedTime = versionNotification.updatedTime;
        result.lastUpdatedTime = versionNotification.lastUpdatedTime;
        const existEditingVersion = await this.versionNotificationRepository.existEditingVersion(versionId, companyGroupCode);
        result.existEditingVersion = existEditingVersion;
        return result;
    }
    async saveDraftVersionNotification(versionNotificationDto, type, req) {
        const isMainVersionPublic = await this.versionNotificationRepository.isMainVersionPublic(versionNotificationDto.version, req.user.companyGroupCode);
        if (!isMainVersionPublic) {
            return new ErrorMessageResponseDto_1.ErrorMessageResponseDto(STATUS_CODE_CONFLICT, '編集ベースとなるバージョンが非公開になったため保存できません。', Date.now());
        }
        const existEditingVersion = await this.versionNotificationRepository.existEditingVersion(type !== NEW_CREATE_TYPE ? versionNotificationDto.id : null, req.user.companyGroupCode);
        if (existEditingVersion) {
            return new ErrorMessageResponseDto_1.ErrorMessageResponseDto(STATUS_CODE_CONFLICT, '編集中のバージョンが存在しているため新規作成できません。', Date.now());
        }
        let result = new VersionNotificationDto_1.VersionNotificationDto();
        versionNotificationDto.creationUser = req.user.id;
        versionNotificationDto.user = req.user;
        versionNotificationDto.lastUpdatedTime = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
        try {
            if (type === NEW_CREATE_TYPE) {
                const maxSubVersion = (await this.versionNotificationRepository.findMaxSubVersion(versionNotificationDto.version, req.user.companyGroupCode)).subVersion;
                versionNotificationDto.subVersion = maxSubVersion + 1;
                versionNotificationDto.status = VersionNotificationStatus_1.VersionNotificationStatus.EDITING;
                versionNotificationDto.id = null;
                versionNotificationDto.publicDate = null;
                versionNotificationDto['companyGroupCode'] = req.user.companyGroupCode;
                const newVersion = await this.versionNotificationRepository.createVersionNotification(versionNotificationDto);
                versionNotificationDto.id = newVersion.id;
            }
            else {
                const versionNotification = await this.versionNotificationRepository.getVersionNotificationById(versionNotificationDto.id, req.user.companyGroupCode);
                if (versionNotificationDto.updatedTime &&
                    versionNotificationDto.updatedTime.toString() !==
                        versionNotification.updatedTime.toISOString()) {
                    throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
                }
                await this.versionNotificationRepository.updateVersionNotification(versionNotificationDto, req.user.companyGroupCode);
            }
            const updatedVersionSetting = await this.versionNotificationRepository.getVersionUpdatedTime(versionNotificationDto.id);
            versionNotificationDto.updatedTime = updatedVersionSetting.updatedTime;
            result = versionNotificationDto;
        }
        catch (error) {
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async cancelVersionNotification(data, companyGroupCode) {
        const version = await this.versionNotificationRepository.findUpdateTimeVersion(data.id, companyGroupCode);
        if (data.updatedTime &&
            version.updatedTime.toISOString() !== data.updatedTime.toString()) {
            throw new RuntimeException_1.RuntimeException('Date invalid', common_1.HttpStatus.CONFLICT);
        }
        delete data.updatedTime;
        await this.versionNotificationRepository.updateVersionNotification(data, companyGroupCode);
        const result = await this.versionNotificationRepository.findUpdateTimeVersion(data.id);
        return result;
    }
    async savePublicVersionNotification(versionNotificationDto, req) {
        const versionNotification = await this.versionNotificationRepository.getVersionNotificationById(versionNotificationDto.id, req.user.companyGroupCode);
        const isMainVersionPublic = await this.versionNotificationRepository.isMainVersionPublic(versionNotificationDto.version, req.user.companyGroupCode);
        if (!isMainVersionPublic) {
            return new ErrorMessageResponseDto_1.ErrorMessageResponseDto(STATUS_CODE_CONFLICT, '編集ベースとなるバージョンが非公開になったため保存できません。', Date.now());
        }
        const transaction = await this.versionNotificationRepository.getNewTransaction();
        versionNotificationDto.creationUser = req.user.id;
        versionNotificationDto.lastUpdatedTime = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
        const httpCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        try {
            const maxVersion = (await this.versionNotificationRepository.findMaxVersion(req.user.companyGroupCode)).version;
            versionNotificationDto.version = maxVersion + 1;
            versionNotificationDto.subVersion = 0;
            versionNotificationDto.publicDate = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
            if (versionNotificationDto.status === VersionNotificationStatus_1.VersionNotificationStatus.PUBLISHED) {
                versionNotificationDto.id = null;
                versionNotificationDto['companyGroupCode'] = req.user.companyGroupCode;
                const newVersion = await this.versionNotificationRepository.createVersionNotification(versionNotificationDto, transaction);
                versionNotificationDto.id = newVersion.id;
            }
            else {
                if (versionNotificationDto.updatedTime &&
                    versionNotificationDto.updatedTime.toString() !==
                        versionNotification.updatedTime.toISOString()) {
                    throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
                }
                versionNotificationDto.status = VersionNotificationStatus_1.VersionNotificationStatus.PUBLISHED;
                await this.versionNotificationRepository.updateVersionNotification(versionNotificationDto, req.user.companyGroupCode, transaction);
            }
            await this.versionNotificationRepository.unPublicVersionSetting(versionNotificationDto.id, transaction, req.user.companyGroupCode);
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || httpCode);
        }
        return versionNotificationDto;
    }
    async findMaxSubVersion(version, companyGroupCode) {
        return (await this.versionNotificationRepository.findMaxSubVersion(version, companyGroupCode)).subVersion;
    }
    async getPublicNotification(companyGroupCode) {
        const versionNotification = await this.versionNotificationRepository.getPublicVersionNotification(companyGroupCode);
        const result = new VersionNotificationDto_1.VersionNotificationDto();
        result.id = versionNotification.id;
        result.status = versionNotification.status;
        result.content = versionNotification.content;
        result.publicDate = versionNotification.publicDate;
        return result;
    }
    async publicVersionNotification(publicVersionNotificationDto, companyGroupCode, timeZone) {
        const versionNotification = await this.versionNotificationRepository.findVersionById(publicVersionNotificationDto.versionId);
        if (!versionNotification ||
            (companyGroupCode !== undefined &&
                versionNotification.companyGroupCode !== companyGroupCode)) {
            throw new RuntimeException_1.RuntimeException('Version not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (publicVersionNotificationDto.updatedTime &&
            publicVersionNotificationDto.updatedTime !==
                versionNotification.updatedTime.toISOString()) {
            throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
        }
        const maxVersion = (await this.versionNotificationRepository.findMaxVersion(companyGroupCode)).version;
        const data = {
            status: publicVersionNotificationDto.status,
            version: publicVersionNotificationDto.version
                ? publicVersionNotificationDto.version
                : maxVersion + 1,
            subVersion: 0,
            publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
            lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
        };
        await this.versionNotificationRepository.publicVersionSetting(publicVersionNotificationDto.versionId, data, companyGroupCode);
        return publicVersionNotificationDto;
    }
};
__decorate([
    (0, common_1.Inject)(versionNotification_repository_1.VersionNotificationRepository),
    __metadata("design:type", Object)
], VersionNotificationService.prototype, "versionNotificationRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], VersionNotificationService.prototype, "evaluationPeriodRepository", void 0);
VersionNotificationService = __decorate([
    (0, common_1.Injectable)()
], VersionNotificationService);
exports.VersionNotificationService = VersionNotificationService;
//# sourceMappingURL=versionNotification.service.js.map