export class ErrorMessageResponseDto {
  private statusCode: number;
  private message: string;
  private stackTrace: string;
  private timeStamp: number;

  constructor(statusCode: number, message: string, timeStamp: number) {
    this.statusCode = statusCode;
    this.message = message;
    this.timeStamp = timeStamp;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public setStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
  }

  public getMessage(): string {
    return this.message;
  }

  public setMessage(message: string): void {
    this.message = message;
  }

  public getTimeStamp(): number {
    return this.timeStamp;
  }

  public setTimeStamp(timeStamp: number): void {
    this.timeStamp = timeStamp;
  }

  public getStacktrace(): string {
    return this.stackTrace;
  }

  public setStacktrace(stacktrace: string) {
    this.stackTrace = stacktrace;
  }
}
