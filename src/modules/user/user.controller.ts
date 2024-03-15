import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async myProfile(@Req() req) {
    return req.user;
  }

  @Get(':username/profile')
  async profile(@Param('username') username) {
    return this.userService.getByUsername(username);
  }

  @Get('checkUsernameAvailability')
  async checkUsernameAvailability(@Query('u') username: string) {
    return this.userService.isUsernameAvailable(username);
  }

  @Get('checkEmailAvailability')
  async checkEmailAvailability(@Query('e') email: string) {
    return this.userService.isEmailAvailable(email);
  }
}
