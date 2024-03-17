import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { isAlphanumeric, isEmail } from 'class-validator';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async myProfile(@Req() req) {
    return req.user;
  }

  @Get(':username/profile')
  async profile(@Param('username') username: string) {
    const user = await this.userService.getByUsername(username);

    if (user) return user;

    throw new NotFoundException({ message: 'User not found' });
  }

  @Get('checkUsernameAvailability')
  async checkUsernameAvailability(@Query('username') username: string) {
    if (!username)
      throw new BadRequestException({
        message: 'Parameter named "username" must not be empty',
      });

    if (!isAlphanumeric(username))
      throw new BadRequestException({
        message: 'Valid username must only contain alphanumeric characters',
      });

    return this.userService.isUsernameAvailable(username);
  }

  @Get('checkEmailAvailability')
  async checkEmailAvailability(@Query('email') email: string) {
    if (!email)
      throw new BadRequestException({
        message: 'Parameter named "email" must not be empty',
      });

    if (!isEmail(email))
      throw new BadRequestException({
        message: 'Invalid email address',
      });

    return this.userService.isEmailAvailable(email);
  }
}
