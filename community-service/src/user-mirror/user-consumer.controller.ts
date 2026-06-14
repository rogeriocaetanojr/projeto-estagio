import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { UserMirrorService } from './user-mirror.service';

interface UserRegisteredPayload {
  id: string;
  email: string;
  profileType: string;
}

@Controller()
export class UserConsumerController {
  private readonly logger = new Logger(UserConsumerController.name);

  constructor(private readonly userMirrorService: UserMirrorService) {}

  @EventPattern('user_registered')
  async handleUserRegistered(@Payload() data: UserRegisteredPayload, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Evento 'user_registered' recebido: ${JSON.stringify(data)}`);

      // GATILHO DE CAOS: Simula uma falha catastrófica no banco se o e-mail contiver "erro"
      if (data.email.includes('erro')) {
        throw new Error("Simulação de falha catastrófica no banco de dados!");
      }

      await this.userMirrorService.upsertUser(data);

      // Em caso de sucesso absoluto, confirmamos a mensagem (Ack)
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Erro ao processar mensagem. Enviando para DLQ... Motivo: ${error.message}`);
      
      // Envia uma rejeição (Nack). 
      // O false, false significa: (allUpTo = false, requeue = false).
      // Como requeue é false, o RabbitMQ vai rotear a mensagem para a dead-letter-exchange.
      channel.nack(originalMsg, false, false);
    }
  }
}
