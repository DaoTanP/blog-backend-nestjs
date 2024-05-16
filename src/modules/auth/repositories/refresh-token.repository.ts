import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  private findOptionRelations: FindOptionsRelations<RefreshToken> = {
    user: true,
  };

  constructor(private dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  getAll(): Promise<RefreshToken[]> {
    return this.find({ relations: this.findOptionRelations });
  }

  getById(id: string): Promise<RefreshToken> {
    return this.findOne({ where: { id }, relations: this.findOptionRelations });
  }

  getByToken(token: string): Promise<RefreshToken> {
    return this.findOne({
      where: { token },
      relations: this.findOptionRelations,
    });
  }

  getByUserId(userId: string): Promise<RefreshToken> {
    return this.findOne({
      where: { user: { id: userId } },
      relations: this.findOptionRelations,
    });
  }

  getByUsername(username: string): Promise<RefreshToken> {
    return this.findOne({
      where: { user: { username: username } },
      relations: this.findOptionRelations,
    });
  }

  async addToken(token: string, user: User): Promise<RefreshToken> {
    const refreshToken: RefreshToken = this.create({ token: token });
    refreshToken.user = user;
    const createdRefreshToken: RefreshToken = await this.save(refreshToken);

    return this.getById(createdRefreshToken.id);
  }

  async updateToken(token: string, user: User): Promise<RefreshToken> {
    const refreshToken: RefreshToken = await this.getByUserId(user.id);
    if (!refreshToken) return;

    refreshToken.token = token;
    const updatedRefreshToken: RefreshToken = await this.save(refreshToken);

    return this.getById(updatedRefreshToken.id);
  }
}
