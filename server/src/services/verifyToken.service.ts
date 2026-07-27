import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from 'src/entity/User';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { UserRepository } from 'src/repository/user.repository';
import { UserType } from '../interfaces/user.interfaces';

@Injectable()
export class VerifyTokenService {
  @Inject(UserRepository)
  private userRepo: UserRepositoryI;

  constructor(
    private readonly jwtService: JwtService,
    private userRepository: UserRepository,
  ) {
    //
  }

  public secretKey = process.env.JWT_SECRET || 'secret';
  public cookieName = process.env.COOKIE_NAME || '__auth_';
  public cookieRefreshName =
    process.env.COOKIE_REFRESH_NAME || '__auth_refresh';
  private maxAgeCookie = process.env.COOKIE_MAX_AGE || 1800000;
  private maxAgeRefreshCookie = process.env.COOKIE_REFRESH_MAX_AGE || 1800000;

  // ** Verify token
  processVerifyToken(token: string): UserType | null {
    try {
      return this.jwtService.verify(token, {
        secret: this.secretKey,
        ignoreExpiration: true,
      });
    } catch {
      //
      return null;
    }
  }

  checkRoles(currentUser: UserType, user: User) {
    if (currentUser.roles.length !== user.roles.length) return false;
    for (let i = 0; i < currentUser.roles.length; i++) {
      if (currentUser.roles[i] !== user.roles[i].id) {
        return false;
      }
    }
    return true;
  }

  // ** Check whether user information has changed or not
  async checkInfoUser(
    currentUser: UserType,
    res: Response,
    companyGroupCode: string,
  ) {
    const user = (await this.userRepo.getUserByEmail(
      currentUser.email,
      companyGroupCode,
    )) as User;

    if (!user) {
      this.clearCookie(res);
      throw new RuntimeException('Deleted user', 405);
    }

    if (
      user &&
      (user.departmentId !== currentUser.departmentId ||
        user.divisionId !== currentUser.divisionId ||
        user.companyId !== currentUser.companyId ||
        user.level !== currentUser.level ||
        user.flagSkill !== currentUser.flagSkill ||
        !this.checkRoles(currentUser, user))
    ) {
      const payload: UserType = {
        id: user.id,
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        employeeNumber: user.employeeNumber,
        active: user.active,
        roles: user.roles.map((role) => role.id),
        departmentId: user.departmentId,
        departmentName: user.department?.name,
        divisionId: user.divisionId,
        divisionName: user.division?.name,
        companyId: user.companyId,
        companyName: user.company?.name,
        level: user.level,
        flagSkill: user.flagSkill,
        companyGroupCode: companyGroupCode,
        companyGroupName: '',
        companyIcon: '',
        timeZone: user.companyGroup.timezone,
        emailHR: user.companyGroup.emailHR,
      };
      return payload;
      // this.setCookieToken(res, results.accessToken, results.refreshToken);
    } else {
      return currentUser;
    }
  }

  // ** Verify token from cookie request
  verifyToken(accessToken: string, refreshToken: string, res: Response) {
    //
    if (accessToken && refreshToken) {
      const decodeAccessToken: UserType | null =
        this.processVerifyToken(accessToken);

      const decodeRefreshToken: UserType | null =
        this.processVerifyToken(refreshToken);
      if (!decodeAccessToken && !decodeRefreshToken) {
        this.clearCookie(res);
        throw new RuntimeException(
          'Access is not allowed',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const ts = Math.round(new Date().getTime() / 1000);
      if (!decodeRefreshToken || ts > decodeRefreshToken.exp) {
        this.clearCookie(res);
        throw new RuntimeException('Refresh token', HttpStatus.UNAUTHORIZED);
      }
      if (!decodeAccessToken) {
        this.clearCookie(res);
        throw new RuntimeException('Access token', HttpStatus.UNAUTHORIZED);
      } else if (ts > decodeAccessToken.exp) {
        throw new RuntimeException(
          'Access is not allowed',
          HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        );
      }
      return decodeAccessToken;
    } else this.clearCookie(res);
    throw new RuntimeException(
      'Access is not allowed',
      HttpStatus.UNAUTHORIZED,
    );
  }

  // ** Get json web token from cookie request
  getTokenFromCookie(request: Request): {
    accessToken: string;
    refreshToken: string;
  } {
    const companyGroupCode = request?.user?.companyGroupCode || '';
    const accessToken =
      request.signedCookies[`${companyGroupCode}${this.cookieName}`];
    const refreshToken =
      request.signedCookies[`${companyGroupCode}${this.cookieRefreshName}`];

    return { accessToken, refreshToken };
  }

  // ** Set Access/Refresh token from cookie response
  setCookieToken(
    response: Response,
    accessToken: string,
    refreshToken: string,
    companyGroupCode?: string,
  ) {
    if (accessToken && refreshToken) {
      response.cookie((companyGroupCode || '') + this.cookieName, accessToken, {
        maxAge: Number(this.maxAgeCookie),
        signed: true,
        secure: false,
        httpOnly: false,
      });
      response.cookie(
        (companyGroupCode || '') + this.cookieRefreshName,
        refreshToken,
        {
          maxAge: Number(this.maxAgeRefreshCookie),
          signed: true,
          secure: false,
          httpOnly: false,
        },
      );
    }
  }

  // ** clear cookie
  clearCookie(response: Response) {
    const signedCookies = response.req.signedCookies;

    // Lặp qua từng cookie và xóa
    for (const cookieName in signedCookies) {
      if (
        cookieName.includes(this.cookieName) ||
        cookieName.includes(this.cookieRefreshName)
      ) {
        // Xóa cookie bằng cách thiết lập thời gian hết hạn ở quá khứ
        response.clearCookie(cookieName);
      }
    }
  }

  // ** Encode payload data to render to json web token
  encodeJsonWebToken(data: any, options?: JwtSignOptions) {
    if (!data) return '';
    const encodeToken = this.jwtService.sign(data, {
      ...options,
      secret: this.secretKey,
    });
    return encodeToken;
  }

  // ** Decode json web token to payload data
  decodeJsonWebToken(token: string) {
    const decodeToken = this.jwtService.decode(token, {
      json: true,
    }) as UserType;
    return decodeToken;
  }

  async handleVerifyToken(
    email: string,
    companyGroupCode?: string,
  ): Promise<UserType> {
    const users = await this.userRepository.getUsersWithCompanyGroup(email);
    const user = companyGroupCode
      ? users.find((u) => u.companyGroupCode === companyGroupCode)
      : users[0];
    return {
      id: user.id,
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      employeeNumber: user.employeeNumber,
      active: user.active,
      roles: user.roles.map((role) => role.id),
      departmentId: user.departmentId,
      departmentName: user.department?.name,
      divisionId: user.divisionId,
      divisionName: user.division?.name,
      companyId: user.companyId,
      companyName: user.company?.name,
      level: user.level,
      flagSkill: user.flagSkill,
      companyGroupCode: user.companyGroup?.code,
      companyGroupName: user.companyGroup?.name,
      companyIcon: user.companyGroup?.icon,
      companyGroups: users.map((u) => ({
        code: u.companyGroup?.code,
        name: u.companyGroup?.name,
        roleCount: u.roles.length,
      })),
      timeZone: user.companyGroup.timezone,
      emailHR: user.companyGroup.emailHR,
    };
  }

  async refreshToken(req: Request) {
    const userObj: UserType | null = this.processVerifyToken(
      req.signedCookies[
        (req?.user?.companyGroupCode || '') + this.cookieRefreshName
      ],
    );

    if (!userObj) {
      return null;
    }

    const payload = {
      id: userObj.id,
      userId: userObj.userId,
      email: userObj.email,
      fullName: userObj.fullName,
      employeeNumber: userObj.employeeNumber,
      active: userObj.active,
      roles: userObj.roles,
      departmentId: userObj.departmentId,
      departmentName: userObj.departmentName,
      companyId: userObj.companyId,
      companyName: userObj.companyName,
      level: userObj.level,
      departmentCode: userObj.departmentCode,
      companyGroupCode: userObj.companyGroupCode,
      companyGroupName: userObj.companyGroupName,
      companyGroups: userObj.companyGroups,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const newAccessToken = await this.encodeJsonWebToken(payload, {
      expiresIn: expiresIn,
    });

    return newAccessToken;
  }
}
