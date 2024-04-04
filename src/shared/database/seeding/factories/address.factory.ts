import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Address } from '@modules/user/entities/address.entity';

export const AddressFactory = setSeederFactory(Address, (faker: Faker) => {
  const address = new Address();
  address.street = faker.location.street();
  address.suite = faker.location.county();
  address.city = faker.location.city();
  address.zipcode = faker.location.zipCode();

  return address;
});
