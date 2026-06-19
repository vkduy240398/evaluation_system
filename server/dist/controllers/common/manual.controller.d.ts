import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { ManualQueryDto } from 'src/model/request/ManualQueryDto';
import { Request } from 'express';
export declare class ManualController {
    private manualService;
    getManualFile(query: ManualQueryDto, res: Response, req: Request): Promise<StreamableFile>;
}
