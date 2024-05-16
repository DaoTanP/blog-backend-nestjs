import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';
import { Request } from 'express';
import { AuthService } from '@/modules/auth/services/auth.service';
import { RefreshToken } from '@/modules/auth/entities/refresh-token.entity';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
      secretOrKey: process.env.APP_SECRET,
    });
  }

  private static extractJWTFromCookies(req: Request): string | null {
    if (
      req.cookies &&
      'refresh_token' in req.cookies &&
      req.cookies.refresh_token.length > 0
    ) {
      return req.cookies.refresh_token;
    }
    return null;
  }

  async validate(req: Request): Promise<any> {
    const refreshToken: string =
      req?.get('Authorization')?.replace('Bearer', '').trim() ||
      RefreshTokenStrategy.extractJWTFromCookies(req);

    if (!refreshToken || refreshToken === '') throw new UnauthorizedException();

    const token: RefreshToken =
      await this.authService.validateRefreshToken(refreshToken);

    if (!token) throw new UnauthorizedException();

    return this.userService.getById(token.user.id);
  }
}
