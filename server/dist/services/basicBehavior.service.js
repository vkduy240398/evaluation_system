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
exports.BasicBehaviorServices = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("../common/util");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const basicBehavior_repository_1 = require("../repository/basicBehavior.repository");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const mail_service_1 = require("./mail.service");
const versionSetting_repository_1 = require("../repository/versionSetting.repository");
const sequelize_1 = require("sequelize");
const moment = require("moment");
let BasicBehaviorServices = class BasicBehaviorServices {
    async searchListBasicBehavior(params) {
        var _a;
        const results = await this.basicBehaviorRepo.listBasicBehavior(params);
        const counts = results.total;
        const datas = results.data;
        const arrays = [];
        for (let index = 0; index < datas.length; index++) {
            let statusName = '';
            if (datas[index].status === 1) {
                statusName = '編集中';
            }
            else if (datas[index].status === 2) {
                statusName = '取消';
            }
            else if (datas[index].status === 3) {
                statusName = '非公開';
            }
            else if (datas[index].status === 4) {
                statusName = '公開中';
            }
            arrays.push({
                key: datas[index].id,
                level: this.displayLevel(datas[index].type, datas[index].level),
                versionNo: datas[index].version + '.' + datas[index].subVersion,
                state: statusName,
                updatedBy: (_a = datas[index].user) === null || _a === void 0 ? void 0 : _a.fullName,
                updatedAt: datas[index].updatedTime,
                releasedDate: datas[index].publicDate,
                status: datas[index].status,
                type: datas[index].type,
                lastUpdatedTime: datas[index].lastUpdatedTime,
            });
        }
        return {
            dataSources: arrays,
            counts,
        };
    }
    displayLevel(type, level) {
        if (type == 1) {
            return '1 ～ 7等級';
        }
        else if (type == 4) {
            return '8 ～ 10等級';
        }
        else {
            return level;
        }
    }
    async getInformationCriteria(id, isEdit, companyGroupCode) {
        var _a;
        const datas = await this.basicBehaviorRepo.inforCriteria(id);
        let type;
        if (datas.length > 0) {
            const listPoints = [];
            if (isEdit === 'true') {
                if (datas[0].versionBasicBehavior.level === null) {
                    if (datas[0].versionBasicBehavior.type === 1) {
                        type = 1;
                    }
                    else if (datas[0].versionBasicBehavior.type === 4) {
                        type = 2;
                    }
                    const listPointBasics = await this.versionSettingRepository.listPointSettingByType(type, companyGroupCode);
                    if (listPointBasics) {
                        for (let index = 1; index <= listPointBasics.basicMaxDifficulty; index++) {
                            listPoints.push({
                                value: index,
                                label: index,
                            });
                        }
                    }
                }
                else {
                    if (datas[0].versionBasicBehavior.type === 2) {
                        type = 1;
                    }
                    else if (datas[0].versionBasicBehavior.type === 3) {
                        type = 3;
                    }
                    else if (datas[0].versionBasicBehavior.type === 5) {
                        type = 2;
                    }
                    else if (datas[0].versionBasicBehavior.type === 6) {
                        type = 4;
                    }
                    const listPointBehavior = await this.versionSettingRepository.listPointSettingByType(type, companyGroupCode);
                    if (listPointBehavior) {
                        for (let index = 1; index <= listPointBehavior.behaviorMaxWeight; index++) {
                            listPoints.push({
                                value: index,
                                label: index,
                            });
                        }
                    }
                }
            }
            const maxVersion = await this.basicBehaviorRepo.maxSubVersion({
                version: datas[0].versionBasicBehavior.version,
                type: datas[0].versionBasicBehavior.type,
                level: datas[0].versionBasicBehavior.level,
                companyGroupCode: companyGroupCode,
            });
            const editAlreadys = await this.basicBehaviorRepo.findAllByCondition({
                [sequelize_1.Op.and]: [
                    { type: datas[0].versionBasicBehavior.type },
                    { level: datas[0].versionBasicBehavior.level },
                    { status: 1 },
                    {
                        id: { [sequelize_1.Op.notIn]: [id] },
                    },
                    { companyGroupCode: companyGroupCode },
                ],
            });
            const results = datas.reduce((acc, curr) => {
                var _a, _b;
                const index = acc.find((v) => v.versionId === curr.versionId);
                const childrens = {
                    id: Math.random().toString(36).slice(4),
                    versionId: curr.versionId,
                    title: curr.title,
                    content: curr.content,
                    difficulty: curr.difficulty,
                };
                let statusName = '';
                if (curr.versionBasicBehavior.status === 1) {
                    statusName = '編集中';
                }
                else if (curr.versionBasicBehavior.status === 2) {
                    statusName = '取消';
                }
                else if (curr.versionBasicBehavior.status === 3) {
                    statusName = '非公開';
                }
                else if (curr.versionBasicBehavior.status === 4) {
                    statusName = '公開中';
                }
                if (!index) {
                    acc.push({
                        id: curr.versionBasicBehavior.id,
                        versionId: curr.versionId,
                        createdTime: (0, util_1.isFormatDate)(curr.versionBasicBehavior.createdTime, 'YYYY/M/D'),
                        creationUser: curr.versionBasicBehavior.creationUser,
                        publicDate: curr.versionBasicBehavior.publicDate,
                        reason: curr.versionBasicBehavior.reason,
                        status: curr.versionBasicBehavior.status,
                        subVersion: curr.versionBasicBehavior.subVersion,
                        type: curr.versionBasicBehavior.type,
                        updatedTime: curr.versionBasicBehavior.updatedTime,
                        lastUpdatedTime: curr.versionBasicBehavior.lastUpdatedTime,
                        statusName: statusName,
                        updatedBy: ((_b = (_a = curr.versionBasicBehavior) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.fullName) || '',
                        version: curr.versionBasicBehavior.version,
                        timer: curr.versionBasicBehavior.updatedTime,
                        level: this.displayLevel(curr.versionBasicBehavior.type, curr.versionBasicBehavior.level),
                        children: [childrens],
                    });
                }
                else {
                    index.children.push(childrens);
                }
                return acc;
            }, []);
            return {
                data: results[0],
                subVersion: maxVersion,
                listPoints: listPoints,
                edited: editAlreadys.length > 0,
            };
        }
        else {
            const arraySteps = await this.basicBehaviorRepo.inforCriteriaStep(id);
            const editAlreadys = await this.basicBehaviorRepo.findAllByCondition({
                [sequelize_1.Op.and]: [
                    { type: arraySteps.type },
                    { level: arraySteps.level },
                    { status: 1 },
                    {
                        id: { [sequelize_1.Op.notIn]: [parseInt(id.toString())] },
                    },
                    { companyGroupCode: companyGroupCode },
                ],
            });
            const listPoints = [];
            if (isEdit === 'true') {
                if (arraySteps.level === null) {
                    if (arraySteps.type === 1) {
                        type = 1;
                    }
                    else if (arraySteps.type === 4) {
                        type = 2;
                    }
                    const listPointBasics = await this.versionSettingRepository.listPointSettingByType(type, companyGroupCode);
                    if (listPointBasics) {
                        for (let index = 1; index <= listPointBasics.basicMaxDifficulty; index++) {
                            listPoints.push({
                                value: index,
                                label: index,
                            });
                        }
                    }
                }
                else {
                    if (arraySteps.type === 2) {
                        type = 1;
                    }
                    else if (arraySteps.type === 3) {
                        type = 3;
                    }
                    else if (arraySteps.type === 5) {
                        type = 2;
                    }
                    else if (arraySteps.type === 6) {
                        type = 4;
                    }
                    const listPointBehavior = await this.versionSettingRepository.listPointSettingByType(type, companyGroupCode);
                    if (listPointBehavior) {
                        for (let index = 1; index <= listPointBehavior.behaviorMaxWeight; index++) {
                            listPoints.push({
                                value: index,
                                label: index,
                            });
                        }
                    }
                }
            }
            const maxVersion = await this.basicBehaviorRepo.maxSubVersion({
                version: arraySteps.version,
                type: arraySteps.type,
                level: arraySteps.level,
                companyGroupCode: companyGroupCode,
            });
            const results = [];
            let statusName = '';
            if (arraySteps.status === 1) {
                statusName = '編集中';
            }
            else if (arraySteps.status === 2) {
                statusName = '取消';
            }
            else {
                statusName = '編集済み';
            }
            results.push({
                id: arraySteps.id,
                versionId: arraySteps.id,
                createdTime: (0, util_1.isFormatDate)(arraySteps.createdTime, 'YYYY/M/D'),
                creationUser: arraySteps.creationUser,
                publicDate: arraySteps.publicDate,
                reason: arraySteps.reason,
                status: arraySteps.status,
                subVersion: arraySteps.subVersion,
                type: arraySteps.type,
                updatedTime: (0, util_1.isFormatDate)(arraySteps.updatedTime, 'YYYY/M/D H:mm'),
                statusName: statusName,
                updatedBy: ((_a = arraySteps.user) === null || _a === void 0 ? void 0 : _a.fullName) || '',
                version: arraySteps.version,
                timer: arraySteps.updatedTime,
                lastUpdatedTime: arraySteps.lastUpdatedTime,
                level: this.displayLevel(arraySteps.type, arraySteps.level),
                children: [],
            });
            return {
                data: results[0],
                subVersion: maxVersion,
                listPoints: listPoints,
                edited: editAlreadys.length > 0,
            };
        }
    }
    async publicVersion(params) {
        const type17 = [1, 2, 3];
        const type810 = [4, 5, 6];
        const currentVersion = await this.basicBehaviorRepo.findOne(params.versionId);
        const years = moment().tz(params.timeZone);
        const periods = await this.evaluationPeriodRepo.getAll({
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { year: years.tz(params.timeZone).format('YYYY') },
                        { year: years.add(-1, 'y').tz(params.timeZone).format('YYYY') },
                    ],
                },
                {
                    companyGroupCode: params.companyGroupCode,
                },
                {
                    checkFixed: { [sequelize_1.Op.ne]: 2 },
                },
            ],
        });
        for (let index = 0; index < periods.length; index++) {
            if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalStart, periods[index].dateCreationGoalEnd, params.timeZone) &&
                type17.includes(currentVersion.type)) {
                return {
                    code: 403,
                    start: periods[index].dateCreationGoalStart,
                    end: periods[index].dateCreationGoalEnd,
                };
            }
            else if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalDepartmentStart, periods[index].dateCreationGoalDepartmentEnd, params.timeZone) &&
                type810.includes(currentVersion.type)) {
                return {
                    code: 403,
                    start: periods[index].dateCreationGoalDepartmentStart,
                    end: periods[index].dateCreationGoalDepartmentEnd,
                };
            }
        }
        if (new Date(currentVersion.updatedTime).getTime() ===
            new Date(params.timer).getTime()) {
            const transactionBehaviorBasic = await this.basicBehaviorRepo.transactionBehaviorBasic();
            try {
                await this.basicBehaviorRepo.updateAllVersionToPrivate({
                    status: 4,
                    type: currentVersion.type,
                    level: currentVersion.level,
                    companyGroupCode: params.companyGroupCode,
                }, transactionBehaviorBasic);
                if (currentVersion.subVersion !== 0) {
                    const newVersion = await this.basicBehaviorRepo.maxVersion({
                        type: params.type,
                        companyGroupCode: params.companyGroupCode,
                    }, 'version');
                    const objects = {
                        version: newVersion + 1,
                        subVersion: 0,
                        publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        creationUser: params === null || params === void 0 ? void 0 : params.userId,
                        status: 4,
                        companyGroupCode: params.companyGroupCode,
                    };
                    const results = await this.basicBehaviorRepo.updateVersion(params.versionId, objects, transactionBehaviorBasic);
                    await transactionBehaviorBasic.commit();
                    return results;
                }
                else {
                    const objects = {
                        version: params.version,
                        subVersion: params.subVersion,
                        publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        creationUser: params === null || params === void 0 ? void 0 : params.userId,
                        status: 4,
                        companyGroupCode: params.companyGroupCode,
                    };
                    const results = await this.basicBehaviorRepo.updateVersion(params.versionId, objects, transactionBehaviorBasic);
                    await transactionBehaviorBasic.commit();
                    return results;
                }
            }
            catch (error) {
                await transactionBehaviorBasic.rollback();
                throw new RuntimeException_1.RuntimeException(error, 500);
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
    }
    async saveDraftData(body, userId, companyGroupCode, timeZone) {
        const currentVersion = await this.basicBehaviorRepo.findOne(body.id);
        const editAlreadys = await this.basicBehaviorRepo.findAllByCondition({
            [sequelize_1.Op.and]: [
                { type: currentVersion.type },
                { level: currentVersion.level },
                {
                    status: 1,
                },
                {
                    id: { [sequelize_1.Op.notIn]: [currentVersion.id] },
                },
                {
                    companyGroupCode: companyGroupCode,
                },
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
                edited: true,
                code: 406,
            };
        }
        if (![1, 4].includes(currentVersion.status)) {
            return {
                code: 407,
                id: currentVersion.id,
                status: currentVersion.status,
                type: body.type,
            };
        }
        if (new Date(currentVersion.updatedTime).getTime() ===
            new Date(body.updated).getTime()) {
            if (currentVersion.status !== 4 && currentVersion.status !== 1) {
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
            const transactionBehaviorBasic = await this.basicBehaviorRepo.transactionBehaviorBasic();
            if (body.status === 3 || body.status === 4) {
                try {
                    const objectNewVersion = {
                        type: body.type,
                        version: body.version,
                        subVersion: body.subVersion + 1,
                        creationUser: userId,
                        status: 1,
                        level: currentVersion.level,
                        reason: body.reason,
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                        companyGroupCode: companyGroupCode,
                    };
                    this.basicBehaviorRepo.updateVersion(body.id, {
                        type: body.type,
                        companyGroupCode: companyGroupCode,
                    }, transactionBehaviorBasic);
                    const versionId = await this.basicBehaviorRepo.createNewVersion(objectNewVersion);
                    const childrens = body.childrens.map((v) => {
                        if (isNaN(parseInt(v.difficulty))) {
                            v.difficulty = null;
                        }
                        delete v.id;
                        v.versionId = versionId.id;
                        return v;
                    });
                    await this.basicBehaviorRepo.createBulkListProSkill(childrens, transactionBehaviorBasic);
                    await transactionBehaviorBasic.commit();
                    return {
                        id: versionId.id,
                        updatedTime: versionId.updatedTime,
                        subVersion: versionId.subVersion,
                        version: versionId.version,
                        status: versionId.status,
                        lastUpdatedTime: versionId.lastUpdatedTime,
                        code: 200,
                    };
                }
                catch (error) {
                    await transactionBehaviorBasic.rollback();
                    throw new RuntimeException_1.RuntimeException(error, 500);
                }
            }
            else if (body.status === 1) {
                try {
                    const result = await this.basicBehaviorRepo.updateVersion(body.id, {
                        type: body.type,
                        creationUser: userId,
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                        reason: body.reason,
                        companyGroupCode: companyGroupCode,
                    }, transactionBehaviorBasic);
                    await this.basicBehaviorRepo.deleteAllListVersion(body.id, transactionBehaviorBasic);
                    const childrens = body.childrens.map((v) => {
                        if (isNaN(parseInt(v.difficulty))) {
                            v.difficulty = null;
                        }
                        delete v.id;
                        v.versionId = body.id;
                        return v;
                    });
                    await this.basicBehaviorRepo.createBulkListProSkill(childrens, transactionBehaviorBasic);
                    await transactionBehaviorBasic.commit();
                    return {
                        id: result[1][0].id,
                        updatedTime: result[1][0].updatedTime,
                        lastUpdatedTime: result[1][0].lastUpdatedTime,
                        subVersion: result[1][0].subVersion,
                        version: result[1][0].version,
                        status: 1,
                        code: 200,
                    };
                }
                catch (error) {
                    await transactionBehaviorBasic.rollback();
                    throw new RuntimeException_1.RuntimeException(error, 500);
                }
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
    async cancelVersionPro(versionId, userId, body, companyGroupCode) {
        const version = await this.basicBehaviorRepo.findOne(versionId);
        if (version.status === 1 &&
            new Date(version.updatedTime).getTime() === new Date(body.timer).getTime()) {
            return await this.basicBehaviorRepo.cancelVersionProSkill(versionId, userId, companyGroupCode);
        }
        throw new RuntimeException_1.RuntimeException('No status valid or Date', 409);
    }
    async savePublicVersion(params) {
        const type17 = [1, 2, 3];
        const type810 = [4, 5, 6];
        const years = moment().tz(params.timeZone);
        const periods = await this.evaluationPeriodRepo.getAll({
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { year: years.tz(params.timeZone).format('YYYY') },
                        { year: years.add(-1, 'y').tz(params.timeZone).format('YYYY') },
                    ],
                },
                {
                    companyGroupCode: params.companyGroupCode,
                },
                {
                    checkFixed: { [sequelize_1.Op.ne]: 2 },
                },
            ],
        });
        for (let index = 0; index < periods.length; index++) {
            if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalStart, periods[index].dateCreationGoalEnd, params.timeZone) &&
                type17.includes(params.type)) {
                return {
                    code: 403,
                    start: periods[index].dateCreationGoalStart,
                    end: periods[index].dateCreationGoalEnd,
                };
            }
            else if ((0, util_1.compareDatePeriod)(periods[index].dateCreationGoalDepartmentStart, periods[index].dateCreationGoalDepartmentEnd, params.timeZone) &&
                type810.includes(params.type)) {
                return {
                    code: 403,
                    start: periods[index].dateCreationGoalDepartmentStart,
                    end: periods[index].dateCreationGoalDepartmentEnd,
                };
            }
        }
        const currentVersion = await this.basicBehaviorRepo.findOne(params.versionId);
        if (![1, 4].includes(currentVersion.status)) {
            return {
                code: 407,
                id: params.versionId,
                status: currentVersion.status,
                type: params.type,
            };
        }
        let typeVersionSetting;
        let listPointDiffent = [];
        if (params.type == 1 || params.type == 2) {
            typeVersionSetting = 1;
        }
        else if (params.type == 4 || params.type == 5) {
            typeVersionSetting = 2;
        }
        else if (params.type == 3) {
            typeVersionSetting = 3;
        }
        else if (params.type == 6) {
            typeVersionSetting = 4;
        }
        const versionSetting = await this.versionSettingRepository.listPointSettingByType(typeVersionSetting, params.companyGroupCode);
        if (versionSetting) {
            if (params.type == 1 || params.type == 4) {
                for (let i = 0; i < params.data.length; i++) {
                    const element = params.data[i];
                    if (parseInt(element.difficulty) > versionSetting.basicMaxDifficulty) {
                        listPointDiffent.push(element.difficulty);
                    }
                }
            }
            else {
                for (let i = 0; i < params.data.length; i++) {
                    const element = params.data[i];
                    if (parseInt(element.difficulty) > versionSetting.behaviorMaxWeight) {
                        listPointDiffent.push(element.difficulty);
                    }
                }
            }
        }
        if (new Date(currentVersion.updatedTime).getTime() ===
            new Date(params.timer).getTime() &&
            listPointDiffent.length <= 0) {
            const transactionBehaviorBasic = await this.basicBehaviorRepo.transactionBehaviorBasic();
            try {
                const newVersion = await this.basicBehaviorRepo.maxVersion({
                    type: params.type,
                    level: params.type == 1 || params.type == 4 ? null : params.level,
                    companyGroupCode: params.companyGroupCode,
                }, 'version');
                await this.basicBehaviorRepo.updateAllVersionToPrivate({
                    status: 4,
                    type: currentVersion.type,
                    level: params.type == 1 || params.type == 4
                        ? null
                        : currentVersion.level,
                    companyGroupCode: params.companyGroupCode,
                }, transactionBehaviorBasic);
                if (params.status !== 1 && params.status !== 2) {
                    this.basicBehaviorRepo.updateVersion(params.versionId, {
                        type: params.type,
                        companyGroupCode: params.companyGroupCode,
                    }, transactionBehaviorBasic);
                    const objectNewVersion = {
                        subVersion: 0,
                        version: newVersion + 1,
                        status: 4,
                        creationUser: params.userId,
                        type: params.type,
                        reason: params.reason,
                        level: params.type == 1 || params.type == 4 ? null : params.level,
                        publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        companyGroupCode: params.companyGroupCode,
                    };
                    const versionNew = await this.basicBehaviorRepo.createNewVersion(objectNewVersion);
                    const childrens = params.data.map((v) => {
                        delete v.id;
                        v.versionId = versionNew.id;
                        return v;
                    });
                    await this.basicBehaviorRepo.createBulkListProSkill(childrens, transactionBehaviorBasic);
                    await transactionBehaviorBasic.commit();
                    return {
                        id: versionNew.id,
                        status: versionNew.status,
                        type: params.type,
                    };
                }
                else {
                    await this.basicBehaviorRepo.deleteAllListVersion(params.versionId, transactionBehaviorBasic);
                    this.basicBehaviorRepo.updateVersion(params.versionId, {
                        type: params.type,
                        status: 4,
                        level: params.type == 1 || params.type == 4 ? null : params.level,
                        subVersion: 0,
                        version: newVersion + 1,
                        creationUser: params.userId,
                        reason: params.reason,
                        publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', params.timeZone),
                        companyGroupCode: params.companyGroupCode,
                    }, transactionBehaviorBasic);
                    const childrens = params.data.map((v) => {
                        delete v.id;
                        v.versionId = params.versionId;
                        return v;
                    });
                    await this.basicBehaviorRepo.createBulkListProSkill(childrens, transactionBehaviorBasic);
                    await transactionBehaviorBasic.commit();
                    return {
                        id: params.versionId,
                        status: 4,
                        type: params.type,
                    };
                }
            }
            catch (error) {
                await transactionBehaviorBasic.rollback();
                throw new RuntimeException_1.RuntimeException(error, 500);
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
};
__decorate([
    (0, common_1.Inject)(basicBehavior_repository_1.BasicBehaviorRepository),
    __metadata("design:type", Object)
], BasicBehaviorServices.prototype, "basicBehaviorRepo", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], BasicBehaviorServices.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], BasicBehaviorServices.prototype, "evaluationPeriodRepo", void 0);
__decorate([
    (0, common_1.Inject)(versionSetting_repository_1.VersionSettingRepository),
    __metadata("design:type", Object)
], BasicBehaviorServices.prototype, "versionSettingRepository", void 0);
BasicBehaviorServices = __decorate([
    (0, common_1.Injectable)()
], BasicBehaviorServices);
exports.BasicBehaviorServices = BasicBehaviorServices;
//# sourceMappingURL=basicBehavior.service.js.map