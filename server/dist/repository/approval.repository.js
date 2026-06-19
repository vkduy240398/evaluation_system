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
exports.ApprovalRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Department_1 = require("../entity/Department");
const User_1 = require("../entity/User");
let ApprovalRepository = class ApprovalRepository {
    async getListApprovalHistoryByEvaluationId(evaluationId) {
        return await this.historyApproveEvaluationEntity.findAll({
            where: { evaluationId: evaluationId },
            attributes: [
                'evaluationId',
                'comment',
                'receiverOrder',
                'status',
                'type',
                'createdTime',
            ],
            order: [
                ['id', 'DESC'],
                ['createdTime', 'DESC'],
            ],
            include: [
                {
                    model: User_1.User,
                    attributes: ['id', 'fullName'],
                    as: 'approverUser',
                    required: false,
                },
                {
                    model: User_1.User,
                    attributes: ['id', 'fullName'],
                    as: 'receiverUser',
                    required: false,
                },
            ],
        });
    }
    async getListEvaluatorByEvaluationId(evaluationId) {
        return await this.evaluatorEntity.findAll({
            where: { evaluationId: evaluationId },
            attributes: ['evaluationId', 'evaluatorId', 'evaluationOrder'],
            include: [
                {
                    model: User_1.User,
                    attributes: ['id', 'fullName'],
                    as: 'user',
                },
            ],
            limit: 3,
            order: [['evaluationOrder', 'ASC']],
        });
    }
    async getEvaluationById(evaluationId) {
        return await this.evaluationEntity.findOne({
            where: { id: evaluationId },
            attributes: [
                'id',
                'periodStart',
                'periodEnd',
                'departmentName',
                'divisionName',
                'status',
                'level',
                'title',
            ],
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'employeeNumber', 'fullName'],
                    include: [
                        {
                            model: Department_1.Department,
                            attributes: ['id', 'code', 'name'],
                            as: 'department',
                        },
                    ],
                },
            ],
        });
    }
    async getEvaluationByListId(evaluationId) {
        return await this.evaluationEntity.findAll({
            where: { id: { [sequelize_1.Op.in]: evaluationId } },
            attributes: ['id', 'status'],
        });
    }
    async getApprovalHistory(conditions) {
        return await this.historyApproveEvaluationEntity.findAll({
            where: conditions,
            attributes: [
                'evaluationId',
                'comment',
                'receiverOrder',
                'status',
                'type',
                'createdTime',
            ],
            order: [['id', 'DESC']],
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_APPROVE_EVALUATION),
    __metadata("design:type", Object)
], ApprovalRepository.prototype, "historyApproveEvaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], ApprovalRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR),
    __metadata("design:type", Object)
], ApprovalRepository.prototype, "evaluatorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], ApprovalRepository.prototype, "evaluationEntity", void 0);
ApprovalRepository = __decorate([
    (0, common_1.Injectable)()
], ApprovalRepository);
exports.ApprovalRepository = ApprovalRepository;
//# sourceMappingURL=approval.repository.js.map