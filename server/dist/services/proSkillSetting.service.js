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
exports.ProSkillSettingServices = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const util_1 = require("../common/util");
const TypeAchievement_1 = require("../enum/TypeAchievement");
const VersionProskillPublicStatus_1 = require("../enum/VersionProskillPublicStatus");
const VersionProskillStatus_1 = require("../enum/VersionProskillStatus");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const VersionProSkillDto_1 = require("../model/response/VersionProSkillDto");
const adminEvaluation_repository_1 = require("../repository/adminEvaluation.repository");
const department_repository_1 = require("../repository/department.repository");
const proSkillSetting_repository_1 = require("../repository/proSkillSetting.repository");
const versionSetting_repository_1 = require("../repository/versionSetting.repository");
let ProSkillSettingServices = class ProSkillSettingServices {
    async getSkillRoleUser(userId, companyGroupCode) {
        const skill = await this.proSkillSettingRepository.getSkillRoleUser(userId, companyGroupCode);
        return {
            skill,
        };
    }
    async getVersionProSkill(query, userId, companyGroupCode) {
        const { status, skillId, offset, limit, publicStatus, type } = query;
        const skills = await this.adminEvaluation
            .getAllSkillByCondition(userId)
            .then((data) => {
            return data.map((v) => {
                return v.skillId;
            });
        });
        if (type === '1') {
            const verSionProSkills = await this.proSkillSettingRepository.getVersionProSkill(companyGroupCode, status, offset, limit, publicStatus, [skillId].filter((v) => v !== '-1' && v !== undefined).length > 0
                ? [skillId]
                : skills, type);
            return Object.assign({}, verSionProSkills);
        }
        else {
            const { skillId, offset, limit } = query;
            const datas = await this.proSkillSettingRepository.listProSkillF3New(companyGroupCode, skillId, offset, limit, userId);
            return datas;
        }
    }
    async getDetailProSkillGeneric(versionId, companyGroupCode) {
        var _a, _b;
        const versionProSkill = await this.proSkillSettingRepository.getDetailProSkillGeneric(versionId, companyGroupCode);
        if (!versionProSkill) {
            throw new RuntimeException_1.RuntimeException('Version not found', common_1.HttpStatus.NOT_FOUND);
        }
        const listProSkills = await this.proSkillSettingRepository.getListProSkillByVersionId(versionId);
        const settersAndApprovers = versionProSkill.skill.skillRoles.reduce((acc, current) => {
            if (current.role == 1) {
                acc['setters'].push(current.user.fullName);
            }
            else if (current.role == 2) {
                acc['approvers'].push(current.user.fullName);
            }
            return acc;
        }, { setters: [], approvers: [] });
        const versionProSkillDto = new VersionProSkillDto_1.VersionProSkillDto();
        versionProSkillDto.id = versionProSkill.id;
        versionProSkillDto.skill = (_a = versionProSkill.skill) === null || _a === void 0 ? void 0 : _a.name;
        versionProSkillDto.userUpdated = (_b = versionProSkill.user) === null || _b === void 0 ? void 0 : _b.fullName;
        versionProSkillDto.updatedTime = versionProSkill.updatedTime;
        versionProSkillDto.publicStatus = versionProSkill.publicStatus;
        versionProSkillDto.status = versionProSkill.status;
        versionProSkillDto.version = `${versionProSkill.version}.${versionProSkill.subVersion}`;
        versionProSkillDto.publicDate = versionProSkill.publicDate;
        versionProSkillDto.reason = versionProSkill.reason;
        versionProSkillDto.versionMain = versionProSkill.version;
        versionProSkillDto.versionSub = versionProSkill.subVersion;
        versionProSkillDto.lastUpdatedTime = versionProSkill.lastUpdatedTime;
        versionProSkillDto.children = listProSkills;
        versionProSkillDto.settersAndApprovers = settersAndApprovers;
        return versionProSkillDto;
    }
    async getVersionProSkillDepartment(query, companyGroupCode) {
        const { skillId, offset, limit } = query;
        const verSionProSkills = await this.proSkillSettingRepository.getVersionProSkillDepartment(skillId, offset, limit, companyGroupCode);
        return verSionProSkills;
    }
    async createNewVersionSaveDraft(versionId, objectUpdated, creationUser, companyGroupCode, timeZone) {
        const version = await this.proSkillSettingRepository.findOneVersion({
            id: versionId,
        });
        const rolesChecked = await this.proSkillSettingRepository.getRoleUser(version.skillId, creationUser);
        if (rolesChecked) {
            if (new Date(objectUpdated.updated).getTime() ===
                version.updatedTime.getTime()) {
                const editAlreadys = await this.proSkillSettingRepository.findAllVersionWaiting({
                    [sequelize_1.Op.and]: [
                        {
                            skillId: version.skillId,
                        },
                        {
                            id: { [sequelize_1.Op.notIn]: [versionId] },
                        },
                        {
                            [sequelize_1.Op.or]: [
                                { status: VersionProskillStatus_1.VersionProskillStatus.EDITING },
                                { status: VersionProskillStatus_1.VersionProskillStatus.PENDING_APPROVAL },
                                { status: VersionProskillStatus_1.VersionProskillStatus.REJECTED },
                                { publicStatus: VersionProskillPublicStatus_1.VersionProskillPublicStatus.PENDING },
                            ],
                        },
                        {
                            companyGroupCode: companyGroupCode,
                        },
                    ],
                });
                if (editAlreadys > 0) {
                    return {
                        code: 406,
                    };
                }
                if ([3, 4].includes(version.status)) {
                    const transactionVersionProSkill = await this.proSkillSettingRepository.getTransactionVersionProSkill();
                    try {
                        await this.proSkillSettingRepository.updatedVersion(versionId, {
                            status: version.status,
                        }, transactionVersionProSkill);
                        const findMax = await this.proSkillSettingRepository.findMax(version.version, version.skillId, companyGroupCode);
                        const dataCreate = {
                            version: version.version,
                            updatedTime: new Date(),
                            subVersion: Math.round(findMax + 1),
                            status: 1,
                            skillId: version.skillId,
                            reason: objectUpdated.reason,
                            publicStatus: 0,
                            creationUser: creationUser,
                            lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                            companyGroupCode: companyGroupCode,
                        };
                        const newVersion = await this.proSkillSettingRepository.createNewVersionSaveDraft(dataCreate, transactionVersionProSkill);
                        await transactionVersionProSkill.commit();
                        return {
                            code: 200,
                            id: newVersion.id,
                            updatedTime: newVersion.updatedTime,
                            status: newVersion.status,
                            publicStatus: newVersion.publicStatus,
                            skillId: version.skillId,
                            version: newVersion.version,
                            subVersion: newVersion.subVersion,
                            reason: newVersion.reason,
                            skillActive: version.skill.active,
                            skill: version.skill.name,
                            skillName: version.skill.name,
                            lastUpdatedTime: newVersion.lastUpdatedTime,
                        };
                    }
                    catch (error) {
                        await transactionVersionProSkill.rollback();
                    }
                }
                else {
                    const transactionVersionProSkill = await this.proSkillSettingRepository.getTransactionVersionProSkill();
                    try {
                        const results = await this.proSkillSettingRepository.updatedVersion(versionId, {
                            status: version.status === 5 ? 5 : 1,
                            reason: objectUpdated.reason,
                            creationUser: creationUser,
                            lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                            companyGroupCode: companyGroupCode,
                        }, transactionVersionProSkill);
                        await this.proSkillSettingRepository.deleteListProSkill(versionId, transactionVersionProSkill);
                        await transactionVersionProSkill.commit();
                        return {
                            code: 200,
                            id: versionId,
                            updatedTime: results[0].updatedTime,
                            status: results[0].status,
                            publicStatus: results[0].publicStatus,
                            skillId: version.skillId,
                            version: results[0].version,
                            subVersion: results[0].subVersion,
                            reason: results[0].reason,
                            lastUpdatedTime: results[0].lastUpdatedTime,
                            skillActive: version.skill.active,
                            skill: version.skill.name,
                            skillName: version.skill.name,
                        };
                    }
                    catch (error) {
                        await transactionVersionProSkill.rollback();
                        throw new RuntimeException_1.RuntimeException('Error server', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }
            }
            else {
                throw new RuntimeException_1.RuntimeException('Date invalid', common_1.HttpStatus.CONFLICT);
            }
        }
        else {
            return {
                code: common_1.HttpStatus.FORBIDDEN,
            };
        }
    }
    async createBulk(versionId, data) {
        const transactionListProSkill = await this.proSkillSettingRepository.getTransactionListProSkill();
        try {
            await this.proSkillSettingRepository.deleteListProSkill(versionId, transactionListProSkill);
            await this.proSkillSettingRepository.createMultipleData(data, transactionListProSkill);
            await transactionListProSkill.commit();
        }
        catch (_a) {
            await transactionListProSkill.rollback();
        }
    }
    async createNewVersionSubmit(versionId, objectUpdated, creationUser, companyGroupCode, tempListPoint, timeZone) {
        const version = await this.proSkillSettingRepository.findOneVersion({
            id: versionId,
        });
        const versionWatings = await this.proSkillSettingRepository.findAllVersionWaiting({
            status: 3,
            skillId: version.skillId,
            companyGroupCode: companyGroupCode,
        });
        const rolesChecked = await this.proSkillSettingRepository.getRoleUser(version.skillId, creationUser);
        const checkedHaveRoleSubmits = await this.proSkillSettingRepository.findDepartmentRoleByDepartmentId(version.skillId, 2);
        let listPointDifferent = [];
        const listPoints = await this.versionSettingRepository.listPointSetting(companyGroupCode);
        const listPointCheck = listPoints.settingProFormula.map((v) => ({
            value: v.point,
        }));
        for (let i = 0; i < tempListPoint.length; i++) {
            const element = tempListPoint[i];
            if (!listPointCheck.some((item) => item.value === element.difficulty)) {
                listPointDifferent.push(element.difficulty);
            }
        }
        if (checkedHaveRoleSubmits.length <= 0) {
            return {
                code: 405,
            };
        }
        if (rolesChecked) {
            if (versionWatings <= 0) {
                if (new Date(objectUpdated.updated).getTime() ===
                    version.updatedTime.getTime() &&
                    listPointDifferent.length <= 0) {
                    const editAlreadys = await this.proSkillSettingRepository.findAllVersionWaiting({
                        [sequelize_1.Op.and]: [
                            {
                                skillId: version.skillId,
                            },
                            {
                                id: { [sequelize_1.Op.notIn]: [versionId] },
                            },
                            {
                                [sequelize_1.Op.or]: [
                                    { status: VersionProskillStatus_1.VersionProskillStatus.EDITING },
                                    { status: VersionProskillStatus_1.VersionProskillStatus.PENDING_APPROVAL },
                                    { status: VersionProskillStatus_1.VersionProskillStatus.REJECTED },
                                    { publicStatus: VersionProskillPublicStatus_1.VersionProskillPublicStatus.PENDING },
                                ],
                            },
                            {
                                companyGroupCode: companyGroupCode,
                            },
                        ],
                    });
                    if (editAlreadys > 0) {
                        return {
                            code: 406,
                        };
                    }
                    if (version.status === 3 || version.status === 4) {
                        const findMax = await this.proSkillSettingRepository.findMax(version.version, version.skillId, companyGroupCode);
                        const transactionVersionProSkill = await this.proSkillSettingRepository.getTransactionVersionProSkill();
                        try {
                            await this.proSkillSettingRepository.updatedVersion(versionId, {
                                status: version.status,
                            }, transactionVersionProSkill);
                            const dataCreate = {
                                version: version.version,
                                updatedTime: new Date(),
                                subVersion: Math.round(findMax + 1),
                                status: 3,
                                skillId: version.skillId,
                                reason: objectUpdated.reason,
                                publicStatus: 0,
                                creationUser: creationUser,
                                lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                                companyGroupCode: companyGroupCode,
                            };
                            const newVersion = await this.proSkillSettingRepository.createNewVersionSaveDraft(dataCreate, transactionVersionProSkill);
                            await transactionVersionProSkill.commit();
                            return Object.assign(Object.assign({}, newVersion.dataValues), { skillName: version.skill.name, skillActive: version.skill.active, code: 200 });
                        }
                        catch (error) {
                            await transactionVersionProSkill.rollback();
                            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) ||
                                (error === null || error === void 0 ? void 0 : error.statusCode) ||
                                common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }
                    else {
                        const transactionVersionProSkill = await this.proSkillSettingRepository.getTransactionVersionProSkill();
                        try {
                            const results = await this.proSkillSettingRepository.updatedVersion(versionId, {
                                status: 3,
                                creationUser: creationUser,
                                reason: objectUpdated.reason,
                                lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                                companyGroupCode: companyGroupCode,
                            }, transactionVersionProSkill);
                            await transactionVersionProSkill.commit();
                            return {
                                id: versionId,
                                updatedTime: results[0].updatedTime,
                                status: results[0].status,
                                publicStatus: results[0].publicStatus,
                                skillId: version.skillId,
                                version: results[0].version,
                                subVersion: results[0].subVersion,
                                reason: results[0].reason,
                                skillActive: version.skillId.active,
                                lastUpdatedTime: results[0].lastUpdatedTime,
                                skillName: version.skill.name,
                                code: 200,
                            };
                        }
                        catch (error) {
                            await transactionVersionProSkill.rollback();
                            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) ||
                                (error === null || error === void 0 ? void 0 : error.statusCode) ||
                                common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }
                }
                else {
                    throw new RuntimeException_1.RuntimeException('Date invalid', common_1.HttpStatus.CONFLICT);
                }
            }
            else {
                return {
                    code: common_1.HttpStatus.UNAUTHORIZED,
                };
            }
        }
        else {
            return {
                code: common_1.HttpStatus.FORBIDDEN,
            };
        }
    }
    async cancelVersionPro(versionId, userId, updatedTime) {
        const version = await this.proSkillSettingRepository.findOneVersion({
            id: versionId,
        });
        const rolesChecked = await this.proSkillSettingRepository.getRoleUser(version.skillId, userId);
        if (rolesChecked) {
            if ([1, 5].includes(version.status) &&
                version.updatedTime.getTime() === new Date(updatedTime).getTime()) {
                const results = await this.proSkillSettingRepository.cancelVersionProSkill(versionId, userId);
                return Object.assign({ code: 200 }, results[1][0].dataValues);
            }
            throw new RuntimeException_1.RuntimeException('No status valid or Date time', 409);
        }
        else {
            return {
                code: 403,
                id: versionId,
            };
        }
    }
    async getDetailProSkillVersion(versionId, role, companyGroupCode) {
        var _a;
        const datas = await this.proSkillSettingRepository.detailProSkill(versionId);
        const skill = await this.proSkillSettingRepository.findOneVersion({
            id: versionId,
        });
        if (datas.length > 0) {
            const arrays = datas.reduce((acc, current) => {
                acc[current.versionId] = {
                    versionId: current.versionId,
                    skill: `${current.versionProSkill.skill.name}`,
                    userUpdated: current.versionProSkill.user.fullName,
                    updated: current.versionProSkill.updatedTime,
                    publicStatus: current.versionProSkill.publicStatus,
                    status: current.versionProSkill.status,
                    version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
                    publicDate: current.versionProSkill.publicDate,
                    reason: current.versionProSkill.reason,
                    versionMain: current.versionProSkill.version,
                    versionSub: current.versionProSkill.subVersion,
                    lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
                    children: [],
                };
                return acc;
            }, {});
            for (let index = 0; index < datas.length; index++) {
                (_a = arrays[`${versionId}`]) === null || _a === void 0 ? void 0 : _a.children.push({
                    itemId: datas[index].itemId,
                    content: datas[index].content,
                    difficulty: datas[index].difficulty,
                    note: datas[index].note,
                    mediumClass: datas[index].mediumClass,
                    smallClass: datas[index].smallClass,
                    versionId: datas[index].versionId,
                    jobType: datas[index].jobType,
                });
            }
            const arrayDeletes = [];
            const results = (await Object(arrays[`${versionId}`]));
            if (results && results.status === 3 && role === 'f4') {
                const versionPublics = await this.proSkillSettingRepository.getVersionPublic(skill.skillId, companyGroupCode);
                for (let index = 0; index < versionPublics.length; index++) {
                    const filter = results.children.find((v) => v.itemId === versionPublics[index].itemId);
                    const findIndex = results.children.findIndex((v) => v.itemId === versionPublics[index].itemId);
                    if (filter) {
                        if (filter.jobType !== versionPublics[index].jobType) {
                            results.children[findIndex].typeJob = 'change';
                            results.children[findIndex].jobOld =
                                versionPublics[index].jobType;
                        }
                        if (filter.mediumClass !== versionPublics[index].mediumClass) {
                            results.children[findIndex].typeMediumClass = 'change';
                            results.children[findIndex].mediumClassOld =
                                versionPublics[index].mediumClass;
                        }
                        if (filter.smallClass !== versionPublics[index].smallClass) {
                            results.children[findIndex].typeSmallClass = 'change';
                            results.children[findIndex].smallClassOld =
                                versionPublics[index].smallClass;
                        }
                        if (filter.content !== versionPublics[index].content) {
                            results.children[findIndex].typeContent = 'change';
                            results.children[findIndex].contentOld =
                                versionPublics[index].content;
                        }
                        if (filter.difficulty !== versionPublics[index].difficulty) {
                            results.children[findIndex].typedifficulty = 'change';
                            results.children[findIndex].difficultyOld =
                                versionPublics[index].difficulty;
                        }
                        if (filter.note !== versionPublics[index].note) {
                            results.children[findIndex].typeNote = 'change';
                            results.children[findIndex].noteOld = versionPublics[index].note;
                        }
                        results.children[findIndex].sort = index;
                    }
                    else {
                        delete versionPublics[index].versionProSkill;
                        arrayDeletes.push({
                            itemId: versionPublics[index].itemId,
                            versionId: versionPublics[index].versionId,
                            smallClass: versionPublics[index].smallClass,
                            mediumClass: versionPublics[index].mediumClass,
                            jobType: versionPublics[index].jobType,
                            difficulty: versionPublics[index].difficulty,
                            content: versionPublics[index].content,
                            note: versionPublics[index].note,
                            delete: true,
                            sort: index,
                        });
                    }
                }
                if (versionPublics.length > 0) {
                    for (let index = 0; index < results.children.length; index++) {
                        const filterAdd = versionPublics === null || versionPublics === void 0 ? void 0 : versionPublics.find((v) => v.itemId === results.children[index].itemId);
                        if (!filterAdd) {
                            results.children[index].isAdd = true;
                            results.children[index].sort =
                                (versionPublics === null || versionPublics === void 0 ? void 0 : versionPublics.length) + results.children.length + index;
                        }
                    }
                }
                await results.children.push(...arrayDeletes);
                results.children = [
                    ...results.children.sort((n1, n2) => {
                        if ((n1 === null || n1 === void 0 ? void 0 : n1.sort) > (n2 === null || n2 === void 0 ? void 0 : n2.sort)) {
                            return 1;
                        }
                        if ((n1 === null || n1 === void 0 ? void 0 : n1.sort) < (n2 === null || n2 === void 0 ? void 0 : n2.sort)) {
                            return -1;
                        }
                        return 0;
                    }),
                ];
                return Object.assign(Object.assign({}, results), { skillActive: skill.skill.active });
            }
            else {
                return Object.assign({ skillActive: skill.skill.active }, (arrays[`${versionId}`] || []));
            }
        }
        else {
            const arraySteps = await this.proSkillSettingRepository.findOneVersion({
                id: versionId,
            });
            return Object.assign(Object.assign({}, arraySteps.dataValues), { skill: `${arraySteps.dataValues.skill.name}`, version: `${arraySteps.dataValues.version}.${arraySteps.dataValues.subVersion}`, skillActive: skill.skill.active, userUpdated: arraySteps.dataValues.user.fullName, children: [] });
        }
    }
    async getHistoryApproveContent(versionId, userId, isAdmin = false, companyGroupCode) {
        var _a;
        if (!versionId)
            throw new RuntimeException_1.RuntimeException('versionId is missing', 400);
        if (!userId)
            throw new RuntimeException_1.RuntimeException('userId is missing', 400);
        if (isNaN(versionId))
            throw new RuntimeException_1.RuntimeException('versionId is not a number', 400);
        const approvalHistories = [];
        const info = { version: '', skill: '' };
        const versionInfo = await this.proSkillSettingRepository.getDetailProSkill(versionId, companyGroupCode);
        if (!versionInfo) {
            throw new RuntimeException_1.RuntimeException('Pro skill version not found', common_1.HttpStatus.NOT_FOUND);
        }
        info.version = versionInfo.version + '.' + versionInfo.subVersion;
        info.skill = (_a = versionInfo.skill) === null || _a === void 0 ? void 0 : _a.name;
        if (!isAdmin) {
            const departmentRolesList = await this.proSkillSettingRepository.getSkillRole(versionInfo.skillId, userId);
            if (!departmentRolesList.length && versionInfo.publicStatus !== 1) {
                throw new RuntimeException_1.RuntimeException('Unauthorized user', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        const resultList = await this.proSkillSettingRepository.getHistoryApproveContent(versionId, userId);
        if (resultList && resultList.length) {
            resultList.map((item) => {
                const content = {};
                content.approverUser = item.user;
                content.createdTime = item.createdTime;
                content.comment = item.comment;
                content.status = item.status;
                approvalHistories.push(content);
            });
        }
        return { info, approvalHistories };
    }
    async getEditProSkillVersion(versionId, creationUser, companyGroupCode) {
        const datas = await this.proSkillSettingRepository.detailProSkill(versionId);
        const listPoints = await this.versionSettingRepository.listPointSetting(companyGroupCode);
        if (datas.length > 0) {
            const rolesChecked = await this.proSkillSettingRepository.getRoleUser(datas[0].versionProSkill.skillId, creationUser);
            if (!rolesChecked) {
                return {
                    code: 403,
                };
            }
            const maxSubVersion = await this.proSkillSettingRepository.findMax(datas[0].versionProSkill.version, datas[0].versionProSkill.skillId, companyGroupCode);
            const editAlreadys = await this.proSkillSettingRepository.findAllVersionWaiting({
                [sequelize_1.Op.and]: [
                    {
                        skillId: datas[0].versionProSkill.skillId,
                    },
                    {
                        [sequelize_1.Op.or]: [
                            { status: VersionProskillStatus_1.VersionProskillStatus.EDITING },
                            { status: VersionProskillStatus_1.VersionProskillStatus.PENDING_APPROVAL },
                            { status: VersionProskillStatus_1.VersionProskillStatus.REJECTED },
                            { publicStatus: VersionProskillPublicStatus_1.VersionProskillPublicStatus.PENDING },
                        ],
                    },
                    {
                        id: { [sequelize_1.Op.notIn]: [versionId] },
                    },
                    {
                        companyGroupCode: companyGroupCode,
                    },
                ],
            });
            const arrays = datas.reduce((acc, current) => {
                const index = acc.find((v) => v.versionId === current.versionId);
                const value = {
                    itemId: current.itemId,
                    versionId: current.versionId,
                    jobType: current.jobType,
                    mediumClass: current.mediumClass,
                    smallClass: current.smallClass,
                    content: current.content,
                    difficulty: current.difficulty,
                    note: current.note,
                };
                if (!index) {
                    acc.push({
                        versionId: current.versionId,
                        skillId: current.versionProSkill.skillId,
                        skillName: current.versionProSkill.skill.name,
                        skill: current.versionProSkill.skill.name,
                        updated: current.versionProSkill.updatedTime,
                        publicStatus: current.versionProSkill.publicStatus,
                        status: current.versionProSkill.status,
                        version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
                        publicDate: current.versionProSkill.publicDate,
                        reason: current.versionProSkill.reason,
                        versionMain: current.versionProSkill.version,
                        versionSub: current.versionProSkill.subVersion,
                        skilltActive: datas[0].versionProSkill.skill.active,
                        creationUser: current.versionProSkill.user,
                        lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
                        children: [value],
                    });
                }
                else {
                    index.children.push(value);
                }
                return acc;
            }, []);
            const lengths = await this.proSkillSettingRepository.findAllVersionWaiting({
                skillId: datas[0].versionProSkill.skillId,
                companyGroupCode: companyGroupCode,
            });
            const settersAndApprovers = datas[0].versionProSkill.skill.skillRoles.reduce((acc, skillRole) => {
                if (skillRole.role == 1) {
                    acc['setters'].push(skillRole.user.fullName);
                }
                else if (skillRole.role == 2) {
                    acc['approvers'].push(skillRole.user.fullName);
                }
                return acc;
            }, { setters: [], approvers: [] });
            const rejectComment = await this.proSkillSettingRepository.getRejectComment(versionId);
            return {
                data: arrays[0],
                settersAndApprovers: settersAndApprovers,
                rejectComment: (rejectComment === null || rejectComment === void 0 ? void 0 : rejectComment.comment) || '',
                subVersion: maxSubVersion,
                listPoint: listPoints,
                lengths: lengths,
                editAlready: editAlreadys > 0,
            };
        }
        else {
            const arraySteps = await this.proSkillSettingRepository.findOneVersion({
                id: versionId,
            });
            const rolesChecked = await this.proSkillSettingRepository.getRoleUser(arraySteps.skillId, creationUser);
            if (!rolesChecked) {
                return {
                    code: common_1.HttpStatus.FORBIDDEN,
                };
            }
            const maxSubVersion = await this.proSkillSettingRepository.findMax(arraySteps.version, arraySteps.skillId, companyGroupCode);
            const lengths = await this.proSkillSettingRepository.findAllVersionWaiting({
                skillId: arraySteps.skillId,
                companyGroupCode: companyGroupCode,
            });
            const editAlreadys = await this.proSkillSettingRepository.findAllVersionWaiting({
                [sequelize_1.Op.and]: [
                    {
                        skillId: arraySteps.skillId,
                    },
                    {
                        [sequelize_1.Op.or]: [
                            { status: VersionProskillStatus_1.VersionProskillStatus.EDITING },
                            { status: VersionProskillStatus_1.VersionProskillStatus.PENDING_APPROVAL },
                            { status: VersionProskillStatus_1.VersionProskillStatus.REJECTED },
                            { publicStatus: VersionProskillPublicStatus_1.VersionProskillPublicStatus.PENDING },
                        ],
                    },
                    {
                        id: { [sequelize_1.Op.notIn]: [versionId] },
                    },
                    {
                        companyGroupCode: companyGroupCode,
                    },
                ],
            });
            const settersAndApprovers = arraySteps.dataValues.skill.skillRoles.reduce((acc, skillRole) => {
                if (skillRole.role == 1) {
                    acc['setters'].push(skillRole.user.fullName);
                }
                else if (skillRole.role == 2) {
                    acc['approvers'].push(skillRole.user.fullName);
                }
                return acc;
            }, { setters: [], approvers: [] });
            const rejectComment = await this.proSkillSettingRepository.getRejectComment(versionId);
            return {
                data: Object.assign(Object.assign({}, arraySteps.dataValues), { skillId: arraySteps.dataValues.skillId, createdUser: arraySteps.dataValues.user, skill: arraySteps.dataValues.skill.name, version: `${arraySteps.dataValues.version}.${arraySteps.dataValues.subVersion}`, versionMain: arraySteps.dataValues.version, updated: arraySteps.dataValues.updatedTime, userUpdated: arraySteps.dataValues.user.fullName, publicStatus: arraySteps.dataValues.publicStatus, status: arraySteps.dataValues.status, publicDate: arraySteps.dataValues.publicDate, reason: arraySteps.dataValues.reason, versionId: parseInt(versionId.toString()), lastUpdatedTime: arraySteps.dataValues.lastUpdatedTime, children: [] }),
                rejectComment: (rejectComment === null || rejectComment === void 0 ? void 0 : rejectComment.comment) || '',
                settersAndApprovers: settersAndApprovers,
                subVersion: maxSubVersion,
                listPoint: listPoints,
                lengths: lengths,
                editAlready: editAlreadys > 0,
            };
        }
    }
    async createNewVersionInit(params, userId, skillId, companyGroupCode, timeZone) {
        const rolesChecked = await this.proSkillSettingRepository.getRoleUser(skillId, userId);
        const skill = await this.departmentRepository.findOnesSkill({
            id: skillId,
        });
        if (rolesChecked) {
            const checkVersions = await this.proSkillSettingRepository.findAllVersionWaiting({
                [sequelize_1.Op.and]: [
                    {
                        version: 0,
                    },
                    {
                        subVersion: 1,
                    },
                    { skillId: skillId },
                    {
                        companyGroupCode: companyGroupCode,
                    },
                ],
            });
            const checkedHaveRoleSubmits = await this.proSkillSettingRepository.findDepartmentRoleByDepartmentId(skillId, 2);
            if (checkedHaveRoleSubmits.length <= 0 && params.isDraft === false) {
                return {
                    code: 405,
                };
            }
            if (checkVersions <= 0) {
                const transactionVersionProSkill = await this.proSkillSettingRepository.getTransactionVersionProSkill();
                try {
                    const dataCreate = {
                        version: 0,
                        subVersion: 1,
                        creationUser: userId,
                        skillId: skillId,
                        status: params.status,
                        reason: params.reason,
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                        publicStatus: 0,
                        companyGroupCode: companyGroupCode,
                    };
                    const results = await this.proSkillSettingRepository.createNewVersionSaveDraft(dataCreate, transactionVersionProSkill);
                    const childrens = params.children.map((v) => {
                        delete v.id;
                        delete v.version_id;
                        if (isNaN(Number(v.difficulty))) {
                            v.difficulty = null;
                        }
                        v.versionId = results.id;
                        return v;
                    });
                    await this.proSkillSettingRepository.createMultipleData(childrens, transactionVersionProSkill);
                    await transactionVersionProSkill.commit();
                    return Object.assign(Object.assign({}, results.dataValues), { updated: results.dataValues.updatedTime, skillActive: rolesChecked.skill.active, skillName: skill.name, versionId: results.id, versionMain: results.version, versionSub: results.subVersion, skill: skill.name, lastUpdatedTime: results.dataValues.lastUpdatedTime, code: 200 });
                }
                catch (error) {
                    await transactionVersionProSkill.rollback();
                    throw new RuntimeException_1.RuntimeException(error, 500);
                }
            }
            else {
                return {
                    code: common_1.HttpStatus.UNAUTHORIZED,
                };
            }
        }
        else {
            return {
                code: common_1.HttpStatus.FORBIDDEN,
            };
        }
    }
    async getAchievementPersonal(versionId) {
        return await this.adminEvaluation.getAchievementPersonal(versionId);
    }
    async getAchievementAdditional(versionId) {
        return await this.adminEvaluation.getAchievementAdditional(versionId, TypeAchievement_1.TypeAchievement.PERSONAL_810);
    }
    async getData810(versionId, req) {
        const additional = await this.adminEvaluation.getAchievementAdditional(versionId, TypeAchievement_1.TypeAchievement.DEPARTMENT_810);
        const goals = await this.adminEvaluation.getAchievementPersonal(versionId);
        const totalPoint = await this.adminEvaluation.getFormula(versionId);
        const data = await this.adminEvaluation.getData810(versionId);
        const isHaveEditRecord = await this.adminEvaluation.haveRecordEdit(req);
        return {
            goals,
            additional,
            totalPoint,
            data,
            isHaveEditRecord: isHaveEditRecord,
        };
    }
    async listPointByVersion(skillId, userId, companyGroupCode) {
        const rolesChecked = await this.proSkillSettingRepository.getRoleUser(parseInt(skillId), userId);
        const settersAndApproversRaws = await this.proSkillSettingRepository.getProskillSettersAndApproversForDepartmentId(Number(skillId));
        const settersAndApprovers = settersAndApproversRaws.reduce((acc, skillRole) => {
            if (skillRole.role == 1) {
                acc['setters'].push(skillRole.user.fullName);
            }
            else if (skillRole.role == 2) {
                acc['approvers'].push(skillRole.user.fullName);
            }
            return acc;
        }, { setters: [], approvers: [] });
        if (rolesChecked) {
            return {
                code: common_1.HttpStatus.OK,
                listPoint: await this.versionSettingRepository.listPointSetting(companyGroupCode),
                settersAndApprovers: settersAndApprovers,
                skill: rolesChecked.skill.name,
            };
        }
        else {
            return {
                code: common_1.HttpStatus.FORBIDDEN,
            };
        }
    }
    async checkPermissionSetterOfDepartment(userId, versionId) {
        const skillRole = await this.proSkillSettingRepository.getDetailProSkill(versionId);
        if (!skillRole)
            return {};
        const countCheck = await this.proSkillSettingRepository.checkPermissionSetterOfDepartment(userId, skillRole.skillId);
        if (countCheck >= 1) {
            return {
                status: skillRole.status,
                publicStatus: skillRole.publicStatus,
            };
        }
        else {
            return {};
        }
    }
    async getDetailProSkill(versionId, userId, readonly, companyGroupCode) {
        const versionProSkill = (await this.proSkillSettingRepository.getDetailProSkillF3(versionId)).get({ plain: true });
        if (versionProSkill) {
            const skillRole = await this.proSkillSettingRepository.checkPermissionSetterOfDepartment(userId, versionProSkill.skillId);
            if (!skillRole && readonly === 'false') {
                return {
                    code: common_1.HttpStatus.FORBIDDEN,
                };
            }
            const editAlreadys = await this.proSkillSettingRepository.findAllVersionWaiting({
                [sequelize_1.Op.and]: [
                    {
                        skillId: versionProSkill.skillId,
                    },
                    {
                        [sequelize_1.Op.or]: [
                            { status: VersionProskillStatus_1.VersionProskillStatus.EDITING },
                            { status: VersionProskillStatus_1.VersionProskillStatus.PENDING_APPROVAL },
                            { status: VersionProskillStatus_1.VersionProskillStatus.REJECTED },
                            { publicStatus: VersionProskillPublicStatus_1.VersionProskillPublicStatus.PENDING },
                        ],
                    },
                    {
                        id: { [sequelize_1.Op.notIn]: [versionId] },
                    },
                    { companyGroupCode: companyGroupCode },
                ],
            });
            const rejectComment = await this.proSkillSettingRepository.getRejectComment(versionId);
            const settersAndApprovers = versionProSkill.skill.skillRoles.reduce((acc, skillRole) => {
                if (skillRole.role == 1) {
                    acc['setters'].push(skillRole.user.fullName);
                }
                else if (skillRole.role == 2) {
                    acc['approvers'].push(skillRole.user.fullName);
                }
                return acc;
            }, { setters: [], approvers: [] });
            const versionResponse = {
                versionId: versionProSkill.id,
                skill: versionProSkill.skill.name,
                userUpdated: versionProSkill.user.fullName,
                updated: versionProSkill.updatedTime,
                publicStatus: versionProSkill.publicStatus,
                status: versionProSkill.status,
                version: `${versionProSkill.version}.${versionProSkill.subVersion}`,
                publicDate: versionProSkill.publicDate,
                reason: versionProSkill.reason,
                versionMain: versionProSkill.version,
                versionSub: versionProSkill.subVersion,
                lastUpdatedTime: versionProSkill.lastUpdatedTime,
                children: versionProSkill.listProSkills,
                settersAndApprovers: settersAndApprovers,
                rejectComment: (rejectComment === null || rejectComment === void 0 ? void 0 : rejectComment.comment) || '',
            };
            return Object.assign(Object.assign({ skillActive: versionProSkill.skill.active }, versionResponse), { editAlready: editAlreadys > 0 });
        }
        else {
            throw new RuntimeException_1.RuntimeException('Version not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async listVersionPublic(companyGroupCode) {
        const datas = await this.proSkillSettingRepository.detailProSkillByCondition({
            [sequelize_1.Op.and]: [
                {
                    publicStatus: 1,
                    companyGroupCode: companyGroupCode,
                },
            ],
        });
        return datas;
    }
};
__decorate([
    (0, common_1.Inject)(proSkillSetting_repository_1.ProSkillSettingRepository),
    __metadata("design:type", proSkillSetting_repository_1.ProSkillSettingRepository)
], ProSkillSettingServices.prototype, "proSkillSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(adminEvaluation_repository_1.AdminEvaluationRepository),
    __metadata("design:type", Object)
], ProSkillSettingServices.prototype, "adminEvaluation", void 0);
__decorate([
    (0, common_1.Inject)(versionSetting_repository_1.VersionSettingRepository),
    __metadata("design:type", Object)
], ProSkillSettingServices.prototype, "versionSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(department_repository_1.DepartmentRepository),
    __metadata("design:type", department_repository_1.DepartmentRepository)
], ProSkillSettingServices.prototype, "departmentRepository", void 0);
ProSkillSettingServices = __decorate([
    (0, common_1.Injectable)()
], ProSkillSettingServices);
exports.ProSkillSettingServices = ProSkillSettingServices;
//# sourceMappingURL=proSkillSetting.service.js.map