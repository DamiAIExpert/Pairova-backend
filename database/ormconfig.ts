// database/ormconfig.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

config(); // loads .env from project root

const isTsEnv = process.env.TS_NODE === 'true' || process.argv.some(arg => arg.includes('ts-node'));
const hasUrl = !!process.env.DATABASE_URL;

const ssl =
  String(process.env.DB_SSL ?? (hasUrl ? 'true' : 'false')).toLowerCase() === 'true'
    ? { rejectUnauthorized: false }
    : false;

const rootDir = isTsEnv ? 'src' : 'dist';

export default new DataSource({
  type: 'postgres',
  ...(hasUrl
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USERNAME ?? 'postgres',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_DATABASE ?? 'pairova',
      }),
  ssl,
  entities: [path.join(rootDir, '**/*.entity.{ts,js}')],
  migrations: [path.join('database', 'migrations', `*.${isTsEnv ? 'ts' : 'js'}`)],
  synchronize: false,
  logging: false,
});
