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
exports.CalculatorDetail810NSDto = exports.CalculatorDetail810Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class achievementAdditionalData {
}
class settingFormula810Data {
}
class data810 {
}
class settingPointBasicProBehavior {
}
class settingPointProFormula {
}
class settingAchievementPersonal {
}
class settingAchievementAdditional {
}
class settingLevel {
}
class CalculatorDetail810Dto extends data810 {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculatorDetail810Dto.prototype, "version", void 0);
exports.CalculatorDetail810Dto = CalculatorDetail810Dto;
class CalculatorDetail810NSDto extends data810 {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculatorDetail810NSDto.prototype, "version", void 0);
exports.CalculatorDetail810NSDto = CalculatorDetail810NSDto;
//# sourceMappingURL=CalculatorDetail810Dto.js.map