import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
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
  async handleUserRegistered(@Payload() data: UserRegisteredPayload) {
    this.logger.log(`Evento 'user_registered' recebido: ${JSON.stringify(data)}`);
    await this.userMirrorService.upsertUser(data);
  }
}
