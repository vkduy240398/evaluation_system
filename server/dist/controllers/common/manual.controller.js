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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualController = void 0;
const common_1 = require("@nestjs/common");
const manual_service_1 = require("../../services/manual.service");
const ManualQueryDto_1 = require("../../model/request/ManualQueryDto");
const swagger_1 = require("@nestjs/swagger");
const Mime_1 = require("../../enum/Mime");
const role_guard_1 = require("../../handler/guard/role.guard");
const Tag_1 = require("../../enum/Tag");
const Authentication_1 = require("../../handler/annotation/Authentication");
const RuntimeException_1 = require("../../model/exception/RuntimeException");
const contentDisposition = require('content-disposition');
let ManualController = class ManualController {
    async getManualFile(query, res, req) {
        if (this.manualService.checkPermissionManualFile(query.type, req) === true) {
            const manualRes = await this.manualService.getManualFile(query.type, req);
            res.set({
                'Content-Type': Mime_1.Mime.PDF,
                'Content-Disposition': contentDisposition(manualRes.filename),
            });
            return new common_1.StreamableFile(manualRes.file);
        }
        else {
            throw new RuntimeException_1.RuntimeException('NOT_FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
__decorate([
    (0, common_1.Inject)(manual_service_1.ManualService),
    __metadata("design:type", manual_service_1.ManualService)
], ManualController.prototype, "manualService", void 0);
__decorate([
    (0, common_1.Get)(),
    (0, Authentication_1.Public)(),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'PDF file',
        schema: { type: 'file', format: 'binary' },
    }),
    (0, swagger_1.ApiProduces)(Mime_1.Mime.PDF),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ManualQueryDto_1.ManualQueryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ManualController.prototype, "getManualFile", null);
ManualController = __decorate([
    (0, common_1.Controller)('v1/manual'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.COMMON),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    })
], ManualController);
exports.ManualController = ManualController;
//# sourceMappingURL=manual.controller.js.map