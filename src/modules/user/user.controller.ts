import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { isAlphanumeric, isEmail } from 'class-validator';
import { User } from './entities/user.entity';
import { Messages } from '@shared/constants/messages.constant';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { UserRoles } from '@shared/constants/role.enum';
import { Request } from 'express';
import { UserDTO } from './dto/user.dto';
import { UserProfileDto } from './dto/userProfile.dto';

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
  async addUser(@Body() formData: UserDTO): Promise<unknown> {
    if (await this.userService.getAccountByUsername(formData.username))
      throw new BadRequestException(Messages.USERNAME_DUPLICATED);
    if (await this.userService.getAccountByEmail(formData.email))
      throw new BadRequestException(Messages.EMAIL_DUPLICATED);

    return this.userService.addUser(formData);
  }

  @Put(':username')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req: Request,
    @Param('username') username: string,
    @Body() formData: UserDTO,
  ): Promise<unknown> {
    const userToUpdate: User = await this.userService.getByUsername(username);
    if (!userToUpdate) throw new NotFoundException(Messages.USER_NOT_FOUND);

    if (!(await this.userService.hasPermission(username, req.user as User)))
      throw new UnauthorizedException();
    // `User ${username} cannot be updated by ${user.username} with role ${userRole.role.name}`,

    if (await this.userService.getAccountByUsername(formData.username))
      throw new BadRequestException(Messages.USERNAME_DUPLICATED);
    if (await this.userService.getAccountByEmail(formData.email))
      throw new BadRequestException(Messages.EMAIL_DUPLICATED);

    try {
      return this.userService.updateById(userToUpdate.id, formData);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Req() req: Request,
    @Param('username') username: string,
  ): Promise<unknown> {
    const userToDelete: User = await this.userService.getByUsername(username);
    if (!userToDelete) throw new NotFoundException(Messages.USER_NOT_FOUND);

    if (!(await this.userService.hasPermission(username, req.user as User)))
      throw new UnauthorizedException();
    // `User ${username} cannot be deleted by ${user.username} with role ${userRole.role.name}`,

    try {
      return this.userService.deleteById(userToDelete.id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Put('/setOrUpdateInfo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  async setOrUpdateInfo(
    @Req() req: Request,
    @Body() userProfileDto: UserProfileDto,
  ): Promise<{ status: number; message: string; data: unknown }> {
    try {
      const reqUser: User = req.user as User;
      if (!reqUser) throw new NotFoundException(Messages.USER_NOT_FOUND);

      const loggedInUserId = reqUser.id;
      const userId = parseInt(req.params.userId);
      const userRole: UserRole =
        await this.userRoleService.getByUserId(loggedInUserId);
      if (userRole.role.name !== UserRoles.ADMIN || userId === loggedInUserId)
        throw new UnauthorizedException();
      const dataReponse = await this.userService.setOrUpdateInfo(
        reqUser.id,
        userProfileDto,
      );
      return {
        status: HttpStatus.OK,
        message: Messages.UPDATE_USER,
        data: dataReponse,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }

  @Post(':username/giveAdmin')
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  giveAdmin(
    @Param('username') username: string,
  ): Promise<{ statusCode: HttpStatus; message: string; data: User }> {
    return this.userService.giveAdmin(username);
  }

  @Post(':username/takeAdmin')
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  takeAdmin(
    @Param('username') username: string,
  ): Promise<{ statusCode: HttpStatus; message: string; data: User }> {
    return this.userService.takeAdmin(username);
  }
}
