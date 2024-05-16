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
import { TokenDTO } from './dto/token.dto';
import { RefreshTokenGuard } from '@/shared/guards/refresh-token.guard';
import { Messages } from '@/shared/constants/messages.enum';
import { UserService } from '@modules/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signUp(
    @Body() signUpDTO: SignUpDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenDTO | BadRequestException> {
    const usernameAvailable: boolean =
      await this.userService.isUsernameAvailable(signUpDTO.username);
    if (!usernameAvailable) {
      throw new BadRequestException(Messages.USERNAME_EXIST);
    }

    const emailAvailable: boolean = await this.userService.isEmailAvailable(
      signUpDTO.email,
    );
    if (!emailAvailable) {
      throw new BadRequestException(Messages.EMAIL_EXIST);
    }

    const token: TokenDTO = await this.authService.signUp(signUpDTO);

    this.setCookies(res, token);

    return this.authService.generateToken();
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenDTO> {
    const jwtTokenObject: TokenDTO = this.authService.generateToken(
      req.user as User,
    );
    await this.authService.updateRefreshToken(
      jwtTokenObject.refreshToken,
      req.user as User,
    );

    this.setCookies(res, jwtTokenObject);

    return this.authService.generateToken();
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenDTO> {
    const jwtTokenObject: TokenDTO = this.authService.generateToken(
      req.user as User,
    );

    await this.authService.updateRefreshToken(
      jwtTokenObject.refreshToken,
      req.user as User,
    );

    this.setCookies(res, jwtTokenObject);

    return this.authService.generateToken();
  }

  @Post('signout')
  @UseGuards(RefreshTokenGuard)
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    try {
      await this.authService.updateRefreshToken(null, req.user as User);
      this.resetCookies(res);

      return true;
    } catch (error) {
      return false;
    }
  }

  setCookies(res: Response, jwtTokenObject: TokenDTO): void {
    res.cookie('access_token', jwtTokenObject.accessToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE_MILLIS, 10) || 3600000, // 1hr max
    });

    res.cookie('refresh_token', jwtTokenObject.refreshToken, {
      httpOnly: true,
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_MAX_AGE_MILLIS, 10) || 604800000, // 7d max
    });
  }

  resetCookies(res: Response): void {
    res.cookie('access_token', null, {
      httpOnly: true,
      maxAge: 1,
    });

    res.cookie('refresh_token', null, {
      httpOnly: true,
      maxAge: 1,
    });
  }
}
