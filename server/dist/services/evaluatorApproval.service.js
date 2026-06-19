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
exports.EvaluatorApprovalService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const ApprovalHistoryResponseDto_1 = require("../model/response/ApprovalHistoryResponseDto");
const EvaluationDto_1 = require("../model/response/EvaluationDto");
const UserDto_1 = require("../model/generic/UserDto");
const approval_repository_1 = require("../repository/approval.repository");
const APPROVED_STATUS = '承認';
let EvaluatorApprovalService = class EvaluatorApprovalService {
    async getListApprovalHistory(evaluationId, currentAccessId, order) {
        const approvalHistories = await this.approvalRepository.getListApprovalHistoryByEvaluationId(evaluationId);
        const evaluation = await this.approvalRepository.getEvaluationById(evaluationId);
        const listEvaluators = await this.approvalRepository.getListEvaluatorByEvaluationId(evaluationId);
        const approvalHistoryResults = [];
        const evlauators = [];
        let currentAccessOrder = null;
        (0, rxjs_1.from)(listEvaluators).subscribe((el) => {
            evlauators.push({
                id: el.user.id,
                fullName: el.user.fullName,
                evaluationOrder: Number(el.evaluationOrder),
            });
            if (el.user.id === currentAccessId) {
                currentAccessOrder = el.evaluationOrder;
            }
        });
        if (order) {
            currentAccessOrder = order;
        }
        (0, rxjs_1.from)(approvalHistories)
            .pipe((0, rxjs_1.map)((el) => {
            if (el.status !== APPROVED_STATUS &&
                currentAccessOrder &&
                Number(el.receiverOrder) > Number(currentAccessOrder)) {
                el.comment = '';
            }
            return el;
        }))
            .subscribe((el) => {
            const tmp = new ApprovalHistoryResponseDto_1.ApprovalHistoryDto();
            tmp.evaluationId = el.evaluationId;
            tmp.comment = el.comment;
            tmp.receiverOrder = el.receiverOrder ? Number(el.receiverOrder) : null;
            tmp.status = el.status;
            tmp.type = el.type;
            tmp.createdTime = el.createdTime;
            tmp.approverUser = el.approverUser;
            tmp.receiverUser = el.receiverUser;
            approvalHistoryResults.push(tmp);
        });
        const evaluationDto = new EvaluationDto_1.EvaluationDto();
        evaluationDto.id = evaluation.id;
        evaluationDto.level = evaluation.level;
        evaluationDto.status = evaluation.status;
        evaluationDto.periodStart = evaluation.periodStart;
        evaluationDto.periodEnd = evaluation.periodEnd;
        evaluationDto.departmentName =
            evaluation.level >= 8
                ? evaluation.divisionName
                : evaluation.departmentName;
        evaluationDto.userId = evaluation.user.id;
        evaluationDto.title = evaluation.title;
        const userDto = new UserDto_1.UserDto();
        userDto.id = evaluation.user.id;
        userDto.employeeNumber = evaluation.user.employeeNumber;
        userDto.fullName = evaluation.user.fullName;
        userDto.department = evaluation.user.department;
        const results = new ApprovalHistoryResponseDto_1.ApprovalHistoryResponseDto();
        results.approvalHistories = approvalHistoryResults;
        results.evaluators = evlauators;
        results.evaluation = evaluationDto;
        results.userDetail = userDto;
        return results;
    }
};
__decorate([
    (0, common_1.Inject)(approval_repository_1.ApprovalRepository),
    __metadata("design:type", Object)
], EvaluatorApprovalService.prototype, "approvalRepository", void 0);
EvaluatorApprovalService = __decorate([
    (0, common_1.Injectable)()
], EvaluatorApprovalService);
exports.EvaluatorApprovalService = EvaluatorApprovalService;
//# sourceMappingURL=evaluatorApproval.service.js.map