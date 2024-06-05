import { Post } from '@modules/post/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';

export class UserDTO {
  id: string;
  username: string;
  email: string;
  displayName: string;
  biography: string;
  avatarImage: string;
  bannerImage: string;
  createdAt: Date;
  posts: Post[];
  followers: User[];
  following: User[];
}

async function mapValue(
  user: User | Promise<User>,
  userService: UserService,
): Promise<UserDTO> {
  const userValue: User = await user;
  const following: User[] = await userService.getFollowing(userValue.id);
  const userDTO: UserDTO = { ...userValue, following };
  return userDTO;
}

export { mapValue };
