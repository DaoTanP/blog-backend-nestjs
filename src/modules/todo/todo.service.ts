import { Injectable } from '@nestjs/common';
import { TodoRepository } from './repositories/todo.repository';
import { Todo } from './entities/todo.entity';
import { TodoDTO } from './dto/todo.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  getByUserId(userId: string): Promise<Todo[]> {
    return this.todoRepository.getByUserId(userId);
  }

  getById(id: string, userId: string): Promise<Todo> {
    return this.todoRepository.getById(id, userId);
  }

  addTodo(todoDto: TodoDTO, user: User): Promise<Todo> {
    return this.todoRepository.addTodo(todoDto, user);
  }

  updateTodo(id: string, userId: string, todoDto: TodoDTO): Promise<Todo> {
    return this.todoRepository.updateTodo(id, userId, todoDto);
  }

  markCompleted(
    id: string,
    userId: string,
    completed: boolean = true,
  ): Promise<boolean> {
    return this.todoRepository.markCompleted(id, userId, completed);
  }

  deleteById(id: string, userId: string): Promise<boolean> {
    return this.todoRepository.deleteById(id, userId);
  }
}
