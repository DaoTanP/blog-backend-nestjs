import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { Messages } from '@/shared/constants/messages.constant';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp() {
    return 'signup';
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Req() req: Request,
  ): Promise<{ access_token: string } | unknown> {
    try {
      return this.authService.generateToken(req.user);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
