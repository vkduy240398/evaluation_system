import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from 'src/handler/annotation/Authentication';
import { LocalAuthGuard } from 'src/handler/guard/auth.guard';
import { LoginRequestDto } from 'src/model/request/LoginRequestDto';
import { AuthResponseDto } from 'src/model/response/AuthResponseDto';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { VerifyTokenService } from 'src/services/verifyToken.service';

const accessTokenCookieName = process.env.COOKIE_NAME || '__auth_';
const maxAgeCookie = process.env.COOKIE_MAX_AGE || 1800000;
@Controller('v1/auth')
@ApiTags('Authentication')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @Inject(VerifyTokenService)
  private verifyTokenService: VerifyTokenService;

  @Inject(UserService)
  private userService: UserService;

  /**
   * Check login
   *
   * @author tran.le.ha.nam
   */
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const authentication = this.authService.checkLogin(req.user);
    this.verifyTokenService.setCookieToken(
      res,
      authentication.accessToken,
      authentication.refreshToken,
    );

    res.status(HttpStatus.OK);
    res.send(authentication);
  }

  @Post('/verify-token')
  @Public()
  async verifyToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.verifyTokenService.getTokenFromCookie(req);
    if (!token.accessToken || !token.refreshToken) {
      res.status(HttpStatus.OK);
      return { userData: null };
    }
    const decode = this.verifyTokenService.verifyToken(
      token.accessToken,
      token.refreshToken,
      res,
    );
    res.status(HttpStatus.OK);

    const userData = await this.verifyTokenService.handleVerifyToken(
      decode.email,
      req?.user?.companyGroupCode,
    );

    return { userData };
  }

  /**
   * Refresh token and return it
   *
   * @author tran.le.ha.nam
   */
  @Get('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.verifyTokenService.refreshToken(req);
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED);
    } else {
      res.cookie((req?.user?.companyGroupCode || '') + accessTokenCookieName, token, {
        maxAge: Number(maxAgeCookie),
        signed: false,
        secure: false,
        httpOnly: false,
      });
      res.status(HttpStatus.OK);
    }
    res.send(true);
  }

  @Post('/logout')
  @Public()
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.verifyTokenService.clearCookie(res);
    res.status(HttpStatus.OK);
  }

  @Post('/select-company')
  async selectCompany(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authentication = await this.authService.checkSelectGroup(
      req.body.email,
      req.body.companyGroupCode,
      res,
    );
    this.verifyTokenService.setCookieToken(
      res,
      authentication.accessToken,
      authentication.refreshToken,
      req.body.companyGroupCode,
    );

    res.status(HttpStatus.OK);
    res.send(authentication);
  }
}
