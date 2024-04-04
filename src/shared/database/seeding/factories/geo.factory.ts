import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Geo } from '@modules/user/entities/geo.entity';

export const GeoFactory = setSeederFactory(Geo, (faker: Faker) => {
  const geo = new Geo();
  geo.lat = faker.location.latitude().toString();
  geo.lng = faker.location.longitude().toString();

  return geo;
});
