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
exports.ApprovalService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const ApprovalHistoryResponseDto_1 = require("../model/response/ApprovalHistoryResponseDto");
const EvaluationDto_1 = require("../model/response/EvaluationDto");
const UserDto_1 = require("../model/generic/UserDto");
const approval_repository_1 = require("../repository/approval.repository");
let ApprovalService = class ApprovalService {
    async getListApprovalHistory(evaluationId, currentAccessId) {
        const evaluation = await this.approvalRepository.getEvaluationById(evaluationId);
        const results = new ApprovalHistoryResponseDto_1.ApprovalHistoryResponseDto();
        if (currentAccessId !== evaluation.user.id) {
            const SECONDARY_FORBIDEN_CODE = 1403;
            results.statusCode = SECONDARY_FORBIDEN_CODE;
            results.message = 'Not allowed to this screen';
            return results;
        }
        const approvalHistories = await this.approvalRepository.getListApprovalHistoryByEvaluationId(evaluationId);
        const evaluators = await this.approvalRepository.getListEvaluatorByEvaluationId(evaluationId);
        const approvalHistoryResults = [];
        (0, rxjs_1.from)(approvalHistories)
            .pipe((0, rxjs_1.map)((history) => {
            const APPROVED_STATUS = '承認';
            const ORDER_ZERO = 0;
            if (history.status !== APPROVED_STATUS &&
                Number(history.receiverOrder) !== ORDER_ZERO) {
                const EMPTY = '';
                history.comment = EMPTY;
            }
            return history;
        }))
            .subscribe((history) => {
            const tmp = new ApprovalHistoryResponseDto_1.ApprovalHistoryDto();
            tmp.evaluationId = history.evaluationId;
            tmp.comment = history.comment;
            tmp.receiverOrder = history.receiverOrder
                ? Number(history.receiverOrder)
                : null;
            tmp.status = history.status;
            tmp.type = history.type;
            tmp.createdTime = history.createdTime;
            tmp.approverUser = history.approverUser;
            tmp.receiverUser = history.receiverUser;
            approvalHistoryResults.push(tmp);
        });
        const evlauatorResults = [];
        (0, rxjs_1.from)(evaluators).subscribe((evaluator) => {
            evlauatorResults.push({
                id: evaluator.user.id,
                fullName: evaluator.user.fullName,
                evaluationOrder: Number(evaluator.evaluationOrder),
            });
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
        const SECONDARY_SUCCESS_CODE = 1200;
        results.statusCode = SECONDARY_SUCCESS_CODE;
        results.approvalHistories = approvalHistoryResults;
        results.evaluators = evlauatorResults;
        results.evaluation = evaluationDto;
        results.userDetail = userDto;
        return results;
    }
};
__decorate([
    (0, common_1.Inject)(approval_repository_1.ApprovalRepository),
    __metadata("design:type", Object)
], ApprovalService.prototype, "approvalRepository", void 0);
ApprovalService = __decorate([
    (0, common_1.Injectable)()
], ApprovalService);
exports.ApprovalService = ApprovalService;
//# sourceMappingURL=approval.service.js.map