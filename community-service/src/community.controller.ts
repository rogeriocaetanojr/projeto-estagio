import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class CommunityController {
  @EventPattern('user_logged_in')
  handleUserLoggedIn(data: any) {
    console.log('Mensagem recebida no módulo de Comunidade:', data);
  }
}
