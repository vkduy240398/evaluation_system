import { HttpException, HttpExceptionOptions } from '@nestjs/common';
import { ErrorMessageResponseDto } from '../response/ErrorMessageResponseDto';

/**
 * Runtime exception model for throwing http error
 *
 * @author tran.le.ha.nam
 * @last_update
 */
export class RuntimeException extends HttpException {
  private errorMessage: string;
  private statusCode: number;
  private timeStamp: number;

  constructor(
    message: string,
    statusCode: number,
    options?: HttpExceptionOptions,
  ) {
    const response = new ErrorMessageResponseDto(
      statusCode,
      message,
      Date.now(),
    );
    super(response, statusCode, options);
    this.errorMessage = message;
    this.statusCode = statusCode;
    this.timeStamp = response.getTimeStamp();
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public setErrorMessage(errorMessage: string): void {
    this.errorMessage = errorMessage;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public setStatusCode(statusCode: number): void {
    this.timeStamp = statusCode;
  }

  public getTimeStamp(): number {
    return this.timeStamp;
  }

  public setTimeStamp(timeStamp: number): void {
    this.timeStamp = timeStamp;
  }
}
