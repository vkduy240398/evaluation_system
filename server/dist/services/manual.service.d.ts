import { ManualType } from 'src/enum/ManualType';
import { ConfigService } from '@nestjs/config';
import { ManualResponseDto } from 'src/model/response/ManualResponseDto';
import { Request } from 'express';
export declare class ManualService {
    private readonly configService;
    constructor(configService: ConfigService);
    getManualFile(type: ManualType, req: Request): Promise<ManualResponseDto>;
    checkPermissionManualFile(type: ManualType, req: Request): boolean;
}
