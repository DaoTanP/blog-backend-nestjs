import { Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { Post } from './entities/post.entity';
import { PostDTO } from './dto/post.dto';
import { User } from '@modules/user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { TagRepository } from './repositories/tag.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  getAll(): Promise<Post[]> {
    return this.postRepository.getAll();
  }

  getById(id: string): Promise<Post> {
    return this.postRepository.getById(id);
  }

  getAllByTag(tagName: string): Promise<Post[]> {
    return this.postRepository.getAllByTag(tagName);
  }

  addPost(postDto: PostDTO, user: User): Promise<Post> {
    return this.postRepository.addPost(postDto, user);
  }

  updateById(id: string, postDto: PostDTO): Promise<Post> {
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
