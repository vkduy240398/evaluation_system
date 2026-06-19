import { HttpException, HttpExceptionOptions } from '@nestjs/common';
export declare class RuntimeException extends HttpException {
    private errorMessage;
    private statusCode;
    private timeStamp;
    constructor(message: string, statusCode: number, options?: HttpExceptionOptions);
    getErrorMessage(): string;
    setErrorMessage(errorMessage: string): void;
    getStatusCode(): number;
    setStatusCode(statusCode: number): void;
    getTimeStamp(): number;
    setTimeStamp(timeStamp: number): void;
}
