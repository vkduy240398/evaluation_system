export declare class ErrorMessageResponseDto {
    private statusCode;
    private message;
    private stackTrace;
    private timeStamp;
    constructor(statusCode: number, message: string, timeStamp: number);
    getStatusCode(): number;
    setStatusCode(statusCode: number): void;
    getMessage(): string;
    setMessage(message: string): void;
    getTimeStamp(): number;
    setTimeStamp(timeStamp: number): void;
    getStacktrace(): string;
    setStacktrace(stacktrace: string): void;
}
