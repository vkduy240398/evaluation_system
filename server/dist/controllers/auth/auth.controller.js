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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Authentication_1 = require("../../handler/annotation/Authentication");
const auth_guard_1 = require("../../handler/guard/auth.guard");
const LoginRequestDto_1 = require("../../model/request/LoginRequestDto");
const AuthResponseDto_1 = require("../../model/response/AuthResponseDto");
const auth_service_1 = require("../../services/auth.service");
const user_service_1 = require("../../services/user.service");
const verifyToken_service_1 = require("../../services/verifyToken.service");
const accessTokenCookieName = process.env.COOKIE_NAME || '__auth_';
const maxAgeCookie = process.env.COOKIE_MAX_AGE || 1800000;
let AuthController = class AuthController {
    login(req, res) {
        const authentication = this.authService.checkLogin(req.user);
        this.verifyTokenService.setCookieToken(res, authentication.accessToken, authentication.refreshToken);
        res.status(common_1.HttpStatus.OK);
        res.send(authentication);
    }
    async verifyToken(req, res) {
        var _a;
        const token = this.verifyTokenService.getTokenFromCookie(req);
        if (!token.accessToken || !token.refreshToken) {
            res.status(common_1.HttpStatus.OK);
            return { userData: null };
        }
        const decode = this.verifyTokenService.verifyToken(token.accessToken, token.refreshToken, res);
        res.status(common_1.HttpStatus.OK);
        const userData = await this.verifyTokenService.handleVerifyToken(decode.email, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode);
        return { userData };
    }
    async refreshToken(req, res) {
        var _a;
        const token = await this.verifyTokenService.refreshToken(req);
        if (!token) {
            res.status(common_1.HttpStatus.UNAUTHORIZED);
        }
        else {
            res.cookie((((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode) || '') + accessTokenCookieName, token, {
                maxAge: Number(maxAgeCookie),
                signed: false,
                secure: false,
                httpOnly: false,
            });
            res.status(common_1.HttpStatus.OK);
        }
        res.send(true);
    }
    logout(req, res) {
        this.verifyTokenService.clearCookie(res);
        res.status(common_1.HttpStatus.OK);
    }
    async selectCompany(req, res) {
        const authentication = await this.authService.checkSelectGroup(req.body.email, req.body.companyGroupCode, res);
        this.verifyTokenService.setCookieToken(res, authentication.accessToken, authentication.refreshToken, req.body.companyGroupCode);
        res.status(common_1.HttpStatus.OK);
        res.send(authentication);
    }
};
__decorate([
    (0, common_1.Inject)(auth_service_1.AuthService),
    __metadata("design:type", auth_service_1.AuthService)
], AuthController.prototype, "authService", void 0);
__decorate([
    (0, common_1.Inject)(verifyToken_service_1.VerifyTokenService),
    __metadata("design:type", verifyToken_service_1.VerifyTokenService)
], AuthController.prototype, "verifyTokenService", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], AuthController.prototype, "userService", void 0);
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.UseGuards)(auth_guard_1.LocalAuthGuard),
    (0, swagger_1.ApiBody)({ type: LoginRequestDto_1.LoginRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: AuthResponseDto_1.AuthResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/verify-token'),
    (0, Authentication_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Get)('/refresh-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, Authentication_1.Public)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('/select-company'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "selectCompany", null);
AuthController = __decorate([
    (0, common_1.Controller)('v1/auth'),
    (0, swagger_1.ApiTags)('Authentication'),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' })
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map