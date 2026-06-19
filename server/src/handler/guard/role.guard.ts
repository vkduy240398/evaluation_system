import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/enum/Roles';
import { IS_PUBLIC_KEY } from '../annotation/Authentication';
import { ROLES_KEY } from '../annotation/Authorization';
import { VerifyTokenService } from 'src/services/verifyToken.service';
import { CustomLogger } from 'src/services/logger.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private verifyToken: VerifyTokenService,
    private logger: CustomLogger,
  ) {
    //
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const requiredRoles = this.reflector.getAllAndOverride<Roles>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !isPublic) return true;

    const companyGroupCode = request.headers['x-company-group-code'] || '';
    const accessToken =
      request.signedCookies[
        `${companyGroupCode}${this.verifyToken.cookieName}`
      ];
    const refreshToken =
      request.signedCookies[
        `${companyGroupCode}${this.verifyToken.cookieRefreshName}`
      ];
    const payLoadUser = this.verifyToken.verifyToken(
      accessToken,
      refreshToken,
      response,
    );
    const user = await this.verifyToken.checkInfoUser(
      payLoadUser,
      response,
      companyGroupCode,
    );
    request['user'] = user;

    if (isPublic && !requiredRoles) return true;
    return user?.roles.includes(requiredRoles);
  }
}
