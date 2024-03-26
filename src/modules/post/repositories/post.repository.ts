import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  Repository,
} from 'typeorm';
import { Post } from '@modules/post/entities/post.entity';
import { PostDTO } from '@modules/post/dto/post.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  private findOptionRelations: FindOptionsRelations<Post> = {
    user: true,
  };

  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async getAll(): Promise<Post[]> {
    return this.find({ relations: this.findOptionRelations });
  }

  async getById(id: number): Promise<Post> {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  async addPost(postDto: PostDTO, user: User): Promise<Post> {
    const post: Post = this.create(postDto);
    post.user = user;

    return this.save(post);
  }

  async updateById(id: number, postDto: PostDTO): Promise<Post> {
    const post: Post = await this.getById(id);
    const postToUpdate: Post = Object.assign(post, postDto);

    return this.save(postToUpdate);
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
