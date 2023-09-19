//database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST, // хост базы данных
  port: parseInt(process.env.DATABASE_PORT), // порт
  username: process.env.DATABASE_USERNAME, // ваше имя пользователя
  password: process.env.DATABASE_PASSWORD, // ваш пароль
  database: process.env.DATABASE_NAME, // имя базы данных
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // путь к вашим сущностям (в зависимости от структуры проекта)
  synchronize: true, // автоматическое обновление схемы (для разработки)
};

export default config;
