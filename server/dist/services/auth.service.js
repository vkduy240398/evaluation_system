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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const verifyToken_service_1 = require("./verifyToken.service");
const user_repository_1 = require("../repository/user.repository");
const ldapts_1 = require("ldapts");
let AuthService = class AuthService {
    async authentication(email, password) {
        var _a, _b, _c;
        if (process.env.ENABLE_LDAP === 'true' &&
            !this.checkEmailExeption(email, password)) {
            const ldapOptions = {
                url: process.env.LDAP_URI || '',
                bindDN: process.env.LDAP_BIND_DN || '',
            };
            const client = new ldapts_1.Client(ldapOptions);
            try {
                await client.bind(email, password);
            }
            catch (error) {
                throw new RuntimeException_1.RuntimeException(error.message, common_1.HttpStatus.UNAUTHORIZED);
            }
            finally {
                await client.unbind();
            }
        }
        const users = await this.userRepo.getUsersWithCompanyGroup(email);
        const user = users[0];
        if (user) {
            return {
                id: user.id,
                userId: user.id,
                email: user.email,
                fullName: user.fullName,
                employeeNumber: user.employeeNumber,
                active: user.active,
                roles: user.roles.map((role) => role.id),
                departmentId: user.departmentId,
                departmentName: (_a = user.department) === null || _a === void 0 ? void 0 : _a.name,
                divisionId: user.divisionId,
                divisionName: (_b = user.division) === null || _b === void 0 ? void 0 : _b.name,
                companyId: user.companyId,
                companyName: (_c = user.company) === null || _c === void 0 ? void 0 : _c.name,
                level: user.level,
                flagSkill: user.flagSkill,
                companyGroupCode: '',
                companyGroupName: '',
                companyIcon: '',
                companyGroups: users.map((u) => {
                    var _a, _b;
                    return ({
                        code: (_a = u.companyGroup) === null || _a === void 0 ? void 0 : _a.code,
                        name: (_b = u.companyGroup) === null || _b === void 0 ? void 0 : _b.name,
                        roleCount: u.roles.length,
                    });
                }),
                timeZone: user.companyGroup.timezone,
                emailHR: user.companyGroup.emailHR,
            };
        }
        return null;
    }
    checkEmailExeption(email, password) {
        const emailException = process.env.EMAIL_EXCEPTION;
        const passwordException = process.env.PASSWORD_EXCEPTION;
        if (!emailException || !passwordException) {
            return false;
        }
        const aryEmailException = emailException.split(',');
        return (aryEmailException
            .map((item) => item.trim().toLowerCase())
            .includes(email.trim().toLowerCase()) && passwordException === password);
    }
    checkLogin(user) {
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
        const expiresInRefresh = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
        return {
            accessToken: this.verifyToken.encodeJsonWebToken(user, {
                expiresIn: expiresIn,
            }),
            refreshToken: this.verifyToken.encodeJsonWebToken(user, {
                expiresIn: expiresInRefresh,
            }),
            user: user,
        };
    }
    async checkSelectGroup(email, companyGroupCode, res) {
        var _a, _b, _c, _d, _e, _f;
        const users = await this.userRepo.getUsersWithCompanyGroup(email);
        const user = users.find((u) => u.companyGroupCode === companyGroupCode);
        if (!user) {
            this.verifyToken.clearCookie(res);
            throw new RuntimeException_1.RuntimeException('Deleted user', 405);
        }
        const payload = {
            id: user.id,
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            employeeNumber: user.employeeNumber,
            active: user.active,
            roles: user.roles.map((role) => role.id),
            departmentId: user.departmentId,
            departmentName: (_a = user.department) === null || _a === void 0 ? void 0 : _a.name,
            divisionId: user.divisionId,
            divisionName: (_b = user.division) === null || _b === void 0 ? void 0 : _b.name,
            companyId: user.companyId,
            companyName: (_c = user.company) === null || _c === void 0 ? void 0 : _c.name,
            level: user.level,
            flagSkill: user.flagSkill,
            companyGroupCode: (_d = user.companyGroup) === null || _d === void 0 ? void 0 : _d.code,
            companyGroupName: (_e = user.companyGroup) === null || _e === void 0 ? void 0 : _e.name,
            companyIcon: (_f = user.companyGroup) === null || _f === void 0 ? void 0 : _f.icon,
            companyGroups: users.map((u) => {
                var _a, _b;
                return ({
                    code: (_a = u.companyGroup) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = u.companyGroup) === null || _b === void 0 ? void 0 : _b.name,
                    roleCount: u.roles.length,
                });
            }),
            timeZone: user.companyGroup.timezone,
            emailHR: user.companyGroup.emailHR,
        };
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
        const expiresInRefresh = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
        return {
            accessToken: this.verifyToken.encodeJsonWebToken(payload, {
                expiresIn: expiresIn,
            }),
            refreshToken: this.verifyToken.encodeJsonWebToken(payload, {
                expiresIn: expiresInRefresh,
            }),
            user: payload,
        };
    }
};
__decorate([
    (0, common_1.Inject)(verifyToken_service_1.VerifyTokenService),
    __metadata("design:type", verifyToken_service_1.VerifyTokenService)
], AuthService.prototype, "verifyToken", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], AuthService.prototype, "userRepo", void 0);
AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
exports.AuthService = AuthService;
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map