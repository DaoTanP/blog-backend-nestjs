import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { isEmail, length, matches } from 'class-validator';
import { User } from './entities/user.entity';
import { Messages } from '@/shared/constants/messages.enum';
import { RolesGuard } from '@shared/guards/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleEnum } from '@shared/constants/role.enum';
import { Request } from 'express';
import { Owner } from '@/shared/decorators/owner.decorator';
import { PermissionGuard } from '@/shared/guards/permission.guard';
import { SignUpDTO } from '@modules/auth/dto/sign-up.dto';
import { REGEX_PATTERN } from '@/shared/constants/regex-pattern.constant';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO, mapValue } from './dto/user.dto';
import { Comment } from '@modules/comment/entities/comment.entity';
import { CommentService } from '@modules/comment/comment.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  myProfile(@Req() req: Request): Promise<UserDTO> {
    const loggedInUser: User = req.user as User;
    return mapValue(
      this.userService.getByUsername(loggedInUser.username),
      this.userService,
    );
  }

  @Post('isUsernameAvailable')
  isUsernameAvailable(@Body('username') username: string): Promise<boolean> {
    if (!username)
      throw new BadRequestException({
        message: Messages.USERNAME_EMPTY,
      });

    if (!matches(username, REGEX_PATTERN.username))
      throw new BadRequestException({
        message: Messages.USERNAME_PATTERN,
      });

    if (!length(username, 3, 30))
      throw new BadRequestException({
        message: Messages.USERNAME_LENGTH,
      });

    return this.userService.isUsernameAvailable(username);
  }

  @Post('isEmailAvailable')
  isEmailAvailable(@Body('email') email: string): Promise<boolean> {
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

  @Get('profile/:username')
  async profile(@Param('username') username: string): Promise<UserDTO> {
    const user: User = await this.userService.getByUsername(username);

    if (user) return mapValue(user, this.userService);

    throw new NotFoundException({
      message: Messages.USER_NOT_FOUND,
    });
  }

  @Get('comments/:username')
  getAllComments(@Param('username') username: string): Promise<Comment[]> {
    return this.commentService.getByUsername(username);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async addUser(@Body() formData: SignUpDTO): Promise<User> {
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

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: Request,
    @Body() formData: UpdateUserDTO,
  ): Promise<User> {
    const userToUpdate: User = req.user as User;
    if (!userToUpdate) throw new NotFoundException(Messages.USER_NOT_FOUND);

    return this.userService.updateById(userToUpdate.id, formData);
  }

  @Post('follow')
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Req() req: Request,
    @Body('userId') userId: string,
  ): Promise<boolean> {
    const follower: User = req.user as User;
    const userToFollow: User = await this.userService.getById(userId);
    if (!userToFollow) throw new NotFoundException(Messages.USER_NOT_FOUND);

    return this.userService.followUser(follower.id, userToFollow.id);
  }

  @Post('unfollow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Req() req: Request,
    @Body('userId') userId: string,
  ): Promise<boolean> {
    const follower: User = req.user as User;
    const userToUnfollow: User = await this.userService.getById(userId);
    if (!userToUnfollow) throw new NotFoundException(Messages.USER_NOT_FOUND);

    return this.userService.unfollowUser(follower.id, userToUnfollow.id);
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
