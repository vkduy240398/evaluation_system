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
exports.UndoFixEvaluationDTO = exports.DeletePeriodDepartmentSettingDTO = exports.ListPeriodDepartmentSettingDTO = exports.SavePeriodDepartmentSettingDTO = exports.DepartmentPeriodSettingItemDTO = exports.SendMailDTO = exports.findListUserToSettingEvaluationDTO = exports.ImportUserDTO = exports.UpdateSettingEvaluatorListUserDTO = exports.UpdateSettingEvaluatorOfOneUserDTO = exports.ConfirmGoalDTO = exports.GetMailHistoryListDTO = exports.SendMailNow2DTO = exports.SendMailNowBodyDTO = exports.SendMailBodyDTO = exports.CheckStatusRecordSendDTO = exports.GetToEmailFixedListDTO = exports.GetToEmailListDTO = exports.ListUserPeriodDTO = exports.SavePeriodDTO = exports.ListPeriodDTO = exports.PeriodDTO = exports.UpdateEvaluationPeriodExceptionDto = exports.EvaluationByPeriodParamDto = exports.ExceptionPeriodParamDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ManagementEvaluationProDto_1 = require("./ManagementEvaluationProDto");
const class_transformer_1 = require("class-transformer");
const TemplateMailId_1 = require("../../enum/TemplateMailId");
class ExceptionPeriodParamDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExceptionPeriodParamDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], ExceptionPeriodParamDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], ExceptionPeriodParamDto.prototype, "periodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExceptionPeriodParamDto.prototype, "searchField", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExceptionPeriodParamDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExceptionPeriodParamDto.prototype, "offset", void 0);
exports.ExceptionPeriodParamDto = ExceptionPeriodParamDto;
class EvaluationByPeriodParamDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationByPeriodParamDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationByPeriodParamDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationByPeriodParamDto.prototype, "periodIndex", void 0);
exports.EvaluationByPeriodParamDto = EvaluationByPeriodParamDto;
class UpdateEvaluationPeriodExceptionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateEvaluationPeriodExceptionDto.prototype, "evaluations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateEvaluationPeriodExceptionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.Validate)(ManagementEvaluationProDto_1.IsNumberOrArray),
    __metadata("design:type", Array)
], UpdateEvaluationPeriodExceptionDto.prototype, "deleteIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], UpdateEvaluationPeriodExceptionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateEvaluationPeriodExceptionDto.prototype, "periodIndex", void 0);
exports.UpdateEvaluationPeriodExceptionDto = UpdateEvaluationPeriodExceptionDto;
class PeriodDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023',
    }),
    __metadata("design:type", Number)
], PeriodDTO.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 2,
        enum: [1, 2],
    }),
    __metadata("design:type", Number)
], PeriodDTO.prototype, "periodIndex", void 0);
exports.PeriodDTO = PeriodDTO;
class ListPeriodDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2022',
    }),
    __metadata("design:type", Number)
], ListPeriodDTO.prototype, "yearStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023',
    }),
    __metadata("design:type", Number)
], ListPeriodDTO.prototype, "yearEnd", void 0);
exports.ListPeriodDTO = ListPeriodDTO;
class SavePeriodConditionDTO {
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SavePeriodConditionDTO.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SavePeriodConditionDTO.prototype, "periodIndex", void 0);
class SavePeriodDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 8,
            year: '2023',
            periodIndex: 2,
            periodStart: '2023/10',
            periodEnd: '2024/3',
            dateCreationGoalStart: '2023/11/22',
            dateCreationGoalEnd: '2023/11/30',
            dateEvaluationStart: '2023/11/20',
            dateEvaluationEnd: '2023/11/29',
            dateCreationGoalDepartmentStart: '2023/11/22',
            dateCreationGoalDepartmentEnd: '2023/11/30',
            dateEvaluationDepartmentStart: '2023/11/20',
            dateEvaluationDepartmentEnd: '2023/11/30',
            createdTime: '2023-11-15T10:52:45.934Z',
            updatedTime: '2023-11-22T02:56:04.582Z',
            checkFixed: 0,
        },
    }),
    __metadata("design:type", Object)
], SavePeriodDTO.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            year: '2023',
            periodIndex: 2,
        },
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SavePeriodConditionDTO),
    __metadata("design:type", SavePeriodConditionDTO)
], SavePeriodDTO.prototype, "condition", void 0);
exports.SavePeriodDTO = SavePeriodDTO;
class ListUserPeriodDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '0,1,2,3,4,5,6,7,8,49,50,51,52,53,54,55,56,57,58,59,60,61,98,99,100',
    }),
    __metadata("design:type", String)
], ListUserPeriodDTO.prototype, "stringStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 8,
    }),
    __metadata("design:type", Number)
], ListUserPeriodDTO.prototype, "periodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'fixedGoal',
        enum: ['fixedGoal', 'fixedEvaluation', 'fixedEvaluationConfirm'],
    }),
    __metadata("design:type", String)
], ListUserPeriodDTO.prototype, "type", void 0);
exports.ListUserPeriodDTO = ListUserPeriodDTO;
class GetToEmailListDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TemplateMailId_1.EmailType,
        example: '7',
    }),
    __metadata("design:type", String)
], GetToEmailListDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023',
    }),
    __metadata("design:type", String)
], GetToEmailListDTO.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2',
    }),
    __metadata("design:type", String)
], GetToEmailListDTO.prototype, "periodIndex", void 0);
exports.GetToEmailListDTO = GetToEmailListDTO;
class GetToEmailFixedListDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TemplateMailId_1.EmailTypeFixed,
        example: '1',
    }),
    __metadata("design:type", String)
], GetToEmailFixedListDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '1',
    }),
    __metadata("design:type", String)
], GetToEmailFixedListDTO.prototype, "periodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], GetToEmailFixedListDTO.prototype, "evaluationId", void 0);
exports.GetToEmailFixedListDTO = GetToEmailFixedListDTO;
class CheckStatusRecordSendDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TemplateMailId_1.EmailTypeFixed,
        example: '1',
    }),
    __metadata("design:type", String)
], CheckStatusRecordSendDTO.prototype, "type", void 0);
exports.CheckStatusRecordSendDTO = CheckStatusRecordSendDTO;
class SendMailBodyDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendMailBodyDTO.prototype, "contentMail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendMailBodyDTO.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], SendMailBodyDTO.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendMailBodyDTO.prototype, "mailTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendMailBodyDTO.prototype, "sendTimeActual", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendMailBodyDTO.prototype, "sendTimeSetting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SendMailBodyDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendMailBodyDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SendMailBodyDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SendMailBodyDTO.prototype, "cronjobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            'le.vu.trung.hieu@geonet.co.jp',
            'vo.thi.huyen.trang@geonet.co.jp',
        ],
    }),
    __metadata("design:type", Array)
], SendMailBodyDTO.prototype, "mailToObjList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], SendMailBodyDTO.prototype, "dataMailCCs", void 0);
exports.SendMailBodyDTO = SendMailBodyDTO;
class SendMailNowBodyDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            'le.vu.trung.hieu@geonet.co.jp',
            'vo.thi.huyen.trang@geonet.co.jp',
        ],
    }),
    __metadata("design:type", Array)
], SendMailNowBodyDTO.prototype, "toEmails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            subject: 'string',
            editor: 'string',
        },
    }),
    __metadata("design:type", Object)
], SendMailNowBodyDTO.prototype, "mailContent", void 0);
exports.SendMailNowBodyDTO = SendMailNowBodyDTO;
class SendMailNow2DTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SendMailNowBodyDTO)
], SendMailNow2DTO.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SendMailBodyDTO)
], SendMailNow2DTO.prototype, "inputedValues", void 0);
exports.SendMailNow2DTO = SendMailNow2DTO;
class GetMailHistoryListDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023',
    }),
    __metadata("design:type", String)
], GetMailHistoryListDTO.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 2,
    }),
    __metadata("design:type", Number)
], GetMailHistoryListDTO.prototype, "periodIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], GetMailHistoryListDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], GetMailHistoryListDTO.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 10,
    }),
    __metadata("design:type", Number)
], GetMailHistoryListDTO.prototype, "offset", void 0);
exports.GetMailHistoryListDTO = GetMailHistoryListDTO;
class ConfirmGoalDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 7,
    }),
    __metadata("design:type", Number)
], ConfirmGoalDTO.prototype, "periodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 2,
        enum: [0, 1, 2],
    }),
    __metadata("design:type", Number)
], ConfirmGoalDTO.prototype, "checkFixed", void 0);
exports.ConfirmGoalDTO = ConfirmGoalDTO;
class UpdateSettingEvaluatorOfOneUserDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 10,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "evaluatorFirst", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 19,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "evaluatorHaft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 10,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "evaluatorSecond", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
    }),
    __metadata("design:type", String)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "getValuaDelete05", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [],
        example: [1, 2],
    }),
    __metadata("design:type", Array)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
    }),
    __metadata("design:type", String)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "getValuaDelete10", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            periodIndex: 2,
            goals: '2023/11/22 ～ 2023/11/30',
            departmentGoals: '2023/11/22 ～ 2023/11/30',
            personalEvaluation: '2023/11/20 ～ 2023/11/29',
            divisionEvaluate: '2023/11/20 ～ 2023/11/30',
            key: '51xcmrp',
            year: '2023',
            id: 8,
            checkFixed: 0,
            evaluationPeriod: '2023年下期',
            goalRecord: 6,
            evaluationRecord: 11,
            evaluationConfirmRecord: 13,
            totalRecord: 15,
            goalFixedRecord: 9,
            evaluationFixedRecord: 2,
            evaluationConfirmFixedRecord: 2,
            periodId: 8,
            goals810Time: '2023/11/22 ～ 2023/11/30',
            goals17Time: '2023/11/22 ～ 2023/11/30',
            title: '2023年下期',
            department: 'すべて',
            isSearch: true,
            current: 1,
            offset: 0,
            limit: 20,
        },
    }),
    __metadata("design:type", Object)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 8,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorOfOneUserDTO.prototype, "userId", void 0);
exports.UpdateSettingEvaluatorOfOneUserDTO = UpdateSettingEvaluatorOfOneUserDTO;
class UpdateSettingEvaluatorListUserDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 10,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorListUserDTO.prototype, "evaluatorFirst", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 19,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorListUserDTO.prototype, "evaluatorHaft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 10,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorListUserDTO.prototype, "evaluatorSecond", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            periodIndex: 2,
            goals: '2023/11/22 ～ 2023/11/30',
            departmentGoals: '2023/11/22 ～ 2023/11/30',
            personalEvaluation: '2023/11/20 ～ 2023/11/29',
            divisionEvaluate: '2023/11/20 ～ 2023/11/30',
            key: '51xcmrp',
            year: '2023',
            id: 8,
            checkFixed: 0,
            evaluationPeriod: '2023年下期',
            goalRecord: 6,
            evaluationRecord: 11,
            evaluationConfirmRecord: 13,
            totalRecord: 15,
            goalFixedRecord: 9,
            evaluationFixedRecord: 2,
            evaluationConfirmFixedRecord: 2,
            periodId: 8,
            goals810Time: '2023/11/22 ～ 2023/11/30',
            goals17Time: '2023/11/22 ～ 2023/11/30',
            title: '2023年下期',
            department: 'すべて',
            isSearch: true,
            current: 1,
            offset: 0,
            limit: 20,
        },
    }),
    __metadata("design:type", Object)
], UpdateSettingEvaluatorListUserDTO.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                id: 8,
                employeeNumber: '1000002',
                fullName: 'pham.dinh.quoc.hoa',
                active: 1,
                level: 5,
                department: {
                    name: 'department test 1',
                    code: 'GNW-20001',
                },
                division: {
                    name: 'division test 1',
                    code: 'GNW-10001',
                },
                evaluatorDefault: {
                    id: 36,
                    active: 1,
                    userId: 8,
                    evaluator05Id: 19,
                    evaluator1Id: 10,
                    evaluator2Id: 9,
                    evaluationPeriodId: 8,
                    createdTime: '2023-11-16T09:41:17.845Z',
                    updatedTime: '2023-11-23T01:13:48.495Z',
                    user_id: 8,
                    evaluator_0_5_id: 19,
                    evaluator_1_id: 10,
                    evaluator_2_id: 9,
                    evaluation_period_id: 8,
                    evaluator05: {
                        id: 19,
                        employeeNumber: '2013786',
                        fullName: 'Chu ThiHoangAnh',
                        email: 'chu.thi.hoang.anh@geonet.co.jp',
                        departmentId: 83,
                        divisionId: 38,
                        companyId: 3,
                        active: 1,
                        level: 4,
                        flagSkill: 1,
                        createdTime: '2023-11-20T04:59:50.170Z',
                        updatedTime: '2023-11-22T04:22:28.984Z',
                        department_id: 83,
                        division_id: 38,
                        company_id: 3,
                    },
                    evaluator1: {
                        id: 10,
                        employeeNumber: '2011111',
                        fullName: 'nguyen.hoang.thien',
                        email: 'nguyen.hoang.thien@geonet.co.jp',
                        departmentId: 7,
                        divisionId: 5,
                        companyId: 1,
                        active: 1,
                        level: 7,
                        flagSkill: 1,
                        createdTime: '2023-11-15T10:52:42.783Z',
                        updatedTime: '2023-11-17T01:10:00.360Z',
                        department_id: 7,
                        division_id: 5,
                        company_id: 1,
                    },
                    evaluator2: {
                        id: 9,
                        employeeNumber: '2013787',
                        fullName: 'dang.hoang.kha',
                        email: 'dang.hoang.kha@geonet.co.jp',
                        departmentId: 6,
                        divisionId: 5,
                        companyId: 2,
                        active: 1,
                        level: 2,
                        flagSkill: 0,
                        createdTime: '2023-11-15T10:52:42.783Z',
                        updatedTime: '2023-11-22T07:57:19.820Z',
                        department_id: 6,
                        division_id: 5,
                        company_id: 2,
                    },
                },
                roles: [
                    {
                        id: 1,
                        name: 'USER',
                        createdTime: '2023-11-15T10:52:42.232Z',
                        updatedTime: '2023-11-15T10:52:42.232Z',
                        Permission: {
                            userId: 8,
                            roleId: 1,
                            createdTime: '2023-11-17T01:09:42.333Z',
                            updatedTime: '2023-11-17T01:09:42.333Z',
                            user_id: 8,
                            role_id: 1,
                        },
                    },
                ],
            },
            {
                id: 14,
                employeeNumber: '1000009',
                fullName: 'vu.trung.kien',
                active: 1,
                level: 5,
                department: {
                    name: 'department test 2',
                    code: 'GNW-20002',
                },
                division: {
                    name: 'division test 1',
                    code: 'GNW-10001',
                },
                evaluatorDefault: {
                    id: 37,
                    active: 1,
                    userId: 14,
                    evaluator05Id: null,
                    evaluator1Id: 1,
                    evaluator2Id: 7,
                    evaluationPeriodId: 8,
                    createdTime: '2023-11-16T09:41:17.845Z',
                    updatedTime: '2023-11-22T09:31:43.397Z',
                    user_id: 14,
                    evaluator_0_5_id: null,
                    evaluator_1_id: 1,
                    evaluator_2_id: 7,
                    evaluation_period_id: 8,
                    evaluator05: null,
                    evaluator1: {
                        id: 1,
                        employeeNumber: '2004045',
                        fullName: 'ベトナム システム',
                        email: 'vietnam.system@geonet.co.jp',
                        departmentId: 1,
                        divisionId: null,
                        companyId: 1,
                        active: 1,
                        level: 1,
                        flagSkill: 1,
                        createdTime: '2023-11-15T10:52:42.783Z',
                        updatedTime: '2023-11-15T10:52:42.783Z',
                        department_id: 1,
                        division_id: null,
                        company_id: 1,
                    },
                    evaluator2: {
                        id: 7,
                        employeeNumber: '2005769',
                        fullName: 'vo.thi.huyen.trang',
                        email: 'vo.thi.huyen.trang@geonet.co.jp',
                        departmentId: 7,
                        divisionId: 5,
                        companyId: 1,
                        active: 1,
                        level: 8,
                        flagSkill: 0,
                        createdTime: '2023-11-15T10:52:42.783Z',
                        updatedTime: '2023-11-16T09:10:00.683Z',
                        department_id: 7,
                        division_id: 5,
                        company_id: 1,
                    },
                },
                roles: [
                    {
                        id: 1,
                        name: 'USER',
                        createdTime: '2023-11-15T10:52:42.232Z',
                        updatedTime: '2023-11-15T10:52:42.232Z',
                        Permission: {
                            userId: 14,
                            roleId: 1,
                            createdTime: '2023-11-16T02:51:40.161Z',
                            updatedTime: '2023-11-16T02:51:40.161Z',
                            user_id: 14,
                            role_id: 1,
                        },
                    },
                ],
            },
        ],
    }),
    __metadata("design:type", Object)
], UpdateSettingEvaluatorListUserDTO.prototype, "listUserSelected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 8,
    }),
    __metadata("design:type", Number)
], UpdateSettingEvaluatorListUserDTO.prototype, "userId", void 0);
exports.UpdateSettingEvaluatorListUserDTO = UpdateSettingEvaluatorListUserDTO;
class ImportUserDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "periodIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '978bi0i',
    }),
    __metadata("design:type", String)
], ImportUserDTO.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2028',
    }),
    __metadata("design:type", String)
], ImportUserDTO.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 17,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "checkFixed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2028年上期',
    }),
    __metadata("design:type", String)
], ImportUserDTO.prototype, "evaluationPeriod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "goalRecord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "evaluationRecord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "evaluationConfirmRecord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "totalRecord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "goalFixedRecord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "evaluationFixedRecord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "evaluationConfirmFixedRecord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 17,
    }),
    __metadata("design:type", Number)
], ImportUserDTO.prototype, "periodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2028年上期',
    }),
    __metadata("design:type", String)
], ImportUserDTO.prototype, "titile", void 0);
exports.ImportUserDTO = ImportUserDTO;
class findListUserToSettingEvaluationDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'すべて',
    }),
    __metadata("design:type", String)
], findListUserToSettingEvaluationDTO.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'すべて',
    }),
    __metadata("design:type", String)
], findListUserToSettingEvaluationDTO.prototype, "division", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
        nullable: true,
        required: false,
    }),
    __metadata("design:type", String)
], findListUserToSettingEvaluationDTO.prototype, "nameAndEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 10,
    }),
    __metadata("design:type", Number)
], findListUserToSettingEvaluationDTO.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], findListUserToSettingEvaluationDTO.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
        nullable: true,
        required: false,
    }),
    __metadata("design:type", String)
], findListUserToSettingEvaluationDTO.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'ASC',
    }),
    __metadata("design:type", String)
], findListUserToSettingEvaluationDTO.prototype, "sortType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        example: {
            state: {
                periodIndex: '2',
                goals: '2023/11/22 ～ 2023/11/30',
                departmentGoals: '2023/11/22 ～ 2023/11/30',
                personalEvaluation: '2023/11/20 ～ 2023/11/29',
                divisionEvaluate: '2023/11/20 ～ 2023/11/30',
                key: 'pp7bkyfq',
                year: '2023',
                id: '8',
                checkFixed: '0',
                evaluationPeriod: '2023年下期',
                goalRecord: '7',
                evaluationRecord: '12',
                evaluationConfirmRecord: '13',
                totalRecord: '15',
                goalFixedRecord: '8',
                evaluationFixedRecord: '2',
                evaluationConfirmFixedRecord: '2',
                periodId: '8',
                goals810Time: '2023/11/22 ～ 2023/11/30',
                goals17Time: '2023/11/22 ～ 2023/11/30',
                title: '2023年下期',
            },
        },
    }),
    __metadata("design:type", Object)
], findListUserToSettingEvaluationDTO.prototype, "state", void 0);
exports.findListUserToSettingEvaluationDTO = findListUserToSettingEvaluationDTO;
class SendMailDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 2,
    }),
    __metadata("design:type", Number)
], SendMailDTO.prototype, "emailType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '18',
    }),
    __metadata("design:type", String)
], SendMailDTO.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: ['2023/11/23', '2023/11/23'],
    }),
    __metadata("design:type", Array)
], SendMailDTO.prototype, "goalEvaluation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: ['2023/11/23', '2023/11/23'],
    }),
    __metadata("design:type", Array)
], SendMailDTO.prototype, "goaldepartmentEvaluation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: [53, 47, 51, 44, 43, 40, 41, 42, 48, 52, 54, 49, 50, 45, 55, 46],
    }),
    __metadata("design:type", Array)
], SendMailDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        example: {
            date: ['2023-11-23T17:00:00.000Z', '2023-11-24T17:00:00.000Z'],
            dateDepartment: ['2023-11-23T17:00:00.000Z', '2023-11-24T17:00:00.000Z'],
            subject: '【期限延長】GNW2028下期 目標設定',
            editor: '<p><span style="font-size: 11pt;"><span style="font-size: 11pt;"> お疲れ様です。<br />GNW人事総務課窓口です。<br /><br /></span><span style="font-size: 11pt;">2028下期</span><span style="font-size: 11pt;"> 目標設定期日が過ぎてしまいましたが、<br />未提出の状況であるため期間を延長し再案内いたします。 <br />評価システムにログインし、目標設定を完了してください。<br /><br />■ログイン情報<br />　1．URL： </span><a href="http://10.70.190.124:8083/login" target="_blank" rel="noopener noreferrer">http://10.70.190.124:8083/login</a><span style="font-size: 11pt;"> <br />　2．ユーザ名・パスワードはPCにログインするユーザ名・パスワードと同様。<br /><br />■実施期間<br />【変更前】 </span><span style="font-size: 11pt;">11月24日 (金)</span><span style="font-size: 11pt;"> &nbsp;~&nbsp;</span><span style="font-size: 11pt;">11月25日 (土) </span><span style="font-size: 11pt;"><br />【変更後】</span><span style="font-size: 11pt;"> 11月24日 (金)</span><span style="font-size: 11pt;">&nbsp;~&nbsp;</span><span style="color: #ff0000; font-size: 11pt;"><strong>M月DD日 (date)</strong> </span><span style="font-size: 11pt;"><br /><br />これ以上の期間延長は行わないので、確実に実施お願いいたします。 <br /><br />お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。</span></span></p>',
        },
    }),
    __metadata("design:type", Object)
], SendMailDTO.prototype, "mailContent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], SendMailDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: [
            ['pham.dinh.quoc.hoa@geonet.co.jp'],
            ['vu.trung.kien@geonet.co.jp'],
            ['vietnam.system@geonet.co.jp'],
            ['vo.thi.huyen.trang@geonet.co.jp'],
            ['dao.thi.hong.nhung@geonet.co.jp'],
            ['lam.duc.huy@geonet.co.jp'],
            ['tran.le.ha.nam@geonet.co.jp'],
            ['nguyen.hoang.thien@geonet.co.jp'],
            ['le.vu.trung.hieu@geonet.co.jp'],
            ['dang.hoang.kha@geonet.co.jp'],
            ['tran.anh.khoi@geonet.co.jp'],
            ['tran.dang.khoa@geonet.co.jp'],
            ['chu.thi.hoang.anh@geonet.co.jp'],
            ['lieu.hong.thai@geonet.co.jp'],
        ],
    }),
    __metadata("design:type", Array)
], SendMailDTO.prototype, "toEmails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'fixedGoal',
    }),
    __metadata("design:type", String)
], SendMailDTO.prototype, "type", void 0);
exports.SendMailDTO = SendMailDTO;
class DepartmentPeriodSettingItemDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DepartmentPeriodSettingItemDTO.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/04/01' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateCreationGoalDepartmentStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/05/31' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateCreationGoalDepartmentEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/04/01' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateCreationGoalStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/05/31' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateCreationGoalEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/06/01' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateEvaluationDepartmentStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/07/31' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateEvaluationDepartmentEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/06/01' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateEvaluationStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2025/07/31' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DepartmentPeriodSettingItemDTO.prototype, "dateEvaluationEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DepartmentPeriodSettingItemDTO.prototype, "isDivisionLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DepartmentPeriodSettingItemDTO.prototype, "childDepartmentIds", void 0);
exports.DepartmentPeriodSettingItemDTO = DepartmentPeriodSettingItemDTO;
class SavePeriodDepartmentSettingDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 8 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SavePeriodDepartmentSettingDTO.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DepartmentPeriodSettingItemDTO] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DepartmentPeriodSettingItemDTO),
    __metadata("design:type", Array)
], SavePeriodDepartmentSettingDTO.prototype, "departments", void 0);
exports.SavePeriodDepartmentSettingDTO = SavePeriodDepartmentSettingDTO;
class ListPeriodDepartmentSettingDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 8 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListPeriodDepartmentSettingDTO.prototype, "evaluationPeriodId", void 0);
exports.ListPeriodDepartmentSettingDTO = ListPeriodDepartmentSettingDTO;
class DeletePeriodDepartmentSettingDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeletePeriodDepartmentSettingDTO.prototype, "id", void 0);
exports.DeletePeriodDepartmentSettingDTO = DeletePeriodDepartmentSettingDTO;
class UndoFixEvaluationDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 8,
    }),
    __metadata("design:type", Number)
], UndoFixEvaluationDTO.prototype, "periodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], UndoFixEvaluationDTO.prototype, "type", void 0);
exports.UndoFixEvaluationDTO = UndoFixEvaluationDTO;
//# sourceMappingURL=ExceptionPeriodRequestDto.js.map