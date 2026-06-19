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
exports.AuthResponseDto = exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const Mock_1 = require("../../enum/Mock");
const RoleName_1 = require("../../constant/RoleName");
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidmlldG5hbS5zeXN0ZW1AZ2VvbmV0LmNvLmpwIiwiZnVsbE5hbWUiOiLjg5njg4jjg4rjg6Ag44K344K544OG44OgIiwiZW1wbG95ZWVOdW1iZXIiOiIyMDA0MDQ1IiwiYWN0aXZlIjoxLCJyb2xlcyI6W3sibmFtZSI6IlVTRVIifSx7Im5hbWUiOiJFVkFMVUFUT1IifSx7Im5hbWUiOiJQUk9fU0tJTExfU0VUVElORyJ9LHsibmFtZSI6IlBST19TS0lMTF9BUFBST1ZBTCJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfQkFTSUNfQkVIQVZJT1JfU0VUVElORyJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTiJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTl9TRVRUSU5HIn0seyJuYW1lIjoiTUFOQUdFTUVOVF9VU0VSIn1dLCJkZXBhcnRtZW50SWQiOjEsImRlcGFydG1lbnROYW1lIjoi776N776e776E776F776R6ZaL55m66KqyIiwiY29tcGFueUlkIjoxLCJjb21wYW55TmFtZSI6IuagquW8j-S8muekvuOCsuOCquODm-ODvOODq-ODh-OCo-ODs-OCsOOCuSIsImxldmVsIjoxLCJpYXQiOjE2ODE4MDM4ODIsImV4cCI6MTY4MTgwNTY4Mn0.cTWoZ5AF5zTN1YNckT1kAlBGumPUW8jsMU4AG73gXAI';
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidmlldG5hbS5zeXN0ZW1AZ2VvbmV0LmNvLmpwIiwiZnVsbE5hbWUiOiLjg5njg4jjg4rjg6Ag44K344K544OG44OgIiwiZW1wbG95ZWVOdW1iZXIiOiIyMDA0MDQ1IiwiYWN0aXZlIjoxLCJyb2xlcyI6W3sibmFtZSI6IlVTRVIifSx7Im5hbWUiOiJFVkFMVUFUT1IifSx7Im5hbWUiOiJQUk9fU0tJTExfU0VUVElORyJ9LHsibmFtZSI6IlBST19TS0lMTF9BUFBST1ZBTCJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfQkFTSUNfQkVIQVZJT1JfU0VUVElORyJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTiJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTl9TRVRUSU5HIn0seyJuYW1lIjoiTUFOQUdFTUVOVF9VU0VSIn1dLCJkZXBhcnRtZW50SWQiOjEsImRlcGFydG1lbnROYW1lIjoi776N776e776E776F776R6ZaL55m66KqyIiwiY29tcGFueUlkIjoxLCJjb21wYW55TmFtZSI6IuagquW8j-S8muekvuOCsuOCquODm-ODvOODq-ODh-OCo-ODs-OCsOOCuSIsImxldmVsIjoxLCJpYXQiOjE2ODE4MDM4ODIsImV4cCI6MTY4MjQwODY4Mn0.jRorLUI7JJT2Hfh-ojbpbIR4pCkFGC7b8VIm1HBG54Q';
const roles = [{ name: RoleName_1.RoleName[1] }, { name: RoleName_1.RoleName[2] }];
class RoleDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Role of user',
    }),
    __metadata("design:type", String)
], RoleDto.prototype, "name", void 0);
class UserResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'userId',
        example: 1,
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'email',
        example: Mock_1.Mock.email,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Full name',
        example: Mock_1.Mock.fullName,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Employee number',
        example: Mock_1.Mock.employeeNumber,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "employeeNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Active',
        example: Mock_1.Mock.active,
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [RoleDto],
        description: 'Roles for user',
        example: roles,
    }),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Department id of user',
        example: Mock_1.Mock.departmentId,
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Department name of user',
        example: Mock_1.Mock.departmentName,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Company id of user',
        example: Mock_1.Mock.companyId,
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Company id of user',
        example: Mock_1.Mock.companyName,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Salary level of user',
        example: Mock_1.Mock.level,
    }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Email for HR',
        example: '',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "emailHR", void 0);
exports.UserResponseDto = UserResponseDto;
class AuthResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'access token',
        example: accessToken,
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'refresh token',
        example: refreshToken,
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: UserResponseDto,
        description: 'user credential',
    }),
    __metadata("design:type", UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=AuthResponseDto.js.map