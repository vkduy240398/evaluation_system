import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VerifyTokenService } from 'src/services/verifyToken.service';
import { CustomLogger } from 'src/services/logger.service';
export declare class RolesGuard implements CanActivate {
    private reflector;
    private verifyToken;
    private logger;
    constructor(reflector: Reflector, verifyToken: VerifyTokenService, logger: CustomLogger);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
