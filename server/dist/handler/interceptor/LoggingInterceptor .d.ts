import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomLogger } from 'src/services/logger.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private logger;
    constructor(logger: CustomLogger);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
