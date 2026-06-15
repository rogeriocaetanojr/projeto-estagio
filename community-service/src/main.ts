import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { connect } from 'amqp-connection-manager';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Habilita requisições de origem cruzada para que o Application Shell consiga baixar os arquivos estáticos
  app.enableCors();

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
  const connection = connect([rabbitmqUrl]);
  const channelWrapper = connection.createChannel({
    setup: (channel: any) => {
      return Promise.all([
        // Exchange principal (já existente)
        channel.assertExchange('user.events', 'fanout', { durable: true }),
        
        // 1. Cria a Exchange de Erro (Dead Letter Exchange)
        channel.assertExchange('user.events.dlx', 'fanout', { durable: true }),
        
        // 2. Cria a Fila de Segurança (Dead Letter Queue)
        channel.assertQueue('community_service_queue_dlq', { durable: true }),
        
        // 3. Vincula a fila DLQ à Exchange DLX
        channel.bindQueue('community_service_queue_dlq', 'user.events.dlx', ''),

        // 4. Cria a Fila do serviço de comunidade configurada para desviar erros para a DLX
        channel.assertQueue('community_service_queue', { 
          durable: true,
          deadLetterExchange: 'user.events.dlx' // Desvio automático em caso de rejeição (nack)
        }),

        // 5. Faz o BIND da Fila Principal na Exchange Principal
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
      noAck: false, // Desativa o auto-ack para habilitar as rejeições (DLQ)
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'user.events.dlx'
        }
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
