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
import { TagRepository } from './tag.repository';
import { Tag } from '@modules/post/entities/tag.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  private findOptionRelations: FindOptionsRelations<Post> = {
    user: true,
    tags: true,
  };

  constructor(
    private dataSource: DataSource,
    private readonly tagRepository: TagRepository,
  ) {
    super(Post, dataSource.createEntityManager());
  }

  getAll(): Promise<Post[]> {
    return this.find({ relations: this.findOptionRelations });
  }

  getById(id: string): Promise<Post> {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  getAllByTag(tagName: string): Promise<Post[]> {
    return this.find({
      where: { tags: { name: tagName } },
      relations: this.findOptionRelations,
    });
  }

  async addPost(postDto: PostDTO, user: User): Promise<Post> {
    const post: Post = this.create({
      title: postDto.title,
      body: postDto.body,
    });
    post.user = user;

    const tags: Tag[] = await Promise.all(
      Array.from(postDto.tags).map(async (tagName: string) => {
        const tag: Tag = await this.tagRepository.getByName(tagName);
        if (tag) return tag;

        return this.tagRepository.addTag(tagName);
      }),
    );

    post.tags = tags;

    return this.save(post);
  }

  async updateById(id: string, postDto: PostDTO): Promise<Post> {
    const post: Post = await this.getById(id);
    const postToUpdate: Post = Object.assign(post, postDto);

    return this.save(postToUpdate);
  }

  async deleteById(id: string): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
