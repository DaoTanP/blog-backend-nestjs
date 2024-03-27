import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Todo } from './entities/todo.entity';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';
import { TodoService } from './todo.service';
import { TodoDTO } from './dto/todo.dto';

@Controller('api/v1/todos')
export class TodoController {
  constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getByUserId(@Req() req: Request): Promise<Todo[]> {
    const user: User = req.user as User;

    return this.todoService.getByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Req() req: Request, @Param('id') id: number): Promise<Todo> {
    const user: User = req.user as User;

    return this.todoService.getById(id, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addTodo(@Req() req: Request, @Body() formData: TodoDTO): Promise<Todo> {
    const user: User = req.user as User;

    return this.todoService.addTodo(formData, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTodo(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() formData: TodoDTO,
  ): Promise<Todo> {
    const user: User = req.user as User;

    return this.todoService.updateTodo(id, user.id, formData);
  }

  @Put(':id/complete')
  @UseGuards(JwtAuthGuard)
  async markCompleted(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<boolean> {
    const user: User = req.user as User;

    return this.todoService.markCompleted(id, user.id, true);
  }

  @Put(':id/unComplete')
  @UseGuards(JwtAuthGuard)
  async markUncompleted(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<boolean> {
    const user: User = req.user as User;

    return this.todoService.markCompleted(id, user.id, false);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<boolean> {
    const user: User = req.user as User;

    return this.todoService.deleteById(id, user.id);
  }
}
