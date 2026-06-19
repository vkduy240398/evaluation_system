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
exports.CheckPermissionRequestDto = exports.CheckPermissionResponseDto = exports.CheckPermissionDto = exports.GetDepartmentGoalResponseDto = exports.GetProSkillEvaluationItemResponseDto = exports.ListBasicBehaviorResponseDto = exports.CreateOrUpdateEvaluationResponseDto = exports.GetEvaluation810ResponseDto = exports.GetSettingProFormulaPublicResponseDto = exports.GetBasicBehaviorSkillPublicResponseDto = exports.GetAchievementSettingPublicResponseDto = exports.EvaluationListProSkillPublicResponseDto = exports.EvaluationUpdateTypeResponseDto = exports.EvaluationSkillCheckResponseDto = exports.EvaluationSearchResponseDto = exports.Evaluation810SaveInfo = exports.Evaluation810RejectInfo = exports.EvaluationApproveInfo = exports.Evaluation810Param = exports.GetEvaluationDTO = exports.EvaluationUpdateTypeDto = exports.EvaluationBasicBehaviorPublicTypeDto = exports.EvaluationAchievementPublicTypeDto = exports.EvaluationProSkillDto = exports.EvaluationSearchDto = exports.EvaluationQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EvaluationQueryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationQueryDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationQueryDto.prototype, "periodEnd", void 0);
exports.EvaluationQueryDto = EvaluationQueryDto;
class EvaluationSearchDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationSearchDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "sortType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "yearStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "yearEnd", void 0);
exports.EvaluationSearchDto = EvaluationSearchDto;
class EvaluationProSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationProSkillDto.prototype, "evaluationId", void 0);
exports.EvaluationProSkillDto = EvaluationProSkillDto;
class EvaluationAchievementPublicTypeDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationAchievementPublicTypeDto.prototype, "achievementType", void 0);
exports.EvaluationAchievementPublicTypeDto = EvaluationAchievementPublicTypeDto;
class EvaluationBasicBehaviorPublicTypeDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        enum: ['1', '2', '3'],
    }),
    __metadata("design:type", String)
], EvaluationBasicBehaviorPublicTypeDto.prototype, "basicBehaviorType", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehaviorPublicTypeDto.prototype, "level", void 0);
exports.EvaluationBasicBehaviorPublicTypeDto = EvaluationBasicBehaviorPublicTypeDto;
class EvaluationUpdateTypeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationUpdateTypeDto.prototype, "data", void 0);
exports.EvaluationUpdateTypeDto = EvaluationUpdateTypeDto;
class GetEvaluationDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'isEvaluatorUser',
        required: true,
        example: '17',
        type: String,
    }),
    __metadata("design:type", String)
], GetEvaluationDTO.prototype, "isEvaluatorUser", void 0);
exports.GetEvaluationDTO = GetEvaluationDTO;
class Evaluation810Param {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'id',
        required: true,
        example: 21,
        type: Number,
    }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], Evaluation810Param.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'userId',
        required: true,
        example: 7,
    }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], Evaluation810Param.prototype, "userId", void 0);
exports.Evaluation810Param = Evaluation810Param;
class EvaluationApproveInfo {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EvaluationApproveInfo.prototype, "evaluationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EvaluationApproveInfo.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], EvaluationApproveInfo.prototype, "listEvalutor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationApproveInfo.prototype, "maxOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationApproveInfo.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EvaluationApproveInfo.prototype, "approverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationApproveInfo.prototype, "updatedTime", void 0);
exports.EvaluationApproveInfo = EvaluationApproveInfo;
class Evaluation810RejectInfo {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'evaluation id',
        example: 21,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Evaluation810RejectInfo.prototype, "evaluationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'evaluation id',
        example: 49,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Evaluation810RejectInfo.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'evaluation id',
        example: 'user',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Evaluation810RejectInfo.prototype, "selectedOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'content',
        example: 'aaaaa',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Evaluation810RejectInfo.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'approver id',
        example: 7,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Evaluation810RejectInfo.prototype, "approverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'owner id',
        example: 8,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Evaluation810RejectInfo.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'list evaluator',
        example: [
            {
                evaluationOrder: '2.0',
                evaluatorId: 9,
                commentPublic: 'comment 2.0 public',
                commentPrivate: 'comment 2.0 private',
                user: {
                    employeeNumber: '2013787',
                    fullName: 'dang.hoang.kha',
                    email: 'dang.hoang.kha@geonet.co.jp',
                },
            },
            {
                evaluationOrder: '1.0',
                evaluatorId: 10,
                commentPublic: 'comment 1.0 public',
                commentPrivate: 'commment 1.0 private ',
                user: {
                    employeeNumber: '2011111',
                    fullName: 'nguyen.hoang.thien',
                    email: 'nguyen.hoang.thien@geonet.co.jp',
                },
            },
        ],
    }),
    __metadata("design:type", Array)
], Evaluation810RejectInfo.prototype, "listEvalutor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'updated time',
        example: '2023-11-22T02:44:17.612Z',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Evaluation810RejectInfo.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: '2023-11-22T02:44:17.612Z',
        example: '',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Evaluation810RejectInfo.prototype, "maxOrder", void 0);
exports.Evaluation810RejectInfo = Evaluation810RejectInfo;
class Evaluation810SaveInfo {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'userId',
        example: 7,
    }),
    __metadata("design:type", Array)
], Evaluation810SaveInfo.prototype, "dataSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Evaluation810SaveInfo.prototype, "additionData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], Evaluation810SaveInfo.prototype, "commentData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Evaluation810SaveInfo.prototype, "evaluationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Evaluation810SaveInfo.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Evaluation810SaveInfo.prototype, "isDraft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Evaluation810SaveInfo.prototype, "listEvalutor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], Evaluation810SaveInfo.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Evaluation810SaveInfo.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Evaluation810SaveInfo.prototype, "checkList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Evaluation810SaveInfo.prototype, "evaluationOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Evaluation810SaveInfo.prototype, "listBehaviors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Evaluation810SaveInfo.prototype, "listPersonalGoals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], Evaluation810SaveInfo.prototype, "achievementAdditionalPersonals", void 0);
exports.Evaluation810SaveInfo = Evaluation810SaveInfo;
class EvaluationSearchResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], EvaluationSearchResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EvaluationSearchResponseDto.prototype, "counts", void 0);
exports.EvaluationSearchResponseDto = EvaluationSearchResponseDto;
class EvaluationSkillCheckResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EvaluationSkillCheckResponseDto.prototype, "flagSkill", void 0);
exports.EvaluationSkillCheckResponseDto = EvaluationSkillCheckResponseDto;
class EvaluationUpdateTypeResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EvaluationUpdateTypeResponseDto.prototype, "statusNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationUpdateTypeResponseDto.prototype, "updateTime", void 0);
exports.EvaluationUpdateTypeResponseDto = EvaluationUpdateTypeResponseDto;
class EvaluationListProSkillPublicResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationListProSkillPublicResponseDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationListProSkillPublicResponseDto.prototype, "smallClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationListProSkillPublicResponseDto.prototype, "mediumClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationListProSkillPublicResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EvaluationListProSkillPublicResponseDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationListProSkillPublicResponseDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationListProSkillPublicResponseDto.prototype, "jobType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EvaluationListProSkillPublicResponseDto.prototype, "key", void 0);
exports.EvaluationListProSkillPublicResponseDto = EvaluationListProSkillPublicResponseDto;
class GetAchievementSettingPublicResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAchievementSettingPublicResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAchievementSettingPublicResponseDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetAchievementSettingPublicResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetAchievementSettingPublicResponseDto.prototype, "point", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAchievementSettingPublicResponseDto.prototype, "note", void 0);
exports.GetAchievementSettingPublicResponseDto = GetAchievementSettingPublicResponseDto;
class GetBasicBehaviorSkillPublicResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetBasicBehaviorSkillPublicResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetBasicBehaviorSkillPublicResponseDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetBasicBehaviorSkillPublicResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetBasicBehaviorSkillPublicResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetBasicBehaviorSkillPublicResponseDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetBasicBehaviorSkillPublicResponseDto.prototype, "key", void 0);
exports.GetBasicBehaviorSkillPublicResponseDto = GetBasicBehaviorSkillPublicResponseDto;
class GetSettingProFormulaPublicResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetSettingProFormulaPublicResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetSettingProFormulaPublicResponseDto.prototype, "formulaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetSettingProFormulaPublicResponseDto.prototype, "totalItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetSettingProFormulaPublicResponseDto.prototype, "coefficient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], GetSettingProFormulaPublicResponseDto.prototype, "settingProFormula", void 0);
exports.GetSettingProFormulaPublicResponseDto = GetSettingProFormulaPublicResponseDto;
class GetEvaluation810ResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            results: {
                evaluationList: {
                    id: 1,
                    departmentName: 'GNW-00001: department_no_1',
                    divisionName: 'GNW-00001: division_no_1',
                    companyName: '株式会社ゲオホールディングス',
                    title: '2023年下期',
                    periodStart: '2023/11',
                    periodEnd: '2023/12',
                    status: 1,
                    level: 8,
                    summaryPointEvaluator2: null,
                    percentPoint: 100,
                    userId: 4,
                    commentUser: 'commentUser',
                    updatedTime: '2023-11-17T03:51:13.403Z',
                    summaryCharPointUser: null,
                    summaryCharPointEvaluator05: null,
                    summaryCharPointEvaluator1: null,
                    summaryCharPointEvaluator2: null,
                    summaryPointUser: '49.00',
                    summaryPointEvaluator05: '87.00',
                    summaryPointEvaluator1: '87.00',
                    achievementPersonalTotalPointUser: '10.00',
                    achievementPersonalTotalPointEvaluator05: '100.00',
                    achievementPersonalTotalPointEvaluator1: '100.00',
                    achievementPersonalTotalPointEvaluator2: '0.00',
                    achievementAdditionalTotalPointUser: null,
                    achievementAdditionalTotalPointEvaluator05: null,
                    achievementAdditionalTotalPointEvaluator1: null,
                    achievementAdditionalTotalPointEvaluator2: null,
                    dateCreationGoalStart: '2023/11/21',
                    dateCreationGoalEnd: '2023/11/30',
                    dateEvaluationStart: '2023/11/15',
                    dateEvaluationEnd: '2023/11/17',
                    evaluationAchievementPersonals: [
                        {
                            achievementStatus: '達成',
                            achievementValue: 'sdf',
                            actionPlan: 'actionPlan',
                            coefficientEvaluator1: null,
                            coefficientEvaluator2: null,
                            coefficientEvaluator05: null,
                            coefficientUser: null,
                            difficultyEvaluator1: '1.00',
                            difficultyEvaluator2: null,
                            difficultyEvaluator05: '1.00',
                            difficultyUser: '1.00',
                            evaluationId: 1,
                            id: 19,
                            itemNo: 0,
                            method: 'sdf',
                            pointEvaluator1: 100,
                            pointEvaluator2: null,
                            pointEvaluator05: 100,
                            pointUser: 10,
                            reasonComment: 'reasonComment',
                            title: 'dsf',
                            weight: 100,
                        },
                    ],
                    evaluationAchievementAdditional: [],
                    evaluator: [
                        {
                            evaluationOrder: '0.5',
                            evaluatorId: 6,
                            commentPublic: 'commentPublic',
                            commentPrivate: '',
                            user: {
                                employeeNumber: '201428a',
                                fullName: 'fullName',
                                email: 'pham.thuy.tien@geonet.co.jp',
                            },
                        },
                        {
                            evaluationOrder: '1.0',
                            evaluatorId: 2,
                            commentPublic: 'commentPublic',
                            commentPrivate: 'commentPrivate',
                            user: {
                                employeeNumber: '2009859',
                                fullName: 'fullName',
                                email: 'vo.khanh.duy@geonet.co.jp',
                            },
                        },
                        {
                            evaluationOrder: '2.0',
                            evaluatorId: 5,
                            commentPublic: 'commentPublic',
                            commentPrivate: 'commentPrivate',
                            user: {
                                employeeNumber: '2014289',
                                fullName: 'fullName',
                                email: 'tran.dang.khoa@geonet.co.jp',
                            },
                        },
                    ],
                    evaluationPeriod: {
                        dateCreationGoalDepartmentEnd: '2023/11/16',
                        dateCreationGoalDepartmentStart: '2023/11/16',
                        dateCreationGoalEnd: '2023/11/17',
                        dateCreationGoalStart: '2023/11/16',
                        dateEvaluationDepartmentEnd: '2023/11/17',
                        dateEvaluationDepartmentStart: '2023/11/17',
                        dateEvaluationEnd: '2023/11/17',
                        dateEvaluationStart: '2023/11/16',
                        id: 8,
                        periodEnd: '2024/3',
                        periodIndex: 2,
                        periodStart: '2023/10',
                        year: '2023',
                    },
                    user: {
                        id: 4,
                        employeeNumber: '2014288',
                        fullName: 'fullName',
                        divisionId: 2,
                        active: 1,
                    },
                },
                subList: [
                    [
                        {
                            evaluationDecision: 'evaluationDecision',
                            coefficient: '1.00',
                            parentKey: 0,
                            achievementPersonalId: 19,
                        },
                    ],
                ],
                versionSetting8: {
                    id: 3,
                    version: 1,
                    subVersion: 0,
                    settingAchievementPersonal: [],
                    settingAchievementAdditional: [],
                    settingFormula810: [],
                },
            },
        },
    }),
    __metadata("design:type", Object)
], GetEvaluation810ResponseDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetEvaluation810ResponseDto.prototype, "hasMode1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetEvaluation810ResponseDto.prototype, "hasMode2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], GetEvaluation810ResponseDto.prototype, "allowSeeList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetEvaluation810ResponseDto.prototype, "maxOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetEvaluation810ResponseDto.prototype, "isDisable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetEvaluation810ResponseDto.prototype, "hasMode3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetEvaluation810ResponseDto.prototype, "hasEvaluator2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 4,
            department: 'GNW-00001: division_no_1',
            division: 'GNW-00001: division_no_1',
            evaluationLevel: 8,
            evaluators: [
                '仮評価: 仮評価',
                '一次評価: 一次評価',
                '二次評価: 二次評価',
            ],
            fiscalYear: '2023年下期',
            periodStart: '2023/11',
            periodEnd: '2023/12',
            fullName: 'fullName',
            employeeNumber: '2014288',
            status: 1,
            active: 1,
        },
    }),
    __metadata("design:type", Object)
], GetEvaluation810ResponseDto.prototype, "userInfo", void 0);
exports.GetEvaluation810ResponseDto = GetEvaluation810ResponseDto;
class CreateOrUpdateEvaluationResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateOrUpdateEvaluationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateOrUpdateEvaluationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateOrUpdateEvaluationResponseDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateOrUpdateEvaluationResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateOrUpdateEvaluationResponseDto.prototype, "summaryCharPointUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateOrUpdateEvaluationResponseDto.prototype, "summaryCharPointEvaluator05", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateOrUpdateEvaluationResponseDto.prototype, "summaryCharPointEvaluator1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateOrUpdateEvaluationResponseDto.prototype, "summaryCharPointEvaluator2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 8,
            year: '2023',
            periodIndex: 2,
            periodStart: '2023/10',
            periodEnd: '2024/3',
            dateCreationGoalStart: '2023/11/16',
            dateCreationGoalEnd: '2023/11/17',
            dateEvaluationStart: '2023/11/16',
            dateEvaluationEnd: '2023/11/17',
            dateCreationGoalDepartmentStart: '2023/11/16',
            dateCreationGoalDepartmentEnd: '2023/11/16',
            dateEvaluationDepartmentStart: '2023/11/17',
            dateEvaluationDepartmentEnd: '2023/11/17',
            createdTime: '2023-11-15T03:42:54.747Z',
            updatedTime: '2023-11-15T06:33:15.868Z',
            checkFixed: 0,
        },
    }),
    __metadata("design:type", Object)
], CreateOrUpdateEvaluationResponseDto.prototype, "evaluationPeriod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            evaluationId: 1,
            evaluatorId: 6,
            evaluationOrder: '0.5',
            commentPublic: 'commentPublic',
            commentPrivate: '',
            createdTime: '2023-11-15T08:36:26.161Z',
            updatedTime: '2023-11-15T10:08:32.359Z',
        },
    }),
    __metadata("design:type", Array)
], CreateOrUpdateEvaluationResponseDto.prototype, "evaluator", void 0);
exports.CreateOrUpdateEvaluationResponseDto = CreateOrUpdateEvaluationResponseDto;
class ListBasicBehaviorResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListBasicBehaviorResponseDto.prototype, "idItem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListBasicBehaviorResponseDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListBasicBehaviorResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListBasicBehaviorResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListBasicBehaviorResponseDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 10,
            version: 2,
            subVersion: 0,
        },
    }),
    __metadata("design:type", Object)
], ListBasicBehaviorResponseDto.prototype, "versionBasicBehavior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListBasicBehaviorResponseDto.prototype, "key", void 0);
exports.ListBasicBehaviorResponseDto = ListBasicBehaviorResponseDto;
class GetProSkillEvaluationItemResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            itemId: 'i9bc',
            smallClass: '1',
            mediumClass: '1',
            content: '11',
            difficulty: 4,
            note: '11111',
            jobType: '1',
            key: 'i9bc',
        },
    }),
    __metadata("design:type", Object)
], GetProSkillEvaluationItemResponseDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProSkillEvaluationItemResponseDto.prototype, "department", void 0);
exports.GetProSkillEvaluationItemResponseDto = GetProSkillEvaluationItemResponseDto;
class GetDepartmentGoalResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentGoalResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentGoalResponseDto.prototype, "divisionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], GetDepartmentGoalResponseDto.prototype, "evaluationAchievementPersonals", void 0);
exports.GetDepartmentGoalResponseDto = GetDepartmentGoalResponseDto;
class CheckPermissionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CheckPermissionDto.prototype, "evaluationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CheckPermissionDto.prototype, "userId", void 0);
exports.CheckPermissionDto = CheckPermissionDto;
class CheckPermissionResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
    }),
    __metadata("design:type", Boolean)
], CheckPermissionResponseDto.prototype, "evaluationId", void 0);
exports.CheckPermissionResponseDto = CheckPermissionResponseDto;
class CheckPermissionRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
    }),
    __metadata("design:type", Number)
], CheckPermissionRequestDto.prototype, "evaluationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
    }),
    __metadata("design:type", Number)
], CheckPermissionRequestDto.prototype, "userId", void 0);
exports.CheckPermissionRequestDto = CheckPermissionRequestDto;
//# sourceMappingURL=EvaluationParamDto.js.map