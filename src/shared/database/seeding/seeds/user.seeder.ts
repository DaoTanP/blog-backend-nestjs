import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '@modules/user/entities/user.entity';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { UserRoles as RoleEnum } from '@shared/constants/role.enum';
import { Role } from '@modules/auth/entities/role.entity';

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(User);
    const users = await userFactory.saveMany(10);

    const userRoleRepository = dataSource.getRepository(UserRole);
    const roleRepository = dataSource.getRepository(Role);
    const userRoles: UserRole[] = [];

    // const roles: Role[] = [];
    // for (const roleType of Object.values(RoleEnum)) {
    //   const role: Role = roleRepository.create({ name: roleType });
    //   roles.push(role);
    // }
    // await roleRepository.save(roles);

    for (let i = 0; i < users.length; i++) {
      const role: Role = await roleRepository.findOne({
        where: { name: RoleEnum.USER },
      });
      const userRole: UserRole = userRoleRepository.create({
        user: users[i],
        role,
      });

      userRoles.push(userRole);
    }

    await userRoleRepository.save(userRoles);
  }
}
