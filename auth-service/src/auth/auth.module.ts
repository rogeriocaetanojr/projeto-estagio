import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as amqp from 'amqp-connection-manager';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'MESSAGE_BROKER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const urls = [
          configService.get<string>('RABBITMQ_URL') ||
            'amqp://guest:guest@localhost:5672',
        ];
        const connection = amqp.connect(urls);
        const channelWrapper = connection.createChannel({
          setup: (channel: any) => {
            // Assert da Exchange 'user.events' do tipo fanout
            return channel.assertExchange('user.events', 'fanout', {
              durable: true,
            });
          },
        });
        return channelWrapper;
      },
    },
  ],
})
export class AuthModule {}
