import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { connect } from 'amqp-connection-manager';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Ativa a validação automática de dados de entrada que a equipe exige
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3003;
  const rabbitmqUrl = configService.get<string>('RABBITMQ_URL') ?? 'amqp://guest:guest@localhost:5672';

  // Setup manual da topologia Pub/Sub do RabbitMQ para a Educação
  logger.log('Configurando topologia Pub/Sub no RabbitMQ para a Educação...');
  const connection = connect([rabbitmqUrl]);
  const channelWrapper = connection.createChannel({
    setup: (channel: any) => {
      return Promise.all([
        // Exchange principal (já existente)
        channel.assertExchange('user.events', 'fanout', { durable: true }),
        
        // 1. Cria a Exchange de Erro (Dead Letter Exchange)
        channel.assertExchange('user.events.dlx', 'fanout', { durable: true }),
        
        // 2. Cria a Fila de Segurança (Dead Letter Queue)
        channel.assertQueue('education_service_queue_dlq', { durable: true }),
        
        // 3. Vincula a fila DLQ à Exchange DLX
        channel.bindQueue('education_service_queue_dlq', 'user.events.dlx', ''),

        // 4. Cria a Fila do serviço de educação configurada para desviar erros para a DLX
        channel.assertQueue('education_service_queue', { 
          durable: true,
          deadLetterExchange: 'user.events.dlx' // Desvio automático em caso de rejeição (nack)
        }),

        // 5. Faz o BIND da Fila Principal na Exchange Principal
        channel.bindQueue('education_service_queue', 'user.events', ''),
      ]);
    }
  });
  
  await channelWrapper.waitForConnect();
  logger.log('Topologia Pub/Sub de Educação configurada com sucesso.');

  // Conexão com o RabbitMQ para escuta de eventos (Configuração híbrida)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'education_service_queue',
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
  logger.log(`Microsserviço RabbitMQ escutando na fila vinculada 'education_service_queue'`);

  // Inicia o servidor HTTP
  await app.listen(port);
  logger.log(`Serviço de Ensino (education-service) rodando HTTP na porta ${port}`);
}
bootstrap();