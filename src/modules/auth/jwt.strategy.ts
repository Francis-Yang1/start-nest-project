import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { JWT_KEY } from './constants';

export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  authService: AuthService;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
