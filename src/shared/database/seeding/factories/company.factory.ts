import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Company } from '@modules/user/entities/company.entity';

export const CompanyFactory = setSeederFactory(Company, (faker: Faker) => {
  const company = new Company();
  company.name = faker.company.name();
  company.catchPhrase = faker.company.catchPhrase();
  company.bs = faker.company.buzzPhrase();

  return company;
});
