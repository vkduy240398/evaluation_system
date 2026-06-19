import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RuntimeException } from '../../model/exception/RuntimeException';
import { CustomLogger } from 'src/services/logger.service';
export declare class RuntimeExceptionFilter implements ExceptionFilter {
    private logger;
    constructor(logger: CustomLogger);
    catch(exception: RuntimeException, host: ArgumentsHost): void;
}
