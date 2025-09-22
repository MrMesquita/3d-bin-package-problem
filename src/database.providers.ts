import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/models/user.model';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'manoel_games_store',
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
