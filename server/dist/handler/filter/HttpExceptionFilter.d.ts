import { ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { CustomLogger } from 'src/services/logger.service';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private logger;
    constructor(logger: CustomLogger);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
