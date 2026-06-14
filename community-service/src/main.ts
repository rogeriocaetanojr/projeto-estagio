import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as amqp from 'amqp-connection-manager';

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
  const rabbitmqUrl = configService.get<string>('RABBITMQ_URL') ?? 'amqp://guest:guest@localhost:5672';

  // Setup manual da topologia Pub/Sub do RabbitMQ para a Comunidade
  logger.log('Configurando topologia Pub/Sub no RabbitMQ...');
  const connection = amqp.connect([rabbitmqUrl]);
  const channelWrapper = connection.createChannel({
    setup: function(channel: any) {
      return Promise.all([
        // Cria a Exchange 'user.events' do tipo fanout
        channel.assertExchange('user.events', 'fanout', { durable: true }),
        // Cria a Fila do serviço de comunidade
        channel.assertQueue('community_service_queue', { durable: true }),
        // Faz o BIND da Fila na Exchange (escutando tudo o que é publicado lá)
        channel.bindQueue('community_service_queue', 'user.events', ''),
      ]);
    }
  });
  
  await channelWrapper.waitForConnect();
  logger.log('Topologia Pub/Sub configurada com sucesso.');

  // Conexão com o RabbitMQ para escuta de eventos (Configuração híbrida)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'community_service_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Inicia todos os microsserviços conectados (RabbitMQ)
  await app.startAllMicroservices();
  logger.log(`Microsserviço RabbitMQ escutando na fila vinculada 'community_service_queue'`);

  // Inicia o servidor HTTP
  await app.listen(port);
  logger.log(`Serviço da Comunidade (community-service) rodando HTTP na porta ${port}`);
}
bootstrap();
