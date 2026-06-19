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
exports.ProSkillServices = void 0;
const common_1 = require("@nestjs/common");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const VersionProSkillDto_1 = require("../model/response/VersionProSkillDto");
const proSkill_repository_1 = require("../repository/proSkill.repository");
const proSkillSetting_repository_1 = require("../repository/proSkillSetting.repository");
const mail_service_1 = require("./mail.service");
const util_1 = require("../common/util");
let ProSkillServices = class ProSkillServices {
    async searchListApprovalProSkill(query, userId, companyGroupCode) {
        return await this.proSkillRepository.searchListApprovalProSkill(query, userId, companyGroupCode);
    }
    async getSkillByRoleUser(userId, companyGroupCode) {
        return await this.proSkillRepository.getSkillByRoleUser(userId, companyGroupCode);
    }
    async getDetailProSkillVersion(versionId, role, skillId, userId, companyGroupCode) {
        var _a;
        const checkRole = await this.proSkillRepository.checkPermissionApproverOfSkill(userId, skillId);
        if (checkRole === null)
            throw new RuntimeException_1.RuntimeException('User not permission approve', 406);
        const datas = await this.proSkillSettingRepository.getDetailProSkillByVersionId(versionId);
        const rejectComment = await this.proSkillSettingRepository.getRejectComment(versionId);
        const dataSettersAndApprovers = await this.proSkillSettingRepository.getProskillSettersAndApproversForSkillId(skillId);
        const listSettersAndApprovers = dataSettersAndApprovers.reduce((acc, current) => {
            if (current.role == 1) {
                acc['setters'].push(current.user.fullName);
            }
            else if (current.role == 2) {
                acc['approvers'].push(current.user.fullName);
            }
            return acc;
        }, { setters: [], approvers: [] });
        const skill = await this.proSkillSettingRepository.findOneVersionProSkill({
            id: versionId,
        });
        if (datas.length > 0) {
            const arrays = datas.reduce((acc, current) => {
                acc[current.versionId] = {
                    skill: current.versionProSkill.skill.name,
                    versionId: current.versionId,
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
                    listSettersAndApprovers,
                    rejectComment: (rejectComment === null || rejectComment === void 0 ? void 0 : rejectComment.comment) || '',
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
                const versionPublics = await this.proSkillSettingRepository.getVersionPublicProSkill(skill.skillId, companyGroupCode);
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
                            sort: versionPublics[index].id,
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
                results.children.push(...arrayDeletes);
                return Object.assign({}, results);
            }
            else {
                return Object.assign({}, (arrays[`${versionId}`] || []));
            }
        }
        else {
            const arraySteps = await this.proSkillSettingRepository.findOneVersionProSkill({
                id: versionId,
            });
            return Object.assign(Object.assign({}, arraySteps.dataValues), { version: `${arraySteps.dataValues.version}.${arraySteps.dataValues.subVersion}`, userUpdated: arraySteps.dataValues.user.fullName, children: [] });
        }
    }
    async approveProSkill(versionId, comment, statusProSkill, creationUser, updateTime, hostName, skillId, companyGroupCode, timeZone) {
        const checkRole = await this.proSkillRepository.checkPermissionApproverOfSkill(creationUser, skillId);
        if (checkRole === null)
            throw new RuntimeException_1.RuntimeException('User not permission approve', 406);
        const proSkillDetail = await this.proSkillRepository.getProSkillDetailById(versionId);
        if (updateTime !== proSkillDetail.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Pro skill is duplicate', 409);
        const checkListProSkillPendingToApproves = await this.proSkillRepository.checkProSkillPendingStatusInDepartmentToApprove(proSkillDetail.skillId, companyGroupCode);
        if (checkListProSkillPendingToApproves.length === 0) {
            await this.proSkillRepository.changeCurrentStatusProSkillToApproved(versionId, creationUser);
            const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone));
            await this.proSkillRepository.createHistoryApproveOrRejectProSkill(versionId, comment, statusProSkill, creationUser, dates);
            await this.mailService.sendMailApproveProSkillToAdmin(proSkillDetail, hostName, companyGroupCode);
            await this.mailService.sendMailApproveProSkillToOther(proSkillDetail, creationUser, hostName, companyGroupCode);
            return { result: 'approved' };
        }
        else {
            return { result: 'notApproved' };
        }
    }
    async rejectProSkill(versionId, comment, statusProSkill, creationUser, updateTime, hostName, skillId, companyGroupCode, timeZone) {
        const checkRole = await this.proSkillRepository.checkPermissionApproverOfSkill(creationUser, skillId);
        if (checkRole === null)
            throw new RuntimeException_1.RuntimeException('User not permission approve', 406);
        const proSkillDetail = await this.proSkillRepository.getProSkillDetailById(versionId);
        if (updateTime !== proSkillDetail.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Pro skill is duplicate', 409);
        await this.proSkillRepository.changeCurrentStatusProSkillToRejected(versionId, creationUser);
        const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone));
        await this.proSkillRepository.createHistoryApproveOrRejectProSkill(versionId, comment, statusProSkill, creationUser, dates);
        await this.mailService.sendMailRejectProSkill(proSkillDetail, creationUser, hostName, companyGroupCode);
        return true;
    }
    async getDetailProSkillPublicOfSkill(skillId, companyGroupCode) {
        var _a, _b;
        let listProSkills;
        const versionProSkillDto = new VersionProSkillDto_1.VersionProSkillDto();
        const skillInfo = await this.proSkillRepository.getSkilltById(skillId, companyGroupCode);
        const skill = skillInfo.name;
        const versionProSkill = await this.proSkillRepository.getVersionProSkillPublicOfSkill(skillId, companyGroupCode);
        if (versionProSkill === null || versionProSkill === void 0 ? void 0 : versionProSkill.id) {
            const dataSettersAndApprovers = await this.proSkillSettingRepository.getProskillSettersAndApproversForSkillId(skillId);
            const listSettersAndApprovers = dataSettersAndApprovers.reduce((acc, current) => {
                if (current.role == 1) {
                    acc['setters'].push(current.user.fullName);
                }
                else if (current.role == 2) {
                    acc['approvers'].push(current.user.fullName);
                }
                return acc;
            }, { setters: [], approvers: [] });
            listProSkills =
                await this.proSkillSettingRepository.getListProSkillByVersionId(versionProSkill === null || versionProSkill === void 0 ? void 0 : versionProSkill.id);
            versionProSkillDto.id = versionProSkill.id;
            versionProSkillDto.skill = (_a = versionProSkill.skill) === null || _a === void 0 ? void 0 : _a.name;
            versionProSkillDto.userUpdated = (_b = versionProSkill.user) === null || _b === void 0 ? void 0 : _b.fullName;
            versionProSkillDto.lastUpdatedTime = versionProSkill.lastUpdatedTime;
            versionProSkillDto.publicStatus = versionProSkill.publicStatus;
            versionProSkillDto.status = versionProSkill.status;
            versionProSkillDto.version = `${versionProSkill.version}.${versionProSkill.subVersion}`;
            versionProSkillDto.publicDate = versionProSkill.publicDate;
            versionProSkillDto.reason = versionProSkill.reason;
            versionProSkillDto.versionMain = versionProSkill.version;
            versionProSkillDto.versionSub = versionProSkill.subVersion;
            versionProSkillDto.settersAndApprovers = listSettersAndApprovers;
            versionProSkillDto.children = [];
            if (listProSkills.length > 0) {
                listProSkills.map((item, index) => {
                    versionProSkillDto.children.push({
                        itemId: item.itemId,
                        versionId: item.versionId,
                        jobType: item.jobType,
                        mediumClass: item.mediumClass,
                        smallClass: item.smallClass,
                        content: item.content,
                        difficulty: item.difficulty,
                        note: item.note,
                        key: index,
                    });
                });
            }
        }
        return {
            result: versionProSkillDto,
            skill: skill,
        };
    }
    async checkPermissionApproverOfDepartment(userId, departmentId) {
        return await this.proSkillRepository.checkPermissionApproverOfSkill(userId, departmentId);
    }
    async getListDep_TempExport(year, periodIndex, role, companyGroupCode) {
        return await this.proSkillRepository.getListDep_TempExport(year, periodIndex, role, companyGroupCode);
    }
    async dep_TempProSkillExport(year, periodIndex, role, listSelected, companyGroupCode) {
        if (role == 'f3' || role == 'f4') {
            return await this.proSkillRepository.getDataExportProSkill(year, periodIndex, role, listSelected, companyGroupCode);
        }
        else if (role == 'f6') {
            return await this.proSkillRepository.getDataExportProSkill(year, periodIndex, role, listSelected, companyGroupCode);
        }
    }
    async getItemsTemplateProSkill(versionId) {
        return await this.proSkillRepository.listItemTemplate(versionId);
    }
};
__decorate([
    (0, common_1.Inject)(proSkill_repository_1.ProSkillRepository),
    __metadata("design:type", proSkill_repository_1.ProSkillRepository)
], ProSkillServices.prototype, "proSkillRepository", void 0);
__decorate([
    (0, common_1.Inject)(proSkillSetting_repository_1.ProSkillSettingRepository),
    __metadata("design:type", proSkillSetting_repository_1.ProSkillSettingRepository)
], ProSkillServices.prototype, "proSkillSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], ProSkillServices.prototype, "mailService", void 0);
ProSkillServices = __decorate([
    (0, common_1.Injectable)()
], ProSkillServices);
exports.ProSkillServices = ProSkillServices;
//# sourceMappingURL=proSkill.service.js.map