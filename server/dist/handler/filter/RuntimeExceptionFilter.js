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
exports.RuntimeExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const RuntimeException_1 = require("../../model/exception/RuntimeException");
const class_validator_1 = require("class-validator");
const logger_service_1 = require("../../services/logger.service");
let RuntimeExceptionFilter = class RuntimeExceptionFilter {
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const message = exception.getErrorMessage();
        const timeStamp = exception.getTimeStamp();
        console.log(exception);
        this.logger.error(request, status.toString() + ' : ' + message);
        response.status((0, class_validator_1.isEnum)(status, common_1.HttpStatus) ? status : common_1.HttpStatus.OK).json({
            statusCode: status,
            message: 'INTERNAL SERVER ERROR',
            timeStamp: timeStamp,
        });
    }
};
RuntimeExceptionFilter = __decorate([
    (0, common_1.Catch)(RuntimeException_1.RuntimeException),
    __metadata("design:paramtypes", [logger_service_1.CustomLogger])
], RuntimeExceptionFilter);
exports.RuntimeExceptionFilter = RuntimeExceptionFilter;
//# sourceMappingURL=RuntimeExceptionFilter.js.map