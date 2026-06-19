"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeException = void 0;
const common_1 = require("@nestjs/common");
const ErrorMessageResponseDto_1 = require("../response/ErrorMessageResponseDto");
class RuntimeException extends common_1.HttpException {
    constructor(message, statusCode, options) {
        const response = new ErrorMessageResponseDto_1.ErrorMessageResponseDto(statusCode, message, Date.now());
        super(response, statusCode, options);
        this.errorMessage = message;
        this.statusCode = statusCode;
        this.timeStamp = response.getTimeStamp();
    }
    getErrorMessage() {
        return this.errorMessage;
    }
    setErrorMessage(errorMessage) {
        this.errorMessage = errorMessage;
    }
    getStatusCode() {
        return this.statusCode;
    }
    setStatusCode(statusCode) {
        this.timeStamp = statusCode;
    }
    getTimeStamp() {
        return this.timeStamp;
    }
    setTimeStamp(timeStamp) {
        this.timeStamp = timeStamp;
    }
}
exports.RuntimeException = RuntimeException;
//# sourceMappingURL=RuntimeException.js.map