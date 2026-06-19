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
exports.ManagementEvaluationService = void 0;
const common_1 = require("@nestjs/common");
const managementEvaluation_repository_1 = require("../repository/managementEvaluation.repository");
let ManagementEvaluationService = class ManagementEvaluationService {
    async getSettingEvaluationSkills(props, companyGroupCode) {
        var _a, _b, _c, _d, _e, _f;
        const { skillId, limit, offset, detailed } = props;
        const skills = [];
        const { results, count } = await this.managementEvaluationRepo.getAllSkills(skillId, detailed, limit, offset, companyGroupCode);
        if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                const sk = results[i];
                const item = {
                    skillId: sk.id,
                    skillName: `${sk.name}`,
                    skillSetters: (_b = (_a = sk.skillRoles) === null || _a === void 0 ? void 0 : _a.filter((x) => x.role === 1).map((skr) => {
                        var _a, _b;
                        return ({
                            id: (_a = skr.user) === null || _a === void 0 ? void 0 : _a.id,
                            fullName: (_b = skr.user) === null || _b === void 0 ? void 0 : _b.fullName,
                        });
                    }).sort((a, b) => Number(a.id) - Number(b.id))) !== null && _b !== void 0 ? _b : [],
                    skillApprovers: (_d = (_c = sk.skillRoles) === null || _c === void 0 ? void 0 : _c.filter((x) => x.role === 2).map((skr) => ({
                        id: skr.user.id,
                        fullName: skr.user.fullName,
                    })).sort((a, b) => Number(a.id) - Number(b.id))) !== null && _d !== void 0 ? _d : [],
                    skillDepartments: (_f = (_e = sk.skills) === null || _e === void 0 ? void 0 : _e.map((dep) => {
                        var _a, _b, _c;
                        return ({
                            departmentId: (_a = dep.department) === null || _a === void 0 ? void 0 : _a.id,
                            departmentName: (_b = dep.department) === null || _b === void 0 ? void 0 : _b.name,
                            departmentType: (_c = dep.department) === null || _c === void 0 ? void 0 : _c.type,
                        });
                    })) !== null && _f !== void 0 ? _f : [],
                    key: `skills-key-${sk.id}`,
                };
                skills.push(item);
            }
        }
        return { dataList: skills, count };
    }
    async deleteAdminEvalutionSkill(skillId) {
        const countSkillVersions = await this.managementEvaluationRepo.countSkillVersions(skillId);
        if (countSkillVersions > 0) {
            return {
                code: 400,
                reason: "Can't delete because user or department uses this skill!",
            };
        }
        await this.managementEvaluationRepo.deleteAdminEvalutionSkill(skillId);
        return {
            code: 200,
            reason: true,
        };
    }
    convertArrayDepartmentApproverSetter(results) {
        var _a, _b;
        const settingProList = [];
        if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i];
                const types = [];
                if (element.setting === 1)
                    types.push('課');
                if (element.divisionId !== null)
                    types.push('部署');
                if (element.groupId !== null)
                    types.push('グループ');
                const item = {
                    typeD: element.type,
                    id: element.id,
                    departmentName: `${element.code}: ${element.name}`,
                    departmentId: element.id,
                    type: types === null || types === void 0 ? void 0 : types.join('、'),
                    skillSetters: [],
                    skillApprovers: [],
                    key: `department-roles-key-${element.id}`,
                    isCheckedDep: element.setting === 1,
                    isCheckedDiv: element.divisionId !== null,
                    isCheckedGroup: element.groupId !== null,
                    group: element.groupId || undefined,
                    groups: element.groupId
                        ? (_a = element === null || element === void 0 ? void 0 : element.groups) === null || _a === void 0 ? void 0 : _a.map((v) => v.groupId === null ? [] : [v.groupId])
                        : [],
                };
                if (((_b = element.departmentRoles) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    const skillSetters = element.departmentRoles.filter((f) => f.role === 1);
                    const skillApprovers = element.departmentRoles.filter((f) => f.role === 2);
                    item.skillSetters.push(...skillSetters.map((v) => {
                        var _a, _b;
                        return ({
                            fullName: (_a = v.user) === null || _a === void 0 ? void 0 : _a.fullName,
                            id: (_b = v.user) === null || _b === void 0 ? void 0 : _b.id,
                        });
                    }));
                    item.skillApprovers.push(...skillApprovers.map((v) => {
                        var _a, _b;
                        return ({
                            fullName: (_a = v.user) === null || _a === void 0 ? void 0 : _a.fullName,
                            id: (_b = v.user) === null || _b === void 0 ? void 0 : _b.id,
                        });
                    }));
                }
                if (item.groups.filter((f) => f.length === 0).length ===
                    item.groups.length) {
                    item.isCheckedGroup = false;
                    item.type = item.type
                        .replace('、グループ', '')
                        .replace('グループ', '');
                }
                settingProList.push(item);
            }
        }
        return settingProList;
    }
    async getUserActive(companyGroupCode) {
        const users = await this.managementEvaluationRepo.getUserActive(companyGroupCode);
        const setters = users.filter((f) => f.roles.some((s) => s.id === 3));
        const approvers = users.filter((f) => f.roles.some((s) => s.id === 4));
        return { setters, approvers };
    }
};
__decorate([
    (0, common_1.Inject)(managementEvaluation_repository_1.ManagementEvaluationRepository),
    __metadata("design:type", managementEvaluation_repository_1.ManagementEvaluationRepository)
], ManagementEvaluationService.prototype, "managementEvaluationRepo", void 0);
ManagementEvaluationService = __decorate([
    (0, common_1.Injectable)()
], ManagementEvaluationService);
exports.ManagementEvaluationService = ManagementEvaluationService;
//# sourceMappingURL=managementEvaluation.service.js.map