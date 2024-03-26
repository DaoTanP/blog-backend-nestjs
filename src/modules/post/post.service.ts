import { Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { Post } from './entities/post.entity';
import { PostDTO } from './dto/post.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAll(): Promise<Post[]> {
    return this.postRepository.getAll();
  }

  async getById(id: number): Promise<Post> {
    return this.postRepository.getById(id);
  }

  async addPost(postDto: PostDTO, user: User): Promise<Post> {
    return this.postRepository.addPost(postDto, user);
  }

  async updateById(id: number, postDto: PostDTO): Promise<Post> {
    return this.postRepository.updateById(id, postDto);
  }

  async deleteById(id: number): Promise<boolean> {
    return this.postRepository.deleteById(id);
  }
}
