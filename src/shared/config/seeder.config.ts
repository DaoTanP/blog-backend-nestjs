import { DataSourceOptions, DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { typeOrmConfig } from './database.config';

const options: DataSourceOptions & SeederOptions = {
  ...(typeOrmConfig as DataSourceOptions),

  // Additional config options brought by typeorm-extension
  //   factories: [__dirname + '/../database/seeding/factories/*.factory{.ts,.js}'],
  //   seeds: [__dirname + '/../database/seeding/seeds/*.seeder{.ts,.js}'],
  factories: ['src/shared/database/seeding/factories/*.factory{.ts,.js}'],
  seeds: ['src/shared/database/seeding/seeds/*.seeder{.ts,.js}'],
  seedTracking: false,
};

const dataSource: DataSource = new DataSource(options);

// dataSource.initialize().then(async () => {
//   console.log(options);

//   await dataSource.synchronize(true);
//   await runSeeders(dataSource);
//   process.exit();
// });

export default dataSource;
