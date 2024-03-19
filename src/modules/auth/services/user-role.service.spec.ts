import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleService } from './user-role.service';

describe('UserRoleService', () => {
  let userRoleService: UserRoleService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [UserRoleService],
    }).compile();

    userRoleService = testingModule.get<UserRoleService>(UserRoleService);
  });

  it('should be defined', () => {
    expect(userRoleService).toBeDefined();
  });
});
