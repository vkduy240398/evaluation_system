/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable require-await */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ManualType } from 'src/enum/ManualType';
import { resolve } from 'path';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { ConfigService } from '@nestjs/config';
import { ManualResponseDto } from 'src/model/response/ManualResponseDto';
import { Request } from 'express';
import { Roles } from 'src/enum/Roles';

@Injectable()
export class ManualService {
  // eslint-disable-next-line no-empty-function
  constructor(private readonly configService: ConfigService) {}

  /**
   *
   * @author tran.le.ha.nam
   */
  async getManualFile(type: ManualType, req: Request) {
    const fs = require('fs');
    const manualNameF12 = this.configService.get('MANUAL_NAME_F12');
    const manualNameF34 = this.configService.get('MANUAL_NAME_F34');
    const manualNameF5678 = this.configService.get('MANUAL_NAME_F5678');
    const listTypeNames = ['', manualNameF12, manualNameF34, manualNameF5678];

    try {
      const filename = listTypeNames[Number(type)];
      const response = new ManualResponseDto();
      const isExistFileCompany = fs.existsSync(
        resolve(
          __dirname,
          '..',
          `pdf/${req?.user?.companyGroupCode}/${filename}`,
        ),
      );

      const buffer = isExistFileCompany
        ? fs.readFileSync(
            resolve(
              __dirname,
              '..',
              `pdf/${req?.user?.companyGroupCode}/${filename}`,
            ),
          )
        : fs.readFileSync(resolve(__dirname, '..', `pdf/${filename}`));

      response.file = buffer;
      response.filename = filename;

      return response;
    } catch (err) {
      const NODE_ENV = this.configService.get('NODE_ENV');
      if (NODE_ENV !== 'production') {
        console.log(err);
      }
      throw new RuntimeException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  checkPermissionManualFile(type: ManualType, req: Request): boolean {
    const listUserRole = req?.user?.roles;

    if (
      type === ManualType.F12 &&
      listUserRole?.some(
        (obj) => obj === Roles.F1 || obj === Roles.F2,
      )
    ) {
      return true;
    } else if (
      type === ManualType.F34 &&
      listUserRole?.some(
        (obj) => obj === Roles.F3 || obj === Roles.F4,
      )
    ) {
      return true;
    } else if (
      type === ManualType.F5678 &&
      listUserRole?.some(
        (obj) =>
          obj === Roles.F5 ||
          obj === Roles.F6 ||
          obj === Roles.F7 ||
          obj === Roles.F8,
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
}
