import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { CustomLogger } from 'src/services/logger.service';
export declare class ExceptionHandlerFilter implements ExceptionFilter {
    private logger;
    constructor(logger: CustomLogger);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
