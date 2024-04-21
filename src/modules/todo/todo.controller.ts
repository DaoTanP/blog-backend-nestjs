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
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Todo } from './entities/todo.entity';
import { User } from '@modules/user/entities/user.entity';
import { TodoService } from './todo.service';
import { TodoDTO } from './dto/todo.dto';
import { Messages } from '@/shared/constants/messages.enum';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getByUserId(@Req() req: Request): Promise<Todo[]> {
    const user: User = req.user as User;

    return this.todoService.getByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Todo | NotFoundException> {
    const user: User = req.user as User;

    const todo: Todo = await this.todoService.getById(id, user.id);

    if (todo) return todo;

    throw new NotFoundException({
      message: Messages.TODO_NOT_FOUND,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addTodo(@Req() req: Request, @Body() formData: TodoDTO): Promise<Todo> {
    const user: User = req.user as User;

    return this.todoService.addTodo(formData, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTodo(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() formData: TodoDTO,
  ): Promise<Todo | NotFoundException> {
    const user: User = req.user as User;

    const todo: Todo = await this.todoService.getById(id, user.id);
    if (!todo) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.todoService.updateTodo(id, user.id, formData);
  }

  @Put(':id/complete')
  @UseGuards(JwtAuthGuard)
  async markCompleted(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<boolean | NotFoundException> {
    const user: User = req.user as User;

    const todo: Todo = await this.todoService.getById(id, user.id);
    if (!todo) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.todoService.markCompleted(id, user.id, true);
  }

  @Put(':id/unComplete')
  @UseGuards(JwtAuthGuard)
  async markUncompleted(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<boolean | NotFoundException> {
    const user: User = req.user as User;

    const todo: Todo = await this.todoService.getById(id, user.id);
    if (!todo) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.todoService.markCompleted(id, user.id, false);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<boolean | NotFoundException> {
    const user: User = req.user as User;

    const todo: Todo = await this.todoService.getById(id, user.id);
    if (!todo) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.todoService.deleteById(id, user.id);
  }
}
