import { Injectable } from '@nestjs/common';
import { CommentRepository } from './repositories/comment.repository';
import { Comment } from './entities/comment.entity';
import { User } from '@modules/user/entities/user.entity';
import { Post } from '@modules/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.getByPostId(postId);
  }

  async getById(id: number, postId: number): Promise<Comment> {
    return this.commentRepository.getById(id, postId);
  }

  async addComment(
    commentBody: string,
    user: User,
    post: Post,
  ): Promise<Comment> {
    return this.commentRepository.addComment(commentBody, user, post);
  }

  async updateById(
    id: number,
    postId: number,
    commentBody: string,
  ): Promise<Comment> {
    return this.commentRepository.updateById(id, postId, commentBody);
  }

  async deleteById(id: number, postId: number): Promise<boolean> {
    return this.commentRepository.deleteById(id, postId);
  }
}
