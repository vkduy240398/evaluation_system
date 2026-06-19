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
exports.VersionSettingService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const sequelize_1 = require("sequelize");
const RandomHelper_1 = require("../common/RandomHelper");
const util_1 = require("../common/util");
const TypeAchievement_1 = require("../enum/TypeAchievement");
const SettingAchievementPersonalType_1 = require("../enum/SettingAchievementPersonalType");
const SettingPointBasicBehaviorProType_1 = require("../enum/SettingPointBasicBehaviorProType");
const VersionSettingStatus_1 = require("../enum/VersionSettingStatus");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const CreationUserDto_1 = require("../model/generic/CreationUserDto");
const SettingAchievementAdditionalDto_1 = require("../model/generic/SettingAchievementAdditionalDto");
const SettingAchievementPersonalDto_1 = require("../model/generic/SettingAchievementPersonalDto");
const SettingLevelDto_1 = require("../model/generic/SettingLevelDto");
const SettingPointBasicBehaviorProDto_1 = require("../model/generic/SettingPointBasicBehaviorProDto");
const SettingProFormulaDto_1 = require("../model/generic/SettingProFormulaDto");
const VersionSettingDto_1 = require("../model/generic/VersionSettingDto");
const ErrorMessageResponseDto_1 = require("../model/response/ErrorMessageResponseDto");
const ListEvaluationCalculationResponseDto_1 = require("../model/response/F6/ListEvaluationCalculationResponseDto");
const SettingProFormulaSubDto_1 = require("../model/response/SettingProFormulaSubDto");
const adminEvaluation_repository_1 = require("../repository/adminEvaluation.repository");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const settingAchievementAdditional_repository_1 = require("../repository/settingAchievementAdditional.repository");
const settingAchievementPersonal_repository_1 = require("../repository/settingAchievementPersonal.repository");
const settingLevel_repository_1 = require("../repository/settingLevel.repository");
const settingPointBasicBehaviorPro_repository_1 = require("../repository/settingPointBasicBehaviorPro.repository");
const settingProFormula_repository_1 = require("../repository/settingProFormula.repository");
const versionSetting_repository_1 = require("../repository/versionSetting.repository");
const FlagSkill_1 = require("../enum/FlagSkill");
const VersionSettingType_1 = require("../enum/VersionSettingType");
const moment = require('moment-timezone');
const NEW_CREATE_TYPE = 'new';
const STATUS_CODE_CONFLICT = 1409;
let VersionSettingService = class VersionSettingService {
    async getListEvaluationCalculationHistory(param, req) {
        const result = new ListEvaluationCalculationResponseDto_1.ListEvaluationCalculationHistoryResponseDto();
        try {
            const listEvaluationCalculationHistories = await this.versionSettingRepository.getListVersionSettingPaging(param, req);
            const total = await this.versionSettingRepository.countListVersionSetting(param, req);
            const records = [];
            result.counts = total;
            if (listEvaluationCalculationHistories.length > 0) {
                listEvaluationCalculationHistories
                    .map((el) => {
                    var _a, _b;
                    const versionSettingDto = new VersionSettingDto_1.VersionSettingDto();
                    versionSettingDto.id = el.id;
                    versionSettingDto.type = el.type;
                    versionSettingDto.version = el.version;
                    versionSettingDto.subVersion = el.subVersion;
                    versionSettingDto.versionDisplay = el.version + '.' + el.subVersion;
                    versionSettingDto.status = el.status;
                    versionSettingDto.reason = el.reason;
                    versionSettingDto.basicMaxDifficulty = el.basicMaxDifficulty;
                    versionSettingDto.behaviorMaxWeight = el.behaviorMaxWeight;
                    versionSettingDto.publicDate = el.publicDate;
                    const creationUserDto = new CreationUserDto_1.CreationUserDto();
                    creationUserDto.id = (_a = el.user) === null || _a === void 0 ? void 0 : _a.id;
                    creationUserDto.fullName = (_b = el.user) === null || _b === void 0 ? void 0 : _b.fullName;
                    versionSettingDto.user = creationUserDto;
                    versionSettingDto.creationUser = el.creationUser;
                    versionSettingDto.updatedTime = el.updatedTime;
                    versionSettingDto.lastUpdatedTime = el.lastUpdatedTime;
                    return versionSettingDto;
                })
                    .forEach((el) => {
                    records.push(el);
                });
            }
            result.rows = records;
        }
        catch (err) {
            throw new RuntimeException_1.RuntimeException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async getDetailEvaluationCalculation17(versionSettingId, req) {
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
        result.maxPoint = versionSetting.maxPoint;
        result.minPoint = versionSetting.minPoint;
        const listSettingPointBasicBehaviorPros = await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(versionSettingId);
        const listSettingPointBasicDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === 1))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointBasicDto.push(tmp);
            });
        }
        result.settingPointBasic = listSettingPointBasicDto;
        const listSettingPointBehaviorDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === 2))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointBehaviorDto.push(tmp);
            });
        }
        result.settingPointBehavior = listSettingPointBehaviorDto;
        const listSettingPointProDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === 3))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointProDto.push(tmp);
            });
        }
        result.settingPointPro = listSettingPointProDto;
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
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
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
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
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
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.versionId = el.versionId;
                tmp.level = el.level;
                tmp.skillPercent = el.skillPercent;
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
    async getDetailEvaluationCalculation810(versionSettingId, req) {
        const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingId, req);
        if (!versionSetting) {
            throw new RuntimeException_1.RuntimeException('Version setting not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = new VersionSettingDto_1.VersionSetting810Dto();
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
        result.maxPoint = versionSetting.maxPoint;
        result.minPoint = versionSetting.minPoint;
        result.maxPointDep = versionSetting.maxPointDep;
        result.minPointDep = versionSetting.minPointDep;
        result.companyGroupCode = versionSetting.companyGroupCode;
        const listSettingPointBasicBehaviorPros = await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(versionSettingId);
        const listSettingPointBasicDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === 1))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointBasicDto.push(tmp);
            });
        }
        result.settingPointBasic = listSettingPointBasicDto;
        const listSettingPointBehaviorDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === 2))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointBehaviorDto.push(tmp);
            });
        }
        result.settingPointBehavior = listSettingPointBehaviorDto;
        const listSettingPointProDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === 3))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointProDto.push(tmp);
            });
        }
        result.settingPointPro = listSettingPointProDto;
        const listSettingAchievementPersonal = await this.settingAchievementPersonalRepository.getListSettingAchievementPersonalByVersionId(versionSettingId, TypeAchievement_1.TypeAchievement.PERSONAL_810);
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
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
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
        const listSettingAchievementAdditional = await this.settingAchievementAdditionalRepository.getListSettingAchievementAdditionalByVersionId(versionSettingId, TypeAchievement_1.TypeAchievement.PERSONAL_810);
        const listSettingAchievementAdditionalDto = [];
        if (listSettingAchievementAdditional.length > 0) {
            (0, rxjs_1.from)(listSettingAchievementAdditional).subscribe((el) => {
                const tmp = new SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
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
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.versionId = el.versionId;
                tmp.level = el.level;
                tmp.skillPercent = el.skillPercent;
                tmp.behaviorPercent = el.behaviorPercent;
                tmp.achievementPercent = el.achievementPercent;
                listSettingLevelDto.push(tmp);
            });
        }
        result.settingLevel = listSettingLevelDto;
        result.settingAchievementDepDiff =
            await this.adminEvaluation.getAchievementDep(versionSettingId, 1, TypeAchievement_1.TypeAchievement.DEPARTMENT_810);
        result.settingAchievementDepJudgeIndex =
            await this.adminEvaluation.getAchievementDep(versionSettingId, 2, TypeAchievement_1.TypeAchievement.DEPARTMENT_810);
        result.settingAchievementAdditionalDep =
            await this.adminEvaluation.getAchievementAdditionalDep(versionSettingId);
        result.settingFormula810 = await this.adminEvaluation.getFormula(versionSettingId);
        result.isHaveEditRecord = await this.adminEvaluation.haveRecordEdit(req);
        return result;
    }
    async getDetailEvaluationCalculation810NS(versionSettingId, req) {
        const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingId, req);
        if (!versionSetting) {
            throw new RuntimeException_1.RuntimeException('Version setting not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = new VersionSettingDto_1.VersionSetting810Dto();
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
        result.maxPoint = versionSetting.maxPoint;
        result.minPoint = versionSetting.minPoint;
        result.maxPointDep = versionSetting.maxPointDep;
        result.minPointDep = versionSetting.minPointDep;
        result.companyGroupCode = versionSetting.companyGroupCode;
        const listSettingPointBasicBehaviorPros = await this.settingPointBasicBehaviorProRepository.getListSettingPointBasicBehaviorProByVersionId(versionSettingId);
        const listSettingPointBehaviorDto = [];
        if (listSettingPointBasicBehaviorPros.length > 0) {
            (0, rxjs_1.from)(listSettingPointBasicBehaviorPros)
                .pipe((0, rxjs_1.filter)((el) => el.type === 2))
                .subscribe((el) => {
                const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.type = el.type;
                tmp.point = el.point;
                tmp.note = el.note;
                listSettingPointBehaviorDto.push(tmp);
            });
        }
        result.settingPointBehavior = listSettingPointBehaviorDto;
        const listSettingAchievementPersonal = await this.settingAchievementPersonalRepository.getListSettingAchievementPersonalByVersionId(versionSettingId, TypeAchievement_1.TypeAchievement.PERSONAL_810);
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
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
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
        const listSettingAchievementAdditional = await this.settingAchievementAdditionalRepository.getListSettingAchievementAdditionalByVersionId(versionSettingId, TypeAchievement_1.TypeAchievement.PERSONAL_810);
        const listSettingAchievementAdditionalDto = [];
        if (listSettingAchievementAdditional.length > 0) {
            (0, rxjs_1.from)(listSettingAchievementAdditional).subscribe((el) => {
                const tmp = new SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
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
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.versionId = el.versionId;
                tmp.level = el.level;
                tmp.skillPercent = el.skillPercent;
                tmp.behaviorPercent = el.behaviorPercent;
                tmp.achievementPercent = el.achievementPercent;
                listSettingLevelDto.push(tmp);
            });
        }
        result.settingLevel = listSettingLevelDto;
        result.settingAchievementDepDiff =
            await this.adminEvaluation.getAchievementDep(versionSettingId, 1, TypeAchievement_1.TypeAchievement.DEPARTMENT_810);
        result.settingAchievementDepJudgeIndex =
            await this.adminEvaluation.getAchievementDep(versionSettingId, 2, TypeAchievement_1.TypeAchievement.DEPARTMENT_810);
        result.settingAchievementAdditionalDep =
            await this.adminEvaluation.getAchievementAdditionalDep(versionSettingId);
        result.settingFormula810 = await this.adminEvaluation.getFormula(versionSettingId);
        result.isHaveEditRecord = await this.adminEvaluation.haveRecordEditNS(req);
        return result;
    }
    async getDetailEvaluationCalculationCommon(versionSettingId, req) {
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
        result.maxPoint = versionSetting.maxPoint;
        result.minPoint = versionSetting.minPoint;
        const listSettingProFormulas = await this.settingProFormulaRepository.getListSettingProFormulaByVersionId(versionSettingId);
        const listSettingProFormulaDto = [];
        if (listSettingProFormulas.length > 0) {
            (0, rxjs_1.from)(listSettingProFormulas).subscribe((el) => {
                const tmp = new SettingProFormulaDto_1.SettingProFormulaDto();
                tmp.key = RandomHelper_1.RandomHelper.randomString(32);
                tmp.id = el.id;
                tmp.versionId = el.versionId;
                tmp.point = el.point;
                tmp.note = el.note;
                const listSettingProFormulaSub = [];
                (0, rxjs_1.from)(el.settingProFormulaSub).subscribe((sub) => {
                    const tmpSub = new SettingProFormulaSubDto_1.SettingProFormulaSubDto();
                    tmpSub.key = RandomHelper_1.RandomHelper.randomString(32);
                    tmpSub.id = sub.id;
                    tmpSub.formulaId = sub.formulaId;
                    tmpSub.totalItem = sub.totalItem;
                    tmpSub.coefficient = sub.coefficient;
                    listSettingProFormulaSub.push(tmpSub);
                });
                tmp.settingProFormulaSub = listSettingProFormulaSub;
                listSettingProFormulaDto.push(tmp);
            });
        }
        result.settingProFormula = listSettingProFormulaDto;
        const existEditingVersion = await this.versionSettingRepository.existEditingVersion(versionSettingId, versionSetting.type, req);
        result.existEditingVersion = existEditingVersion;
        return result;
    }
    async savePublicVersionSettingCommon(versionSettingDto, req) {
        var _a;
        const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingDto.id, req);
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
            const isEvaluationTimePersonal = (0, util_1.compareDatePeriod)(periods[index].dateEvaluationStart, periods[index].dateEvaluationEnd, req.user.timeZone);
            const isEvaluationTimeDepartment = (0, util_1.compareDatePeriod)(periods[index].dateEvaluationDepartmentStart, periods[index].dateEvaluationDepartmentEnd, req.user.timeZone);
            if (isEvaluationTimePersonal || isEvaluationTimeDepartment) {
                return {
                    code: 403,
                    startEvaluationPersonal: periods[index].dateEvaluationStart,
                    endEvaluationPersonal: periods[index].dateEvaluationEnd,
                    startEvaluationDepartment: periods[index].dateEvaluationDepartmentStart,
                    endEvaluationDepartment: periods[index].dateEvaluationDepartmentEnd,
                    isEvaluationTimePersonal,
                    isEvaluationTimeDepartment,
                };
            }
        }
        let result = new VersionSettingDto_1.VersionSettingDto();
        const transaction = await this.versionSettingRepository.getNewTransaction();
        versionSettingDto.creationUser = req.user.id;
        versionSettingDto.lastUpdatedTime = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
        const httpCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        try {
            const maxVersion = (await this.versionSettingRepository.findMaxVersion(versionSettingDto.type, req)).version;
            versionSettingDto.version = maxVersion + 1;
            versionSettingDto.subVersion = 0;
            versionSettingDto.publicDate = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
            versionSettingDto.companyGroupCode = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode;
            if (versionSettingDto.status === VersionSettingStatus_1.VersionSettingStatus.PUBLISHED) {
                versionSettingDto.id = null;
                const newVersionSetting = await this.versionSettingRepository.createVersionSetting17T(versionSettingDto, transaction);
                versionSettingDto.id = newVersionSetting.id;
                result = await this.bulkCreateSettingsToVersionCommon(versionSettingDto, transaction);
            }
            else {
                if (versionSettingDto.updatedTime &&
                    versionSettingDto.updatedTime.toString() !==
                        versionSetting.updatedTime.toISOString()) {
                    throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
                }
                versionSettingDto.status = VersionSettingStatus_1.VersionSettingStatus.PUBLISHED;
                await this.versionSettingRepository.updateVersionSettingT(versionSettingDto, transaction);
                result = await this.batchUpdateSettingsToVersionCommon(versionSettingDto, transaction);
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
    async publicVersionSettingCommon(publicVersionSettingDto, req) {
        const versionSetting = await this.versionSettingRepository.findVersionSettingById(publicVersionSettingDto.versionId);
        if (!versionSetting) {
            throw new RuntimeException_1.RuntimeException('Version not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (publicVersionSettingDto.updatedTime &&
            publicVersionSettingDto.updatedTime !==
                versionSetting.updatedTime.toISOString()) {
            throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
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
            const isEvaluationTimePersonal = (0, util_1.compareDatePeriod)(periods[index].dateEvaluationStart, periods[index].dateEvaluationEnd, req.user.timeZone);
            const isEvaluationTimeDepartment = (0, util_1.compareDatePeriod)(periods[index].dateEvaluationDepartmentStart, periods[index].dateEvaluationDepartmentEnd, req.user.timeZone);
            if (isEvaluationTimePersonal || isEvaluationTimeDepartment) {
                return {
                    code: 403,
                    startEvaluationPersonal: periods[index].dateEvaluationStart,
                    endEvaluationPersonal: periods[index].dateEvaluationEnd,
                    startEvaluationDepartment: periods[index].dateEvaluationDepartmentStart,
                    endEvaluationDepartment: periods[index].dateEvaluationDepartmentEnd,
                    isEvaluationTimePersonal,
                    isEvaluationTimeDepartment,
                };
            }
        }
        const maxVersion = (await this.versionSettingRepository.findMaxVersion(versionSetting.type, req)).version;
        const data = {
            status: publicVersionSettingDto.status,
            version: publicVersionSettingDto.version
                ? publicVersionSettingDto.version
                : maxVersion + 1,
            subVersion: 0,
            publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
            lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
        };
        await this.versionSettingRepository.publicVersionSetting(publicVersionSettingDto.versionId, publicVersionSettingDto.type, data, req.user.companyGroupCode);
        const result = Object.assign({}, publicVersionSettingDto);
        return result;
    }
    async saveDraftVersionSettingCommon(versionSettingDto, type, req) {
        var _a;
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
        versionSettingDto.user = req.user;
        versionSettingDto.companyGroupCode = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode;
        versionSettingDto.lastUpdatedTime = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
        try {
            if (type === NEW_CREATE_TYPE) {
                const maxSubVersion = (await this.versionSettingRepository.findMaxSubVersion(versionSettingDto.version, versionSettingDto.type, req)).subVersion;
                versionSettingDto.subVersion = maxSubVersion + 1;
                versionSettingDto.status = VersionSettingStatus_1.VersionSettingStatus.EDITING;
                versionSettingDto.id = null;
                versionSettingDto.publicDate = null;
                const newVersionSetting = await this.versionSettingRepository.createVersionSetting17T(versionSettingDto, transaction);
                versionSettingDto.id = newVersionSetting.id;
                result = await this.bulkCreateSettingsToVersionCommon(versionSettingDto, transaction);
            }
            else {
                const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingDto.id, req);
                if (versionSettingDto.updatedTime &&
                    versionSettingDto.updatedTime.toString() !==
                        versionSetting.updatedTime.toISOString()) {
                    throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
                }
                await this.versionSettingRepository.updateVersionSettingT(versionSettingDto, transaction);
                result = await this.batchUpdateSettingsToVersionCommon(versionSettingDto, transaction);
            }
            await transaction.commit();
            const updatedVersionSetting = await this.versionSettingRepository.getVersionUpdatedTime(versionSettingDto.id);
            versionSettingDto.updatedTime = updatedVersionSetting.updatedTime;
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async bulkCreateSettingsToVersionCommon(versionSettingDto, transaction) {
        const listSettingProFormulaDto = [];
        let listSettingProFormulaSubDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingProFormula).subscribe((el) => {
            const tmp = new SettingProFormulaDto_1.SettingProFormulaDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingProFormulaSubDto = [];
            (0, rxjs_1.from)(el.settingProFormulaSub).subscribe((sub) => {
                const tmp2 = new SettingProFormulaSubDto_1.SettingProFormulaSubDto();
                tmp2.totalItem = sub.totalItem;
                tmp2.coefficient = sub.coefficient;
                listSettingProFormulaSubDto.push(tmp2);
            });
            tmp.settingProFormulaSub = listSettingProFormulaSubDto;
            listSettingProFormulaDto.push(tmp);
        });
        await this.settingProFormulaRepository.bulkCreate(listSettingProFormulaDto, transaction);
        return versionSettingDto;
    }
    async getNextVersion810(version, req) {
        return await this.versionSettingRepository.getNextVersion810(version, req);
    }
    async getNextVersion810NS(version, req) {
        return await this.versionSettingRepository.getNextVersion810NS(version, req);
    }
    async saveDraft810(params, userId, req) {
        const version = await this.versionSettingRepository.findUpdateTimeVersion(params.id, req);
        if (params.isNew === 1 ||
            new Date(version.updatedTime).getTime() ===
                new Date(params.updatedTime).getTime()) {
            if (params.isNew === 1) {
                const isEditVersion = await this.versionSettingRepository.existEditingVersion(params.id, VersionSettingType_1.VersionSettingType.LEVEL_8_10, req);
                if (isEditVersion) {
                    return {
                        code: 403,
                        message: '編集中のバージョンが存在しているため新規作成できません。',
                    };
                }
                const versionPublic = await this.versionSettingRepository.checkVersionPublic(VersionSettingType_1.VersionSettingType.LEVEL_8_10, req);
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
                const versionSetting = await this.versionSettingRepository.saveDraftVersion(params, userId, params.isNew, FlagSkill_1.FlagSkill.HAVE_SKILL, transaction, req);
                await this.versionSettingRepository.saveDraftData(params, versionSetting[0].id, transaction, req);
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
    async cancelSetting(id, params, userId, req) {
        const version = await this.versionSettingRepository.findUpdateTimeVersion(id, req);
        if (new Date(version.updatedTime).getTime() ===
            new Date(params.updatedTime).getTime())
            return await this.versionSettingRepository.cancelSetting(id, userId, req);
        else
            throw new RuntimeException_1.RuntimeException('Date invalid', common_1.HttpStatus.CONFLICT);
    }
    async checkDatePublic(companyGroupCode, timeZone) {
        const datePublic = await this.versionSettingRepository.findDatePublic(companyGroupCode);
        if (moment(datePublic.publicDate).tz(timeZone).format('YYYY/M/D') ===
            moment().tz(timeZone).format('YYYY/M/D'))
            return true;
        return false;
    }
    async publicVersionSetting17(publicVersionSettingDto, req) {
        const versionSetting = await this.versionSettingRepository.findVersionSettingById(publicVersionSettingDto.versionId);
        if (!versionSetting) {
            throw new RuntimeException_1.RuntimeException('Version not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (publicVersionSettingDto.updatedTime &&
            publicVersionSettingDto.updatedTime !==
                versionSetting.updatedTime.toISOString()) {
            throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
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
        let startGoal;
        let endGoal;
        let startEvaluation;
        let endEvaluation;
        for (let index = 0; index < periods.length; index++) {
            if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalStart, periods[index].dateCreationGoalEnd, req.user.timeZone) ||
                (0, util_1.compareDatePeriod)(periods[index].dateEvaluationStart, periods[index].dateEvaluationEnd, req.user.timeZone)) {
                if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalStart, periods[index].dateCreationGoalEnd, req.user.timeZone)) {
                    startGoal = periods[index].dateCreationGoalStart;
                    endGoal = periods[index].dateCreationGoalEnd;
                }
                else if ((0, util_1.compareDatePeriod)(periods[index].dateEvaluationStart, periods[index].dateEvaluationEnd, req.user.timeZone)) {
                    startEvaluation = periods[index].dateEvaluationStart;
                    endEvaluation = periods[index].dateEvaluationEnd;
                }
                return {
                    code: common_1.HttpStatus.FORBIDDEN,
                    startGoal: startGoal,
                    endGoal: endGoal,
                    startEvaluation: startEvaluation,
                    endEvaluation: endEvaluation,
                };
            }
        }
        for (let index = 0; index < periods.length; index++) {
            const isGoalCreationTime = (0, util_1.compareDatePeriod)(periods[index].dateCreationGoalStart, periods[index].dateCreationGoalEnd, req.user.timeZone);
            const isEvaluationTime = (0, util_1.compareDatePeriod)(periods[index].dateEvaluationStart, periods[index].dateEvaluationEnd, req.user.timeZone);
            if (isGoalCreationTime || isEvaluationTime) {
                return {
                    code: 403,
                    startGoal: periods[index].dateCreationGoalStart,
                    endGoal: periods[index].dateCreationGoalEnd,
                    startEvaluation: periods[index].dateEvaluationStart,
                    endEvaluation: periods[index].dateEvaluationEnd,
                    isGoalCreationTime,
                    isEvaluationTime,
                };
            }
        }
        const maxVersion = (await this.versionSettingRepository.findMaxVersion(versionSetting.type, req)).version;
        const data = {
            status: publicVersionSettingDto.status,
            version: publicVersionSettingDto.version
                ? publicVersionSettingDto.version
                : maxVersion + 1,
            subVersion: 0,
            publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
            lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
        };
        await this.versionSettingRepository.publicVersionSetting(publicVersionSettingDto.versionId, publicVersionSettingDto.type, data, req.user.companyGroupCode);
        const result = Object.assign({}, publicVersionSettingDto);
        return result;
    }
    async saveDraftVersionSetting17(versionSettingDto, type, req) {
        var _a, _b, _c;
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
        versionSettingDto.user = req.user;
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
                versionSettingDto.companyGroupCode = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.companyGroupCode;
                const newVersionSetting = await this.versionSettingRepository.createVersionSetting17T(versionSettingDto, transaction);
                versionSettingDto.id = newVersionSetting.id;
                result = await this.bulkCreateSettingsToVersion(versionSettingDto, transaction);
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
            const updatedVersionSetting = await this.versionSettingRepository.getVersionUpdatedTime(versionSettingDto.id);
            versionSettingDto.updatedTime = updatedVersionSetting.updatedTime;
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    async savePublicVersionSetting17(versionSettingDto, req) {
        var _a;
        const versionSetting = await this.versionSettingRepository.getVersionSettingById(versionSettingDto.id, req);
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
                    code: 403,
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
        const httpCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        try {
            const maxVersion = (await this.versionSettingRepository.findMaxVersion(versionSettingDto.type, req)).version;
            versionSettingDto.version = maxVersion + 1;
            versionSettingDto.subVersion = 0;
            versionSettingDto.publicDate = (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone);
            versionSettingDto.companyGroupCode = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode;
            if (versionSettingDto.status === VersionSettingStatus_1.VersionSettingStatus.PUBLISHED) {
                versionSettingDto.id = null;
                const newVersionSetting = await this.versionSettingRepository.createVersionSetting17T(versionSettingDto, transaction);
                versionSettingDto.id = newVersionSetting.id;
                result = await this.bulkCreateSettingsToVersion(versionSettingDto, transaction);
            }
            else {
                if (versionSettingDto.updatedTime &&
                    versionSettingDto.updatedTime.toString() !==
                        versionSetting.updatedTime.toISOString()) {
                    throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
                }
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
    async bulkCreateSettingsToVersion(versionSettingDto, transaction) {
        const listSettingPointBasicDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingPointBasic).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointBasicDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProRepository.bulkCreate(listSettingPointBasicDto, transaction);
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
        const listSettingPointProDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingPointPro).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = versionSettingDto.id;
            el.versionId = versionSettingDto.id;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointProDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProRepository.bulkCreate(listSettingPointProDto, transaction);
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
        const listSettingPointBasicDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingPointBasic).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = el.versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointBasicDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProRepository.bulkDelete(versionSettingDto.id, SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.BASIC, transaction);
        await this.settingPointBasicBehaviorProRepository.bulkCreate(listSettingPointBasicDto, transaction);
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
        const listSettingPointProDto = [];
        (0, rxjs_1.from)(versionSettingDto.settingPointPro).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = el.versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointProDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProRepository.bulkDelete(versionSettingDto.id, SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.PRO, transaction);
        await this.settingPointBasicBehaviorProRepository.bulkCreate(listSettingPointProDto, transaction);
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
            tmp.skillPercent = el.skillPercent;
            tmp.behaviorPercent = el.behaviorPercent;
            tmp.achievementPercent = el.achievementPercent;
            listSettingLevellDto.push(tmp);
        });
        await this.settingLevelRepository.bulkDelete(versionSettingDto.id, transaction);
        await this.settingLevelRepository.bulkCreate(listSettingLevellDto, transaction);
        return versionSettingDto;
    }
    async batchUpdateSettingsToVersionCommon(versionSettingDto, transaction) {
        const listSettingProFormulaDto = [];
        let listSettingProFormulaSubDto = [];
        const formulaIds = [];
        (0, rxjs_1.from)(versionSettingDto.settingProFormula).subscribe((el) => {
            const tmp = new SettingProFormulaDto_1.SettingProFormulaDto();
            tmp.versionId = versionSettingDto.id;
            tmp.point = el.point;
            tmp.note = el.note;
            formulaIds.push(el.id);
            listSettingProFormulaSubDto = [];
            (0, rxjs_1.from)(el.settingProFormulaSub).subscribe((sub) => {
                const tmp2 = new SettingProFormulaSubDto_1.SettingProFormulaSubDto();
                tmp2.totalItem = sub.totalItem;
                tmp2.coefficient = sub.coefficient;
                listSettingProFormulaSubDto.push(tmp2);
            });
            tmp.settingProFormulaSub = listSettingProFormulaSubDto;
            listSettingProFormulaDto.push(tmp);
        });
        await this.settingProFormulaRepository.bulkDelete(versionSettingDto.id, transaction);
        await this.settingProFormulaRepository.bulkCreate(listSettingProFormulaDto, transaction);
        return versionSettingDto;
    }
    async savePublicOrPrivate(params, userId, req) {
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
                    const isEditVersion = await this.versionSettingRepository.existEditingVersion(params.id, VersionSettingType_1.VersionSettingType.LEVEL_8_10, req);
                    if (isEditVersion) {
                        await transaction.rollback();
                        return {
                            code: 403,
                            message: '編集中のバージョンが存在しているため新規作成できません。',
                        };
                    }
                }
                const versionPublic = await this.versionSettingRepository.checkVersionPublic(VersionSettingType_1.VersionSettingType.LEVEL_8_10, req);
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
                await this.versionSettingRepository.saveDraftData(params, versionSetting[0].id, transaction, req);
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
    async findMaxSubVersion(version, type, req) {
        return (await this.versionSettingRepository.findMaxSubVersion(version, type, req)).subVersion;
    }
    async cancelVersionSetting17(versionId, data, req) {
        const version = await this.versionSettingRepository.findUpdateTimeVersion(versionId, req);
        if (data.updatedTime &&
            version.updatedTime.toISOString() !== data.updatedTime) {
            throw new RuntimeException_1.RuntimeException('Date invalid', common_1.HttpStatus.CONFLICT);
        }
        delete data.updatedTime;
        await this.versionSettingRepository.updateVersionSetting(versionId, data, req);
        const result = await this.versionSettingRepository.findUpdateTimeVersion(versionId, req);
        return result;
    }
};
__decorate([
    (0, common_1.Inject)(versionSetting_repository_1.VersionSettingRepository),
    __metadata("design:type", Object)
], VersionSettingService.prototype, "versionSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingPointBasicBehaviorPro_repository_1.SettingPointBasicBehaviorProRepository),
    __metadata("design:type", settingPointBasicBehaviorPro_repository_1.SettingPointBasicBehaviorProRepository)
], VersionSettingService.prototype, "settingPointBasicBehaviorProRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingProFormula_repository_1.SettingProFormulaRepository),
    __metadata("design:type", settingProFormula_repository_1.SettingProFormulaRepository)
], VersionSettingService.prototype, "settingProFormulaRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingAchievementPersonal_repository_1.SettingAchievementPersonalRepository),
    __metadata("design:type", settingAchievementPersonal_repository_1.SettingAchievementPersonalRepository)
], VersionSettingService.prototype, "settingAchievementPersonalRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingAchievementAdditional_repository_1.SettingAchievementAdditionalRepository),
    __metadata("design:type", settingAchievementAdditional_repository_1.SettingAchievementAdditionalRepository)
], VersionSettingService.prototype, "settingAchievementAdditionalRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingLevel_repository_1.SettingLevelRepository),
    __metadata("design:type", settingLevel_repository_1.SettingLevelRepository)
], VersionSettingService.prototype, "settingLevelRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], VersionSettingService.prototype, "evaluationPeriodRepo", void 0);
__decorate([
    (0, common_1.Inject)(adminEvaluation_repository_1.AdminEvaluationRepository),
    __metadata("design:type", Object)
], VersionSettingService.prototype, "adminEvaluation", void 0);
VersionSettingService = __decorate([
    (0, common_1.Injectable)()
], VersionSettingService);
exports.VersionSettingService = VersionSettingService;
//# sourceMappingURL=versionSetting.service.js.map