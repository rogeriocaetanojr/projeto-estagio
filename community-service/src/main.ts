import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuração de Pipes de Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3002;
  const rabbitmqUrl = configService.get<string>('RABBITMQ_URL') ?? 'amqp://guest:guest@rabbitmq:5672';

  // Conexão com o RabbitMQ para escuta de eventos (Configuração híbrida)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'events_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Inicia todos os microsserviços conectados (RabbitMQ)
  await app.startAllMicroservices();
  logger.log(`Microsserviço RabbitMQ conectado com sucesso na fila 'events_queue'`);

  // Inicia o servidor HTTP
  await app.listen(port);
  logger.log(`Serviço da Comunidade (community-service) rodando HTTP na porta ${port}`);
}
bootstrap();
