import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { decrypt } from 'src/common/util';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.authentication(
      email,
      decrypt(password),
    );
    if (!user) {
      throw new RuntimeException('Invalid user.', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
