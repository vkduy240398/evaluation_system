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
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const express_rate_limit_1 = require("express-rate-limit");
let RateLimitMiddleware = class RateLimitMiddleware {
    constructor() {
        this.limiter = (0, express_rate_limit_1.default)({
            windowMs: 10 * 60 * 1000,
            max: 5,
            message: 'Too many login attempts, please try again later.',
            skipSuccessfulRequests: true,
            keyGenerator: (req) => req.get('x-forwarded-for'),
        });
    }
    use(req, res, next) {
        this.limiter(req, res, next);
    }
};
RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RateLimitMiddleware);
exports.RateLimitMiddleware = RateLimitMiddleware;
//# sourceMappingURL=RateLimitMiddleware.js.map