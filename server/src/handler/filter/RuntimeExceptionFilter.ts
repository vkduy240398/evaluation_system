import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RuntimeException } from '../../model/exception/RuntimeException';
import { Request, Response } from 'express';
import { isEnum } from 'class-validator';
import { CustomLogger } from 'src/services/logger.service';

@Catch(RuntimeException)
export class RuntimeExceptionFilter implements ExceptionFilter {
  constructor(private logger: CustomLogger) {
    //
  }
  catch(exception: RuntimeException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getErrorMessage();
    const timeStamp = exception.getTimeStamp();
    console.log(exception);
    this.logger.error(request, status.toString() + ' : ' + message);

    response.status(isEnum(status, HttpStatus) ? status : HttpStatus.OK).json({
      statusCode: status,
      message: 'INTERNAL SERVER ERROR',
      timeStamp: timeStamp,
    });
  }
}
