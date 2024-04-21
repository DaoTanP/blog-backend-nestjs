import { Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { Post } from './entities/post.entity';
import { PostDTO } from './dto/post.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAll(): Promise<Post[]> {
    return this.postRepository.getAll();
  }

  getById(id: string): Promise<Post> {
    return this.postRepository.getById(id);
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
}
