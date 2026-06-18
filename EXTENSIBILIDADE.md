# Arquitetura de Eventos: Padrão Pub/Sub com RabbitMQ (Exchanges)

Para atender ao requisito de suporte a plug-ins e alta extensibilidade do plano de estágio, a arquitetura de comunicação orientada a eventos foi aprimorada, migrando de **Filas Diretas (Direct Queues)** para o padrão **Publish/Subscribe (Pub/Sub) usando Exchanges**.

## O Problema das Filas Diretas
Anteriormente, o `auth-service` enviava a mensagem diretamente para uma fila chamada `events_queue`, e o `community-service` consumia dessa fila. 
Se quiséssemos adicionar um novo microsserviço (como um envio de e-mails de boas-vindas), esse novo serviço competiria pelas mensagens da fila. Ou seja, se o serviço de e-mail consumisse o evento primeiro, a comunidade não o receberia (padrão *Round-Robin/Work Queues*).

## A Solução com Exchanges (Fanout)
Com o uso de Exchanges do tipo `fanout`, o publicador **nunca envia mensagens diretamente para uma fila**. O `auth-service` apenas "grita" o evento na praça (a Exchange `user.events`).

Qualquer serviço que precise saber sobre a criação de um usuário simplesmente cria a sua **própria fila exclusiva** e faz o "Bind" (vinculação) dessa fila na Exchange.
A Exchange do tipo `fanout` clona e entrega a mensagem para **todas** as filas vinculadas a ela simultaneamente.

## Exemplo Prático: Plug-in `notification-service`

Se no futuro precisarmos criar um serviço que envia SMS/E-mail assim que um usuário for cadastrado, **nenhuma linha de código precisará ser alterada no `auth-service` ou no `community-service`**.

O novo `notification-service` só precisará ser iniciado configurando sua própria fila (`notification_service_queue`) e vinculando-a à Exchange `user.events`, exatamente como fizemos:

```typescript
// notification-service/src/main.ts
import * as amqp from 'amqp-connection-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  // 1. Conecta e faz o BIND da sua própria fila na Exchange existente
  const connection = amqp.connect([rabbitmqUrl]);
  const channelWrapper = connection.createChannel({
    setup: function(channel: any) {
      return Promise.all([
        channel.assertExchange('user.events', 'fanout', { durable: true }),
        channel.assertQueue('notification_service_queue', { durable: true }),
        channel.bindQueue('notification_service_queue', 'user.events', ''),
      ]);
    }
  });
  await channelWrapper.waitForConnect();

  // 2. O microserviço consome da SUA fila exclusiva
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'notification_service_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
```

E no Controller do novo serviço, a escuta continuaria idêntica:
```typescript
@EventPattern('user_registered')
async handleUserRegistered(@Payload() data: any) {
  // Enviar e-mail usando os dados...
}
```

Essa arquitetura "Plug and Play" blinda o ecossistema, reduz o acoplamento e permite que a aplicação cresça indefinidamente através da inserção de novos módulos consumidores sem tocar no núcleo principal.
