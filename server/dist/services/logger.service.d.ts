import { LoggerService } from '@nestjs/common';
import { Logger } from 'log4js';
export declare class CustomLogger implements LoggerService {
    private readonly logger;
    constructor(logger: Logger);
    log(req: any, content: string): void;
    error(req: any, content: string): void;
    warn(req: any, content: string): void;
    debug?(req: any, content: string): void;
}
