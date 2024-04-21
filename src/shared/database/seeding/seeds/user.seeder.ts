import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactory, SeederFactoryManager } from 'typeorm-extension';
import { User } from '@modules/user/entities/user.entity';
import { RoleEnum as RoleEnum } from '@shared/constants/role.enum';
import { Role } from '@modules/auth/entities/role.entity';

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory: SeederFactory<User> = factoryManager.get(User);
    const roleRepository: Repository<Role> = dataSource.getRepository(Role);

    const roles: Role[] = await roleRepository.find();
    if (roles.length === 0) {
      for (const roleType of Object.values(RoleEnum)) {
        const role: Role = roleRepository.create({ name: roleType });
        roles.push(role);
      }
      await roleRepository.save(roles);
    }
    // await userFactory.saveMany(10, {
    //   roles: roles.filter((role: Role) => role.name === RoleEnum.USER),
    // });
    await userFactory.saveMany(2);
  }
}
