"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const hasUrl = !!process.env.DATABASE_URL;
const ssl = String(process.env.DB_SSL ?? (hasUrl ? 'true' : 'false')).toLowerCase() ===
    'true'
    ? { rejectUnauthorized: false }
    : false;
exports.default = new typeorm_1.DataSource({
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
    entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
    migrations: ['database/migrations/*.{ts,js}'],
    synchronize: false,
    logging: false,
});
//# sourceMappingURL=ormconfig.js.map