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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionSettingRepository = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const sequelize_1 = require("sequelize");
const util_1 = require("../common/util");
const EntityConstant_1 = require("../constant/EntityConstant");
const SettingAchievementAdditional_1 = require("../entity/SettingAchievementAdditional");
const SettingProFormula_1 = require("../entity/SettingProFormula");
const SettingProFormulaSub_1 = require("../entity/SettingProFormulaSub");
const User_1 = require("../entity/User");
const TypeAchievement_1 = require("../enum/TypeAchievement");
const SettingPointBasicBehaviorProType_1 = require("../enum/SettingPointBasicBehaviorProType");
const VersionSettingStatus_1 = require("../enum/VersionSettingStatus");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const SettingAchievementAdditionalDto_1 = require("../model/generic/SettingAchievementAdditionalDto");
const SettingAchievementPersonalDto_1 = require("../model/generic/SettingAchievementPersonalDto");
const SettingPointBasicBehaviorProDto_1 = require("../model/generic/SettingPointBasicBehaviorProDto");
const SettingLevelDto_1 = require("../model/generic/SettingLevelDto");
const FlagSkill_1 = require("../enum/FlagSkill");
const VersionSettingType_1 = require("../enum/VersionSettingType");
let VersionSettingRepository = class VersionSettingRepository {
    async getListVersionSettingPaging(param, req) {
        var _a;
        const condition = {};
        if (param.type !== '-1') {
            condition.type = param.type;
        }
        if (param.status !== '-1') {
            condition.status = param.status;
        }
        condition.companyGroupCode = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode;
        return await this.versionSettingEntity.findAll({
            limit: param.limit,
            offset: param.offset,
            where: condition,
            attributes: [
                'id',
                'type',
                'version',
                'subVersion',
                'status',
                'reason',
                'basicMaxDifficulty',
                'behaviorMaxWeight',
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
    async countListVersionSetting(param, req) {
        var _a;
        const condition = {};
        if (param.type !== '-1') {
            condition.type = param.type;
        }
        if (param.status !== '-1') {
            condition.status = param.status;
        }
        condition.companyGroupCode = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode;
        return await this.versionSettingEntity.count({
            where: condition,
        });
    }
    async getVersionSettingById(versionSettingId, req) {
        var _a;
        return await this.versionSettingEntity.findOne({
            where: {
                id: versionSettingId,
                companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
            },
            include: [{ model: User_1.User, attributes: ['id', 'fullName'] }],
        });
    }
    async getVersionUpdatedTime(versionSettingId) {
        return await this.versionSettingEntity.findByPk(versionSettingId, {
            attributes: ['updatedTime'],
        });
    }
    async getListSettingProFormulaByVersionId(versionSettingId) {
        return await this.settingProFormulaEntity.findAll({
            where: { versionId: versionSettingId },
            include: [
                {
                    model: SettingProFormulaSub_1.SettingProFormulaSub,
                    order: [['totalItem', 'ASC']],
                    required: false,
                },
            ],
            order: [['point', 'DESC']],
        });
    }
    async getListSettingAchievementPersonalByVersionId(versionSettingId) {
        return await this.settingAchievementPersonalEntity.findAll({
            where: { versionId: versionSettingId },
            order: [['point', 'DESC']],
        });
    }
    async getNextVersion810(version, req) {
        var _a;
        const data = await this.versionSettingEntity.findOne({
            attributes: ['subVersion'],
            where: {
                [sequelize_1.Op.and]: [
                    { type: VersionSettingType_1.VersionSettingType.LEVEL_8_10 },
                    { version: version },
                    { companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
                ],
            },
            order: [['subVersion', 'desc']],
        });
        return { version: version, subVersion: data.subVersion };
    }
    async getNextVersion810NS(version, req) {
        var _a;
        const data = await this.versionSettingEntity.findOne({
            attributes: ['subVersion'],
            where: {
                [sequelize_1.Op.and]: [
                    { type: VersionSettingType_1.VersionSettingType.LEVEL_8_10_NS },
                    { version: version },
                    { companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
                ],
            },
            order: [['subVersion', 'desc']],
        });
        return { version: version, subVersion: data.subVersion };
    }
    getTypeVersionSettingBySkill810(skill) {
        if (skill === FlagSkill_1.FlagSkill.HAVE_SKILL) {
            return VersionSettingType_1.VersionSettingType.LEVEL_8_10;
        }
        else {
            return VersionSettingType_1.VersionSettingType.LEVEL_8_10_NS;
        }
    }
    getNumberValueBeforeSetting(point) {
        return point == '' || isNaN(point) ? null : point;
    }
    async saveDraftVersion(params, userId, isNew, isHaveSkill, transaction, req) {
        var _a, _b, _c, _d, _e;
        const { version, status, reason, data } = params;
        const { maxPoint, minPoint, maxPointDep, minPointDep, basicMaxDifficulty, behaviorMaxWeight, } = data;
        const versions = version.toString().split('.');
        let datas = await this.versionSettingEntity.findOrCreate({
            where: {
                version: Number(versions[0]),
                subVersion: Number(versions[1]),
                type: this.getTypeVersionSettingBySkill810(isHaveSkill),
                companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
            },
            defaults: {
                type: this.getTypeVersionSettingBySkill810(isHaveSkill),
                version: Number(versions[0]),
                subVersion: Number(versions[1]),
                status: status,
                reason: reason,
                creationUser: userId,
                maxPoint: this.getNumberValueBeforeSetting(maxPoint),
                minPoint: this.getNumberValueBeforeSetting(minPoint),
                maxPointDep: this.getNumberValueBeforeSetting(maxPointDep),
                minPointDep: this.getNumberValueBeforeSetting(minPointDep),
                basicMaxDifficulty: this.getNumberValueBeforeSetting(basicMaxDifficulty),
                behaviorMaxWeight: this.getNumberValueBeforeSetting(behaviorMaxWeight),
                companyGroupCode: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.companyGroupCode,
            },
            transaction: transaction,
        });
        if (isNew === 1 && datas[1] === false)
            datas = await this.versionSettingEntity.findOrCreate({
                where: {
                    version: Number(versions[0]),
                    subVersion: Number(versions[1]) + 1,
                    type: this.getTypeVersionSettingBySkill810(isHaveSkill),
                    companyGroupCode: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.companyGroupCode,
                },
                defaults: {
                    type: this.getTypeVersionSettingBySkill810(isHaveSkill),
                    version: Number(versions[0]),
                    subVersion: Number(versions[1]) + 1,
                    status: status,
                    creationUser: userId,
                    reason: reason,
                    lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
                    maxPoint: this.getNumberValueBeforeSetting(maxPoint),
                    minPoint: this.getNumberValueBeforeSetting(minPoint),
                    maxPointDep: this.getNumberValueBeforeSetting(maxPointDep),
                    minPointDep: this.getNumberValueBeforeSetting(minPointDep),
                    basicMaxDifficulty: this.getNumberValueBeforeSetting(basicMaxDifficulty),
                    behaviorMaxWeight: this.getNumberValueBeforeSetting(behaviorMaxWeight),
                    companyGroupCode: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.companyGroupCode,
                },
                transaction: transaction,
            });
        else
            await this.versionSettingEntity.update({
                creationUser: userId,
                reason: reason,
                lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
                maxPoint: this.getNumberValueBeforeSetting(maxPoint),
                minPoint: this.getNumberValueBeforeSetting(minPoint),
                maxPointDep: this.getNumberValueBeforeSetting(maxPointDep),
                minPointDep: this.getNumberValueBeforeSetting(minPointDep),
                basicMaxDifficulty: this.getNumberValueBeforeSetting(basicMaxDifficulty),
                behaviorMaxWeight: this.getNumberValueBeforeSetting(behaviorMaxWeight),
            }, {
                where: {
                    id: datas[0].id,
                    companyGroupCode: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.companyGroupCode,
                },
                transaction: transaction,
            });
        return datas;
    }
    async saveDraftData(params, versionId, transaction, req) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j, _k, e_4, _l, _m;
        const { data } = params;
        data.settingAchievementDepDiff = data.settingAchievementDepDiff.filter((item) => (item.point !== undefined || item.note !== undefined) &&
            (item.point !== null || item.note !== '') &&
            (item.point !== null || item.note !== undefined) &&
            (item.point !== undefined || item.note !== ''));
        data.settingAchievementDepJudgeIndex =
            data.settingAchievementDepJudgeIndex.filter((item) => (item.point !== undefined || item.note !== undefined) &&
                (item.point !== null || item.note !== '') &&
                (item.point !== null || item.note !== undefined) &&
                (item.point !== undefined || item.note !== ''));
        data.settingAchievementAdditionalDep =
            data.settingAchievementAdditionalDep.filter((item) => (item.point !== undefined ||
                item.note !== undefined ||
                item.rating !== undefined) &&
                (item.point !== undefined ||
                    item.note !== undefined ||
                    item.rating !== null) &&
                (item.point !== null ||
                    item.note !== '' ||
                    item.rating !== undefined) &&
                (item.point !== null || item.note !== '' || item.rating !== null) &&
                (item.point !== null ||
                    item.note !== undefined ||
                    item.rating !== undefined) &&
                (item.point !== null ||
                    item.note !== undefined ||
                    item.rating !== null) &&
                (item.point !== undefined ||
                    item.note !== '' ||
                    item.rating !== undefined) &&
                (item.point !== undefined ||
                    item.note !== '' ||
                    item.rating !== null));
        data.settingFormula810 = data.settingFormula810.filter((item) => (item.point !== undefined ||
            item.note !== undefined ||
            item.result !== undefined) &&
            (item.point !== undefined ||
                item.note !== undefined ||
                item.result !== null) &&
            (item.point !== null ||
                item.note !== '' ||
                item.result !== undefined) &&
            (item.point !== null || item.note !== '' || item.result !== null) &&
            (item.point !== null ||
                item.note !== undefined ||
                item.result !== undefined) &&
            (item.point !== null ||
                item.note !== undefined ||
                item.result !== null) &&
            (item.point !== undefined ||
                item.note !== '' ||
                item.result !== undefined) &&
            (item.point !== undefined || item.note !== '' || item.result !== null));
        const { settingAchievementDepDiff, settingAchievementDepJudgeIndex, settingAchievementAdditionalDep, settingFormula810, } = data;
        await this.settingAchievementPersonalEntity.destroy({
            where: {
                versionId: versionId,
                typeEvaluation: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
            },
            transaction: transaction,
        });
        await this.settingAchievementAdditionalEntity.destroy({
            where: { versionId: versionId, type: TypeAchievement_1.TypeAchievement.DEPARTMENT_810 },
            transaction: transaction,
        });
        await this.settingFormula810Entity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
        try {
            for (var _o = true, settingAchievementDepDiff_1 = __asyncValues(settingAchievementDepDiff), settingAchievementDepDiff_1_1; settingAchievementDepDiff_1_1 = await settingAchievementDepDiff_1.next(), _a = settingAchievementDepDiff_1_1.done, !_a;) {
                _c = settingAchievementDepDiff_1_1.value;
                _o = false;
                try {
                    const num = _c;
                    await this.settingAchievementPersonalEntity.create({
                        versionId: versionId,
                        type: 1,
                        point: !isNaN(num.point) ? num.point : null,
                        note: num.note,
                        typeEvaluation: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
                    }, { transaction: transaction });
                }
                finally {
                    _o = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_o && !_a && (_b = settingAchievementDepDiff_1.return)) await _b.call(settingAchievementDepDiff_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _p = true, settingAchievementDepJudgeIndex_1 = __asyncValues(settingAchievementDepJudgeIndex), settingAchievementDepJudgeIndex_1_1; settingAchievementDepJudgeIndex_1_1 = await settingAchievementDepJudgeIndex_1.next(), _d = settingAchievementDepJudgeIndex_1_1.done, !_d;) {
                _f = settingAchievementDepJudgeIndex_1_1.value;
                _p = false;
                try {
                    const num = _f;
                    await this.settingAchievementPersonalEntity.create({
                        versionId: versionId,
                        type: 2,
                        point: !isNaN(num.point) && num.point !== '' ? num.point : null,
                        note: num.note,
                        typeEvaluation: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
                    }, { transaction: transaction });
                }
                finally {
                    _p = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_p && !_d && (_e = settingAchievementDepJudgeIndex_1.return)) await _e.call(settingAchievementDepJudgeIndex_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _q = true, settingAchievementAdditionalDep_1 = __asyncValues(settingAchievementAdditionalDep), settingAchievementAdditionalDep_1_1; settingAchievementAdditionalDep_1_1 = await settingAchievementAdditionalDep_1.next(), _g = settingAchievementAdditionalDep_1_1.done, !_g;) {
                _j = settingAchievementAdditionalDep_1_1.value;
                _q = false;
                try {
                    const e = _j;
                    await this.settingAchievementAdditionalEntity.create({
                        versionId: versionId,
                        rating: e.rating,
                        point: !isNaN(e.point) && e.point !== '' ? e.point : null,
                        note: e.note,
                        type: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
                    }, { transaction: transaction });
                }
                finally {
                    _q = true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_q && !_g && (_h = settingAchievementAdditionalDep_1.return)) await _h.call(settingAchievementAdditionalDep_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _r = true, settingFormula810_1 = __asyncValues(settingFormula810), settingFormula810_1_1; settingFormula810_1_1 = await settingFormula810_1.next(), _k = settingFormula810_1_1.done, !_k;) {
                _m = settingFormula810_1_1.value;
                _r = false;
                try {
                    const e = _m;
                    await this.settingFormula810Entity.create({
                        versionId: versionId,
                        result: e.result,
                        point: !isNaN(e.point) && e.point !== '' ? e.point : null,
                        note: e.note,
                    }, { transaction: transaction });
                }
                finally {
                    _r = true;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_r && !_k && (_l = settingFormula810_1.return)) await _l.call(settingFormula810_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        const { settingPointBasic, settingPointPro, settingProFormula, settingPointBehavior, settingAchievementPersonalDiff, settingAchievementPersonalJudgeIndex, settingAchievementAdditional, settingLevel, } = data;
        const listSettingPointBasicDto = [];
        (0, rxjs_1.from)(settingPointBasic).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointBasicDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProEntity.destroy({
            where: {
                versionId: versionId,
                type: SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.BASIC,
            },
            transaction: transaction,
        });
        await this.settingPointBasicBehaviorProEntity.bulkCreate(listSettingPointBasicDto, { transaction: transaction });
        const listSettingPointProDto = [];
        (0, rxjs_1.from)(settingPointPro).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointProDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProEntity.destroy({
            where: {
                versionId: versionId,
                type: SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.PRO,
            },
            transaction: transaction,
        });
        await this.settingPointBasicBehaviorProEntity.bulkCreate(listSettingPointProDto, { transaction: transaction });
        const listSettingPointBehaviorDto = [];
        (0, rxjs_1.from)(settingPointBehavior).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointBehaviorDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProEntity.destroy({
            where: {
                versionId: versionId,
                type: SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.BEHAVIOR,
            },
            transaction: transaction,
        });
        await this.settingPointBasicBehaviorProEntity.bulkCreate(listSettingPointBehaviorDto, { transaction: transaction });
        const listSettingAchievementPersonalDto = [];
        (0, rxjs_1.from)(settingAchievementPersonalDiff).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            listSettingAchievementPersonalDto.push(tmp);
        });
        (0, rxjs_1.from)(settingAchievementPersonalJudgeIndex).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            tmp.description = el.description;
            listSettingAchievementPersonalDto.push(tmp);
        });
        await this.settingAchievementPersonalEntity.destroy({
            where: {
                versionId: versionId,
                typeEvaluation: TypeAchievement_1.TypeAchievement.PERSONAL_810,
            },
            transaction: transaction,
        });
        await this.settingAchievementPersonalEntity.bulkCreate(listSettingAchievementPersonalDto, {
            transaction: transaction,
        });
        const listSettingAchievementAdditionalDto = [];
        (0, rxjs_1.from)(settingAchievementAdditional).subscribe((el) => {
            const tmp = new SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto();
            tmp.versionId = versionId;
            tmp.rating = el.rating;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.type = el.type;
            listSettingAchievementAdditionalDto.push(tmp);
        });
        await this.settingAchievementAdditionalEntity.destroy({
            where: { versionId: versionId, type: TypeAchievement_1.TypeAchievement.PERSONAL_810 },
            transaction: transaction,
        });
        await this.settingAchievementAdditionalEntity.bulkCreate(listSettingAchievementAdditionalDto, {
            transaction: transaction,
        });
        const listSettingLevellDto = [];
        (0, rxjs_1.from)(settingLevel).subscribe((el) => {
            const tmp = new SettingLevelDto_1.SettingLevelDto();
            tmp.versionId = versionId;
            tmp.level = el.level;
            tmp.skillPercent = el.skillPercent;
            tmp.behaviorPercent = el.behaviorPercent;
            tmp.achievementPercent = el.achievementPercent;
            listSettingLevellDto.push(tmp);
        });
        await this.settingLevelEntity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
        await this.settingLevelEntity.bulkCreate(listSettingLevellDto, {
            transaction: transaction,
        });
        return 1;
    }
    async saveDraftNSData(params, versionId, transaction) {
        var _a, e_5, _b, _c, _d, e_6, _e, _f, _g, e_7, _h, _j, _k, e_8, _l, _m;
        const { data } = params;
        data.settingAchievementDepDiff = data.settingAchievementDepDiff.filter((item) => (item.point !== undefined || item.note !== undefined) &&
            (item.point !== null || item.note !== '') &&
            (item.point !== null || item.note !== undefined) &&
            (item.point !== undefined || item.note !== ''));
        data.settingAchievementDepJudgeIndex =
            data.settingAchievementDepJudgeIndex.filter((item) => (item.point !== undefined || item.note !== undefined) &&
                (item.point !== null || item.note !== '') &&
                (item.point !== null || item.note !== undefined) &&
                (item.point !== undefined || item.note !== ''));
        data.settingAchievementAdditionalDep =
            data.settingAchievementAdditionalDep.filter((item) => (item.point !== undefined ||
                item.note !== undefined ||
                item.rating !== undefined) &&
                (item.point !== undefined ||
                    item.note !== undefined ||
                    item.rating !== null) &&
                (item.point !== null ||
                    item.note !== '' ||
                    item.rating !== undefined) &&
                (item.point !== null || item.note !== '' || item.rating !== null) &&
                (item.point !== null ||
                    item.note !== undefined ||
                    item.rating !== undefined) &&
                (item.point !== null ||
                    item.note !== undefined ||
                    item.rating !== null) &&
                (item.point !== undefined ||
                    item.note !== '' ||
                    item.rating !== undefined) &&
                (item.point !== undefined ||
                    item.note !== '' ||
                    item.rating !== null));
        data.settingFormula810 = data.settingFormula810.filter((item) => (item.point !== undefined ||
            item.note !== undefined ||
            item.result !== undefined) &&
            (item.point !== undefined ||
                item.note !== undefined ||
                item.result !== null) &&
            (item.point !== null ||
                item.note !== '' ||
                item.result !== undefined) &&
            (item.point !== null || item.note !== '' || item.result !== null) &&
            (item.point !== null ||
                item.note !== undefined ||
                item.result !== undefined) &&
            (item.point !== null ||
                item.note !== undefined ||
                item.result !== null) &&
            (item.point !== undefined ||
                item.note !== '' ||
                item.result !== undefined) &&
            (item.point !== undefined || item.note !== '' || item.result !== null));
        const { settingAchievementDepDiff, settingAchievementDepJudgeIndex, settingAchievementAdditionalDep, settingFormula810, } = data;
        await this.settingAchievementPersonalEntity.destroy({
            where: {
                versionId: versionId,
                typeEvaluation: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
            },
            transaction: transaction,
        });
        await this.settingAchievementAdditionalEntity.destroy({
            where: { versionId: versionId, type: TypeAchievement_1.TypeAchievement.DEPARTMENT_810 },
            transaction: transaction,
        });
        await this.settingFormula810Entity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
        try {
            for (var _o = true, settingAchievementDepDiff_2 = __asyncValues(settingAchievementDepDiff), settingAchievementDepDiff_2_1; settingAchievementDepDiff_2_1 = await settingAchievementDepDiff_2.next(), _a = settingAchievementDepDiff_2_1.done, !_a;) {
                _c = settingAchievementDepDiff_2_1.value;
                _o = false;
                try {
                    const num = _c;
                    await this.settingAchievementPersonalEntity.create({
                        versionId: versionId,
                        type: 1,
                        point: !isNaN(num.point) ? num.point : null,
                        note: num.note,
                        typeEvaluation: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
                    }, { transaction: transaction });
                }
                finally {
                    _o = true;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (!_o && !_a && (_b = settingAchievementDepDiff_2.return)) await _b.call(settingAchievementDepDiff_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        try {
            for (var _p = true, settingAchievementDepJudgeIndex_2 = __asyncValues(settingAchievementDepJudgeIndex), settingAchievementDepJudgeIndex_2_1; settingAchievementDepJudgeIndex_2_1 = await settingAchievementDepJudgeIndex_2.next(), _d = settingAchievementDepJudgeIndex_2_1.done, !_d;) {
                _f = settingAchievementDepJudgeIndex_2_1.value;
                _p = false;
                try {
                    const num = _f;
                    await this.settingAchievementPersonalEntity.create({
                        versionId: versionId,
                        type: 2,
                        point: !isNaN(num.point) && num.point !== '' ? num.point : null,
                        note: num.note,
                        typeEvaluation: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
                    }, { transaction: transaction });
                }
                finally {
                    _p = true;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (!_p && !_d && (_e = settingAchievementDepJudgeIndex_2.return)) await _e.call(settingAchievementDepJudgeIndex_2);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            for (var _q = true, settingAchievementAdditionalDep_2 = __asyncValues(settingAchievementAdditionalDep), settingAchievementAdditionalDep_2_1; settingAchievementAdditionalDep_2_1 = await settingAchievementAdditionalDep_2.next(), _g = settingAchievementAdditionalDep_2_1.done, !_g;) {
                _j = settingAchievementAdditionalDep_2_1.value;
                _q = false;
                try {
                    const e = _j;
                    await this.settingAchievementAdditionalEntity.create({
                        versionId: versionId,
                        rating: e.rating,
                        point: !isNaN(e.point) && e.point !== '' ? e.point : null,
                        note: e.note,
                        type: TypeAchievement_1.TypeAchievement.DEPARTMENT_810,
                    }, { transaction: transaction });
                }
                finally {
                    _q = true;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (!_q && !_g && (_h = settingAchievementAdditionalDep_2.return)) await _h.call(settingAchievementAdditionalDep_2);
            }
            finally { if (e_7) throw e_7.error; }
        }
        try {
            for (var _r = true, settingFormula810_2 = __asyncValues(settingFormula810), settingFormula810_2_1; settingFormula810_2_1 = await settingFormula810_2.next(), _k = settingFormula810_2_1.done, !_k;) {
                _m = settingFormula810_2_1.value;
                _r = false;
                try {
                    const e = _m;
                    await this.settingFormula810Entity.create({
                        versionId: versionId,
                        result: e.result,
                        point: !isNaN(e.point) && e.point !== '' ? e.point : null,
                        note: e.note,
                    }, { transaction: transaction });
                }
                finally {
                    _r = true;
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (!_r && !_k && (_l = settingFormula810_2.return)) await _l.call(settingFormula810_2);
            }
            finally { if (e_8) throw e_8.error; }
        }
        const { settingPointBehavior, settingAchievementPersonalDiff, settingAchievementPersonalJudgeIndex, settingAchievementAdditional, settingLevel, } = data;
        const listSettingPointBehaviorDto = [];
        (0, rxjs_1.from)(settingPointBehavior).subscribe((el) => {
            const tmp = new SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            listSettingPointBehaviorDto.push(tmp);
        });
        await this.settingPointBasicBehaviorProEntity.destroy({
            where: {
                versionId: versionId,
                type: SettingPointBasicBehaviorProType_1.SettingPointBasicBehaviorProType.BEHAVIOR,
            },
            transaction: transaction,
        });
        await this.settingPointBasicBehaviorProEntity.bulkCreate(listSettingPointBehaviorDto, { transaction: transaction });
        const listSettingAchievementPersonalDto = [];
        (0, rxjs_1.from)(settingAchievementPersonalDiff).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            listSettingAchievementPersonalDto.push(tmp);
        });
        (0, rxjs_1.from)(settingAchievementPersonalJudgeIndex).subscribe((el) => {
            const tmp = new SettingAchievementPersonalDto_1.SettingAchievementPersonalDto();
            tmp.versionId = versionId;
            tmp.type = el.type;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.typeEvaluation = el.typeEvaluation;
            tmp.description = el.description;
            listSettingAchievementPersonalDto.push(tmp);
        });
        await this.settingAchievementPersonalEntity.destroy({
            where: {
                versionId: versionId,
                typeEvaluation: TypeAchievement_1.TypeAchievement.PERSONAL_810,
            },
            transaction: transaction,
        });
        await this.settingAchievementPersonalEntity.bulkCreate(listSettingAchievementPersonalDto, {
            transaction: transaction,
        });
        const listSettingAchievementAdditionalDto = [];
        (0, rxjs_1.from)(settingAchievementAdditional).subscribe((el) => {
            const tmp = new SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto();
            tmp.versionId = versionId;
            tmp.rating = el.rating;
            tmp.point = el.point;
            tmp.note = el.note;
            tmp.type = el.type;
            listSettingAchievementAdditionalDto.push(tmp);
        });
        await this.settingAchievementAdditionalEntity.destroy({
            where: { versionId: versionId, type: TypeAchievement_1.TypeAchievement.PERSONAL_810 },
            transaction: transaction,
        });
        await this.settingAchievementAdditionalEntity.bulkCreate(listSettingAchievementAdditionalDto, {
            transaction: transaction,
        });
        const listSettingLevellDto = [];
        (0, rxjs_1.from)(settingLevel).subscribe((el) => {
            const tmp = new SettingLevelDto_1.SettingLevelDto();
            tmp.versionId = versionId;
            tmp.level = el.level;
            tmp.skillPercent = el.skillPercent;
            tmp.behaviorPercent = el.behaviorPercent;
            tmp.achievementPercent = el.achievementPercent;
            listSettingLevellDto.push(tmp);
        });
        await this.settingLevelEntity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
        await this.settingLevelEntity.bulkCreate(listSettingLevellDto, {
            transaction: transaction,
        });
        return 1;
    }
    async cancelSetting(id, _userId, req) {
        var _a;
        return await this.versionSettingEntity.update({
            status: 2,
        }, { where: { id: id, companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode } });
    }
    async listPointSetting(companyGroupCode) {
        return await this.versionSettingEntity.findOne({
            where: {
                status: 4,
                type: 1,
                companyGroupCode: companyGroupCode,
            },
            include: [{ model: SettingProFormula_1.SettingProFormula, as: 'settingProFormula' }],
            order: [
                [
                    { model: SettingProFormula_1.SettingProFormula, as: 'settingProFormula' },
                    'point',
                    'DESC',
                ],
            ],
        });
    }
    async listPointSettingByType(type, companyGroupCode) {
        return await this.versionSettingEntity.findOne({
            where: {
                status: 4,
                type: type,
                companyGroupCode: companyGroupCode,
            },
            include: [{ model: SettingProFormula_1.SettingProFormula, as: 'settingProFormula' }],
            order: [
                [
                    { model: SettingProFormula_1.SettingProFormula, as: 'settingProFormula' },
                    'point',
                    'DESC',
                ],
            ],
        });
    }
    async findMaxVersion(type, req) {
        var _a;
        return await this.versionSettingEntity.findOne({
            attributes: [[sequelize_1.Sequelize.fn('max', sequelize_1.Sequelize.col('version')), 'version']],
            where: { type: type, companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
        });
    }
    async findMaxSubVersion(version, type, req) {
        var _a;
        return await this.versionSettingEntity.findOne({
            attributes: [
                [sequelize_1.Sequelize.fn('max', sequelize_1.Sequelize.col('sub_version')), 'subVersion'],
            ],
            where: {
                version: version,
                type: type,
                companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
            },
        });
    }
    async findVersionSettingById(versionId) {
        return await this.versionSettingEntity.findByPk(versionId);
    }
    async publicVersionSetting(versionId, type, data, companyGroupCode) {
        const t = await this.versionSettingEntity.sequelize.transaction();
        try {
            await this.versionSettingEntity.update(data, {
                where: { id: versionId },
                transaction: t,
            });
            await this.versionSettingEntity.update({ status: VersionSettingStatus_1.VersionSettingStatus.PRIVATE, publicDate: null }, {
                where: {
                    id: {
                        [sequelize_1.Op.ne]: versionId,
                    },
                    type: type,
                    status: VersionSettingStatus_1.VersionSettingStatus.PUBLISHED,
                    companyGroupCode: companyGroupCode,
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
    async findOneSetting(where) {
        return await this.settingLevelEntity.findOne({ where: where });
    }
    async createVersionSetting17T(data, t) {
        const result = await this.versionSettingEntity.create(data, {
            transaction: t,
        });
        return result;
    }
    async updateVersionSettingT(data, t) {
        return await this.versionSettingEntity.update(data, {
            where: { id: data.id },
            transaction: t,
        });
    }
    async updateVersionSetting(versionId, data, req) {
        var _a;
        return await this.versionSettingEntity.update(data, {
            where: { id: versionId, companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
        });
    }
    async getNewTransaction() {
        return await this.versionSettingEntity.sequelize.transaction();
    }
    async checkVersionPublic(type, req) {
        var _a;
        return await this.versionSettingEntity.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { status: 4 },
                    { type },
                    {
                        companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
                    },
                ],
            },
        });
    }
    async savePublicOrPrivate(params, userId, transaction, req) {
        var _a, _b, _c, _d, _e, _f;
        const { type, status, reason, version, isUpdate } = params;
        const { maxPoint, minPoint, maxPointDep, minPointDep, basicMaxDifficulty, behaviorMaxWeight, } = params.data;
        const versions = version.toString().split('.');
        const datas = await this.versionSettingEntity.findOrCreate({
            where: {
                version: Number(versions[0]),
                subVersion: Number(versions[1]),
                type,
                companyGroupCode: req.user.companyGroupCode,
            },
            defaults: {
                type,
                version: Number(versions[0]),
                subVersion: Number(versions[1]),
                status: 3,
                reason: reason,
                creationUser: userId,
                basicMaxDifficulty,
                behaviorMaxWeight,
                maxPoint: maxPoint,
                minPoint: minPoint,
                maxPointDep: maxPointDep,
                minPointDep: minPointDep,
                companyGroupCode: req.user.companyGroupCode,
            },
            transaction: transaction,
        });
        if (status === 4) {
            await this.versionSettingEntity.update({ status: 3, publicDate: null }, {
                where: {
                    type,
                    status: 4,
                    companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
                },
                transaction: transaction,
            });
            const versionMax = await this.versionSettingEntity.findOne({
                where: { type, companyGroupCode: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.companyGroupCode },
                order: [['version', 'desc']],
            });
            await this.versionSettingEntity.update({
                reason: reason,
                status: status,
                publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
                lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
                version: versionMax.version + 1,
                subVersion: 0,
                basicMaxDifficulty,
                behaviorMaxWeight,
                maxPoint: maxPoint,
                minPoint: minPoint,
                maxPointDep: maxPointDep,
                minPointDep: minPointDep,
            }, {
                where: {
                    [sequelize_1.Op.and]: [
                        { id: datas[0].id },
                        { subVersion: { [sequelize_1.Op.notIn]: [0] } },
                        { companyGroupCode: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.companyGroupCode },
                    ],
                },
                transaction: transaction,
            });
            await this.versionSettingEntity.update({
                status: status,
                reason: reason,
                publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
                lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
                subVersion: 0,
                basicMaxDifficulty,
                behaviorMaxWeight,
                maxPoint: maxPoint,
                minPoint: minPoint,
                maxPointDep: maxPointDep,
                minPointDep: minPointDep,
            }, {
                where: {
                    [sequelize_1.Op.and]: [
                        { id: datas[0].id },
                        { subVersion: 0 },
                        { companyGroupCode: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.companyGroupCode },
                    ],
                },
                transaction: transaction,
            });
        }
        else {
            await this.versionSettingEntity.update({
                status: status,
                reason: reason,
                basicMaxDifficulty,
                behaviorMaxWeight,
                maxPoint: maxPoint,
                minPoint: minPoint,
                maxPointDep: maxPointDep,
                minPointDep: minPointDep,
            }, {
                where: {
                    id: datas[0].id,
                    companyGroupCode: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.companyGroupCode,
                },
                transaction: transaction,
            });
        }
        if (isUpdate) {
            await this.versionSettingEntity.update({
                creationUser: userId,
                lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', req.user.timeZone),
            }, {
                where: {
                    id: datas[0].id,
                    companyGroupCode: (_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f.companyGroupCode,
                },
                transaction: transaction,
            });
        }
        return datas;
    }
    async findDatePublic(companyGroupCode) {
        return await this.versionSettingEntity.findOne({
            attributes: ['publicDate'],
            where: { type: 2, status: 4, companyGroupCode: companyGroupCode },
        });
    }
    async findUpdateTimeVersion(id, req, t) {
        var _a;
        return await this.versionSettingEntity.findOne({
            where: { id: id, companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
            include: [{ model: User_1.User, as: 'user' }],
            transaction: t,
        });
    }
    async findEditVersion() {
        const editVersion = await this.versionSettingEntity.findOne({
            where: { type: VersionSettingType_1.VersionSettingType.LEVEL_8_10, status: 1 },
        });
        return editVersion ? true : false;
    }
    async unPublicVersionSetting(idException, type, transaction, req) {
        var _a;
        await this.versionSettingEntity.update({ status: VersionSettingStatus_1.VersionSettingStatus.PRIVATE, publicDate: null }, {
            where: {
                id: {
                    [sequelize_1.Op.ne]: idException,
                },
                type: type,
                status: VersionSettingStatus_1.VersionSettingStatus.PUBLISHED,
                companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
            },
            transaction: transaction,
        });
        return true;
    }
    async existEditingVersion(versionId, type, req) {
        var _a;
        let versionIdStatement = '';
        const condition = {};
        if (versionId) {
            versionIdStatement = ' AND id!=:versionId';
            condition['versionId'] = versionId;
        }
        condition['type'] = type;
        condition['companyGroupCode'] = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode;
        const querys = await this.settingLevelEntity.sequelize.query(`SELECT EXISTS(SELECT 1 FROM version_setting_tbl WHERE status=1 AND type=:type${versionIdStatement} AND company_group_code=:companyGroupCode)`, {
            replacements: condition,
        });
        const hasResult = querys[0][0]['exists'];
        return hasResult;
    }
    async isMainVersionPublic(version, type, req) {
        var _a;
        const querys = await this.versionSettingEntity.sequelize.query(`SELECT EXISTS(SELECT 1 FROM version_setting_tbl WHERE version= :version AND sub_version=0 AND status=4 AND type= :type AND company_group_code=:companyGroupCode)`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                version: version,
                type: type,
                companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
            },
        });
        const hasResult = querys[0]['exists'];
        return hasResult;
    }
    async listPointSettingCron(companyGroupCode) {
        return await this.versionSettingEntity.findAll({
            where: {
                status: 4,
                companyGroupCode: companyGroupCode,
            },
            include: [{ model: SettingProFormula_1.SettingProFormula, as: 'settingProFormula' }],
            order: [
                [
                    { model: SettingProFormula_1.SettingProFormula, as: 'settingProFormula' },
                    'point',
                    'DESC',
                ],
            ],
        });
    }
    async getVersionSrtting17(flagSkill, companyGroupCode) {
        return await this.versionSettingEntity.findOne({
            where: {
                type: flagSkill === 1 ? 1 : 3,
                status: 4,
                companyGroupCode: companyGroupCode,
            },
            attributes: ['maxPoint', 'minPoint'],
            include: [
                {
                    model: SettingAchievementAdditional_1.SettingAchievementAdditional,
                    as: 'settingAchievementAdditional',
                    attributes: ['id', 'versionId', 'rating', 'point', 'note'],
                },
            ],
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_SETTING),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "versionSettingEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_FORMULA_8_10),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "settingFormula810Entity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_POINT_BASIC_BEHAVIOR_PRO),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "settingPointBasicBehaviorProEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_PRO_FORMULA),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "settingProFormulaEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_LEVEL),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "settingLevelEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "settingAchievementPersonalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_ADDITIONAL),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "settingAchievementAdditionalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], VersionSettingRepository.prototype, "userEntity", void 0);
VersionSettingRepository = __decorate([
    (0, common_1.Injectable)()
], VersionSettingRepository);
exports.VersionSettingRepository = VersionSettingRepository;
//# sourceMappingURL=versionSetting.repository.js.map