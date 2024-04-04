import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { Messages } from '@shared/constants/messages.constant';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { UserRoles } from '@shared/constants/role.enum';
import { Request } from 'express';
import { UserDTO } from './dto/user.dto';
import { UserProfileDto } from './dto/userProfile.dto';
import { Owner } from '@/shared/decorators/owner.decorator';
import { PermissionGuard } from '@/shared/guards/permission.guard';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async myProfile(@Req() req: Request): Promise<User> {
    return req.user as User;
  }

  @Get(':username/profile')
  async profile(@Param('username') username: string): Promise<User | unknown> {
    const user: User = await this.userService.getByUsername(username);

    if (user) return user;

    throw new NotFoundException({
      message: Messages.USER_NOT_FOUND,
    });
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

    return this.userService.isUsernameAvailable(username);
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

    return this.userService.isEmailAvailable(email);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async addUser(@Body() formData: UserDTO): Promise<unknown> {
    if (await this.userService.getAccountByUsername(formData.username))
      throw new BadRequestException(Messages.USERNAME_EXIST);
    if (await this.userService.getAccountByEmail(formData.email))
      throw new BadRequestException(Messages.EMAIL_EXIST);

    return this.userService.addUser(formData);
  }

  @Put(':username')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Owner('username')
  async updateUser(
    @Req() req: Request,
    @Param('username') username: string,
    @Body() formData: UserDTO,
  ): Promise<unknown> {
    const userToUpdate: User = await this.userService.getByUsername(username);
    if (!userToUpdate) throw new NotFoundException(Messages.USER_NOT_FOUND);

    return this.userService.updateById(userToUpdate.id, formData);
  }

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

  @Put('/setOrUpdateInfo')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Owner({ idParamName: 'username', type: User, requestType: 'body' })
  async setOrUpdateInfo(
    @Req() req: Request,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<{ status: number; message: string; data: unknown }> {
    const reqUser: User = req.user as User;

    const dataReponse = await this.userService.setOrUpdateInfo(
      reqUser.id,
      userProfileDto,
    );
    return {
      status: HttpStatus.OK,
      message: Messages.UPDATE_USER,
      data: dataReponse,
    };
  }

  @Post(':username/giveAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async giveAdmin(
    @Param('username') username: string,
  ): Promise<{ statusCode: HttpStatus; message: string; data: User }> {
    return this.userService.giveAdmin(username);
  }

  @Post(':username/takeAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async takeAdmin(
    @Param('username') username: string,
  ): Promise<{ statusCode: HttpStatus; message: string; data: User }> {
    return this.userService.takeAdmin(username);
  }
}
