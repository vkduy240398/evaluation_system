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
exports.ProSkillSettingRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Department_1 = require("../entity/Department");
const ListProSkill_1 = require("../entity/ListProSkill");
const Skill_1 = require("../entity/Skill");
const SkillRole_1 = require("../entity/SkillRole");
const User_1 = require("../entity/User");
const VersionProSkill_1 = require("../entity/VersionProSkill");
let ProSkillSettingRepository = class ProSkillSettingRepository {
    async getSkillRoleUser(userId, companyGroupCode) {
        const datas = await this.skillRoleEntity.findAll({
            where: {
                userId: userId,
                role: 1,
            },
            include: {
                model: Skill_1.Skill,
                where: { active: 1, companyGroupCode: companyGroupCode },
            },
            order: [['id', 'ASC']],
        });
        return datas;
    }
    async getVersionProSkill(companyGroupCode, status, offset, limit, publicStatus, listSkillId, type) {
        const whereStatus = parseInt(status) !== -1 ? [parseInt(status)] : [1, 2, 3, 4, 5];
        const where = {
            [sequelize_1.Op.and]: [
                {
                    skillId: { [sequelize_1.Op.in]: listSkillId },
                },
                {
                    status: {
                        [sequelize_1.Op.in]: type === '1' ? whereStatus : [4],
                    },
                },
                Object.assign({}, (publicStatus &&
                    publicStatus != -1 && { publicStatus: publicStatus })),
                {
                    companyGroupCode: companyGroupCode,
                },
            ],
        };
        const results = await this.versionProSkillEntity.findAll({
            attributes: [
                'id',
                'version',
                'subVersion',
                'status',
                'publicStatus',
                'publicDate',
                'updatedTime',
                'lastUpdatedTime',
            ],
            where: where,
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
                { model: User_1.User, attributes: ['fullName'] },
            ],
            order: [[{ model: Skill_1.Skill, as: 'skill' }, 'name', 'ASC']],
            limit: limit,
            offset: offset,
        });
        const count = await this.versionProSkillEntity.count({
            where: where,
        });
        return { data: results, total: count };
    }
    async detailProSkill(versionId) {
        const datas = await this.listProSkillEntiny.findAll({
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
                            attributes: ['id', 'name'],
                            include: [
                                {
                                    model: SkillRole_1.SkillRole,
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
                },
            ],
            order: [['id', 'ASC']],
        });
        return datas;
    }
    async getDetailProSkillF3(versionId) {
        const result = await this.versionProSkillEntity.findOne({
            where: { id: versionId },
            include: [
                {
                    model: Skill_1.Skill,
                    attributes: ['id', 'name', 'active'],
                    include: [
                        {
                            model: SkillRole_1.SkillRole,
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
                {
                    model: ListProSkill_1.ListProSkill,
                    attributes: [
                        'id',
                        'itemId',
                        'jobType',
                        'smallClass',
                        'mediumClass',
                        'content',
                        'difficulty',
                        'note',
                    ],
                    as: 'listProSkills',
                    order: ['id', 'ASC'],
                    required: false,
                },
            ],
            order: [[{ model: ListProSkill_1.ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
        });
        return result;
    }
    async getProskillSettersAndApproversForDepartmentId(skillId) {
        const datas = await this.skillRoleEntity.findAll({
            where: { skillId },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName'],
                },
            ],
            order: [['userId', 'ASC']],
        });
        return datas;
    }
    async getDetailProSkillGeneric(versionId, companyGroupCode) {
        const result = await this.versionProSkillEntity.findOne({
            where: Object.assign({ id: versionId }, (companyGroupCode !== undefined && { companyGroupCode })),
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
    async getVersionPublic(skillId, companyGroupCode) {
        const datas = await this.listProSkillEntiny.findAll({
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
                    as: 'versionProSkill',
                    required: true,
                    where: {
                        publicStatus: 1,
                        skillId: skillId,
                        companyGroupCode: companyGroupCode,
                    },
                },
            ],
        });
        return datas;
    }
    async getVersionProSkillDepartment(skillId, offset, limit, companyGroupCode) {
        const where = Object.assign(Object.assign(Object.assign({}, (skillId != -1 && { skillId: skillId })), (companyGroupCode !== undefined && { companyGroupCode })), { publicStatus: 1 });
        const results = await this.versionProSkillEntity.findAndCountAll({
            attributes: [
                'id',
                'version',
                'subVersion',
                'status',
                'publicStatus',
                'publicDate',
                'updatedTime',
                'lastUpdatedTime',
            ],
            where: where,
            include: [
                {
                    model: Skill_1.Skill,
                    attributes: ['id', 'name'],
                    where: {
                        active: 1,
                    },
                },
                { model: User_1.User, attributes: ['fullName'] },
            ],
            order: [
                [{ model: Skill_1.Skill, as: 'skill' }, 'name', 'ASC'],
                ['version', 'DESC'],
                ['subVersion', 'DESC'],
            ],
            limit: limit,
            offset: offset,
        });
        return { data: results.rows, total: results.count };
    }
    async findOneVersion(object) {
        return await this.versionProSkillEntity.findOne({
            where: object,
            include: [
                {
                    model: Skill_1.Skill,
                    include: [
                        {
                            model: SkillRole_1.SkillRole,
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
                { model: User_1.User, as: 'user' },
            ],
            attributes: { exclude: ['creation_user', 'department_id'] },
        });
    }
    async findMax(version, skillId, companyGroupCode) {
        const num = await this.versionProSkillEntity.max('subVersion', {
            where: {
                version: version,
                skillId: skillId,
                companyGroupCode: companyGroupCode,
            },
        });
        return num;
    }
    async createNewVersionSaveDraft(data, transaction) {
        const results = await this.versionProSkillEntity.create(data, {
            transaction: transaction,
        });
        return results;
    }
    async createMultipleData(data, transaction) {
        return await this.listProSkillEntiny.bulkCreate(data, {
            transaction: transaction,
        });
    }
    async updatedVersion(versionId, objectUpdate, transaction) {
        const results = (await this.versionProSkillEntity
            .update(objectUpdate, {
            where: {
                id: versionId,
            },
            returning: true,
            transaction: transaction,
        })
            .then(([_, data]) => data)).map((data) => data && data.get({ plain: true }));
        return results;
    }
    async deleteListProSkill(versionId, transaction) {
        return await this.listProSkillEntiny.destroy({
            where: {
                versionId: versionId,
            },
            transaction: transaction,
        });
    }
    async cancelVersionProSkill(versionId, _userId) {
        return await this.versionProSkillEntity.update({
            status: 2,
        }, {
            where: {
                id: versionId,
            },
            returning: true,
        });
    }
    async getHistoryApproveContent(versionId, _userId) {
        return await this.historyApproveProSkillEntiny.findAll({
            where: { versionId: versionId },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName'],
                },
            ],
            order: [['createdTime', 'DESC']],
        });
    }
    async getSkillRole(skillId, userId) {
        return await this.skillRoleEntity.findAll({
            where: { skillId: skillId, userId: userId },
        });
    }
    async getDetailProSkill(versionId, companyGroupCode) {
        const result = await this.versionProSkillEntity.findOne({
            where: Object.assign({ id: versionId }, (companyGroupCode !== undefined && { companyGroupCode })),
            include: [
                {
                    model: Skill_1.Skill,
                    attributes: ['id', 'name'],
                    where: { active: 1 },
                },
            ],
        });
        return result;
    }
    async getRoleUser(skillId, userId) {
        return await this.skillRoleEntity.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        skillId: skillId,
                    },
                    {
                        userId: userId,
                    },
                    { role: 1 },
                ],
            },
            include: [
                {
                    model: Skill_1.Skill,
                    attributes: ['id', 'name', 'active'],
                },
            ],
        });
    }
    async getListProSkillByVersionId(versionId) {
        const results = await this.listProSkillEntiny.findAll({
            where: { versionId: versionId },
            attributes: [
                'itemId',
                'versionId',
                'jobType',
                'mediumClass',
                'smallClass',
                'content',
                'difficulty',
                'note',
            ],
            order: [['id', 'ASC']],
            raw: true,
        });
        return results;
    }
    async getDivSubClassByDepartmentId(departmentId) {
        const result = await this.divisionSubclassEntity.findOne({
            where: { departmentId: departmentId },
            include: {
                model: Department_1.Department,
                as: 'division',
                attributes: ['id', 'code', 'name'],
            },
        });
        return result;
    }
    async getDivSubClassByGroupId(groupId) {
        const results = await this.divisionSubclassEntity.findAll({
            where: { divisionId: groupId },
            attributes: [],
            include: {
                model: Department_1.Department,
                as: 'department',
                attributes: ['id', 'code', 'name'],
                required: true,
            },
        });
        return results;
    }
    async findAllVersionWaiting(object) {
        return await this.versionProSkillEntity.count({
            where: object,
        });
    }
    async findDepartmentRoleByDepartmentId(skillId, role) {
        return await this.skillRoleEntity.findAll({
            where: { skillId: skillId, role: role },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['fullName', 'email', 'id'],
                },
            ],
        });
    }
    async checkPermissionSetterOfDepartment(userId, skillId) {
        const result = await this.skillRoleEntity.count({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        skillId: skillId,
                        role: 1,
                        userId: userId,
                    },
                ],
            },
        });
        return result;
    }
    async getTransactionVersionProSkill() {
        return await this.versionProSkillEntity.sequelize.transaction();
    }
    async getTransactionListProSkill() {
        return await this.listProSkillEntiny.sequelize.transaction();
    }
    async detailProSkillByCondition(where) {
        const datas = await this.versionProSkillEntity.findAll({
            where: where,
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
        });
        return datas;
    }
    async listProSkillF3New(companyGroupCode, skillId, offset, limit, userId) {
        skillId = Number(skillId) == -1 ? null : skillId;
        const datas = await this.listProSkillEntiny.sequelize.query(`
select
	*
from
	(
	select
		version_pro_skill_tbl.company_group_code ,
		version_pro_skill_tbl.id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		version,
		sub_version,
		public_date,
		public_status,
		last_updated_time,
		version_pro_skill_tbl.updated_time,
		user_tbl.full_name,
		status
	from
		version_pro_skill_tbl
	inner join skill_tbl on
		version_pro_skill_tbl.skill_id = skill_tbl.id
		and skill_tbl.active = 1
	inner join skill_role_tbl on
		version_pro_skill_tbl.skill_id =
skill_role_tbl.skill_id
	left join user_tbl on
		version_pro_skill_tbl.creation_user = user_tbl.id
	where
		user_id = :userId
		and role = 1
		and (status = 5
			or status = 1)
union
	select
		skill_tbl.company_group_code ,
		(
		select
			id
		from
			version_pro_skill_tbl
		where
			public_status = 1
			and skill_id = skill_tbl.id
		limit 1 ) as id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		null as version,
		null as sub_version,
		null as public_date,
		null as public_status,
		null as last_updated_time,
		null as updated_time,
		null as full_name,
		null as status
	from
		skill_tbl
	left join skill_role_tbl on
		skill_tbl.id = skill_role_tbl.skill_id
	where
		skill_tbl.id not in (
		select
			distinct skill_id
		from
			version_pro_skill_tbl
		where
			status in (1, 3, 5)
				or public_status = 2 )
		and active = 1
		and user_id = :userId
		and role = 1
	group by
		skill_tbl.name,
		skill_tbl.id) as temp
where
	skill_id = coalesce(:skillId,
	skill_id) and company_group_code like :companyGroupCode
order by
	skill_id asc offset :offset
limit :limit
    `, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                companyGroupCode: companyGroupCode,
                userId: userId,
                skillId: skillId,
                offset: offset,
                limit: limit,
            },
            logging: false,
        });
        const totals = await this.listProSkillEntiny.sequelize.query(`
select count(*) as total
from
	(
	select
		version_pro_skill_tbl.company_group_code ,
		version_pro_skill_tbl.id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		version,
		sub_version,
		public_date,
		public_status,
		last_updated_time,
		version_pro_skill_tbl.updated_time,
		user_tbl.full_name,
		status
	from
		version_pro_skill_tbl
	inner join skill_tbl on
		version_pro_skill_tbl.skill_id = skill_tbl.id
		and skill_tbl.active = 1
	inner join skill_role_tbl on
		version_pro_skill_tbl.skill_id =
skill_role_tbl.skill_id
	left join user_tbl on
		version_pro_skill_tbl.creation_user = user_tbl.id
	where
		user_id = :userId
		and role = 1
		and (status = 5
			or status = 1)
union
	select
		skill_tbl.company_group_code ,
		(
		select
			id
		from
			version_pro_skill_tbl
		where
			public_status = 1
			and skill_id = skill_tbl.id
		limit 1 ) as id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		null as version,
		null as sub_version,
		null as public_date,
		null as public_status,
		null as last_updated_time,
		null as updated_time,
		null as full_name,
		null as status
	from
		skill_tbl
	left join skill_role_tbl on
		skill_tbl.id = skill_role_tbl.skill_id
	where
		skill_tbl.id not in (
		select
			distinct skill_id
		from
			version_pro_skill_tbl
		where
			status in (1, 3, 5)
				or public_status = 2 )
		and active = 1
		and user_id = :userId
		and role = 1
	group by
		skill_tbl.name,
		skill_tbl.id) as temp
where
	skill_id = coalesce(:skillId,
	skill_id) and company_group_code like :companyGroupCode
      `, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                userId: userId,
                skillId: skillId,
                companyGroupCode: companyGroupCode,
            },
        });
        return { data: datas, counts: totals[0].total };
    }
    async getRejectComment(versionId) {
        const maxId = await this.historyApproveProSkillEntiny.max('id', {
            where: {
                [sequelize_1.Op.and]: [
                    {
                        versionId: versionId,
                        status: '差戻',
                    },
                ],
            },
        });
        if (maxId) {
            return await this.historyApproveProSkillEntiny.findOne({
                attributes: ['comment'],
                where: {
                    id: maxId,
                },
            });
        }
        else
            return null;
    }
    async getProskillSettersAndApproversForSkillId(skillId) {
        const datas = await this.skillRoleEntity.findAll({
            where: { skillId },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName'],
                },
            ],
            order: [['userId', 'ASC']],
        });
        return datas;
    }
    async findOneVersionProSkill(object) {
        return await this.versionProSkillEntity.findOne({
            where: object,
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
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
                { model: User_1.User, as: 'user' },
            ],
            attributes: { exclude: ['creation_user', 'department_id'] },
        });
    }
    async getVersionPublicProSkill(skillId, companyGroupCode) {
        const datas = await this.listProSkillEntiny.findAll({
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
                    as: 'versionProSkill',
                    required: true,
                    where: {
                        publicStatus: 1,
                        skillId: skillId,
                        companyGroupCode: companyGroupCode,
                    },
                },
            ],
        });
        return datas;
    }
    async getDetailProSkillByVersionId(versionId) {
        const datas = await this.listProSkillEntiny.findAll({
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
                },
            ],
            order: [['id', 'ASC']],
        });
        return datas;
    }
    async findSkillRoleBySkillId(skillId, role) {
        return await this.skillRoleEntity.findAll({
            where: { skillId: skillId, role: role },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['fullName', 'email', 'id'],
                },
            ],
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_PRO_SKILL),
    __metadata("design:type", Object)
], ProSkillSettingRepository.prototype, "versionProSkillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.LIST_PRO_SKILL),
    __metadata("design:type", Object)
], ProSkillSettingRepository.prototype, "listProSkillEntiny", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_APPROVE_PRO_SKILL),
    __metadata("design:type", Object)
], ProSkillSettingRepository.prototype, "historyApproveProSkillEntiny", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DIVISION_SUBCLASS),
    __metadata("design:type", Object)
], ProSkillSettingRepository.prototype, "divisionSubclassEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_ROLE),
    __metadata("design:type", Object)
], ProSkillSettingRepository.prototype, "skillRoleEntity", void 0);
ProSkillSettingRepository = __decorate([
    (0, common_1.Injectable)()
], ProSkillSettingRepository);
exports.ProSkillSettingRepository = ProSkillSettingRepository;
//# sourceMappingURL=proSkillSetting.repository.js.map