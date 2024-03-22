import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@modules/auth/services/auth.service';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'usernameOrEmail' });
  }

  async validate(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | unknown> {
    const user: User = await this.authService.validateUser({
      usernameOrEmail,
      password,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
