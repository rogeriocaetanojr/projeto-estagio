# Módulo Interativo de Ensino / Pedagógico (Education Service)

**Responsáveis pelo Desenvolvimento:** Matheus e Vinicius

## Diretrizes Gerais
Este módulo é parte integrante da arquitetura de microsserviços do projeto. O desenvolvimento deste serviço é agnóstico a linguagens de programação e frameworks; a implementação pode ser realizada em qualquer tecnologia (como Node.js, Python, Java, Go, C#, entre outras), desde que sejam respeitados os contratos de infraestrutura, comunicação em rede e mensageria definidos a seguir.

---

## 1. Configuração de Rede no Docker
Para possibilitar a comunicação com a infraestrutura principal do projeto e com o Message Broker, o container deste serviço deve obrigatoriamente executar na mesma rede virtual. 

Configure o arquivo `docker-compose.yml` do serviço associando-o à rede externa `microservices_network`:

```yaml
services:
  education-service:
    build: .
    # Outras configurações específicas do serviço
    networks:
      - microservices_network

networks:
  microservices_network:
    external: true
```

---

## 2. Conexão com o Message Broker (RabbitMQ)
Toda a comunicação assíncrona baseada em eventos é intermediada pelo RabbitMQ. Seguem os dados para estabelecimento de conexão no ambiente local:

- **Host:** `rabbitmq` (utilizar `localhost` caso o serviço seja executado fora do container Docker e a porta esteja mapeada para a máquina hospedeira)
- **Porta:** `5672`
- **Usuário:** `root`
- **Senha:** `rootpassword`

**String de Conexão padrão (AMQP):**
`amqp://root:rootpassword@rabbitmq:5672`

---

## 3. Contrato de Mensagens: Evento `user_registered`
O microsserviço de autenticação (`auth-service`) publica um evento sempre que um novo usuário (Student ou Professor) é inserido na base de dados. 

O contrato de comunicação segue o padrão de envelopamento do framework NestJS. O serviço deve escutar a fila associada ao tópico `'user_registered'` e processar o payload JSON sob a seguinte estrutura:

```json
{
  "pattern": "user_registered",
  "data": {
    "id": "uuid-identificador-do-usuario",
    "email": "usuario@dominio.com",
    "profileType": "student"
  }
}
```

### Detalhes dos Campos (Objeto `data`):
* `id` (String / UUID): Identificador único do usuário gerado pelo serviço de autenticação.
* `email` (String): Endereço de e-mail do usuário.
* `profileType` (String): Tipo de perfil do usuário. Valores possíveis: `student` ou `professor` (sempre em minúsculas).

---

## 4. Diretriz de Arquitetura: Database per Service
Em conformidade com os padrões de arquitetura de microsserviços, cada serviço possui seu próprio armazenamento persistente isolado (*Database per Service*). Este módulo não deve, sob nenhuma circunstância, realizar conexões ou consultas diretas ao banco de dados do `auth-service`.

Para garantir o desacoplamento físico e manter as referências necessárias para a lógica do negócio:
1. Crie uma tabela espelho de usuários (ex: `users` ou `users_mirror`) no banco de dados local deste serviço.
2. Modele a tabela contendo apenas os campos estritamente necessários para as regras de negócio deste módulo (como o `id` e o `profileType`), definindo o `id` originário do evento como chave primária local.
3. Implemente um consumidor de mensagens para escutar o evento `user_registered` e executar operações de persistência local (inserção/atualização) com os dados recebidos.
4. Utilize a chave primária da tabela espelho como chave estrangeira em tabelas locais associadas à parte pedagógica/ensino (como turmas, matrículas, avaliações, etc.).

---

## 5. Guia Rápido de Integração (Exemplo com NestJS)

Caso a equipe opte por utilizar o **NestJS** para este microsserviço, a infraestrutura global já conta com o padrão **Pub/Sub** e **Dead Letter Queues (DLQ)** para resiliência. 

Para "mastigar" a integração, copiem exatamente a estrutura abaixo para conectar o serviço e consumir a fila de forma segura:

### A. Configuração da Topologia no `main.ts`

No seu `src/main.ts`, configurem a conexão manual com o RabbitMQ criando a fila exclusiva da Educação e sua respectiva fila de quarentena (DLQ):

```typescript
import { connect } from 'amqp-connection-manager';
// ... outras importações

// Dentro do bootstrap():
const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

// 1. Configura as filas exclusivas do Education
const connection = connect([rabbitmqUrl]);
const channelWrapper = connection.createChannel({
  setup: (channel: any) => {
    return Promise.all([
      // Vincula à Exchange global (Não alterar o nome 'user.events')
      channel.assertExchange('user.events', 'fanout', { durable: true }),
      
      // Filas e Exchanges de ERRO exclusivas do Education
      channel.assertExchange('user.events.dlx', 'fanout', { durable: true }),
      channel.assertQueue('education_service_queue_dlq', { durable: true }),
      channel.bindQueue('education_service_queue_dlq', 'user.events.dlx', ''),

      // Fila principal do Education (Com redirecionamento de erros para a DLX)
      channel.assertQueue('education_service_queue', { 
        durable: true,
        deadLetterExchange: 'user.events.dlx' 
      }),
      channel.bindQueue('education_service_queue', 'user.events', ''),
    ]);
  }
});
await channelWrapper.waitForConnect();

// 2. Conecta o microserviço indicando a fila correta e desabilitando o auto-ack
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.RMQ,
  options: {
    urls: [rabbitmqUrl],
    queue: 'education_service_queue',
    noAck: false, // OBRIGATÓRIO: Permite controle manual de sucesso/falha (DLQ)
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'user.events.dlx'
      }
    },
  },
});
```

### B. O Consumidor Perfeito (`controller.ts`)

No Controller, interceptem o evento e insiram a regra de negócio do módulo:

```typescript
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller()
export class EducationConsumerController {
  private readonly logger = new Logger(EducationConsumerController.name);

  @EventPattern('user_registered')
  async handleUserRegistered(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Novo usuário detectado! Dados: ${JSON.stringify(data)}`);

      // ==========================================
      // LÓGICA DE NEGÓCIO E PERSISTÊNCIA AQUI
      // Exemplo:
      // await this.prisma.userMirror.create(...);
      // await this.courseService.enrollInDefaultCourses(...);
      // ==========================================

      // Sucesso: Confirma o processamento para o RabbitMQ apagar a mensagem
      channel.ack(originalMsg);

    } catch (error) {
      this.logger.error(`Falha interna. Desviando mensagem para a DLQ...`);
      
      // Falha: Rejeita a mensagem sem requeue, ativando o roteamento para a DLQ
      channel.nack(originalMsg, false, false); 
    }
  }
}
```
