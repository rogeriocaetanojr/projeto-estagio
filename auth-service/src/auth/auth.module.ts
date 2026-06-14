import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'MESSAGE_BROKER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const urls = [configService.get<string>('RABBITMQ_URL') || 'amqp://guest:guest@localhost:5672'];
        const connection = amqp.connect(urls);
        const channelWrapper = connection.createChannel({
          setup: (channel: any) => {
            // Assert da Exchange 'user.events' do tipo fanout
            return channel.assertExchange('user.events', 'fanout', { durable: true });
          },
        });
        return channelWrapper;
      },
    },
  ]
})
export class AuthModule {}
