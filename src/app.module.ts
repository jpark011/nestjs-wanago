import { LogsMiddleware } from './middleware/logs.middleware';
import { ExceptionsLoggerFilter } from './utils/exceptions-logger.filter';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import Joi from '@hapi/joi';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import HealthModule from './health/health.module';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().default(3600),
        REFRESH_SECRET: Joi.string().required(),
        REFRESH_EXPIRATION_TIME: Joi.number().default(172800),
        TENTH2_UPLOAD_URL: Joi.string().required(),
        TENTH2_DOWNLOAD_URL: Joi.string().required(),
        TENTH2_SVC_ID: Joi.string().required(),
        TENTH2_W_KEY: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    DbModule,
    UsersModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
