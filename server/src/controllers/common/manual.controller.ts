/* eslint-disable @typescript-eslint/naming-convention */
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ManualService } from 'src/services/manual.service';
import { ManualQueryDto } from 'src/model/request/ManualQueryDto';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Mime } from 'src/enum/Mime';
import { Request } from 'express';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { Tag } from 'src/enum/Tag';
import { Public } from 'src/handler/annotation/Authentication';
import { RuntimeException } from 'src/model/exception/RuntimeException';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentDisposition = require('content-disposition');

@Controller('v1/manual')
@UseGuards(RolesGuard)
@ApiTags(Tag.COMMON)
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: ' Internal Server Error',
})
export class ManualController {
  @Inject(ManualService)
  private manualService: ManualService;

  /**
   *
   * @author tran.le.ha.nam
   */
  @Get()
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PDF file',
    schema: { type: 'file', format: 'binary' },
  })
  @ApiProduces(Mime.PDF)
  async getManualFile(
    @Query() query: ManualQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    if (
      this.manualService.checkPermissionManualFile(query.type, req) === true
    ) {
      const manualRes = await this.manualService.getManualFile(query.type, req);

      res.set({
        'Content-Type': Mime.PDF,
        'Content-Disposition': contentDisposition(manualRes.filename),
      });

      return new StreamableFile(manualRes.file);
    } else {
      throw new RuntimeException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
