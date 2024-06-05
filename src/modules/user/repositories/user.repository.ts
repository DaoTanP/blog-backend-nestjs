import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  Repository,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { SignUpDTO } from '@/modules/auth/dto/sign-up.dto';
import { UpdateUserDTO } from '@modules/user/dto/update-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  private findOptionRelations: FindOptionsRelations<User> = {
    posts: { tags: true },
    followers: true,
  };

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  getAll(): Promise<User[]> {
    return this.find({
      relations: this.findOptionRelations,
    });
  }

  // mostly used for authentication
  getById(id: string): Promise<User> {
    return this.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  getByUsername(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      relations: this.findOptionRelations,
    });
  }

  getByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
      relations: this.findOptionRelations,
    });
  }

  getAccountByUsername(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      select: { id: true, username: true, password: true },
    });
  }

  getAccountByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }

  getFollowers(id: string): Promise<User[]> {
    return this.find({
      where: { id },
    });
  }

  getFollowing(id: string): Promise<User[]> {
    return this.find({
      where: { followers: { id } },
    });
  }

  async followUser(followerId: string, userId: string): Promise<boolean> {
    const follower: User = await this.getById(followerId);
    if (!follower) return false;

    const user: User = await this.findOne({
      where: { id: userId },
      relations: this.findOptionRelations,
    });
    if (!user) return false;

    user.followers.push(follower);
    const result: User = await this.save(user);

    if (result.followers.indexOf(follower) === -1) return false;
    return true;
  }

  async unfollowUser(followerId: string, userId: string): Promise<boolean> {
    const follower: User = await this.getById(followerId);
    if (!follower) return false;

    const user: User = await this.findOne({
      where: { id: userId },
      relations: this.findOptionRelations,
    });
    if (!user) return false;

    const followerIndex: number = user.followers.findIndex(
      (f: User) => f.id === followerId,
    );
    if (followerIndex === -1) return false;

    user.followers.splice(followerIndex, 1);
    const result: User = await this.save(user);

    if (result.followers.indexOf(follower) !== -1) return false;
    return true;
  }

  // #region TODO: consider remove user-role table
  async addUser(signUpDto: SignUpDTO): Promise<User> {
    const user: User = this.create(signUpDto);
    const newUser: User = await this.save(user);

    return this.getById(newUser.id);
  }

  async updateById(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user: User = await this.getById(id);
    const userToUpdate: User = Object.assign(user, updateUserDTO);
    const updatedUser: User = await this.save(userToUpdate);

    return this.getByUsername(updatedUser.username);
  }

  // #endregion

  async deleteById(id: string): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    return deleteResult.affected !== 0;
  }
}
