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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const Authentication_1 = require("../annotation/Authentication");
const Authorization_1 = require("../annotation/Authorization");
const verifyToken_service_1 = require("../../services/verifyToken.service");
const logger_service_1 = require("../../services/logger.service");
let RolesGuard = class RolesGuard {
    constructor(reflector, verifyToken, logger) {
        this.reflector = reflector;
        this.verifyToken = verifyToken;
        this.logger = logger;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const requiredRoles = this.reflector.getAllAndOverride(Authorization_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const isPublic = this.reflector.getAllAndOverride(Authentication_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles && !isPublic)
            return true;
        const companyGroupCode = request.headers['x-company-group-code'] || '';
        const accessToken = request.signedCookies[`${companyGroupCode}${this.verifyToken.cookieName}`];
        const refreshToken = request.signedCookies[`${companyGroupCode}${this.verifyToken.cookieRefreshName}`];
        const payLoadUser = this.verifyToken.verifyToken(accessToken, refreshToken, response);
        const user = await this.verifyToken.checkInfoUser(payLoadUser, response, companyGroupCode);
        request['user'] = user;
        if (isPublic && !requiredRoles)
            return true;
        return user === null || user === void 0 ? void 0 : user.roles.includes(requiredRoles);
    }
};
RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        verifyToken_service_1.VerifyTokenService,
        logger_service_1.CustomLogger])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=role.guard.js.map