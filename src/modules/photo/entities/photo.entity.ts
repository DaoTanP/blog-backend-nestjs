import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Album } from '@modules/album/entities/album.entity';
import { User } from '@modules/user/entities/user.entity';

@Entity('photos')
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  title: string;

  @Column('varchar', { length: 255, nullable: false })
  url: string;

  @Column('text', { name: 'thumbnail_url', nullable: false })
  thumbnailUrl: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @Column('bigint', {
    name: 'created_by',
    unsigned: true,
    default: null,
    select: false,
  })
  createdBy: number;

  @Column('bigint', {
    name: 'updated_by',
    unsigned: true,
    default: null,
    select: false,
  })
  updatedBy: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_photo_user',
  })
  user: User;

  @ManyToOne(() => Album)
  @JoinColumn({
    name: 'album_id',
    foreignKeyConstraintName: 'fk_photo_album',
  })
  album: Album;
}
