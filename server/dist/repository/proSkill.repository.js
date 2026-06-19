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
exports.ProSkillRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Department_1 = require("../entity/Department");
const ListProSkill_1 = require("../entity/ListProSkill");
const Skill_1 = require("../entity/Skill");
const SkillRole_1 = require("../entity/SkillRole");
const User_1 = require("../entity/User");
const VersionProSkill_1 = require("../entity/VersionProSkill");
let ProSkillRepository = class ProSkillRepository {
    async searchListApprovalProSkill(query, userId, companyGroupCode) {
        let publicStatus = query.publicStatus;
        let status = query.status;
        let skill = query.skill;
        const limit = query.limit;
        const offset = query.offset;
        if (status === 'すべて')
            status = null;
        if (publicStatus === 'すべて')
            publicStatus = null;
        if (skill === 'すべて') {
            skill = null;
        }
        else {
            skill = parseInt(skill[0].trim());
        }
        const listSkillApproveOfUsers = await this.skillRoleEntity.findAll({
            attributes: ['skillId'],
            where: {
                userId: userId,
                role: 2,
            },
            include: {
                model: Skill_1.Skill,
                as: 'skill',
                where: {
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
            },
        });
        const listSkillIdApproveOfUsers = [];
        listSkillApproveOfUsers.map((item) => {
            listSkillIdApproveOfUsers.push(item.skillId);
        });
        const datas = await this.versionProSkillEntity.findAll({
            attributes: { exclude: ['reason', 'createdTime', 'updatedTime'] },
            where: {
                skillId: skill || {
                    [sequelize_1.Op.and]: [
                        {
                            [sequelize_1.Op.not]: null,
                        },
                        {
                            [sequelize_1.Op.in]: listSkillIdApproveOfUsers,
                        },
                    ],
                },
                status: status || {
                    [sequelize_1.Op.and]: [
                        {
                            [sequelize_1.Op.not]: null,
                        },
                        {
                            [sequelize_1.Op.notIn]: [
                                1, 2,
                            ],
                        },
                    ],
                },
                publicStatus: publicStatus || { [sequelize_1.Op.not]: null },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name'],
                    where: {
                        active: 1,
                        companyGroupCode: companyGroupCode,
                    },
                },
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'employeeNumber', 'fullName'],
                },
            ],
            order: [
                [{ model: Skill_1.Skill, as: 'skill' }, 'name', 'ASC'],
                ['version', 'DESC'],
                ['subVersion', 'DESC'],
            ],
            offset: offset,
            limit: limit,
        });
        const counts = await this.versionProSkillEntity.count({
            where: {
                skillId: skill || {
                    [sequelize_1.Op.and]: [
                        {
                            [sequelize_1.Op.not]: null,
                        },
                        {
                            [sequelize_1.Op.in]: listSkillIdApproveOfUsers,
                        },
                    ],
                },
                status: status || {
                    [sequelize_1.Op.and]: [
                        {
                            [sequelize_1.Op.not]: null,
                        },
                        {
                            [sequelize_1.Op.notIn]: [
                                1, 2,
                            ],
                        },
                    ],
                },
                publicStatus: publicStatus || { [sequelize_1.Op.not]: null },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name'],
                    where: {
                        active: 1,
                        companyGroupCode: companyGroupCode,
                    },
                },
            ],
        });
        return { data: datas, counts: counts };
    }
    async getSkillByRoleUser(userId, companyGroupCode) {
        const datas = await this.skillRoleEntity.findAll({
            attributes: [],
            where: {
                userId: userId,
                role: 2,
            },
            include: {
                model: Skill_1.Skill,
                as: 'skill',
                where: {
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
            },
            order: [
                [{ model: Skill_1.Skill, as: 'skill' }, 'name', 'ASC'],
            ],
        });
        const results = datas.map((e) => {
            return e.skill;
        });
        return results;
    }
    async detailProSkill(versionId) {
        const datas = await this.listProSkillEntity.findAll({
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
                    as: 'versionProSkill',
                    required: true,
                    where: {
                        id: versionId,
                    },
                    include: [
                        {
                            model: Skill_1.Skill,
                            as: 'skill',
                            attributes: ['id', 'name', 'active'],
                            include: [
                                {
                                    model: SkillRole_1.SkillRole,
                                    as: 'skillRoles',
                                    attributes: ['role'],
                                    include: [
                                        {
                                            model: User_1.User,
                                            as: 'user',
                                            attributes: ['employeeNumber', 'fullName', 'id'],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            model: User_1.User,
                            as: 'user',
                            attributes: ['id', 'fullName'],
                        },
                    ],
                },
            ],
            order: [['id', 'ASC']],
        });
        return datas;
    }
    async getVersionPublic() {
        const datas = await this.listProSkillEntity.findAll({
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
                    as: 'versionProSkill',
                    required: true,
                    where: {
                        publicStatus: 1,
                    },
                },
            ],
        });
        return datas;
    }
    async createHistoryApproveOrRejectProSkill(versionId, comment, status, creationUser, createTime) {
        return await this.historyApproveProSkillEntity.create({
            versionId,
            comment,
            status,
            creationUser,
            createdTime: createTime,
        });
    }
    async getProSkillById(id) {
        const result = await this.versionProSkillEntity.findOne({
            where: { id },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name', 'active'],
                    include: [
                        {
                            model: SkillRole_1.SkillRole,
                            as: 'skillRoles',
                            attributes: ['role'],
                            include: [
                                {
                                    model: User_1.User,
                                    as: 'user',
                                    attributes: ['employeeNumber', 'fullName', 'id'],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName'],
                },
            ],
        });
        return result;
    }
    async changeCurrentStatusProSkillToApproved(id, _userId) {
        return await this.versionProSkillEntity.update({ status: 4, publicStatus: 2 }, { where: { id: id } });
    }
    async changeCurrentStatusProSkillToRejected(id, _userId) {
        return await this.versionProSkillEntity.update({ status: 5 }, { where: { id: id } });
    }
    async checkProSkillPendingStatusInDepartmentToApprove(id, companyGroupCode) {
        const datas = await this.versionProSkillEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        skillId: id,
                        publicStatus: 2,
                        companyGroupCode: companyGroupCode,
                    },
                ],
            },
        });
        return datas;
    }
    async getDepartmentById(id) {
        const result = await this.departmentEntity.findOne({
            attributes: ['code', 'name', 'id', 'type'],
            where: { id },
        });
        return result;
    }
    async checkPermissionApproverOfSkill(userId, skillId) {
        const result = await this.skillRoleEntity.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        skillId: skillId,
                        role: 2,
                        userId: userId,
                    },
                ],
            },
        });
        return result;
    }
    async findEvaluationItemsProSkill(query) {
        let publicStatus = query.publicStatus;
        let status = query.status;
        let skill = query.skill;
        const limit = query.limit;
        const offset = query.offset;
        const companyGroupCode = query.companyGroupCode;
        if (status === 'すべて')
            status = null;
        if (publicStatus === 'すべて')
            publicStatus = null;
        if (publicStatus === '公開待ち')
            publicStatus = 2;
        if (skill === 'すべて') {
            skill = null;
        }
        else {
            skill = parseInt(skill[0].trim());
        }
        const datas = await this.versionProSkillEntity.findAll({
            where: {
                status: status || { [sequelize_1.Op.in]: [1, 2, 3, 4, 5] },
                skillId: skill || { [sequelize_1.Op.not]: null },
                publicStatus: publicStatus || { [sequelize_1.Op.not]: null },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name'],
                    where: {
                        active: 1,
                    },
                },
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'employeeNumber', 'fullName'],
                },
            ],
            order: [
                [{ model: Skill_1.Skill, as: 'skill' }, 'name', 'ASC'],
                ['version', 'DESC'],
                ['subVersion', 'DESC'],
            ],
            offset: offset,
            limit: limit,
        });
        const counts = await this.versionProSkillEntity.count({
            where: {
                status: status || { [sequelize_1.Op.in]: [1, 2, 3, 4, 5] },
                skillId: skill || { [sequelize_1.Op.not]: null },
                publicStatus: publicStatus || { [sequelize_1.Op.not]: null },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name'],
                    where: {
                        active: 1,
                    },
                },
            ],
            distinct: true,
        });
        return { data: datas, counts: counts };
    }
    async versionMax(fields, where) {
        return await this.versionProSkillEntity.max(fields, {
            where: where,
        });
    }
    async updateVersion(object, where, transaction) {
        return (await this.versionProSkillEntity
            .update(object, {
            where: where,
            returning: true,
            transaction: transaction,
        })
            .then(([_, data]) => data)).map((data) => data && data.get({ plain: true }));
    }
    createHistory(object, transaction) {
        return this.historyApproveProSkillEntity.create(object, {
            transaction: transaction,
        });
    }
    async getVersionPublicOfDivision(departmentId) {
        const datas = await this.listProSkillEntity.findAll({
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
                    as: 'versionProSkill',
                    required: true,
                    where: {
                        publicStatus: 1,
                        departmentId: departmentId,
                    },
                    include: [
                        {
                            model: Department_1.Department,
                            where: {
                                type: 1,
                                active: 1,
                            },
                        },
                    ],
                },
            ],
        });
        return datas;
    }
    async getVersionPublicOfDepartment(departmentId) {
        const datas = await this.listProSkillEntity.findAll({
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
                    as: 'versionProSkill',
                    required: true,
                    where: {
                        publicStatus: 1,
                        departmentId: departmentId,
                    },
                    include: [
                        {
                            model: Department_1.Department,
                            where: {
                                type: 0,
                                active: 1,
                            },
                        },
                    ],
                },
            ],
        });
        return datas;
    }
    async buildCreate(array, transaction) {
        return await this.versionProSkillEntity.bulkCreate(array, {
            transaction: transaction,
        });
    }
    async adminEvaluationDetailProSkillById(id) {
        return await this.versionProSkillEntity.sequelize.query(`SELECT version_pro_skill_tbl.id as id,version_pro_skill_tbl.version as version, 
        version_pro_skill_tbl.sub_version as "subVersion",
        version_pro_skill_tbl.department_id as "departmentId",
        version_pro_skill_tbl.status as status,
        version_pro_skill_tbl.public_status as "publicStatus", 
        version_pro_skill_tbl.reason as reason,
        version_pro_skill_tbl.updated_time as "updatedTime",
        version_pro_skill_tbl.public_date as "publicDate"
        ,divisionSubClass."departmentIdSub",
        divisionSubClass."departmentCodeSub",  
        divisionSubClass."departmentNameSub",
        divisionSubClass."departmentIdSub", 
        department_tbl.type,
        list_pro_skill_tbl.item_id as "itemId",
        list_pro_skill_tbl.job_type as "jobType",
        list_pro_skill_tbl.medium_class as "mediumClass",
        list_pro_skill_tbl.small_class as "smallClass",
        list_pro_skill_tbl.difficulty, list_pro_skill_tbl.note,
        list_pro_skill_tbl.id as "idListProSkill",
        list_pro_skill_tbl.content as "content",
        user_tbl.full_name as "fullName",
        department_tbl.code as "departmentCode",
        department_tbl.name as "departmentName"
        FROM version_pro_skill_tbl 
        LEFT JOIN department_tbl ON department_tbl.id = version_pro_skill_tbl.department_id
        LEFT JOIN (SELECT division_subclass_tbl.department_id as "departmentIdSub",
              division_subclass_tbl.division_id as "divisionSub",
              department_tbl.code as "departmentCodeSub", 
              department_tbl.name as "departmentNameSub",
              department_tbl.type as "departmentTypeSub"
              FROM division_subclass_tbl 
              INNER JOIN department_tbl on department_tbl.id = division_subclass_tbl.department_id) as divisionSubClass
              ON divisionSubClass."divisionSub" = department_tbl.id
        LEFT JOIN list_pro_skill_tbl ON list_pro_skill_tbl.version_id = version_pro_skill_tbl.id
        LEFT JOIN user_tbl ON user_tbl.id = version_pro_skill_tbl.creation_user
        WHERE version_pro_skill_tbl.id = :id limit 100`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                id: id,
            },
        });
    }
    async getProSkillDetailById(id) {
        const result = await this.versionProSkillEntity.findOne({
            where: { id },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: SkillRole_1.SkillRole,
                            as: 'skillRoles',
                            attributes: ['role'],
                            include: [
                                {
                                    model: User_1.User,
                                    as: 'user',
                                    attributes: ['employeeNumber', 'fullName', 'id'],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName'],
                },
            ],
        });
        return result;
    }
    async getSkilltById(id, companyGroupCode) {
        const result = await this.skillEntity.findOne({
            attributes: ['name', 'id'],
            where: { id: id, companyGroupCode: companyGroupCode },
        });
        return result;
    }
    async getVersionProSkillPublicOfSkill(skillId, companyGroupCode) {
        const result = await this.versionProSkillEntity.findOne({
            attributes: { exclude: ['reason', 'createdTime', 'updatedTime'] },
            where: {
                [sequelize_1.Op.and]: [
                    { skillId: skillId },
                    { publicStatus: 1 },
                    { companyGroupCode: companyGroupCode },
                ],
            },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: SkillRole_1.SkillRole,
                            as: 'skillRoles',
                            attributes: ['id', 'userId', 'role'],
                            include: [
                                {
                                    model: User_1.User,
                                    as: 'user',
                                    attributes: ['id', 'fullName'],
                                },
                            ],
                        },
                    ],
                },
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName'],
                },
            ],
        });
        return result;
    }
    async insertHistoryPublicProSkill(year, periodIndex, companyGroupCode) {
        const count = await this.historyPublicProSkillEntity.count({
            where: {
                year,
                periodIndex,
                companyGroupCode,
            },
        });
        if (!count) {
            const datasBulk = [];
            const listVersionProPublic = await this.versionProSkillEntity.findAll({
                attributes: ['id', 'skillId'],
                where: {
                    publicStatus: 1,
                    status: 4,
                    companyGroupCode: companyGroupCode,
                },
            });
            for (let i = 0; i < (listVersionProPublic === null || listVersionProPublic === void 0 ? void 0 : listVersionProPublic.length); i++) {
                const versionProSkill = listVersionProPublic[i];
                const skillGroups = await this.skillGroupEntity.findAll({
                    attributes: ['departmentId'],
                    where: {
                        skillId: versionProSkill.skillId,
                    },
                });
                for (let j = 0; j < (skillGroups === null || skillGroups === void 0 ? void 0 : skillGroups.length); j++) {
                    const data = {
                        year: year,
                        periodIndex: periodIndex,
                        versionId: versionProSkill.id,
                        skillId: versionProSkill.skillId,
                        departmentId: skillGroups[j].departmentId,
                        companyGroupCode: companyGroupCode,
                    };
                    datasBulk.push(data);
                }
            }
            await this.historyPublicProSkillEntity.destroy({
                where: {
                    year: year,
                    periodIndex: periodIndex,
                    companyGroupCode: companyGroupCode,
                },
            });
            await this.historyPublicProSkillEntity.bulkCreate(datasBulk);
        }
    }
    async getListDep_TempExport(year, periodIndex, role, companyGroupCode) {
        let listResult = [];
        if (role == 'f3' || role == 'f4') {
            const result = await this.historyPublicProSkillEntity.findAll({
                where: {
                    year: year,
                    periodIndex: periodIndex,
                    departmentId: { [sequelize_1.Op.not]: null },
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Department_1.Department,
                        as: 'department',
                        attributes: ['id', 'name'],
                    },
                ],
                order: [[{ model: Department_1.Department, as: 'department' }, 'name', 'ASC']],
            });
            if (result.length > 0) {
                const uniqueListDep = result.filter((obj, index) => {
                    return (index ===
                        result.findIndex((o) => { var _a, _b; return ((_a = obj.department) === null || _a === void 0 ? void 0 : _a.id) === ((_b = o.department) === null || _b === void 0 ? void 0 : _b.id); }));
                });
                if (uniqueListDep.length > 0) {
                    uniqueListDep.map((item) => {
                        var _a, _b;
                        listResult.push({
                            id: (_a = item.department) === null || _a === void 0 ? void 0 : _a.id,
                            name: (_b = item.department) === null || _b === void 0 ? void 0 : _b.name,
                        });
                    });
                }
                return listResult;
            }
            else {
                return [];
            }
        }
        else if (role == 'f6') {
            const result = await this.historyPublicProSkillEntity.findAll({
                where: {
                    year: year,
                    periodIndex: periodIndex,
                    skillId: { [sequelize_1.Op.not]: null },
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Skill_1.Skill,
                        as: 'skill',
                        attributes: ['id', 'name'],
                    },
                ],
                order: [[{ model: Skill_1.Skill, as: 'skill' }, 'name', 'ASC']],
            });
            if (result.length > 0) {
                const uniqueListTemp = result.filter((obj, index) => {
                    return (index === result.findIndex((o) => { var _a, _b; return ((_a = obj.skill) === null || _a === void 0 ? void 0 : _a.id) === ((_b = o.skill) === null || _b === void 0 ? void 0 : _b.id); }));
                });
                if (uniqueListTemp.length > 0) {
                    uniqueListTemp.map((item) => {
                        var _a, _b;
                        listResult.push({
                            id: (_a = item.skill) === null || _a === void 0 ? void 0 : _a.id,
                            name: (_b = item.skill) === null || _b === void 0 ? void 0 : _b.name,
                        });
                    });
                }
                return listResult;
            }
            else {
                return [];
            }
        }
    }
    async getDataExportProSkill(year, periodIndex, role, listSelected, companyGroupCode) {
        if (role == 'f3' || role == 'f4') {
            const result = await this.historyPublicProSkillEntity.findAll({
                where: {
                    year: year,
                    periodIndex: periodIndex,
                    departmentId: listSelected,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Department_1.Department,
                        as: 'department',
                        attributes: ['name'],
                    },
                    {
                        model: VersionProSkill_1.VersionProSkill,
                        as: 'versionProSkill',
                        include: [
                            {
                                model: ListProSkill_1.ListProSkill,
                                as: 'listProSkills',
                            },
                        ],
                    },
                ],
                order: [[{ model: Department_1.Department, as: 'department' }, 'name', 'ASC']],
            });
            const listData = [];
            result.map((item) => {
                var _a, _b;
                (_b = (_a = item.versionProSkill) === null || _a === void 0 ? void 0 : _a.listProSkills) === null || _b === void 0 ? void 0 : _b.map((item2) => {
                    var _a;
                    listData.push({
                        departmentName: ((_a = item.department) === null || _a === void 0 ? void 0 : _a.name) || ' ',
                        jobType: item2.jobType || ' ',
                        mediumClass: item2.mediumClass || ' ',
                        smallClass: item2.smallClass || ' ',
                        content: item2.content || ' ',
                        difficulty: item2.difficulty || ' ',
                        note: item2.note || ' ',
                    });
                });
            });
            return listData;
        }
        else if (role == 'f6') {
            const result = await this.historyPublicProSkillEntity.findAll({
                where: {
                    year: year,
                    periodIndex: periodIndex,
                    skillId: listSelected,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Department_1.Department,
                        as: 'department',
                        attributes: ['name'],
                    },
                    {
                        model: Skill_1.Skill,
                        as: 'skill',
                        attributes: ['name'],
                    },
                    {
                        model: VersionProSkill_1.VersionProSkill,
                        as: 'versionProSkill',
                        include: [
                            {
                                model: ListProSkill_1.ListProSkill,
                                as: 'listProSkills',
                            },
                        ],
                    },
                ],
                order: [[{ model: Skill_1.Skill, as: 'skill' }, 'name', 'ASC']],
            });
            const listData = [];
            result.map((item) => {
                var _a, _b;
                (_b = (_a = item.versionProSkill) === null || _a === void 0 ? void 0 : _a.listProSkills) === null || _b === void 0 ? void 0 : _b.map((item2) => {
                    var _a, _b;
                    listData.push({
                        skillName: ((_a = item.skill) === null || _a === void 0 ? void 0 : _a.name) || ' ',
                        departmentName: ((_b = item.department) === null || _b === void 0 ? void 0 : _b.name) || ' ',
                        jobType: item2.jobType || ' ',
                        mediumClass: item2.mediumClass || ' ',
                        smallClass: item2.smallClass || ' ',
                        content: item2.content || ' ',
                        difficulty: item2.difficulty || ' ',
                        note: item2.note || ' ',
                    });
                });
            });
            return listData;
        }
    }
    async listItemTemplate(versionId) {
        return await this.listProSkillEntity.findAll({
            where: {
                versionId: versionId,
            },
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_PRO_SKILL),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "versionProSkillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_GROUP),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "skillGroupEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.LIST_PRO_SKILL),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "listProSkillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "departmentEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_APPROVE_PRO_SKILL),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "historyApproveProSkillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_ROLE),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "skillRoleEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "skillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_PUBLIC_PRO_SKILL),
    __metadata("design:type", Object)
], ProSkillRepository.prototype, "historyPublicProSkillEntity", void 0);
ProSkillRepository = __decorate([
    (0, common_1.Injectable)()
], ProSkillRepository);
exports.ProSkillRepository = ProSkillRepository;
//# sourceMappingURL=proSkill.repository.js.map