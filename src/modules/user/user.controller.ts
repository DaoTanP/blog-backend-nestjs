import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { isAlphanumeric, isEmail } from 'class-validator';
import { User } from './entities/user.entity';
import { Messages } from '@/shared/constants/messages.enum';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleEnum } from '@shared/constants/role.enum';
import { Request } from 'express';
import { Owner } from '@/shared/decorators/owner.decorator';
import { PermissionGuard } from '@/shared/guards/permission.guard';
import { SignUpDTO } from '@modules/auth/dto/sign-up.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  myProfile(@Req() req: Request): Promise<User> {
    const loggedInUser: User = req.user as User;
    return this.userService.getByUsername(loggedInUser.username);
  }

  @Get(':username')
  async profile(
    @Param('username') username: string,
  ): Promise<User | NotFoundException> {
    const user: User = await this.userService.getByUsername(username);

    if (user) return user;

    throw new NotFoundException({
      message: Messages.USER_NOT_FOUND,
    });
  }

  @Get('checkUsernameAvailability')
  checkUsernameAvailability(
    @Query('username') username: string,
  ): Promise<boolean | BadRequestException> {
    if (!username)
      throw new BadRequestException({
        message: Messages.USERNAME_EMPTY,
      });

    if (!isAlphanumeric(username))
      throw new BadRequestException({
        message: Messages.USERNAME_INVALID,
      });

    return this.userService.isUsernameAvailable(username);
  }

  @Get('checkEmailAvailability')
  checkEmailAvailability(
    @Query('email') email: string,
  ): Promise<boolean | BadRequestException> {
    if (!email)
      throw new BadRequestException({
        message: Messages.EMAIL_EMPTY,
      });

    if (!isEmail(email))
      throw new BadRequestException({
        message: Messages.EMAIL_INVALID,
      });

    return this.userService.isEmailAvailable(email);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async addUser(
    @Body() formData: SignUpDTO,
  ): Promise<User | BadRequestException> {
    if (await this.userService.getAccountByUsername(formData.username))
      throw new BadRequestException(Messages.USERNAME_EXIST);

    if (await this.userService.getAccountByEmail(formData.email))
      throw new BadRequestException(Messages.EMAIL_EXIST);

    return this.userService.addUser(formData);
  }

  // @Put(':username')
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  // @Owner('username')
  // async updateUser(
  //   @Req() req: Request,
  //   @Param('username') username: string,
  //   @Body() formData: UserDTO,
  // ): Promise<unknown> {
  //   const userToUpdate: User = await this.userService.getByUsername(username);
  //   if (!userToUpdate) throw new NotFoundException(Messages.USER_NOT_FOUND);

  //   return this.userService.updateById(userToUpdate.id, formData);
  // }

  @Delete(':username')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Owner('username')
  async deleteUser(
    @Req() req: Request,
    @Param('username') username: string,
  ): Promise<unknown> {
    const userToDelete: User = await this.userService.getByUsername(username);
    if (!userToDelete) throw new NotFoundException(Messages.USER_NOT_FOUND);

    return this.userService.deleteById(userToDelete.id);
  }

  @Post(':username/giveAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  giveAdmin(@Param('username') username: string): Promise<any> {
    return this.userService.giveAdmin(username);
  }

  @Post(':username/takeAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  takeAdmin(@Param('username') username: string): Promise<any> {
    return this.userService.takeAdmin(username);
  }
}
