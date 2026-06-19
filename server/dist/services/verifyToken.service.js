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
exports.VerifyTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const user_repository_1 = require("../repository/user.repository");
let VerifyTokenService = class VerifyTokenService {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.secretKey = process.env.JWT_SECRET || 'secret';
        this.cookieName = process.env.COOKIE_NAME || '__auth_';
        this.cookieRefreshName = process.env.COOKIE_REFRESH_NAME || '__auth_refresh';
        this.maxAgeCookie = process.env.COOKIE_MAX_AGE || 1800000;
        this.maxAgeRefreshCookie = process.env.COOKIE_REFRESH_MAX_AGE || 1800000;
    }
    processVerifyToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.secretKey,
                ignoreExpiration: true,
            });
        }
        catch (_a) {
            return null;
        }
    }
    checkRoles(currentUser, user) {
        if (currentUser.roles.length !== user.roles.length)
            return false;
        for (let i = 0; i < currentUser.roles.length; i++) {
            if (currentUser.roles[i] !== user.roles[i].id) {
                return false;
            }
        }
        return true;
    }
    async checkInfoUser(currentUser, res, companyGroupCode) {
        var _a, _b, _c;
        const user = (await this.userRepo.getUserByEmail(currentUser.email, companyGroupCode));
        if (!user) {
            this.clearCookie(res);
            throw new RuntimeException_1.RuntimeException('Deleted user', 405);
        }
        if (user &&
            (user.departmentId !== currentUser.departmentId ||
                user.divisionId !== currentUser.divisionId ||
                user.companyId !== currentUser.companyId ||
                user.level !== currentUser.level ||
                user.flagSkill !== currentUser.flagSkill ||
                !this.checkRoles(currentUser, user))) {
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
                companyGroupCode: companyGroupCode,
                companyGroupName: '',
                companyIcon: '',
                timeZone: user.companyGroup.timezone,
                emailHR: user.companyGroup.emailHR,
            };
            return payload;
        }
        else {
            return currentUser;
        }
    }
    verifyToken(accessToken, refreshToken, res) {
        if (accessToken && refreshToken) {
            const decodeAccessToken = this.processVerifyToken(accessToken);
            const decodeRefreshToken = this.processVerifyToken(refreshToken);
            if (!decodeAccessToken && !decodeRefreshToken) {
                this.clearCookie(res);
                throw new RuntimeException_1.RuntimeException('Access is not allowed', common_1.HttpStatus.UNAUTHORIZED);
            }
            const ts = Math.round(new Date().getTime() / 1000);
            if (!decodeRefreshToken || ts > decodeRefreshToken.exp) {
                this.clearCookie(res);
                throw new RuntimeException_1.RuntimeException('Refresh token', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (!decodeAccessToken) {
                this.clearCookie(res);
                throw new RuntimeException_1.RuntimeException('Access token', common_1.HttpStatus.UNAUTHORIZED);
            }
            else if (ts > decodeAccessToken.exp) {
                throw new RuntimeException_1.RuntimeException('Access is not allowed', common_1.HttpStatus.NON_AUTHORITATIVE_INFORMATION);
            }
            return decodeAccessToken;
        }
        else
            this.clearCookie(res);
        throw new RuntimeException_1.RuntimeException('Access is not allowed', common_1.HttpStatus.UNAUTHORIZED);
    }
    getTokenFromCookie(request) {
        var _a;
        const companyGroupCode = ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode) || '';
        const accessToken = request.signedCookies[`${companyGroupCode}${this.cookieName}`];
        const refreshToken = request.signedCookies[`${companyGroupCode}${this.cookieRefreshName}`];
        return { accessToken, refreshToken };
    }
    setCookieToken(response, accessToken, refreshToken, companyGroupCode) {
        if (accessToken && refreshToken) {
            response.cookie((companyGroupCode || '') + this.cookieName, accessToken, {
                maxAge: Number(this.maxAgeCookie),
                signed: true,
                secure: false,
                httpOnly: false,
            });
            response.cookie((companyGroupCode || '') + this.cookieRefreshName, refreshToken, {
                maxAge: Number(this.maxAgeRefreshCookie),
                signed: true,
                secure: false,
                httpOnly: false,
            });
        }
    }
    clearCookie(response) {
        const signedCookies = response.req.signedCookies;
        for (const cookieName in signedCookies) {
            if (cookieName.includes(this.cookieName) ||
                cookieName.includes(this.cookieRefreshName)) {
                response.clearCookie(cookieName);
            }
        }
    }
    encodeJsonWebToken(data, options) {
        if (!data)
            return '';
        const encodeToken = this.jwtService.sign(data, Object.assign(Object.assign({}, options), { secret: this.secretKey }));
        return encodeToken;
    }
    decodeJsonWebToken(token) {
        const decodeToken = this.jwtService.decode(token, {
            json: true,
        });
        return decodeToken;
    }
    async handleVerifyToken(email, companyGroupCode) {
        var _a, _b, _c, _d, _e, _f;
        const users = await this.userRepository.getUsersWithCompanyGroup(email);
        const user = companyGroupCode
            ? users.find((u) => u.companyGroupCode === companyGroupCode)
            : users[0];
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
    }
    async refreshToken(req) {
        var _a;
        const userObj = this.processVerifyToken(req.signedCookies[(((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode) || '') + this.cookieRefreshName]);
        if (!userObj) {
            return null;
        }
        const payload = {
            id: userObj.id,
            userId: userObj.userId,
            email: userObj.email,
            fullName: userObj.fullName,
            employeeNumber: userObj.employeeNumber,
            active: userObj.active,
            roles: userObj.roles,
            departmentId: userObj.departmentId,
            departmentName: userObj.departmentName,
            companyId: userObj.companyId,
            companyName: userObj.companyName,
            level: userObj.level,
            departmentCode: userObj.departmentCode,
            companyGroupCode: userObj.companyGroupCode,
            companyGroupName: userObj.companyGroupName,
            companyGroups: userObj.companyGroups,
        };
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
        const newAccessToken = await this.encodeJsonWebToken(payload, {
            expiresIn: expiresIn,
        });
        return newAccessToken;
    }
};
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], VerifyTokenService.prototype, "userRepo", void 0);
VerifyTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_repository_1.UserRepository])
], VerifyTokenService);
exports.VerifyTokenService = VerifyTokenService;
//# sourceMappingURL=verifyToken.service.js.map