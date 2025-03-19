import { config } from 'dotenv';
config();

import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { entities } from './src/data/entities';
import * as migrations from './src/data/migrations';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing! Check your .env file.');
}
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities,
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: 'migrations_history',
  migrations: migrations,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
  uuidExtension: 'pgcrypto',
};

export default new DataSource(dataSourceOptions);
