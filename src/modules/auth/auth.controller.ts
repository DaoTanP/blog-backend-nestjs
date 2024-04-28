import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
  signIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): { access_token: string } {
    const jwtTokenObject: { access_token: string } =
      this.authService.generateToken(req.user as User);

    res.cookie('access_token', jwtTokenObject.access_token, {
      httpOnly: true,
      maxAge: parseInt(process.env.TOKEN_MAX_AGE_MILLIS, 10) || 3600000, // 1hr max
    });

    return this.authService.generateToken();
  }
}
