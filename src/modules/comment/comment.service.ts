import { Injectable } from '@nestjs/common';
import { CommentRepository } from './repositories/comment.repository';
import { Comment } from './entities/comment.entity';
import { User } from '@modules/user/entities/user.entity';
import { Post } from '@modules/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  getByPostId(postId: string): Promise<Comment[]> {
    return this.commentRepository.getByPostId(postId);
  }

  getByUsername(username: string): Promise<Comment[]> {
    return this.commentRepository.getByUsername(username);
  }

  getById(id: string, postId: string): Promise<Comment> {
    return this.commentRepository.getById(id, postId);
  }

  addComment(commentBody: string, user: User, post: Post): Promise<Comment> {
    return this.commentRepository.addComment(commentBody, user, post);
  }

  updateById(
    id: string,
    postId: string,
    commentBody: string,
  ): Promise<Comment> {
    return this.commentRepository.updateById(id, postId, commentBody);
  }

  deleteById(id: string, postId: string): Promise<boolean> {
    return this.commentRepository.deleteById(id, postId);
  }
}
