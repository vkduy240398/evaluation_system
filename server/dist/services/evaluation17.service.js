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
exports.Evaluation17Service = void 0;
const common_1 = require("@nestjs/common");
const evaluation17_repository_1 = require("../repository/evaluation17.repository");
let Evaluation17Service = class Evaluation17Service {
    async getBasicBehaviorProOptionPublic(companyGroupCode, isNoSkill) {
        const basicSkillPointOptions = [];
        const behaviorSkillPointOptions = [];
        const proSkillPointOptions = [];
        const results = await this.evaluation17Repo.getBasicBehaviorProPointPublic(companyGroupCode, isNoSkill);
        if (results.length > 0) {
            results.map((v) => {
                if (v.type === 1)
                    basicSkillPointOptions.push({ label: v.point, value: v.point });
                else if (v.type === 2)
                    behaviorSkillPointOptions.push({ label: v.point, value: v.point });
                else
                    proSkillPointOptions.push({ label: v.point, value: v.point });
            });
        }
        return {
            basicSkillPointOptions,
            behaviorSkillPointOptions,
            proSkillPointOptions,
        };
    }
    async getMaxPointProBasicSkillPublic(companyGroupCode) {
        return await this.evaluation17Repo.getMaxPointProBasicSkillPublic(companyGroupCode);
    }
};
__decorate([
    (0, common_1.Inject)(evaluation17_repository_1.Evaluation17Repository),
    __metadata("design:type", evaluation17_repository_1.Evaluation17Repository)
], Evaluation17Service.prototype, "evaluation17Repo", void 0);
Evaluation17Service = __decorate([
    (0, common_1.Injectable)()
], Evaluation17Service);
exports.Evaluation17Service = Evaluation17Service;
//# sourceMappingURL=evaluation17.service.js.map