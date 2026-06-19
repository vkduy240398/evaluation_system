import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

const EMAIL_VN_SYSTEM = 'vietnam.system@geonet.co.jp';
@Injectable()
export class AuthVietNamSystemGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user.email === EMAIL_VN_SYSTEM) {
      return true;
    }
    return false;
  }
}
