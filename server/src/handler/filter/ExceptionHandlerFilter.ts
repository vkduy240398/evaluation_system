import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { isEnum } from 'class-validator';
import { Request, Response } from 'express';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { CustomLogger } from 'src/services/logger.service';

@Catch(HttpException)
export class ExceptionHandlerFilter implements ExceptionFilter {
  constructor(private logger: CustomLogger) {
    //
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const timeStamp = Date.now();
    const message =
      exception instanceof RuntimeException ||
      exception instanceof UnauthorizedException
        ? exception instanceof UnauthorizedException
          ? exception.message
          : exception.getErrorMessage()
        : exception.getResponse()['error'] +
          ' - ' +
          exception.getResponse()['message'];

    this.logger.error(
      request,
      `${status || 500} : ` +
        (JSON.stringify(exception) === '{}'
          ? exception
          : JSON.stringify(exception)),
    );

    response.status(isEnum(status, HttpStatus) ? status : HttpStatus.OK).json({
      statusCode: status || 500,
      // message: message || 'INTERNAL SERVER ERROR',
      message: 'INTERNAL SERVER ERROR',
      timeStamp: timeStamp,
    });
  }
}
