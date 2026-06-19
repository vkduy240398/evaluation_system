import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RuntimeException } from '../../model/exception/RuntimeException';
import { isEnum } from 'class-validator';
import { CustomLogger } from 'src/services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: CustomLogger) {
    //
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const _request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message =
      exception instanceof RuntimeException ||
      exception instanceof UnauthorizedException
        ? exception instanceof UnauthorizedException
          ? exception.message
          : exception.getErrorMessage()
        : exception.getResponse()['error'] +
          ' - ' +
          exception.getResponse()['message'];
    const timeStamp = Date.now();
    console.log(exception);
    this.logger.error(_request, status.toString() + ' : ' + message);

    response.status(isEnum(status, HttpStatus) ? status : HttpStatus.OK).json({
      statusCode: status,
      message: 'INTERNAL SERVER ERROR',
      timeStamp: timeStamp,
    });
  }
}
