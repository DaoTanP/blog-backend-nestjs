import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsSelect,
  Repository,
} from 'typeorm';
import { Comment } from '@modules/comment/entities/comment.entity';
import { User } from '@modules/user/entities/user.entity';
import { Post } from '@modules/post/entities/post.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  private findOptionRelations: FindOptionsRelations<Comment> = {
    user: true,
  };

  private findOptionsSelect: FindOptionsSelect<Comment> = {
    user: { username: true },
  };

  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getByPostId(postId: number): Promise<Comment[]> {
    return this.find({
      where: { post: { id: postId } },
      select: this.findOptionsSelect,
      relations: this.findOptionRelations,
    });
  }

  async getById(id: number, postId: number): Promise<Comment> {
    return this.findOne({
      where: { id, post: { id: postId } },
      select: this.findOptionsSelect,
      relations: this.findOptionRelations,
    });
  }

  async addComment(
    commentBody: string,
    user: User,
    post: Post,
  ): Promise<Comment> {
    const comment: Comment = this.create({
      name: user.username,
      email: user.email,
      body: commentBody,
    });
    comment.user = user;
    comment.post = post;

    return this.save(comment);
  }

  async updateById(
    id: number,
    postId: number,
    commentBody: string,
  ): Promise<Comment> {
    const comment: Comment = await this.getById(id, postId);
    comment.body = commentBody;

    return this.save(comment);
  }

  async deleteById(id: number, postId: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({
      id,
      post: { id: postId },
    });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
