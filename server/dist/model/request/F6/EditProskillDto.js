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
exports.EditProskillDto = void 0;
const class_validator_1 = require("class-validator");
class EditProskillDto {
}
__decorate([
    (0, class_validator_1.IsString)({ message: 'skillName must be a string' }),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsNotEmpty)({ message: 'skillName cannot be blank' }),
    __metadata("design:type", String)
], EditProskillDto.prototype, "skillName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'setters cannot be an empty array' }),
    __metadata("design:type", Array)
], EditProskillDto.prototype, "skillSetters", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'approvers cannot be an empty array' }),
    __metadata("design:type", Array)
], EditProskillDto.prototype, "skillApprovers", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.ArrayMinSize)(0),
    __metadata("design:type", Array)
], EditProskillDto.prototype, "departments", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.ArrayMinSize)(0),
    __metadata("design:type", Array)
], EditProskillDto.prototype, "divisions", void 0);
exports.EditProskillDto = EditProskillDto;
//# sourceMappingURL=EditProskillDto.js.map