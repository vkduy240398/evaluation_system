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
exports.DetailProSkillPublicResponse = exports.ProSkillEditResponse = exports.VersionPublicResponse = exports.PermissionResponse = exports.ListPointResponse = exports.InitialVersionResponse = exports.HistoryApproveResponse = exports.VersionCancelResponse = exports.VersionSubmitResponse = exports.VersionProSkillDepartmentResponse = exports.ProSkillSaveDrafReponse = exports.VersionProSkillResponse = exports.DepartmentDto = exports.DetailProSkillResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const ProSkillSettingCommon_1 = require("./ProSkillSettingCommon");
class DetailProSkillResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DetailProSkillResponse.prototype, "departmentActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DetailProSkillResponse.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001: department_1' }),
    __metadata("design:type", String)
], DetailProSkillResponse.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'huynh.ngoc.hung' }),
    __metadata("design:type", String)
], DetailProSkillResponse.prototype, "userUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], DetailProSkillResponse.prototype, "updated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], DetailProSkillResponse.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], DetailProSkillResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1.0' }),
    __metadata("design:type", String)
], DetailProSkillResponse.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], DetailProSkillResponse.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'reason' }),
    __metadata("design:type", String)
], DetailProSkillResponse.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DetailProSkillResponse.prototype, "versionMain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], DetailProSkillResponse.prototype, "versionSub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], DetailProSkillResponse.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProSkillSettingCommon_1.ProskillChildren] }),
    __metadata("design:type", Array)
], DetailProSkillResponse.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProSkillSettingCommon_1.SettersAndApproversDto }),
    __metadata("design:type", ProSkillSettingCommon_1.SettersAndApproversDto)
], DetailProSkillResponse.prototype, "settersAndApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], DetailProSkillResponse.prototype, "editAlready", void 0);
exports.DetailProSkillResponse = DetailProSkillResponse;
class DepartmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001: department_1' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'huynh.ngoc.hung' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T06:13:40.049Z' }),
    __metadata("design:type", Date)
], DepartmentDto.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-20T04:38:56.027Z' }),
    __metadata("design:type", Date)
], DepartmentDto.prototype, "updatedTime", void 0);
exports.DepartmentDto = DepartmentDto;
class VersionProSkillResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProSkillSettingCommon_1.VersionProSkillDetail] }),
    __metadata("design:type", Array)
], VersionProSkillResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionProSkillResponse.prototype, "counts", void 0);
exports.VersionProSkillResponse = VersionProSkillResponse;
class CreationUser {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'dang.hoang.kha' }),
    __metadata("design:type", String)
], CreationUser.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 26 }),
    __metadata("design:type", Number)
], CreationUser.prototype, "id", void 0);
class ProSkillSaveDrafReponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 200 }),
    __metadata("design:type", Number)
], ProSkillSaveDrafReponse.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 26 }),
    __metadata("design:type", Number)
], ProSkillSaveDrafReponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], ProSkillSaveDrafReponse.prototype, "updated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], ProSkillSaveDrafReponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], ProSkillSaveDrafReponse.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 18 }),
    __metadata("design:type", Number)
], ProSkillSaveDrafReponse.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1.0' }),
    __metadata("design:type", String)
], ProSkillSaveDrafReponse.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], ProSkillSaveDrafReponse.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'huynh.ngoc.hung' }),
    __metadata("design:type", String)
], ProSkillSaveDrafReponse.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'reason' }),
    __metadata("design:type", String)
], ProSkillSaveDrafReponse.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ProSkillSaveDrafReponse.prototype, "departmentActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001: department_1' }),
    __metadata("design:type", String)
], ProSkillSaveDrafReponse.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CreationUser }),
    __metadata("design:type", CreationUser)
], ProSkillSaveDrafReponse.prototype, "creationUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], ProSkillSaveDrafReponse.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    __metadata("design:type", String)
], ProSkillSaveDrafReponse.prototype, "listDepartment", void 0);
exports.ProSkillSaveDrafReponse = ProSkillSaveDrafReponse;
class Department {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Number)
], Department.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001' }),
    __metadata("design:type", Number)
], Department.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'department_1' }),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
class VersionProSkillDepartment {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 26 }),
    __metadata("design:type", Number)
], VersionProSkillDepartment.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionProSkillDepartment.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionProSkillDepartment.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], VersionProSkillDepartment.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionProSkillDepartment.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionProSkillDepartment.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionProSkillDepartment.prototype, "updateDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionProSkillDepartment.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Department }),
    __metadata("design:type", Department)
], VersionProSkillDepartment.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, example: {
            "fullName": "lieu.hong.thai"
        } }),
    __metadata("design:type", Object)
], VersionProSkillDepartment.prototype, "user", void 0);
class VersionProSkillDepartmentResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [VersionProSkillDepartment] }),
    __metadata("design:type", Array)
], VersionProSkillDepartmentResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionProSkillDepartmentResponse.prototype, "total", void 0);
exports.VersionProSkillDepartmentResponse = VersionProSkillDepartmentResponse;
class VersionSubmitResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 26 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 200 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionSubmitResponse.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 18 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'reason' }),
    __metadata("design:type", String)
], VersionSubmitResponse.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSubmitResponse.prototype, "departmentActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionSubmitResponse.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001: department_1' }),
    __metadata("design:type", String)
], VersionSubmitResponse.prototype, "departmentName", void 0);
exports.VersionSubmitResponse = VersionSubmitResponse;
class VersionCancelResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 402 }),
    __metadata("design:type", Number)
], VersionCancelResponse.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1' }),
    __metadata("design:type", String)
], VersionCancelResponse.prototype, "id", void 0);
exports.VersionCancelResponse = VersionCancelResponse;
class ApprovalHistories {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, example: {
            'id': 3,
            'fullName': 'lieu.hong.thai'
        } }),
    __metadata("design:type", Object)
], ApprovalHistories.prototype, "approverUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], ApprovalHistories.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'public' }),
    __metadata("design:type", String)
], ApprovalHistories.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '公開' }),
    __metadata("design:type", String)
], ApprovalHistories.prototype, "status", void 0);
class Infor {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2.0' }),
    __metadata("design:type", Number)
], Infor.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001: division_thai_no_1' }),
    __metadata("design:type", String)
], Infor.prototype, "department", void 0);
class HistoryApproveResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Infor }),
    __metadata("design:type", Infor)
], HistoryApproveResponse.prototype, "infor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ApprovalHistories] }),
    __metadata("design:type", ApprovalHistories)
], HistoryApproveResponse.prototype, "approvalHistories", void 0);
exports.HistoryApproveResponse = HistoryApproveResponse;
class InitialVersionResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 401 }),
    __metadata("design:type", Number)
], InitialVersionResponse.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'dang.hoang.kha' }),
    __metadata("design:type", String)
], InitialVersionResponse.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: "85" }),
    __metadata("design:type", String)
], InitialVersionResponse.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object, example: {
            "fullName": "dang.hoang.kha",
            "id": 9
        }
    }),
    __metadata("design:type", Object)
], InitialVersionResponse.prototype, "creationUser", void 0);
exports.InitialVersionResponse = InitialVersionResponse;
class ListPointResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 200 }),
    __metadata("design:type", Number)
], ListPointResponse.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProSkillSettingCommon_1.ListPoint }),
    __metadata("design:type", ProSkillSettingCommon_1.ListPoint)
], ListPointResponse.prototype, "listPoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProSkillSettingCommon_1.SettersAndApproversDto }),
    __metadata("design:type", ProSkillSettingCommon_1.SettersAndApproversDto)
], ListPointResponse.prototype, "settersAndApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: "GNW-0001: Dep_1" }),
    __metadata("design:type", String)
], ListPointResponse.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: "" }),
    __metadata("design:type", String)
], ListPointResponse.prototype, "listDepartment", void 0);
exports.ListPointResponse = ListPointResponse;
class PermissionResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 5 }),
    __metadata("design:type", Number)
], PermissionResponse.prototype, "status", void 0);
exports.PermissionResponse = PermissionResponse;
class VersionPublicResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 26 }),
    __metadata("design:type", Number)
], VersionPublicResponse.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 18 }),
    __metadata("design:type", Number)
], VersionPublicResponse.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001: department_1' }),
    __metadata("design:type", String)
], VersionPublicResponse.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionPublicResponse.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionPublicResponse.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], VersionPublicResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1.0' }),
    __metadata("design:type", String)
], VersionPublicResponse.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionPublicResponse.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'reason' }),
    __metadata("design:type", String)
], VersionPublicResponse.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionPublicResponse.prototype, "versionMain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionPublicResponse.prototype, "versionSub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object, example: {
            'id': 3,
            'fullName': 'lieu.hong.thai'
        }
    }),
    __metadata("design:type", Object)
], VersionPublicResponse.prototype, "creationUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionPublicResponse.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProSkillSettingCommon_1.ProskillChildren] }),
    __metadata("design:type", Array)
], VersionPublicResponse.prototype, "children", void 0);
exports.VersionPublicResponse = VersionPublicResponse;
class ProSkillEditResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: VersionPublicResponse }),
    __metadata("design:type", VersionPublicResponse)
], ProSkillEditResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProSkillSettingCommon_1.SettersAndApproversDto }),
    __metadata("design:type", ProSkillSettingCommon_1.SettersAndApproversDto)
], ProSkillEditResponse.prototype, "settersAndApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], ProSkillEditResponse.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProSkillSettingCommon_1.ListPoint }),
    __metadata("design:type", ProSkillSettingCommon_1.ListPoint)
], ProSkillEditResponse.prototype, "listPoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ProSkillEditResponse.prototype, "lengths", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], ProSkillEditResponse.prototype, "editAlready", void 0);
exports.ProSkillEditResponse = ProSkillEditResponse;
class DetailProSkillPublicResponse extends ProSkillSettingCommon_1.VersionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-1900：Group 1' }),
    __metadata("design:type", String)
], DetailProSkillPublicResponse.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DetailProSkillPublicResponse.prototype, "departmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], DetailProSkillPublicResponse.prototype, "versionMain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Number)
], DetailProSkillPublicResponse.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProSkillSettingCommon_1.ProskillChildren] }),
    __metadata("design:type", Array)
], DetailProSkillPublicResponse.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProSkillSettingCommon_1.SettersAndApproversDto }),
    __metadata("design:type", ProSkillSettingCommon_1.SettersAndApproversDto)
], DetailProSkillPublicResponse.prototype, "settersAndApprovers", void 0);
exports.DetailProSkillPublicResponse = DetailProSkillPublicResponse;
//# sourceMappingURL=ProSkillSettingResponse.js.map