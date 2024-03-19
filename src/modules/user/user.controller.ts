import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { isAlphanumeric, isEmail } from 'class-validator';
import { User } from './entities/user.entity';
import { Messages } from '@/shared/constants/messages.constant';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { UserRoles } from '@modules/auth/enums/role.enum';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async myProfile(@Req() req): Promise<User> {
    return req.user;
  }

  @Get(':username/profile')
  async profile(@Param('username') username: string): Promise<User | unknown> {
    try {
      const user: User = await this.userService.getByUsername(username);

      if (user) return user;

      throw new NotFoundException({
        message: Messages.USER_NOT_FOUND,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('checkUsernameAvailability')
  async checkUsernameAvailability(
    @Query('username') username: string,
  ): Promise<boolean | unknown> {
    if (!username)
      throw new BadRequestException({
        message: Messages.USERNAME_EMPTY,
      });

    if (!isAlphanumeric(username))
      throw new BadRequestException({
        message: Messages.USERNAME_INVALID,
      });

    try {
      return this.userService.isUsernameAvailable(username);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('checkEmailAvailability')
  async checkEmailAvailability(
    @Query('email') email: string,
  ): Promise<boolean | unknown> {
    if (!email)
      throw new BadRequestException({
        message: Messages.EMAIL_EMPTY,
      });

    if (!isEmail(email))
      throw new BadRequestException({
        message: Messages.EMAIL_INVALID,
      });

    try {
      return this.userService.isEmailAvailable(email);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async addUser(@Body() formData: User): Promise<unknown> {
    // placeholder code to test role guard, will be updated later
    return formData;
  }
}
