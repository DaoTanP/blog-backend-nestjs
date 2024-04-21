import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from '@shared/guards/local-auth.guard';
import { SignUpDTO } from './dto/sign-up.dto';
import { User } from '@modules/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDTO: SignUpDTO): Promise<User | Error> {
    const result: User | Error = await this.authService.signUp(signUpDTO);
    if (result instanceof Error)
      throw new BadRequestException({
        message: result.message,
      });

    return result;
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signIn(@Req() req: Request): { access_token: string } {
    return this.authService.generateToken(req.user as User);
  }
}
