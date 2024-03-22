import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from '@shared/guards/local-auth.guard';
import { Request } from 'express';
import { Messages } from '@shared/constants/messages.constant';
import { Body } from '@nestjs/common';
import { SignUpDTO } from './dto/signUp.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDTO: SignUpDTO): Promise<Object> {
    return await this.authService.signUp(signUpDTO);
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
