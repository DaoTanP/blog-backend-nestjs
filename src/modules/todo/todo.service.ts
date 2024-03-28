import { Injectable } from '@nestjs/common';
import { TodoRepository } from './repositories/todo.repository';
import { Todo } from './entities/todo.entity';
import { TodoDTO } from './dto/todo.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getByUserId(userId: number): Promise<Todo[]> {
    return this.todoRepository.getByUserId(userId);
  }

  async getById(id: number, userId: number): Promise<Todo> {
    return this.todoRepository.getById(id, userId);
  }

  async addTodo(todoDto: TodoDTO, user: User): Promise<Todo> {
    return this.todoRepository.addTodo(todoDto, user);
  }

  async updateTodo(
    id: number,
    userId: number,
    todoDto: TodoDTO,
  ): Promise<Todo> {
    return this.todoRepository.updateTodo(id, userId, todoDto);
  }

  async markCompleted(
    id: number,
    userId: number,
    completed: boolean = true,
  ): Promise<boolean> {
    return this.todoRepository.markCompleted(id, userId, completed);
  }

  async deleteById(id: number, userId: number): Promise<boolean> {
    return this.todoRepository.deleteById(id, userId);
  }
}
