"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessageResponseDto = void 0;
class ErrorMessageResponseDto {
    constructor(statusCode, message, timeStamp) {
        this.statusCode = statusCode;
        this.message = message;
        this.timeStamp = timeStamp;
    }
    getStatusCode() {
        return this.statusCode;
    }
    setStatusCode(statusCode) {
        this.statusCode = statusCode;
    }
    getMessage() {
        return this.message;
    }
    setMessage(message) {
        this.message = message;
    }
    getTimeStamp() {
        return this.timeStamp;
    }
    setTimeStamp(timeStamp) {
        this.timeStamp = timeStamp;
    }
    getStacktrace() {
        return this.stackTrace;
    }
    setStacktrace(stacktrace) {
        this.stackTrace = stacktrace;
    }
}
exports.ErrorMessageResponseDto = ErrorMessageResponseDto;
//# sourceMappingURL=ErrorMessageResponseDto.js.map