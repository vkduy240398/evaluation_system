import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { VerifyTokenService } from './verifyToken.service';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { UserRepository } from 'src/repository/user.repository';
import { Client } from 'ldapts';
import { UserType } from '../interfaces/user.interfaces';
import { Response } from 'express';

@Injectable()
export class AuthService {
  @Inject(VerifyTokenService)
  private verifyToken: VerifyTokenService;

  @Inject(UserRepository)
  private userRepo: UserRepositoryI;

  /**
   * Validate email, password
   *
   * @author tran.le.ha.nam
   * @last_update
   */
  async authentication(email: string, password: string): Promise<UserType> {
    if (
      process.env.ENABLE_LDAP === 'true' &&
      !this.checkEmailExeption(email, password)
    ) {
      const ldapOptions = {
        url: process.env.LDAP_URI || '',
        bindDN: process.env.LDAP_BIND_DN || '',
      };
      const client = new Client(ldapOptions);
      try {
        await client.bind(email, password);
      } catch (error) {
        throw new RuntimeException(error.message, HttpStatus.UNAUTHORIZED);
      } finally {
        await client.unbind();
      }
    }

    const users = await this.userRepo.getUsersWithCompanyGroup(email);
    const user = users[0];
    if (user) {
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
        companyGroupCode: '',
        companyGroupName: '',
        companyIcon: '',
        companyGroups: users.map((u) => ({
          code: u.companyGroup?.code,
          name: u.companyGroup?.name,
          roleCount: u.roles.length,
        })),
        timeZone: user.companyGroup.timezone,
        emailHR: user.companyGroup.emailHR,
      };
    }
    return null;
  }

  checkEmailExeption(email: string, password: string) {
    const emailException = process.env.EMAIL_EXCEPTION;
    const passwordException = process.env.PASSWORD_EXCEPTION;
    if (!emailException || !passwordException) {
      return false;
    }

    const aryEmailException = emailException.split(',');

    return (
      aryEmailException
        .map((item) => item.trim().toLowerCase())
        .includes(email.trim().toLowerCase()) && passwordException === password
    );
  }

  checkLogin(user: any) {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const expiresInRefresh = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    return {
      accessToken: this.verifyToken.encodeJsonWebToken(user, {
        expiresIn: expiresIn,
      }),
      refreshToken: this.verifyToken.encodeJsonWebToken(user, {
        expiresIn: expiresInRefresh,
      }),
      user: user,
    };
  }

  async checkSelectGroup(
    email: string,
    companyGroupCode: string,
    res: Response,
  ) {
    const users = await this.userRepo.getUsersWithCompanyGroup(email);

    const user = users.find((u) => u.companyGroupCode === companyGroupCode);
    if (!user) {
      this.verifyToken.clearCookie(res);
      throw new RuntimeException('Deleted user', 405);
    }
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
    // console.log("payload: ", payload);
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const expiresInRefresh = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    return {
      accessToken: this.verifyToken.encodeJsonWebToken(payload, {
        expiresIn: expiresIn,
      }),
      refreshToken: this.verifyToken.encodeJsonWebToken(payload, {
        expiresIn: expiresInRefresh,
      }),
      user: payload,
    };
  }
}

export default AuthService;
