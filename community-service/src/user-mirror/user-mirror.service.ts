import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface UserRegisteredPayload {
  id: string;
  email: string;
  profileType: string;
}

@Injectable()
export class UserMirrorService {
  private readonly logger = new Logger(UserMirrorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertUser(data: UserRegisteredPayload) {
    try {
      this.logger.log(`Processando upsert para o usuário mirror: ${data.email} (${data.id})`);
      const user = await this.prisma.userMirror.upsert({
        where: { id: data.id },
        update: {
          email: data.email,
          profileType: data.profileType,
        },
        create: {
          id: data.id,
          email: data.email,
          profileType: data.profileType,
        },
      });
      this.logger.log(`Usuário mirror persistido com sucesso: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Erro ao salvar usuário mirror no banco:`, error);
      throw error;
    }
  }
}
