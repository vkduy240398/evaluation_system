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
exports.VersionSettingNsService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const SettingAchievementAdditionalDto_1 = require("../model/generic/SettingAchievementAdditionalDto");
const SettingAchievementPersonalDto_1 = require("../model/generic/SettingAchievementPersonalDto");
const SettingLevelDto_1 = require("../model/generic/SettingLevelDto");
const SettingPointBasicBehaviorProDto_1 = require("../model/generic/SettingPointBasicBehaviorProDto");
const versionSetting_repository_1 = require("../repository/versionSetting.repository");
const VersionSettingDto_1 = require("../model/generic/VersionSettingDto");
const settingPointBasicBehaviorPro_repository_1 = require("../repository/settingPointBasicBehaviorPro.repository");
const settingAchievementPersonal_repository_1 = require("../repository/settingAchievementPersonal.repository");
const settingAchievementAdditional_repository_1 = require("../repository/settingAchievementAdditional.repository");
const settingLevel_repository_1 = require("../repository/settingLevel.repository");
const CreationUserDto_1 = require("../model/generic/CreationUserDto");
const sequelize_1 = require("sequelize");
const VersionSettingStatus_1 = require("../enum/VersionSettingStatus");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const util_1 = require("../common/util");
const RandomHelper_1 = require("../common/RandomHelper");
const ErrorMessageResponseDto_1 = require("../model/response/ErrorMessageResponseDto");
const SettingPointBasicBehaviorProType_1 = require("../enum/SettingPointBasicBehaviorProType");
const SettingAchievementPersonalType_1 = require("../enum/SettingAchievementPersonalType");
const TypeAchievement_1 = require("../enum/TypeAchievement");
const FlagSkill_1 = require("../enum/FlagSkill");
const VersionSettingType_1 = require("../enum/VersionSettingType");
const moment = require('moment-timezone');
const NEW_CREATE_TYPE = 'new';
const STATUS_CODE_CONFLICT = 1409;
let VersionSettingNsService = class VersionSettingNsService {
    async getDetailEvaluationCalculation17ns(versionSettingId, req) {
        const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingId, req);
        if (!versionSetting) {
            throw new RuntimeException_1.RuntimeException('Version setting not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = new VersionSettingDto_1.VersionSettingDto();
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
        const creationUserDto = new CreationUserDto_1.CreationUserDto();
        creationUserDto.id = versionSetting.user.id;
        creationUserDto.fullName = versionSetting.user.fullName;
        result.user = creationUserDto;
        result.creationUser = versionSetting.creationUser;
        result.publicDate = versionSetting.publicDate;
        result.updatedTime = versionSetting.updatedTime;
        result.lastUpdatedTime = versionSetting.lastUpdatedTime;
        result.minPoint = versionSetting.minPoint;
        result.maxPoint = versionSetting.maxPoint;
        result.companyGroupCode = versionSetting.companyGroupCode;
        const listSettingPointBasicBehaviorPros = await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(versionSettingId);
        const listSettingPointBehaviorDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.BEHAVIOR))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                const NUM_OF_CHARS = 32;
                tmp.key = RandomHelper_1.RandomHelper.randomString(NUM_OF_CHARS);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointBehaviorDto.push(tmp);
            });
        }
        result.settingPointBehavior = listSettingPointBehaviorDto;
        const listSettingAchievementPersonal = await this.settingAchievementPersonalRepository.getListSettingAchievementPersonalByVersionId(versionSettingId, TypeAchievement_1.TypeAchievement.PERSONAL_17);
        const listSettingAchievementPersonalDiffDto = [];
        if (listSettingAchievementPersonal.length > 0) {
            (0, rxjs_1.from)(listSettingAchievementPersonal)
                .pipe((0, rxjs_1.filter)((el) => el.type === SettingAchievementPersonalType_1.SettingAchievementPersonalType.DIFFICULTY), (0, rxjs_1.toArray)(), (0, rxjs_1.map)((arr) => arr.sort((a, b) => b.point - a.point)), (0, rxjs_1.mergeMap)((el) => el))
                .subscribe((el) => {
                const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
                const NUM_OF_CHARS = 32;
                tmp.key = RandomHelper_1.RandomHelper.randomString(NUM_OF_CHARS);
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
        const listSettingAchievementPersonalJudgeIndexDto = [];
        if (listSettingAchievementPersonal.length > 0) {
            (0, rxjs_1.from)(listSettingAchievementPersonal)
                .pipe((0, rxjs_1.filter)((el) => el.type === SettingAchievementPersonalType_1.SettingAchievementPersonalType.JUDGE_INDEX), (0, rxjs_1.toArray)(), (0, rxjs_1.map)((arr) => arr.sort((a, b) => b.point - a.point)), (0, rxjs_1.mergeMap)((el) => el))
                .subscribe((el) => {
                const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
                const NUM_OF_CHARS = 32;
                tmp.key = RandomHelper_1.RandomHelper.randomString(NUM_OF_CHARS);
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
        const listSettingAchievementAdditional = await this.settingAchievementAdditionalRepository.getListSettingAchievementAdditionalByVersionId(versionSettingId, TypeAchievement_1.TypeAchievement.PERSONAL_17);
        const listSettingAchievementAdditionalDto = [];
        if (listSettingAchievementAdditional.length > 0) {
            (0, rxjs_1.from)(listSettingAchievementAdditional).subscribe((el) => {
                const tmp = new SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto();
                const NUM_OF_CHARS = 32;
                tmp.key = RandomHelper_1.RandomHelper.randomString(NUM_OF_CHARS);
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
        const listSettingLevel = await this.settingLevelRepository.getListSettingLevelByVersionId(versionSettingId);
        const listSettingLevelDto = [];
        if (listSettingLevel.length > 0) {
            (0, rxjs_1.from)(listSettingLevel).subscribe((el) => {
                const tmp = new SettingLevelDto_1.SettingLevelDto();
                const NUM_OF_CHARS = 32;
                tmp.key = RandomHelper_1.RandomHelper.randomString(NUM_OF_CHARS);
                tmp.versionId = el.versionId;
                tmp.level = el.level;
                tmp.behaviorPercent = el.behaviorPercent;
                tmp.achievementPercent = el.achievementPercent;
                listSettingLevelDto.push(tmp);
            });
        }
        result.settingLevel = listSettingLevelDto;
        const existEditingVersion = await this.versionSettingRepository.existEditingVersion(versionSettingId, versionSetting.type, req);
        result.existEditingVersion = existEditingVersion;
        return result;
    }
    async saveDraftVersionSetting17ns(versionSettingDto, type, req) {
        var _a, _b;
        const isMainVersionPublic = await this.versionSettingRepository.isMainVersionPublic(versionSettingDto.version, versionSettingDto.type, req);
        if (!isMainVersionPublic) {
            return new ErrorMessageResponseDto_1.ErrorMessageResponseDto(STATUS_CODE_CONFLICT, '編集ベースとなるバージョンが非公開になったため保存できません。', Date.now());
        }
        const existEditingVersion = await this.versionSettingRepository.existEditingVersion(type !== NEW_CREATE_TYPE ? versionSettingDto.id : null, versionSettingDto.type, req);
        if (existEditingVersion) {
            return new ErrorMessageResponseDto_1.ErrorMessageResponseDto(STATUS_CODE_CONFLICT, '編集中のバージョンが存在しているため新規作成できません。', Date.now());
        }
        let result = new VersionSettingDto_1.VersionSettingDto();
        const transaction = await this.versionSettingRepository.getNewTransaction();
        versionSettingDto.creationUser = req.user.id;
        versionSettingDto.lastUpdatedTime = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
        versionSettingDto.maxPoint =
            ((_a = versionSettingDto.maxPoint) === null || _a === void 0 ? void 0 : _a.toString()) == '' ||
                isNaN(versionSettingDto.maxPoint)
                ? null
                : versionSettingDto.maxPoint;
        versionSettingDto.minPoint =
            ((_b = versionSettingDto.minPoint) === null || _b === void 0 ? void 0 : _b.toString()) == '' ||
                isNaN(versionSettingDto.minPoint)
                ? null
                : versionSettingDto.minPoint;
        try {
            if (type === NEW_CREATE_TYPE) {
                const maxSubVersion = (await this.versionSettingRepository.findMaxSubVersion(versionSettingDto.version, versionSettingDto.type, req)).subVersion;
                versionSettingDto.subVersion = maxSubVersion + 1;
                versionSettingDto.status = VersionSettingStatus_1.VersionSettingStatus.EDITING;
                versionSettingDto.id = null;
                versionSettingDto.publicDate = null;
                versionSettingDto.companyGroupCode = req.user.companyGroupCode;
                const newVersionSetting = await this.versionSettingRepository.createVersionSetting17T(versionSettingDto, transaction);
                versionSettingDto.id = newVersionSetting.id;
                result = await this.bulkCreateSettingsToVersionNsT(versionSettingDto, transaction);
            }
            else {
                const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingDto.id, req);
                if (versionSettingDto.updatedTime &&
                    versionSettingDto.updatedTime.toString() !==
                        versionSetting.updatedTime.toISOString()) {
                    throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
                }
                await this.versionSettingRepository.updateVersionSettingT(versionSettingDto, transaction);
                result = await this.batchUpdateSettingsToVersionT(versionSettingDto, transaction);
            }
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async saveDraft810NS(params, userId, req) {
        const version = await this.versionSettingRepository.findUpdateTimeVersion(params.id, req);
        if (params.isNew === 1 ||
            new Date(version.updatedTime).getTime() ===
                new Date(params.updatedTime).getTime()) {
            if (params.isNew === 1) {
                const isEditVersion = await this.versionSettingRepository.existEditingVersion(params.id, VersionSettingType_1.VersionSettingType.LEVEL_8_10_NS, req);
                if (isEditVersion) {
                    return {
                        code: 403,
                        message: '編集中のバージョンが存在しているため新規作成できません。',
                    };
                }
                const versionPublic = await this.versionSettingRepository.checkVersionPublic(VersionSettingType_1.VersionSettingType.LEVEL_8_10_NS, req);
                if (versionPublic.version.toString() !== params.version.split('.')[0] &&
                    params.isNew === 1) {
                    return {
                        code: 411,
                        message: `編集ベースとなるバージョンが非公開になったため保存できません。`,
                        data: versionPublic,
                    };
                }
            }
            const transaction = await this.versionSettingRepository.getNewTransaction();
            try {
                const versionSetting = await this.versionSettingRepository.saveDraftVersion(params, userId, params.isNew, FlagSkill_1.FlagSkill.NO_SKILL, transaction, req);
                await this.versionSettingRepository.saveDraftNSData(params, versionSetting[0].id, transaction);
                await transaction.commit();
                return versionSetting;
            }
            catch (error) {
                console.log(error);
                await transaction.rollback();
                throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) ||
                    (error === null || error === void 0 ? void 0 : error.statusCode) ||
                    common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else
            throw new RuntimeException_1.RuntimeException('Date invalid', common_1.HttpStatus.CONFLICT);
    }
    async savePublicOrPrivateNS(params, userId, req) {
        var _a;
        const version = await this.versionSettingRepository.findUpdateTimeVersion(params.id, req);
        if (params.status === 4) {
            const years = moment().tz(req.user.timeZone);
            const periods = await this.evaluationPeriodRepo.getAll({
                [sequelize_1.Op.and]: [
                    {
                        [sequelize_1.Op.or]: [
                            { year: years.tz(req.user.timeZone).format('YYYY') },
                            { year: years.add(-1, 'Y').tz(req.user.timeZone).format('YYYY') },
                        ],
                    },
                    {
                        companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
                    },
                    {
                        checkFixed: { [sequelize_1.Op.ne]: 2 },
                    },
                ],
            });
            let dateGoal;
            let dateEvaluation;
            for (let index = 0; index < periods.length; index++) {
                if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalDepartmentStart, periods[index].dateCreationGoalDepartmentEnd, req.user.timeZone) ||
                    (0, util_1.compareDatePeriod)(periods[index].dateEvaluationDepartmentStart, periods[index].dateEvaluationDepartmentEnd, req.user.timeZone)) {
                    if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalDepartmentStart, periods[index].dateCreationGoalDepartmentEnd, req.user.timeZone)) {
                        dateGoal = {
                            startCheck: periods[index].dateCreationGoalDepartmentStart,
                            endCheck: periods[index].dateCreationGoalDepartmentEnd,
                        };
                    }
                    if ((0, util_1.compareDatePeriod)(periods[index].dateEvaluationDepartmentStart, periods[index].dateEvaluationDepartmentEnd, req.user.timeZone)) {
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
        if (params.isNew === 1 ||
            new Date(version.updatedTime).getTime() ===
                new Date(params.updatedTime).getTime()) {
            const transaction = await this.versionSettingRepository.getNewTransaction();
            try {
                if (params.isNew === 1) {
                    const isEditVersion = await this.versionSettingRepository.existEditingVersion(params.id, VersionSettingType_1.VersionSettingType.LEVEL_8_10_NS, req);
                    if (isEditVersion) {
                        await transaction.rollback();
                        return {
                            code: 403,
                            message: '編集中のバージョンが存在しているため新規作成できません。',
                        };
                    }
                }
                const versionPublic = await this.versionSettingRepository.checkVersionPublic(VersionSettingType_1.VersionSettingType.LEVEL_8_10_NS, req);
                if ((versionPublic === null || versionPublic === void 0 ? void 0 : versionPublic.version.toString()) !== params.version.split('.')[0] &&
                    params.isNew === 1) {
                    await transaction.rollback();
                    return {
                        code: 411,
                        message: `編集ベースとなるバージョンが非公開になったため保存できません。`,
                        data: versionPublic,
                    };
                }
                const versionSetting = await this.versionSettingRepository.savePublicOrPrivate(params, userId, transaction, req);
                await this.versionSettingRepository.saveDraftNSData(params, versionSetting[0].id, transaction);
                await transaction.commit();
                return versionSetting;
            }
            catch (error) {
                await transaction.rollback();
                throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) ||
                    (error === null || error === void 0 ? void 0 : error.statusCode) ||
                    common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else
            throw new RuntimeException_1.RuntimeException('Date invalid', common_1.HttpStatus.CONFLICT);
    }
    async savePublicVersionSetting17ns(versionSettingDto, req) {
        var _a;
        const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingDto.id, req);
        if (versionSettingDto.updatedTime &&
            versionSettingDto.updatedTime.toString() !==
                versionSetting.updatedTime.toISOString()) {
            throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
        }
        const isMainVersionPublic = await this.versionSettingRepository.isMainVersionPublic(versionSettingDto.version, versionSettingDto.type, req);
        if (!isMainVersionPublic) {
            return new ErrorMessageResponseDto_1.ErrorMessageResponseDto(STATUS_CODE_CONFLICT, '編集ベースとなるバージョンが非公開になったため保存できません。', Date.now());
        }
        const years = moment().tz(req.user.timeZone);
        const periods = await this.evaluationPeriodRepo.getAll({
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { year: years.tz(req.user.timeZone).format('YYYY') },
                        { year: years.add(-1, 'Y').tz(req.user.timeZone).format('YYYY') },
                    ],
                },
                {
                    companyGroupCode: req.user.companyGroupCode,
                },
                {
                    checkFixed: { [sequelize_1.Op.ne]: 2 },
                },
            ],
        });
        for (let index = 0; index < periods.length; index++) {
            const isGoalCreationTime = (0, util_1.compareDatePeriod)(periods[index].dateCreationGoalStart, periods[index].dateCreationGoalEnd, req.user.timeZone);
            const isEvaluationTime = (0, util_1.compareDatePeriod)(periods[index].dateEvaluationStart, periods[index].dateEvaluationEnd, req.user.timeZone);
            if (isGoalCreationTime || isEvaluationTime) {
                return {
                    code: common_1.HttpStatus.FORBIDDEN,
                    startGoal: periods[index].dateCreationGoalStart,
                    endGoal: periods[index].dateCreationGoalEnd,
                    startEvaluation: periods[index].dateEvaluationStart,
                    endEvaluation: periods[index].dateEvaluationEnd,
                    isGoalCreationTime,
                    isEvaluationTime,
                };
            }
        }
        let result = new VersionSettingDto_1.VersionSettingDto();
        const transaction = await this.versionSettingRepository.getNewTransaction();
        versionSettingDto.creationUser = req.user.id;
        versionSettingDto.lastUpdatedTime = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
        let httpCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        try {
            if (versionSettingDto.status === VersionSettingStatus_1.VersionSettingStatus.CANCEL) {
                httpCode = common_1.HttpStatus.BAD_REQUEST;
                throw new RuntimeException_1.RuntimeException('Version is cancelled', httpCode);
            }
            const maxVersion = (await this.versionSettingRepository.findMaxVersion(versionSettingDto.type, req)).version;
            versionSettingDto.version = maxVersion + 1;
            versionSettingDto.subVersion = 0;
            versionSettingDto.publicDate = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
            versionSettingDto.companyGroupCode = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode;
            if (versionSettingDto.status === VersionSettingStatus_1.VersionSettingStatus.PUBLISHED) {
                versionSettingDto.id = null;
                const newVersionSetting = await this.versionSettingRepository.createVersionSetting17T(versionSettingDto, transaction);
                versionSettingDto.id = newVersionSetting.id;
                result = await this.bulkCreateSettingsToVersionNsT(versionSettingDto, transaction);
            }
            else {
                versionSettingDto.status = VersionSettingStatus_1.VersionSettingStatus.PUBLISHED;
                await this.versionSettingRepository.updateVersionSettingT(versionSettingDto, transaction);
                result = await this.batchUpdateSettingsToVersionT(versionSettingDto, transaction);
            }
            await this.versionSettingRepository.unPublicVersionSetting(versionSettingDto.id, versionSettingDto.type, transaction, req);
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || httpCode);
        }
        return result;
    }
    async bulkCreateSettingsToVersionNsT(versionSettingDto, transaction) {
        const listSettingPointBehaviorDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingPointBehavior).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointBehaviorDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProRepository.bulkCreate(listSettingPointBehaviorDto, transaction);
        const listSettingAchievementPersonalDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingAchievementPersonalDiff).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            listSettingAchievementPersonalDto.push(tmp);
        });
        (0, rxjs_1.from)(versionSettingDto.settingAchievementPersonalJudgeIndex).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            tmp.description = el.description;
            listSettingAchievementPersonalDto.push(tmp);
        });
        await this.settingAchievementPersonalRepository.bulkCreate(listSettingAchievementPersonalDto, transaction);
        const listSettingAchievementAdditionalDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingAchievementAdditional).subscribe((el) => {
            const tmp = new SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.rating = el.rating;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.type = el.type;
            listSettingAchievementAdditionalDto.push(tmp);
        });
        await this.settingAchievementAdditionalRepository.bulkCreate(listSettingAchievementAdditionalDto, transaction);
        const listSettingLevellDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingLevel).subscribe((el) => {
            const tmp = new SettingLevelDto_1.SettingLevelDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.level = el.level;
            tmp.skillPercent = el.skillPercent;
            tmp.behaviorPercent = el.behaviorPercent;
            tmp.achievementPercent = el.achievementPercent;
            listSettingLevellDto.push(tmp);
        });
        await this.settingLevelRepository.bulkCreate(listSettingLevellDto, transaction);
        return versionSettingDto;
    }
    async batchUpdateSettingsToVersionT(versionSettingDto, transaction) {
        const listSettingPointBehaviorDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingPointBehavior).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = el.versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointBehaviorDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProRepository.bulkDelete(versionSettingDto.id, SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.BEHAVIOR, transaction);
        await this.settingPointBasicBehaviorProRepository.bulkCreate(listSettingPointBehaviorDto, transaction);
        const listSettingAchievementPersonalDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingAchievementPersonalDiff).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = el.versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            listSettingAchievementPersonalDto.push(tmp);
        });
        (0, rxjs_1.from)(versionSettingDto.settingAchievementPersonalJudgeIndex).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = el.versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            tmp.description = el.description;
            listSettingAchievementPersonalDto.push(tmp);
        });
        await this.settingAchievementPersonalRepository.bulkDelete(versionSettingDto.id, transaction);
        await this.settingAchievementPersonalRepository.bulkCreate(listSettingAchievementPersonalDto, transaction);
        const listSettingAchievementAdditionalDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingAchievementAdditional).subscribe((el) => {
            const tmp = new SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto();
            tmp.versionId = el.versionId;
            tmp.rating = el.rating;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.type = el.type;
            listSettingAchievementAdditionalDto.push(tmp);
        });
        await this.settingAchievementAdditionalRepository.bulkDelete(versionSettingDto.id, transaction);
        await this.settingAchievementAdditionalRepository.bulkCreate(listSettingAchievementAdditionalDto, transaction);
        const listSettingLevellDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingLevel).subscribe((el) => {
            const tmp = new SettingLevelDto_1.SettingLevelDto();
            tmp.versionId = el.versionId;
            tmp.level = el.level;
            tmp.behaviorPercent = el.behaviorPercent;
            tmp.achievementPercent = el.achievementPercent;
            listSettingLevellDto.push(tmp);
        });
        await this.settingLevelRepository.bulkDelete(versionSettingDto.id, transaction);
        await this.settingLevelRepository.bulkCreate(listSettingLevellDto, transaction);
        return versionSettingDto;
    }
};
__decorate([
    (0, common_1.Inject)(versionSetting_repository_1.VersionSettingRepository),
    __metadata("design:type", Object)
], VersionSettingNsService.prototype, "versionSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingPointBasicBehaviorPro_repository_1.SettingPointBasicBehaviorProRepository),
    __metadata("design:type", settingPointBasicBehaviorPro_repository_1.SettingPointBasicBehaviorProRepository)
], VersionSettingNsService.prototype, "settingPointBasicBehaviorProRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingAchievementPersonal_repository_1.SettingAchievementPersonalRepository),
    __metadata("design:type", settingAchievementPersonal_repository_1.SettingAchievementPersonalRepository)
], VersionSettingNsService.prototype, "settingAchievementPersonalRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingAchievementAdditional_repository_1.SettingAchievementAdditionalRepository),
    __metadata("design:type", settingAchievementAdditional_repository_1.SettingAchievementAdditionalRepository)
], VersionSettingNsService.prototype, "settingAchievementAdditionalRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingLevel_repository_1.SettingLevelRepository),
    __metadata("design:type", settingLevel_repository_1.SettingLevelRepository)
], VersionSettingNsService.prototype, "settingLevelRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], VersionSettingNsService.prototype, "evaluationPeriodRepo", void 0);
VersionSettingNsService = __decorate([
    (0, common_1.Injectable)()
], VersionSettingNsService);
exports.VersionSettingNsService = VersionSettingNsService;
//# sourceMappingURL=versionSettingNs.service.js.map