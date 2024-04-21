import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Todo } from '@modules/todo/entities/todo.entity';
import { TodoDTO } from '@modules/todo/dto/todo.dto';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class TodoRepository extends Repository<Todo> {
  // private findOptionRelations: FindOptionsRelations<Todo> = {
  //   user: true,
  // };

  // private findOptionSelect: FindOptionsSelect<Todo> = {
  //   user: { username: true, email: true },
  // };

  constructor(private dataSource: DataSource) {
    super(Todo, dataSource.createEntityManager());
  }

  getByUserId(userId: string): Promise<Todo[]> {
    return this.find({
      where: { user: { id: userId } },
    });
  }

  getById(id: string, userId: string): Promise<Todo> {
    return this.findOne({
      where: { id, user: { id: userId } },
    });
  }

  addTodo(todoDto: TodoDTO, user: User): Promise<Todo> {
    const todo: Todo = this.create(todoDto);
    todo.user = user;
    return this.save(todo);
  }

  async updateTodo(
    id: string,
    userId: string,
    todoDto: TodoDTO,
  ): Promise<Todo> {
    const todo: Todo = await this.getById(id, userId);
    const todoToUpdate: Todo = Object.assign(todo, todoDto);

    return this.save(todoToUpdate);
  }

  async markCompleted(
    id: string,
    userId: string,
    completed: boolean = true,
  ): Promise<boolean> {
    const todo: Todo = await this.getById(id, userId);
    if (todo.completed === completed) return true;

    todo.completed = completed;
    const updatedTodo: Todo = await this.save(todo);
    if (!updatedTodo) return false;

    return true;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({
      id,
      user: { id: userId },
    });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
