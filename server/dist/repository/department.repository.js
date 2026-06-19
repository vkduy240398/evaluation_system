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
exports.DepartmentRepository = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Department_1 = require("../entity/Department");
const DivisionSubclass_1 = require("../entity/DivisionSubclass");
const User_1 = require("../entity/User");
const VersionProSkill_1 = require("../entity/VersionProSkill");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const EvaluationPeriodHelper_1 = require("../common/datetime/EvaluationPeriodHelper");
let DepartmentRepository = class DepartmentRepository {
    async createNewDivisionDepartment(saveData, companyGroupCode) {
        const checkCondition = {
            name: saveData.name,
            active: 1,
        };
        if (companyGroupCode !== undefined)
            checkCondition['companyGroupCode'] = companyGroupCode;
        const duplicateRecord = await this.departmentEntity.findOne({
            where: checkCondition,
        });
        if (duplicateRecord) {
            throw new RuntimeException_1.RuntimeException(`${saveData.type} is duplicate`, 204);
        }
        saveData['companyGroupCode'] = companyGroupCode;
        if (saveData.type === 1) {
            return await this.departmentEntity.create(saveData).then(async (data) => {
                if (saveData.class !== 0) {
                    const seqId = await this.departmentEntity.sequelize.query(`SELECT nextval('department_creation_seq') as id`);
                    data.code = `GNW-${seqId[0][0].id}`;
                    data.save();
                }
                return data;
            });
        }
        if (saveData.type === 0) {
            if ((0, class_validator_1.isNumber)(saveData.division)) {
                const result = await this.departmentEntity.create(saveData);
                if (result) {
                    const dataAdd = {
                        departmentId: result.id,
                        divisionId: Number(saveData.division),
                    };
                    if (saveData.class !== 0) {
                        const seqId = await this.departmentEntity.sequelize.query(`SELECT nextval('department_creation_seq') as id`);
                        result.code = `GNW-${seqId[0][0].id}`;
                        result.save();
                    }
                    await this.divisionSubEntity.create(dataAdd);
                }
                return result;
            }
            else {
                if (saveData.code == saveData.division.split(':')[0].trim()) {
                    throw new RuntimeException_1.RuntimeException(`${saveData.division}: department and division are same`, 204);
                }
                const conditions = {
                    code: saveData.division.split(':')[0].trim(),
                    name: saveData.division.split(':')[1].trim(),
                    active: 1,
                    type: 1,
                    class: 0,
                    companyGroupCode,
                };
                const checkExistDivision = await this.departmentEntity.findOne({
                    where: Object.assign({ name: saveData.division.split(':')[1].trim(), active: 1 }, (companyGroupCode !== undefined && { companyGroupCode })),
                });
                if (!checkExistDivision) {
                    const result = await this.departmentEntity.create(saveData);
                    if (result) {
                        await this.departmentEntity
                            .create(conditions)
                            .then(async (division) => {
                            const dataAdd = {
                                divisionId: division.id,
                                departmentId: result.id,
                            };
                            await this.divisionSubEntity.create(dataAdd);
                        });
                    }
                    return result;
                }
                else {
                    throw new RuntimeException_1.RuntimeException('Division is duplicate', 204);
                }
            }
        }
    }
    async addDivisionSub(data) {
        const checkSubDivisionList = await this.divisionSubEntity.findAll({
            where: { departmentId: data.departmentId },
        });
        if (checkSubDivisionList.length > 0) {
            throw new RuntimeException_1.RuntimeException('Department is already add for another division', 410);
        }
        else {
            return await this.divisionSubEntity.create(data);
        }
    }
    async updateDepartmentForGNW(id, department, data, companyGroupCode, timeZone) {
        const transaction = await this.evaluationEntity.sequelize.transaction();
        try {
            const year = EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodYear(timeZone).toString();
            const periodIndex = EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) == '上期'
                ? 1
                : 2;
            const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
                attributes: ['id', 'checkFixed'],
                where: {
                    year: year,
                    periodIndex: periodIndex,
                    companyGroupCode: companyGroupCode,
                },
            });
            const indexTime = department.radioPeriod;
            if (dataEvaluationPeroid) {
                let objectCondition = {};
                if (indexTime == 0) {
                    objectCondition = {
                        [sequelize_1.Op.gte]: dataEvaluationPeroid.id,
                    };
                }
                else if (indexTime == 2 || indexTime == 1) {
                    objectCondition = {
                        [sequelize_1.Op.gt]: dataEvaluationPeroid.id,
                    };
                }
                const newData = department.name.trim();
                if ((data === null || data === void 0 ? void 0 : data.type) === 0) {
                    await this.evaluationEntity.update({ departmentName: newData }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                {
                                    evaluationPeriodId: objectCondition,
                                },
                                { departmentId: id },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                    });
                    await this.evaluatorDefault.update({ departmentName: newData }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                {
                                    evaluationPeriodId: objectCondition,
                                },
                                { departmentId: id },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                    });
                }
                if ((data === null || data === void 0 ? void 0 : data.type) === 1) {
                    await this.evaluationEntity.update({ divisionName: newData }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                {
                                    evaluationPeriodId: objectCondition,
                                },
                                { divisionId: id },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                    });
                    await this.evaluatorDefault.update({ divisionName: newData }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                {
                                    evaluationPeriodId: objectCondition,
                                },
                                { divisionId: id },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                    });
                }
            }
            if (data && (data === null || data === void 0 ? void 0 : data.type) === 0) {
                await this.divisionSubEntity.destroy({
                    where: {
                        departmentId: id,
                        divisionId: { [sequelize_1.Op.ne]: department.divisionOldId },
                    },
                });
                await this.divisionSubEntity.update({ divisionId: department.divisionId }, {
                    where: { divisionId: department.divisionOldId, departmentId: id },
                    transaction: transaction,
                });
            }
            const listHistoryDataDepartment = [];
            const departmentNew = department.name.trim();
            if (indexTime == 1) {
                listHistoryDataDepartment.push({
                    year: year,
                    periodIndex: periodIndex,
                    type: data === null || data === void 0 ? void 0 : data.type,
                    departmentId: parseInt(id),
                    departmentName: department.oldName,
                    companyGroupCode: companyGroupCode,
                }, {
                    year: year,
                    periodIndex: periodIndex,
                    type: data === null || data === void 0 ? void 0 : data.type,
                    departmentId: parseInt(id),
                    departmentName: departmentNew,
                    companyGroupCode: companyGroupCode,
                });
                await this.historyUpdateDepartmentdEntity.bulkCreate(listHistoryDataDepartment);
            }
            else if (indexTime == 2) {
                listHistoryDataDepartment.push({
                    year: year,
                    periodIndex: periodIndex,
                    type: data === null || data === void 0 ? void 0 : data.type,
                    departmentId: parseInt(id),
                    departmentName: department.oldName,
                    companyGroupCode: companyGroupCode,
                });
                await this.historyUpdateDepartmentdEntity.bulkCreate(listHistoryDataDepartment);
            }
            else if (indexTime == 0) {
                await this.historyUpdateDepartmentdEntity.destroy({
                    where: {
                        year: year,
                        periodIndex: periodIndex,
                        companyGroupCode: companyGroupCode,
                        departmentId: parseInt(id),
                    },
                });
            }
            const results = await this.departmentEntity.update({ code: department.code, name: department.name }, { where: { id: id }, transaction: transaction });
            await transaction.commit();
            return results;
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findListDepartment(query, companyGroupCode) {
        let category = query.catergory;
        let classification = query.classification;
        const departmentCodeAndName = query.departmentCodeAndName;
        const limit = query.limit;
        const offset = query.offset;
        if (category === 'すべて')
            category = null;
        if (classification === 'すべて')
            classification = null;
        const datas = await this.departmentEntity.findAndCountAll({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        [sequelize_1.Op.or]: [
                            {
                                code: departmentCodeAndName
                                    ? { [sequelize_1.Op.iLike]: `%${departmentCodeAndName}%` }
                                    : { [sequelize_1.Op.not]: null },
                            },
                            {
                                name: departmentCodeAndName
                                    ? { [sequelize_1.Op.iLike]: `%${departmentCodeAndName}%` }
                                    : { [sequelize_1.Op.not]: null },
                            },
                        ],
                    },
                    { type: category || { [sequelize_1.Op.not]: null } },
                    { class: classification || { [sequelize_1.Op.not]: null } },
                    companyGroupCode !== undefined ? { companyGroupCode } : {},
                ],
                active: 1,
            },
            include: [
                {
                    model: DivisionSubclass_1.DivisionSubclass,
                    as: 'divisionSubclass',
                    include: [
                        {
                            model: Department_1.Department,
                            as: 'division',
                        },
                        {
                            model: Department_1.Department,
                            as: 'department',
                        },
                    ],
                },
            ],
            order: [
                ['name', 'ASC'],
            ],
            offset: offset,
            limit: limit,
            distinct: true,
        });
        const fullDatas = await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { type: 1 },
                    { active: 1 },
                    companyGroupCode !== undefined ? { companyGroupCode } : {},
                ],
            },
        });
        return { data: datas.rows, counts: datas.count, fullData: fullDatas };
    }
    async getAllDepartment(companyGroupCode) {
        return await this.departmentEntity.findAll({
            where: {
                active: 1,
                companyGroupCode: companyGroupCode,
            },
            order: [
                ['name', 'ASC'],
            ],
        });
    }
    async getHistoryUpdateDepartment(year, periodIndex, companyGroupCode, timeZone) {
        const result = [];
        const selectedPeriod = `${year}${periodIndex}`;
        const currentYear = EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodYear(timeZone);
        const currentPeriodIndex = EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) == '上期' ? 1 : 2;
        const currentPeriod = `${currentYear}${currentPeriodIndex}`;
        if (selectedPeriod > currentPeriod)
            return [];
        const oldDepartments = await this.historyUpdateDepartmentdEntity.findAll({
            attributes: ['type', 'departmentName', 'departmentId'],
            where: {
                year: year.toString(),
                periodIndex: periodIndex,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    where: { active: 1 },
                },
            ],
            raw: true,
        });
        result.push(oldDepartments);
        return result;
    }
    async getAllDepartmentNotSetDivision(companyGroupCode) {
        const departmentAlreadySetDivisionList = await this.divisionSubEntity.findAll();
        const tempList = [];
        departmentAlreadySetDivisionList.map((item) => {
            tempList.push(item.departmentId);
        });
        const datas = await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { active: 1 },
                    { type: 0 },
                    { id: { [sequelize_1.Op.notIn]: tempList } },
                    { companyGroupCode: companyGroupCode },
                ],
            },
            order: [['name', 'ASC']],
        });
        return datas;
    }
    async getAllDepartmentTypeDepartment(companyGroupCode) {
        return await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { active: 1 },
                    { type: 0 },
                    { companyGroupCode: companyGroupCode },
                ],
            },
            order: [
                ['name', 'ASC'],
            ],
        });
    }
    async getAllDepartmentTypeDivision(companyGroupCode) {
        return await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { active: 1 },
                    { type: 1 },
                    { companyGroupCode: companyGroupCode },
                ],
            },
            order: [['name', 'ASC']],
        });
    }
    async getAllDepartmentNotGroup(companyGroupCode) {
        return await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { active: 1 },
                    { type: { [sequelize_1.Op.not]: 2 } },
                    { companyGroupCode: companyGroupCode },
                ],
            },
            order: [
                ['name', 'ASC'],
            ],
        });
    }
    async getAllDivisionDepartment(companyGroupCode) {
        return await this.departmentEntity.findAll({
            where: { active: 1, type: 1, companyGroupCode: companyGroupCode },
            include: [
                {
                    model: DivisionSubclass_1.DivisionSubclass,
                    as: 'divisionSubclass',
                    include: [
                        { model: Department_1.Department, as: 'department', where: { type: 0 } },
                    ],
                },
            ],
            order: [
                ['name', 'ASC'],
            ],
        });
    }
    async getAllDepartmentGNW(companyGroupCode) {
        return await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { active: 1 },
                    { class: 1 },
                    { companyGroupCode: companyGroupCode },
                ],
            },
        });
    }
    async getDepartmentUpdateTime(id, companyGroupCode) {
        return await this.departmentEntity.findOne({
            attributes: ['type', 'updatedTime'],
            where: Object.assign({ id: id, active: 1 }, (companyGroupCode !== undefined && { companyGroupCode })),
        });
    }
    async deleteDepartment(id, department, companyGroupCode) {
        const listUsers = await this.userEntity.findAll({
            where: {
                [sequelize_1.Op.or]: [{ departmentId: id }, { divisionId: id }],
                active: 1,
                companyGroupCode: companyGroupCode,
            },
        });
        if (listUsers.length === 0) {
            const transaction = await this.departmentEntity.sequelize.transaction();
            try {
                if ((department === null || department === void 0 ? void 0 : department.type) === 1) {
                    const countDepartment = await this.divisionSubEntity.count({
                        include: [
                            {
                                model: Department_1.Department,
                                as: 'department',
                                where: {
                                    type: 0,
                                },
                            },
                        ],
                        where: { divisionId: id },
                        distinct: true,
                        transaction: transaction,
                    });
                    if (countDepartment > 0) {
                        throw new RuntimeException_1.RuntimeException('Division has departments, can not be deleted ', 204);
                    }
                }
                else if ((department === null || department === void 0 ? void 0 : department.type) === 0) {
                    await this.divisionSubEntity.destroy({
                        where: {
                            departmentId: id,
                        },
                        transaction: transaction,
                    });
                }
                await this.skillGroupEntity.destroy({
                    where: {
                        departmentId: id,
                    },
                    transaction: transaction,
                });
                await this.departmentEntity.update({ active: 0 }, { where: { id: id }, transaction: transaction });
                await transaction.commit();
                return { result: 200 };
            }
            catch (error) {
                await transaction.rollback();
                throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) ||
                    (error === null || error === void 0 ? void 0 : error.statusCode) ||
                    common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else {
            return { result: 204 };
        }
    }
    async getDepartmentById(id) {
        if (id)
            return await this.departmentEntity.findOne({
                where: { id: id },
            });
        return null;
    }
    async getTransactionDepartment() {
        return await this.departmentEntity.sequelize.transaction();
    }
    async findOne(where) {
        return await this.departmentEntity.findOne({ where: where });
    }
    async findOnesSkill(where) {
        return await this.skillEntity.findOne({ where: where });
    }
    async checkIsDivision(id) {
        return await this.departmentEntity.findOne({
            where: {
                [sequelize_1.Op.and]: [{ active: 1 }, { type: 1 }, { id: id }],
            },
        });
    }
    async getVersionProSkillbyDepartment(where) {
        return await this.departmentEntity.findAll({
            where: where,
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
                    as: 'versionProSkill',
                    required: false,
                    include: [
                        {
                            model: User_1.User,
                            as: 'user',
                        },
                    ],
                },
            ],
            order: [
                ['code', 'ASC'],
                [{ model: VersionProSkill_1.VersionProSkill, as: 'versionProSkill' }, 'version', 'DESC'],
            ],
        });
    }
    async getListSubDepartment(query, id, companyGroupCode) {
        const departmentCodeAndName = query.departmentCodeAndName;
        const limit = query.limit;
        const offset = query.offset;
        const selectedDivision = await this.departmentEntity.findOne({
            where: Object.assign({ id }, (companyGroupCode !== undefined && { companyGroupCode })),
            attributes: ['id', 'code', 'name'],
        });
        if (!selectedDivision) {
            throw new RuntimeException_1.RuntimeException('NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const datas = await this.divisionSubEntity.findAll({
            where: { divisionId: id },
            attributes: ['departmentId'],
            order: [['departmentId', 'DESC']],
        });
        const temps = datas.filter((data) => {
            if (data.departmentId !== null)
                return data.departmentId;
        });
        const subDepartmentIdList = temps.map((data) => data.departmentId);
        const subDepartmentList = await this.departmentEntity.findAndCountAll({
            where: {
                [sequelize_1.Op.and]: [
                    { id: { [sequelize_1.Op.in]: subDepartmentIdList } },
                    {
                        [sequelize_1.Op.or]: [
                            {
                                code: departmentCodeAndName
                                    ? { [sequelize_1.Op.iLike]: `%${departmentCodeAndName}%` }
                                    : { [sequelize_1.Op.not]: null },
                            },
                            {
                                name: departmentCodeAndName
                                    ? { [sequelize_1.Op.iLike]: `%${departmentCodeAndName}%` }
                                    : { [sequelize_1.Op.not]: null },
                            },
                        ],
                    },
                    {
                        type: 0,
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [
                ['name', 'ASC'],
            ],
        });
        const fullDatas = await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { type: 0 },
                    { active: 1 },
                    companyGroupCode !== undefined ? { companyGroupCode } : {},
                ],
            },
        });
        return {
            data: subDepartmentList.rows,
            counts: subDepartmentList.count,
            selectedDivision,
            fullData: fullDatas,
        };
    }
    async getSubDepartmentListByDivisionId(id) {
        const datas = await this.divisionSubEntity.findAll({
            where: { divisionId: id },
            attributes: ['departmentId'],
        });
        const temps = datas.filter((data) => {
            if (data.departmentId !== null)
                return data.departmentId;
        });
        const subDepartmentIdList = temps.map((data) => data.departmentId);
        const subDepartmentList = await this.departmentEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { id: { [sequelize_1.Op.in]: subDepartmentIdList } },
                    {
                        active: 1,
                    },
                ],
            },
            attributes: ['id', 'code', 'name'],
        });
        return subDepartmentList;
    }
    async getList() {
        return await this.departmentEntity.findAll({
            where: { active: 1 },
            order: [['code', 'ASC']],
        });
    }
    async getAllSkill(companyGroupCode) {
        return await this.skillEntity.findAll({
            attributes: ['id', 'name'],
            where: {
                active: 1,
                companyGroupCode: companyGroupCode,
            },
            order: [['name', 'ASC']],
        });
    }
    async getUserDivision(userId) {
        const divisionInfo = await this.userEntity.findOne({
            where: {
                id: userId,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'division',
                    where: {
                        type: 1,
                    },
                },
            ],
        });
        return divisionInfo;
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "departmentEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DIVISION_SUBCLASS),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "divisionSubEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "evaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "skillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_GROUP),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "skillGroupEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "evaluatorDefault", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "evaluationPeriodEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_UPDATE_DEPARTMENT),
    __metadata("design:type", Object)
], DepartmentRepository.prototype, "historyUpdateDepartmentdEntity", void 0);
DepartmentRepository = __decorate([
    (0, common_1.Injectable)()
], DepartmentRepository);
exports.DepartmentRepository = DepartmentRepository;
//# sourceMappingURL=department.repository.js.map