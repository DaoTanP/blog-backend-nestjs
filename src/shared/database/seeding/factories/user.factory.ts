import { Faker } from '@faker-js/faker';
import { SeederFactoryItem, setSeederFactory } from 'typeorm-extension';
import { User } from '@modules/user/entities/user.entity';

export const UserFactory: SeederFactoryItem = setSeederFactory(
  User,
  (faker: Faker) => {
    const user: User = new User();
    user.displayName = faker.internet.displayName();
    user.username = faker.internet.userName();
    user.email = faker.internet.email();
    user.password = '12345678';
    user.biography =
      faker.person.jobTitle() +
      ' at ' +
      faker.company.name() +
      ' \n' +
      faker.person.gender() +
      '\n' +
      faker.person.zodiacSign() +
      '\n';

    return user;
  },
);
