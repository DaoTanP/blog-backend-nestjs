import { Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { Post } from './entities/post.entity';
import { CreatePostDTO } from './dto/create-post.dto';
import { User } from '@modules/user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { TagRepository } from './repositories/tag.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  getAll(skip: number, take: number): Promise<Post[]> {
    return this.postRepository.getAll(skip, take);
  }

  getById(id: string): Promise<Post> {
    return this.postRepository.getById(id);
  }

  getAllByTag(tagName: string): Promise<Post[]> {
    return this.postRepository.getAllByTag(tagName);
  }

  getAllByUsername(
    username: string,
    skip: number,
    take: number,
  ): Promise<Post[]> {
    return this.postRepository.getAllByUsername(username, skip, take);
  }

  searchPost(query: string, skip: number, take: number): Promise<Post[]> {
    return this.postRepository.searchPost(query, skip, take);
  }

  addPost(postDto: CreatePostDTO, user: User): Promise<Post> {
    return this.postRepository.addPost(postDto, user);
  }

  updateById(id: string, postDto: CreatePostDTO): Promise<Post> {
    return this.postRepository.updateById(id, postDto);
  }

  deleteById(id: string): Promise<boolean> {
    return this.postRepository.deleteById(id);
  }

  getAllTags(): Promise<Tag[]> {
    return this.tagRepository.getAll();
  }

  findTag(tagName: string): Promise<Tag[]> {
    return this.tagRepository.findTag(tagName);
  }
}
