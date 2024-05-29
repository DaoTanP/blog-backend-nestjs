import { User } from '@/modules/user/entities/user.entity';

export class PostDTO {
  id: string;
  title: string;
  body: string;
  tags: string[];
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
