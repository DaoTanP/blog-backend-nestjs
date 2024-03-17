import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp() {
    return 'signup';
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() req) {
    return this.authService.generateToken(req.user);
  }
}
