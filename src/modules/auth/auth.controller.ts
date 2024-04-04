import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from '@shared/guards/local-auth.guard';
import { SignUpDTO } from './dto/signUp.dto';
import { User } from '@modules/user/entities/user.entity';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDTO: SignUpDTO): Promise<User> {
    return this.authService.signUp(signUpDTO);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Req() req: Request,
  ): Promise<{ access_token: string } | unknown> {
    return this.authService.generateToken(req.user);
  }
}
