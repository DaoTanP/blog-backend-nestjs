import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user/user.module';
import { User } from '@modules/user/entities/user.entity';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './repositories/todo.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Todo, User])],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}
