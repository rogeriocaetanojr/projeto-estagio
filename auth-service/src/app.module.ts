import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GlobalRabbitMqModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o módulo de configuração global em toda a aplicação
    }),
    PrismaModule,
    GlobalRabbitMqModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
