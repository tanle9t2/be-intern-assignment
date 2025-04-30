import { DataSource } from 'typeorm';
import { PostSubscriber } from './services/postSubscriber.service';
import { UserSubcriber } from './services/userSubcriber.service';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: false, // Do not use synchronize, write migrations instead
  logging: true,
  entities: ['src/entities/**/*.ts'],
  subscribers: [PostSubscriber, UserSubcriber],
  migrations: ['src/migrations/**/*.ts'],
});
