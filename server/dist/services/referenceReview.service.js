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
exports.ReferenceReviewService = void 0;
const common_1 = require("@nestjs/common");
const referenceReview_repository_1 = require("../repository/referenceReview.repository");
let ReferenceReviewService = class ReferenceReviewService {
    async listReferenceReview(params, req) {
        return await this.referenceReviewRepository.getListReferenceEvaluation(params, req);
    }
};
__decorate([
    (0, common_1.Inject)(referenceReview_repository_1.ReferenceReview),
    __metadata("design:type", Object)
], ReferenceReviewService.prototype, "referenceReviewRepository", void 0);
ReferenceReviewService = __decorate([
    (0, common_1.Injectable)()
], ReferenceReviewService);
exports.ReferenceReviewService = ReferenceReviewService;
//# sourceMappingURL=referenceReview.service.js.map