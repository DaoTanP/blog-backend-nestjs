import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '@modules/user/entities/user.entity';

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.username = faker.internet.userName({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.password = faker.internet.password();
  user.phone = faker.phone.number();
  user.website = faker.internet.url();

  return user;
});
