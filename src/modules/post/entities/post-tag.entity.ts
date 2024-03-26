import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity('post_tag')
export class PostTag extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @OneToOne(() => Post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'post_id',
    foreignKeyConstraintName: 'fk_posttag_post_id',
  })
  post: Post;

  @OneToOne(() => Tag, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'tag_id',
    foreignKeyConstraintName: 'fk_posttag_tag_id',
  })
  tag: Tag;
}
