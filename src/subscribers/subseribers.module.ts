import { SubscribersController } from './subscribers.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule],
  controllers: [SubscribersController],
  providers: [
    {
      provide: 'SUBSCRIBERS_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SUBSCRIBERS_SERVICE_HOST'),
            port: configService.get('SUBSCRIBERS_SERVICE_PORT'),
          },
        }),
    },
  ],
})
export class SubscribersModule {}
